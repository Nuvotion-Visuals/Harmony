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

    const contentType = imageRes.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`Invalid content type for image: ${contentType}`);
    }

    const imageBuffer = await imageRes.arrayBuffer();
    // Set Content-Type header only once
    res.setHeader('Content-Type', contentType || '');
    res.send(Buffer.from(imageBuffer));

    // Store image in cache and on disk
    console.log(`Caching image ${imageUrl}`);
    cache.put(imageUrl, { contentType: contentType || '', data: Buffer.from(imageBuffer) }, CACHE_DURATION);

    fs.writeFileSync(filename, Buffer.from(imageBuffer));
    console.log(`Saved image to disk: ${filename}`);
  } catch (err: any) {
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
