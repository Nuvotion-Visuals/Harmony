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
          path.join(__dirname, './corpa/lexi/space-en.json'),
          path.join(__dirname, './corpa/lexi/time-en.json'),
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
  
  switch (intent) {
    case 'getTime':
      const time = new Date().toLocaleTimeString(detectedLanguage, { hour: 'numeric', minute: 'numeric', hour12: true });
      response.answer = response.answer.replace('{{ time }}', time);
      response.entities.time = time;
      res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
      break;
    case 'getDayOfWeek':
      const dayOfWeek = new Date().toLocaleDateString(detectedLanguage, { weekday: 'long' });
      response.answer = response.answer.replace('{{ dayOfWeek }}', dayOfWeek);
      response.entities.dayOfWeek = dayOfWeek;
      res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
      break;
    case 'getMonth':
      const month = new Date().toLocaleDateString(detectedLanguage, { month: 'long' });
      response.answer = response.answer.replace('{{ month }}', month);
      response.entities.month = month;
      res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
      break;
    case 'getYear':
      const year = new Date().toLocaleDateString(detectedLanguage, { year: 'numeric' });
      response.answer = response.answer.replace('{{ year }}', year);
      response.entities.year = year;
      res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
      break;
    case 'getDateTime':
      const dateTime = new Date().toLocaleString(detectedLanguage, { dateStyle: 'long', timeStyle: 'short' });
      response.answer = response.answer.replace('{{ dateTime }}', dateTime);
      response.entities.dateTime = dateTime;
      res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
      break;
    default:
      res.json({ message: response.answer, lang: detectedLanguage });
      break;
  }
};

export default chatbotController;
