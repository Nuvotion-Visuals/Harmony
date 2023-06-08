import { Request, Response } from 'express';
import path from 'path';

// @ts-ignore
import { dockStart } from '@nlpjs/basic';
// @ts-ignore
import { BuiltinCompromise } from '@nlpjs/builtin-compromise'

const onIntent = (nlp: any, input: any) => {
  if (input.intent === 'greetings.hello') {
    const output = input;
    output.answer = 'Fuck off';
  }
  return input;
}

let context = {};

const chatbotController = async (req: Request, res: Response) => {
  const { message } = req.body;

   if (message.toLowerCase() === 'nevermind') {
    context = {};
    return res.json({ message: 'Okay, let\'s start over.', lang: 'en' });
  }

  const dock = await dockStart({
    settings: {
      nlp: {
        corpora: [
          path.join(__dirname, './corpa/harmony/space-en.json'),
          path.join(__dirname, './corpa/harmony/datetime-en.json'),
          path.join(__dirname, './corpa/harmony/weather-en.json'),
        ]
      }
    },
    'use': ['Basic', 'LangEn']
  });

  const ner = dock.get('ner');
  const builtin = new BuiltinCompromise({
    enable: [
      'hashtags', 'person', 'place', 'organization',
      'email', 'phonenumber', 'date', 'url', 'number', 'dimension'
    ]
   });
  ner.container.register('extract-builtin-??', builtin, true);
  
  const nlp = dock.get('nlp');

  nlp.addAnswer('en', 'None', 'I do not understand');
  nlp.onIntent = onIntent;

  await nlp.train();

  const response = await nlp.process('en', message, context);

  const intent = response.intent;
  const answer = response.answer;
  const sentiment = response.sentiment;
  const entities = response.entities;

  const detectedLanguage = response.locale || 'en';

  console.log(`\x1b[32mMessage:\x1b[0m \x1b[94m[${detectedLanguage} - ${intent} - ${sentiment.vote}]\x1b[0m \x1b[32m${message}\x1b[0m`);
  console.log(`\x1b[35mAnswer:\x1b[0m \x1b[94m[${detectedLanguage} - ${intent} - ${sentiment.vote}]\x1b[0m \x1b[35m${answer}\x1b[0m`);
  console.log(entities)

  const getDescription = (weatherCode: number) => {
    let description
    switch (weatherCode) {
      case 0:
        description = 'clear sky';
        break;
      case 1:
        description = 'mainly clear';
        break;
      case 2:
        description = 'partly cloudy';
        break;
      case 3:
        description = 'overcast';
        break;
      case 45:
        description = 'fog';
        break;
      case 48:
        description = 'depositing rime fog';
        break;
      case 51:
        description = 'light drizzle';
        break;
      case 53:
        description = 'moderate drizzle';
        break;
      case 55:
        description = 'dense intensity drizzle';
        break;
      case 56:
        description = 'light freezing drizzle';
        break;
      case 57:
        description = 'dense intensity freezing drizzle';
        break;
      case 61:
        description = 'slight intensity rain';
        break;
      case 63:
        description = 'moderate intensity rain';
        break;
      case 65:
        description = 'heavy intensity rain';
        break;
      case 66:
        description = 'light intensity freezing rain';
        break;
      case 67:
        description = 'heavy intensity freezing rain';
        break;
      case 71:
        description = 'slight intensity snowfall';
        break;
      case 73:
        description = 'moderate intensity snowfall';
        break;
      case 75:
        description = 'heavy intensity snowfall';
        break;
      case 77:
        description = 'snow grains';
        break;
      case 80:
        description = 'slight intensity rain showers';
        break;
      case 81:
        description = 'moderate intensity rain showers';
        break;
      case 82:
        description = 'violent rain showers';
        break;
      case 85:
        description = 'slight intensity snow showers';
        break;
      case 86:
        description = 'heavy intensity snow showers';
        break;
      case 95:
        description = 'slight or moderate thunderstorm';
        break;
      case 96:
        description = 'thunderstorm with slight hail';
        break;
      case 99:
        description = 'thunderstorm with heavy hail';
        break;
      default:
        description = 'unknown';
        break;
    }

    return description
  }
  
  switch (intent) {
    case 'getDateTime':
      const timestamp = {
        time: new Date().toLocaleTimeString(detectedLanguage, { hour: 'numeric', minute: 'numeric', hour12: true }),
        dayOfWeek: new Date().toLocaleDateString(detectedLanguage, { weekday: 'long' }),
        month: new Date().toLocaleDateString(detectedLanguage, { month: 'long' }),
        year: new Date().toLocaleDateString(detectedLanguage, { year: 'numeric' }),
        dateTime: new Date().toLocaleString(detectedLanguage, { dateStyle: 'long', timeStyle: 'short' })
      };
      response.entities = timestamp;

      const dateStr = `${timestamp.dayOfWeek}, ${timestamp.dateTime.split(',')[0]}`;
      const timeStr = `It's ${timestamp.time}`;
      response.answer = `${timeStr} on ${dateStr}`;

      res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
      break;
      case 'getWeather':

        const lat = 41.739685; // replace with actual latitude
        const lon = -87.554420; // replace with actual longitude
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;
      
        fetch(url)
          .then(res => res.json())
          .then(data => {
            const weatherCode = data.current_weather.weathercode;
            let description = getDescription(weatherCode)
           
      
            const weather = {
              description: description,
              temperature: data.current_weather.temperature,
              windSpeed: data.current_weather.windspeed,
              windDirection: data.current_weather.winddirection
            };


            let cardinalDirection;

            if (weather.windDirection >= 337.5 || weather.windDirection < 22.5) {
              cardinalDirection = 'North';
            } else if (weather.windDirection >= 22.5 && weather.windDirection < 67.5) {
              cardinalDirection = 'North-East';
            } else if (weather.windDirection >= 67.5 && weather.windDirection < 112.5) {
              cardinalDirection = 'East';
            } else if (weather.windDirection >= 112.5 && weather.windDirection < 157.5) {
              cardinalDirection = 'South-East';
            } else if (weather.windDirection >= 157.5 && weather.windDirection < 202.5) {
              cardinalDirection = 'South';
            } else if (weather.windDirection >= 202.5 && weather.windDirection < 247.5) {
              cardinalDirection = 'South-West';
            } else if (weather.windDirection >= 247.5 && weather.windDirection < 292.5) {
              cardinalDirection = 'West';
            } else if (weather.windDirection >= 292.5 && weather.windDirection < 337.5) {
              cardinalDirection = 'North-West';
            }
            
            const temperatureF = Math.round((weather.temperature * 1.8) + 32);
            const windSpeedMph = Math.round(weather.windSpeed * 0.621371);

            const weatherFormatted = {
              description: description,
              temperature: temperatureF,
              temperatureUnit: '°F',
              windSpeed: windSpeedMph,
              windSpeedUnit: 'mph',
              windDirection: cardinalDirection
            };

            response.entities.weather = weatherFormatted;
            response.answer = response.answer.replace('{{ description }}', description)
              .replace('{{ temperature }}', `${temperatureF}°F`)
              .replace('{{ windSpeed }}', `${windSpeedMph}mph`)
              .replace('{{ windDirection }}', cardinalDirection);

            res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });

          })
          .catch(error => {
            response.answer = "Sorry, I couldn't fetch the weather information at the moment.";
            res.json({ message: response.answer, lang: detectedLanguage });
          });
        break;
      default:
        res.json({ message: response.answer, lang: detectedLanguage });
  }
};

export default chatbotController;
