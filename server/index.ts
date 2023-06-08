import next from 'next';
import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { sendMessage } from './messaging/sendMessage'

import toolsRouter from './routes/tools';
import imageRouter from './routes/image'
import sendMessageRouter from './routes/sendMessage'
import chatbotRouter from './routes/chatbot'
import ttsRouter from './routes/tts';
import { startMessagingServer } from './messaging/messaging';

dotenv.config();

const SERVER_PORT = parseInt(process.env.SERVER_PORT || '1618');
const WEBSOCKETSERVER_PORT = parseInt(process.env.WEBSOCKETSERVER_PORT || '1619');
const DEV = process.env.NODE_ENV !== 'production';

const app = next({ dev: DEV });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    await app.prepare();

    const server = express();

    // Middleware
    server.use(bodyParser.json({ limit: '10mb' }));
    server.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    server.use(express.static('public'));
    server.use(cookieParser());
    server.use(
      cookieSession({
        name: 'session',
        keys: ['eThElIMpLYMOSeAMaNKlEroashIrOw'],
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
    );

    // Routes
    server.use('/send-message', sendMessageRouter);
    server.use('/image', imageRouter);
    server.use('/tools', toolsRouter);
    server.use('/api/chatbot', chatbotRouter)
    server.use('/tts', ttsRouter);

    server.all('/next/*', async (req, res) => {
      res.status(400).json({ error: 'Next API route not found' });
    });

    server.all('*', (req, res) => handle(req, res));

    await startMessagingServer(WEBSOCKETSERVER_PORT);

    sendMessage({
      conversationId: '',
      parentMessageId: '',
      personaLabel: 'Harmony',
      systemMessage:
        'You are an especially creative autonomous cognitive entity named Harmony.',
      userLabel: 'user',
      message: 'State if you are functioning properly. What is your name?',
      onComplete: ({ response }: any) => console.log(response),
      onProgress: () => {},
    });

    server.listen(SERVER_PORT, () => {
      console.log('🟣', `I'm listening on port ${SERVER_PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
