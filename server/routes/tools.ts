import express, { Request, Response } from 'express';
import { extract } from '@extractus/article-extractor';
// @ts-ignore
import { getSubtitles, Caption } from 'youtube-captions-scraper';

const router = express.Router();

const handleError = (res: Response, error: Error & { statusCode?: number; code?: number }) => {
  console.log('🟣', `I experienced the following error: ${error}`);
  const status = error.statusCode || error.code || 500;
  const message = error.message || 'internal error';
  res.status(status).send({ status, message });
};

router.post('/parse-article', async (req: Request, res: Response) => {
  const { contentUrl } = req.body;

  try {
    const input = contentUrl as string;
    const article = await extract(input);
    res.send({ status: 200, data: { article } });
  } catch (error) {
    handleError(res, error as Error & { statusCode?: number; code?: number });
  }
});

router.post('/parse-youtube-video', async (req: Request, res: Response) => {
  const { videoUrl } = req.body;

  const youtube_parser = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : '';
  };

  try {
    const captions: Caption[] = await getSubtitles({
      videoID: youtube_parser(videoUrl),
      lang: 'en',
    });
    const transcript = captions.map((cap) => cap.text).join(' ');
    res.send({ status: 200, data: { transcript } });
  } catch (error) {
    handleError(res, error as Error & { statusCode?: number; code?: number });
  }
});

export default router;
