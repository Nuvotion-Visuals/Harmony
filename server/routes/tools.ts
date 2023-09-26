import express, { Request, Response } from 'express'
import { extract } from '@extractus/article-extractor'
// @ts-ignore
import { getSubtitles, Caption } from 'youtube-captions-scraper'
import google from 'googlethis'
import { harmonyErrorMessage } from '../../systemMessage'

const router = express.Router()

const handleError = (res: Response, error: Error & { statusCode?: number; code?: number }) => {
  console.log('🔴', `${harmonyErrorMessage}${error}`)
  const status = error.statusCode || error.code || 500
  const message = error.message || 'internal error'
  res.status(status).send({ status, message })
}

router.post('/parse-article', async (req: Request, res: Response) => {
  const { contentUrl } = req.body

  try {
    const input = contentUrl as string
    const article = await extract(input)
    res.send({ status: 200, data: { article } })
  } 
  catch (error) {
    handleError(res, error as Error & { statusCode?: number; code?: number })
  }
})

router.post('/parse-youtube-video', async (req: Request, res: Response) => {
  const { videoUrl } = req.body

  const youtube_parser = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[7].length == 11 ? match[7] : ''
  }

  try {
    const captions: Caption[] = await getSubtitles({
      videoID: youtube_parser(videoUrl),
      lang: 'en',
    })
    const transcript = captions.map((cap) => cap.text).join(' ')
    res.send({ status: 200, data: { transcript } })
  } catch (error) {
    handleError(res, error as Error & { statusCode?: number; code?: number })
  }
})

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string
  const options = {
    page: 0, 
    safe: false, 
    parse_ads: false, 
    additional_params: {
      hl: 'en' 
    }
  }

  try {
    const results = await google.search(query, options)
  //   const news = await google.getTopNews()
  //  console.info('Google Top News:', news)
    res.send({ status: 200, data: { results } })
  } 
  catch (error) {
    console.log('🔴', `${harmonyErrorMessage}${error}`)
    res.status(500).send({ status: 500, message: 'internal error' })
  }
})

router.get('/search/images', async (req: Request, res: Response) => {
  const query = req.query.q as string
  const options = {
    page: 0, 
    safe: false, 
    parse_ads: false, 
    additional_params: {
      hl: 'en' 
    }
  }

  try {
    const results = await google.image(query, options)
  //   const news = await google.getTopNews()
  //  console.info('Google Top News:', news)
    res.send({ status: 200, data: { results } })
  } 
  catch (error) {
    console.log('🔴', `${harmonyErrorMessage}${error}`)
    res.status(500).send({ status: 500, message: 'internal error' })
  }
})

interface Suggestion {
  suggestion: string
  relevance: number
  type: string
}

export function getAllSuggestions(string: string): Promise<Suggestion[]> {
  const searchURL = 'https://suggestqueries.google.com/complete/search?client=chrome&q='

  return fetch(searchURL + encodeURIComponent(string))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
      }
      return response.json()
    })
    .then((result) => {
      const suggestions: Suggestion[] = result[1].map((suggestion: Suggestion, index: number) => {
        return {
          suggestion: suggestion,
          relevance: result[4]['google:suggestrelevance'][index],
          type: result[4]['google:suggesttype'][index],
        }
      })
      return suggestions
    })
    .catch((error) => {
      throw new Error(`Network error: ${error.message}`)
    })
}

export function getQuerySuggestions(string: string): Promise<Suggestion[]> {
  return getAllSuggestions(string).then((suggestions) => {
    return suggestions.filter((suggestion) => {
      return suggestion.type == 'QUERY'
    })
  })
}

router.get('/suggest', async (req: Request, res: Response) => {
  const query = req.query.q as string
  if (!query) {
    return res.status(400).send({ status: 400, message: 'Missing query parameter' })
  }

  try {
    const suggestions = await getQuerySuggestions(query)
    res.send({ status: 200, data: { suggestions } })
  } 
  catch (error) {
    console.log(`🔴 ${harmonyErrorMessage}${error}`)
    res.status(500).send({ status: 500, message: 'internal error' })
  }
})

export default router
