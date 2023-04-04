import { Request, Response } from 'express';
// @ts-ignore
import { dockStart } from '@nlpjs/basic';
import path from 'path';

const context = {};

const chatbotController = async (req: Request, res: Response) => {
  const { message } = req.body;
  const dock = await dockStart({
    settings: {
      nlp: {
        corpora: [
          path.join(__dirname, './corpa/corpus-en.json'),
          path.join(__dirname, './corpa/slotFilling-en.json')
        ]
      }
    },
    'use': ['Basic', 'BuiltinMicrosoft', 'LangEn']
  });

  const builtin = dock.get('builtin-microsoft');
  const ner = dock.get('ner');
  ner.container.register('extract-builtin-??', builtin, true);

  const nlp = dock.get('nlp');
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
    case 'agent.birthday':
    case 'agent.age':
    // add more intents here
    default:
      res.json({ message: answer, lang: detectedLanguage });
      break;
  }
};

export default chatbotController;
