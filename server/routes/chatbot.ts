import { Request, Response } from 'express';
// @ts-ignore
import { NlpManager, Language } from 'node-nlp';

import * as rsvpData from './trainingData/rsvp';
import * as membershipData from './trainingData/membership';
// Import more files here...

const manager = new NlpManager({ languages: ['en', 'es'] });

// Add documents and answers for different intents and languages
[ 
  { intent: 'RSVP', data: rsvpData },
  { intent: 'Membership', data: membershipData },
  // Add more intents and data here...
].forEach(({ intent, data }) => {
  Object.entries(data.documents).forEach(([lang, docs]) => {
    docs.forEach((doc) => {
      manager.addDocument(lang, doc, intent);
    });
  });
  
  Object.entries(data.answers).forEach(([lang, answers]) => {
    Object.entries(answers).forEach(([answerIntent, answer]) => {
      manager.addAnswer(lang, answerIntent, answer);
    });
  });
});
// Add default answer
manager.addAnswer('en', 'None', "I'm sorry, I don't understand.");

(async () => {
  await manager.train();
})();

const chatbotController = async (req: Request, res: Response) => {
  const { message } = req.body;
  const response = await manager.process(message);
  const intent = response.intent;
  const answer = response.answer;
  const sentiment = response.sentiment;

  const detectedLanguage: Language = response.locale ?? 'en';

  console.log(`\x1b[32mMessage:\x1b[0m \x1b[94m[${detectedLanguage} - ${intent} - ${sentiment.vote}]\x1b[0m \x1b[32m${message}\x1b[0m`);
  console.log(`\x1b[35mAnswer:\x1b[0m \x1b[94m[${detectedLanguage} - ${intent} - ${sentiment.vote}]\x1b[0m \x1b[35m${answer}\x1b[0m`);

  switch (intent) {
    case 'RSVP':
    case 'RSVPTime':
    case 'RSVPGuest':
    case 'Membership':
    case 'MembershipLevels':
    case 'None':
    default:
      res.json({ message: answer, lang: detectedLanguage });
      break;
  }
};

export default chatbotController;
