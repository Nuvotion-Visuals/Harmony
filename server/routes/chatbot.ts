import { Request, Response } from 'express';
import path from 'path';

// @ts-ignore
import { dockStart } from '@nlpjs/basic';
// @ts-ignore
import { BuiltinCompromise } from '@nlpjs/builtin-compromise'

// modify answer before getting response
const onIntent = (nlp: any, input: any) => {
  if (input.intent === 'greetings.hello') {
    const output = input;
    output.answer = 'Fuck off';
  }
  return input;
}

const context = {};

const chatbotController = async (req: Request, res: Response) => {
  const { message } = req.body;
  const dock = await dockStart({
    settings: {
      nlp: {
        corpora: [
          // path.join(__dirname, './corpa/corpus-en.json'),
          path.join(__dirname, './corpa/membership-en.json'),
          // path.join(__dirname, './corpa/slotFilling-en.json')
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

  nlp.addDocument('en', 'Hello my name is @name', 'greeting.hello');
  nlp.addDocument('en', 'Hello I\'m @name', 'greeting.hello');
  nlp.addNerAfterLastCondition('en', 'name', ['is', 'I\'m']);

  nlp.addDocument('en', 'I have to go', 'greeting.bye');
  nlp.addAnswer('en', 'greeting.hello', 'Hey there!');
  nlp.addAnswer('en', 'greeting.bye', 'Till next time, {{name}}!');

  nlp.addAction('whatTimeIsIt', 'handleWhatsTimeAction', ['en-US', 'parameter 2'], async (data: any, locale: any, param2: any) => { 
    // Inject a new entitiy into context used for answer generation
    data.context.time = new Date().toLocaleTimeString(locale);
    return data;
  });

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
