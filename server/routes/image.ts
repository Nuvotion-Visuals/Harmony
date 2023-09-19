import fs from 'fs';
import express from 'express';
import path from 'path';
import cache from 'memory-cache';
const router = express.Router();

// Set cache duration to 1 hour
const CACHE_DURATION = 24 * 60 * 60 * 1000;
router.get('/prompt/:prompt', async (req, res) => {
  const prompt = req.params.prompt;
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}`;

  const cachedImage = cache.get(imageUrl);
  if (cachedImage) {
    res.setHeader('Content-Type', cachedImage.contentType);
    res.send(cachedImage.data);
    return;
  }

  const filename = path.join(
    __dirname,
    '..',
    'data',
    'images',
    `${encodeURIComponent(prompt)}.jpg`
  );
  if (fs.existsSync(filename)) {
    const imageBuffer = fs.readFileSync(filename);
    const contentType = 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.send(imageBuffer);

    // Store image in cache
    console.log(`Caching image ${imageUrl}`);
    cache.put(imageUrl, { contentType, data: imageBuffer }, CACHE_DURATION);

    return;
  }

  try {
    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      throw new Error(
        `Error fetching image from ${imageUrl}: ${imageRes.status} ${imageRes.statusText}`
      );
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg'

    if (contentType.startsWith('image/')) {
      const imageBuffer = await imageRes.arrayBuffer()
      
      res.setHeader('Content-Type', contentType)
      res.send(Buffer.from(imageBuffer))
      return  // Return after response is sent
      
    } else {
      console.warn(`Unexpected Content-Type: ${contentType}, but proceeding anyway`)
      const imageBuffer = await imageRes.arrayBuffer()
      
      res.setHeader('Content-Type', 'image/jpeg')
      res.send(Buffer.from(imageBuffer))
      return  // Return after response is sent
    }
  } 
  catch (err: any) {
    console.error(`Error fetching image from ${imageUrl}: ${err.message}`);
    const placeholderUrl =
      'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
    try {
      const placeholderRes = await fetch(placeholderUrl);
      if (!placeholderRes.ok) {
        throw new Error(
          `Error fetching placeholder image from ${placeholderUrl}: ${placeholderRes.status} ${placeholderRes.statusText}`
        );
      }
      const contentType = placeholderRes.headers.get('content-type');
      const placeholderBuffer = await placeholderRes.arrayBuffer();
      // Set Content-Type header before sending the response
      res.setHeader('Content-Type', contentType || '');
      res.send(Buffer.from(placeholderBuffer));
      return;
    } catch (placeholderErr: any) {
      console.error(
        `Error fetching placeholder image from ${placeholderUrl}: ${placeholderErr.message}`
      );
      res.status(500).send(`Error fetching image from ${imageUrl}`);
      return;
    }
  }
});

export default router;
