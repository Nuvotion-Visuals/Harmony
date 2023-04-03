import express, { Request, Response } from 'express';
import { CommonMessageProps } from 'types/MessagesTypes';

import { sendMessage } from '../sendMessage'

const router = express.Router();

router.get('/send-message', async (req: Request, res: Response) => {
  try {
    // Extract the relevant data from the request query parameters
    const {
      conversationId,
      parentMessageId,
      personaLabel,
      systemMessage,
      userLabel,
      message,
    } = req.query as Record<string, string>;
  
    // Call the sendMessage function with the extracted data
    await sendMessage({
      conversationId,
      parentMessageId,
      personaLabel,
      systemMessage,
      userLabel,
      message,
      onComplete: (data: CommonMessageProps & { response: string }) => {
        res.status(200).json({ ...data });
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while sending the message');
  }
});

export default router;