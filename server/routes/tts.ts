import express, { Request, Response } from 'express';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({
  keyFilename: __dirname + '/key.json',
});

type SsmlVoiceGender = 'FEMALE' | 'MALE' | 'NEUTRAL' | 'SSML_VOICE_GENDER_UNSPECIFIED';

interface CustomSynthesizeSpeechRequest {
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    voiceType?: string;
    name: string;
    ssmlGender: SsmlVoiceGender;
  };
  audioConfig: {
    audioEncoding: string;
  };
}

async function synthesizeText(text: string, res: Response): Promise<void> {
  const request: CustomSynthesizeSpeechRequest = {
    input: { text: text },
    voice: {
      languageCode: 'en-US',
      voiceType: 'Neural2',
      name: 'en-US-Neural2-F',
      ssmlGender: 'FEMALE'
    },
    audioConfig: {
      audioEncoding: 'LINEAR16'
    }
  };
  const [response] = await client.synthesizeSpeech(request as any);
  res.setHeader('Content-Type', 'audio/wav');
  res.send(response.audioContent);
}

const ttsRouter = express.Router();

ttsRouter.get('/tts', async (req: Request, res: Response) => {
  const text = req.query.text as string;
  try {
    await synthesizeText(text, res);
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
});

export default ttsRouter;
