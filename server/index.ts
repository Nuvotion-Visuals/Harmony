// @ts-ignore
const next = require('next')

const fs = require('fs')

const express = require('express')
const { join } = require('path')
const { fetchTranscript } = require('youtube-transcript').default

const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const { extract } = require('@extractus/article-extractor')

const { getSubtitles } = require('youtube-captions-scraper')

const bodyParser = require('body-parser')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

require('dotenv').config()
const port = parseInt(process.env.PORT || '1618', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let lexi = {} as any

// send message to language model
const sendMessage = (
  message: string,
  callback: (arg0: {
    status: number,
    message?: string,
    data: {
      response: string
    }
  }) => void
) => {
  (async () => {
    try {
      const response = await lexi.sendMessage(message)
      callback({ status: 200, data: { response } })
    }
    catch(e) {
      const error = e as any
      console.log(error)
      const status = error.statusCode || error.code || 500
      const message = error.message || 'internal error'
      callback({ status, message, data: { response: '' } })
    }
  })()
}

// initalize websocket server
const WSS = require('ws').WebSocketServer;
const wss = new WSS({ port: 1619 });
let websock = {} as typeof WSS
wss.on('connection', function connection(ws: typeof WSS) {
  console.log('Web socket server initialized.')
  // receive message from client
  ws.onmessage = (message: { data: string }) => {
    const action = JSON.parse(message.data) as {
      type: string,
      message: string,
      guid: string,
      messageTime: string,
    }
    if (action.type === 'message') {
      sendMessage(
        action.message,
        ({ data, status }) => {
          // send response from language model to client
          console.log(`Sending Lexi's response to client...`)

          ws.send(JSON.stringify({
            type: 'response',
            message: data.response || '',
            guid: action.guid,
            status,
            messageTime: action.messageTime
          }))
        }
      )
    }
  }
})

// create app
app.prepare().then(() => {
  const server = express()

  server.use(
    bodyParser.json({limit: '10mb'})
  )
  server.use(
    bodyParser.urlencoded({limit: '10mb', extended: true})
  )

  server.use(
    express.static('public')
  )

  server.use(
    cookieParser()
  )

  server.use(
    cookieSession({ 
      name: 'session', 
      keys: ['eThElIMpLYMOSeAMaNKlEroashIrOw'],
      maxAge: 1.75 * 60 * 60 * 1000 // 1 hour 45 minutes 
    })
  )

  server.use((req: any, res: any, next: any) => {
    if (
      req.originalUrl !== '/login' && 
      !req.session.loggedIn &&
      !req.originalUrl.startsWith('/_next') &&
      !req.originalUrl.startsWith('/assets') &&
      !req.originalUrl.startsWith('/auth')
    ) {
      res.redirect('/login')
      return
    }
    
    next()
    return
  })

  // login
  server.post('/auth/login', async (req: any, res: any) => {
    const { email, password } = req.body
    try {
      (async() => {
        try {
          const { ChatGPTAPIBrowser } = await import('chatgpt')

          lexi = new ChatGPTAPIBrowser({
            email,
            password
          })
          await lexi.init()
          const response = await lexi.sendMessage('Hello.', {
            onProgress: (partialResponse: any) => {
              console.log(partialResponse)
            }
          })
          console.log(response)
          req.session.loggedIn = true
          res.send({ status: 200 })
        }
        catch(e) {
          const error = e as any
          console.log(error)
          const status = error.statusCode || error.code || 500
          const message = error.message || 'internal error'
          res.send({ status, message })
        }
      })()
    }
    catch(e) {
      console.log(e)
      res.send({ status: 'failure', msg: 'Code validation failed' })
    }
  })

  // initialize Lexi
  server.post('/lexi/chat/init', async (req: any, res: any) => {
    try {
      // const lexiInitializationScript = fs.readFileSync('lexi/lexi-initialization.txt', 'utf8')
      const response = await lexi.sendMessage('Are you there?')
      res.send({ status: 200, data: {
        response
      }})
    }
    catch(e) {
      const error = e as any
      console.log(error)
      const status = error.statusCode || error.code || 500
      const message = error.message || 'internal error'
      res.send({ status, message })
    }
  })

   // chat
  server.post('/tools/parse-article', async (req: any, res: any) => {
    const { contentUrl } = req.body

    try {
      const input = contentUrl
      extract(input)
      // @ts-ignore
        .then(article => {
          res.send({ status: 200, data: {
            article
          }})
        })
      // @ts-ignore
      .catch(e => {
        const error = e as any
        console.log(error)
        const status = error.statusCode || error.code || 500
        const message = error.message || 'internal error'
        res.send({ status, message })
      })
    }
    catch(e) {
      const error = e as any
      console.log(error)
      const status = error.statusCode || error.code || 500
      const message = error.message || 'internal error'
      res.send({ status, message })
    }
  })

  server.post('/tools/parse-youtube-video', async (req: any, res: any) => {
    const { videoUrl } = req.body

    function youtube_parser(url : string) : string {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return (match&&match[7].length==11)? match[7] : '';
  }

    try {
      getSubtitles({
        videoID: youtube_parser(videoUrl), 
        lang: 'en'
      }).then((captions : {
        'start': Number,
        'dur': Number,
        'text': String
      }[]) => {
        const transcript = captions.map(cap => cap.text).join(' ')
        res.send({ status: 200, data: {
          transcript
        }})
      })
    }
    catch(e) {
      const error = e as any
      console.log(error)
      const status = error.statusCode || error.code || 500
      const message = error.message || 'internal error'
      res.send({ status, message })
    }
  })
  
  server.all('/next/*', async (req: Request, res: any) => {
    res.status(400).json({ error: 'Next API route not found' })
  })
  
  server.all('*', (req: Request, res: Response) => handle(req, res))

  server.listen(<number>port, (err: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})