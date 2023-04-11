"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
// @ts-ignore
var basic_1 = require("@nlpjs/basic");
// @ts-ignore
var builtin_compromise_1 = require("@nlpjs/builtin-compromise");
var onIntent = function (nlp, input) {
    if (input.intent === 'greetings.hello') {
        var output = input;
        output.answer = 'Fuck off';
    }
    return input;
};
var context = {};
var chatbotController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, dock, ner, builtin, nlp, response, intent, answer, sentiment, entities, detectedLanguage, getDescription, timestamp, dateStr, timeStr, lat, lon, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                message = req.body.message;
                if (message.toLowerCase() === 'nevermind') {
                    context = {};
                    return [2 /*return*/, res.json({ message: 'Okay, let\'s start over.', lang: 'en' })];
                }
                return [4 /*yield*/, (0, basic_1.dockStart)({
                        settings: {
                            nlp: {
                                corpora: [
                                    path_1.default.join(__dirname, './corpa/lexi/space-en.json'),
                                    path_1.default.join(__dirname, './corpa/lexi/datetime-en.json'),
                                    path_1.default.join(__dirname, './corpa/lexi/weather-en.json'),
                                ]
                            }
                        },
                        'use': ['Basic', 'LangEn']
                    })];
            case 1:
                dock = _a.sent();
                ner = dock.get('ner');
                builtin = new builtin_compromise_1.BuiltinCompromise({
                    enable: [
                        'hashtags', 'person', 'place', 'organization',
                        'email', 'phonenumber', 'date', 'url', 'number', 'dimension'
                    ]
                });
                ner.container.register('extract-builtin-??', builtin, true);
                nlp = dock.get('nlp');
                nlp.addAnswer('en', 'None', 'I do not understand');
                nlp.onIntent = onIntent;
                return [4 /*yield*/, nlp.train()];
            case 2:
                _a.sent();
                return [4 /*yield*/, nlp.process('en', message, context)];
            case 3:
                response = _a.sent();
                intent = response.intent;
                answer = response.answer;
                sentiment = response.sentiment;
                entities = response.entities;
                detectedLanguage = response.locale || 'en';
                console.log("\u001B[32mMessage:\u001B[0m \u001B[94m[".concat(detectedLanguage, " - ").concat(intent, " - ").concat(sentiment.vote, "]\u001B[0m \u001B[32m").concat(message, "\u001B[0m"));
                console.log("\u001B[35mAnswer:\u001B[0m \u001B[94m[".concat(detectedLanguage, " - ").concat(intent, " - ").concat(sentiment.vote, "]\u001B[0m \u001B[35m").concat(answer, "\u001B[0m"));
                console.log(entities);
                getDescription = function (weatherCode) {
                    var description;
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
                    return description;
                };
                switch (intent) {
                    case 'getDateTime':
                        timestamp = {
                            time: new Date().toLocaleTimeString(detectedLanguage, { hour: 'numeric', minute: 'numeric', hour12: true }),
                            dayOfWeek: new Date().toLocaleDateString(detectedLanguage, { weekday: 'long' }),
                            month: new Date().toLocaleDateString(detectedLanguage, { month: 'long' }),
                            year: new Date().toLocaleDateString(detectedLanguage, { year: 'numeric' }),
                            dateTime: new Date().toLocaleString(detectedLanguage, { dateStyle: 'long', timeStyle: 'short' })
                        };
                        response.entities = timestamp;
                        dateStr = "".concat(timestamp.dayOfWeek, ", ").concat(timestamp.dateTime.split(',')[0]);
                        timeStr = "It's ".concat(timestamp.time);
                        response.answer = "".concat(timeStr, " on ").concat(dateStr);
                        res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
                        break;
                    case 'getWeather':
                        lat = 41.739685;
                        lon = -87.554420;
                        url = "https://api.open-meteo.com/v1/forecast?latitude=".concat(lat, "&longitude=").concat(lon, "&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m");
                        fetch(url)
                            .then(function (res) { return res.json(); })
                            .then(function (data) {
                            var weatherCode = data.current_weather.weathercode;
                            var description = getDescription(weatherCode);
                            var weather = {
                                description: description,
                                temperature: data.current_weather.temperature,
                                windSpeed: data.current_weather.windspeed,
                                windDirection: data.current_weather.winddirection
                            };
                            var cardinalDirection;
                            if (weather.windDirection >= 337.5 || weather.windDirection < 22.5) {
                                cardinalDirection = 'North';
                            }
                            else if (weather.windDirection >= 22.5 && weather.windDirection < 67.5) {
                                cardinalDirection = 'North-East';
                            }
                            else if (weather.windDirection >= 67.5 && weather.windDirection < 112.5) {
                                cardinalDirection = 'East';
                            }
                            else if (weather.windDirection >= 112.5 && weather.windDirection < 157.5) {
                                cardinalDirection = 'South-East';
                            }
                            else if (weather.windDirection >= 157.5 && weather.windDirection < 202.5) {
                                cardinalDirection = 'South';
                            }
                            else if (weather.windDirection >= 202.5 && weather.windDirection < 247.5) {
                                cardinalDirection = 'South-West';
                            }
                            else if (weather.windDirection >= 247.5 && weather.windDirection < 292.5) {
                                cardinalDirection = 'West';
                            }
                            else if (weather.windDirection >= 292.5 && weather.windDirection < 337.5) {
                                cardinalDirection = 'North-West';
                            }
                            var temperatureF = Math.round((weather.temperature * 1.8) + 32);
                            var windSpeedMph = Math.round(weather.windSpeed * 0.621371);
                            var weatherFormatted = {
                                description: description,
                                temperature: temperatureF,
                                temperatureUnit: '°F',
                                windSpeed: windSpeedMph,
                                windSpeedUnit: 'mph',
                                windDirection: cardinalDirection
                            };
                            response.entities.weather = weatherFormatted;
                            response.answer = response.answer.replace('{{ description }}', description)
                                .replace('{{ temperature }}', "".concat(temperatureF, "\u00B0F"))
                                .replace('{{ windSpeed }}', "".concat(windSpeedMph, "mph"))
                                .replace('{{ windDirection }}', cardinalDirection);
                            res.json({ message: response.answer, lang: detectedLanguage, entities: response.entities });
                        })
                            .catch(function (error) {
                            response.answer = "Sorry, I couldn't fetch the weather information at the moment.";
                            res.json({ message: response.answer, lang: detectedLanguage });
                        });
                        break;
                    default:
                        res.json({ message: response.answer, lang: detectedLanguage });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.default = chatbotController;
