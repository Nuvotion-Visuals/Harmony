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

let currentConversationId = ''
let currentMessageId = ''

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
      const { response, messageId } = await lexi.sendMessage(message, {
        conversationId: currentConversationId,
        parentMessageId: currentMessageId,
        timeoutMs: 2 * 60 * 1000
      })
      currentMessageId = messageId
      callback({ status: 200, data: { response } })
    }
    catch(error) {
      if (error instanceof Error) {
        console.log(error)
        callback({ 
          status: 500, 
          data: { 
            response: `Unfortunately, you may need to log out and log in again. I experienced the following error when trying to access my language model.<br><pre>${error.message}</pre> ${error.cause ? `<br><pre>${error.cause}</pre>` : ''} <pre>${error.stack}</pre> <br>Because I am not able to access my language model, I cannot answer intelligently. This is usually caused when my access to the ChatCPT session is interrupted.`
          }})
      }
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

    else if (action.type === 'script') {
      const script = fs.readFileSync('./Lexi/Scripts/1. Identity/Readme.md', 'utf8')
      console.log(script)
      sendMessage(
        script,
        ({ data, status }) => {
          ws.send(JSON.stringify({
            type: 'response',
            message: data.response || '',
            guid: Math.random(),
            status,
            messageTime: action.messageTime
          }))
        }
      )
    }
  }
})

async function readMarkdownFile(filePath: string): Promise<string> {
  try {
    const data: Buffer = await fs.promises.readFile(filePath);
    return data.toString();
  } catch (error: any) {
    throw new Error(`Failed to read markdown file at ${filePath}: ${error.message}`);
  }
}

function sortByNumber(strings: string[]): string[] {
  function extractNumber(string: string): number {
    // Use a regular expression to extract the numeric portion of the string
    const matchResult = match(string, /\d+/);
    if (!matchResult) {
      throw new Error(`Unable to extract number from string: ${string}`);
    }
    // Return the extracted number as an integer
    return parseInt(matchResult[0], 10);
  }
  // Sort the strings using the extractNumber key function
  return sorted(strings, (a, b) => extractNumber(a) - extractNumber(b));
}

function sorted<T>(array: T[], compareFn?: (a: T, b: T) => number): T[] {
  // Create a copy of the array
  const copy = array.slice();
  // Sort the copy using the compare function if provided, or the default comparison function if not
  copy.sort(compareFn || ((a, b) => a < b ? -1 : 1));
  // Return the sorted copy
  return copy;
}

const match = (string: string, regex: RegExp): RegExpMatchArray | null => {
  // Use the regex.exec() method to search for a match in the string
  const result = regex.exec(string);
  // If a match was found, return the match array
  if (result) {
    return result;
  }
  // If no match was found, return null
  return null;
}

const extractScriptNameFromPath = (input: string): string => 
  input.split(' ')[1].split('/')[0]

const countWords = (s: string): number => {
  s = s.replace(/(^\s)|(\s$)/gi,""); // exclude start and end white-space
  s = s.replace(/[ ]{2,}/gi," "); // 2 or more spaces to 1
  s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
  return s.split(' ').filter(str => str !== "").length;
}

const initializeScripts = () => {
  (async () => {
    const getDirectories = (source: string) =>
      fs.readdirSync(source, { withFileTypes: true })
        .filter((dirent: any) => dirent.isDirectory())
        .map((dirent : any) => dirent.name)
        
    const scriptNames = sortByNumber(getDirectories('./Lexi/Scripts/'))
    const scriptPaths = scriptNames.map(scriptName => `./Lexi/Scripts/${scriptName}/Readme.md`)
    let pageCount = 0
    let wordCount = 0
    let characterCount = 0
    let numberOfSteps = 0

    const logResults = async (scripts: string[]) => {
      let step = 1
      numberOfSteps = scripts.length
      for (const script of scripts) {
        const result = await readMarkdownFile(script)
        const scriptWordCount = countWords(result)
        const scriptCharacterCount = result.length
        const scriptPageCount = scriptWordCount / 250
        console.log(`🟣 Initializing script ${step}/${numberOfSteps} - ${extractScriptNameFromPath(script)} [${scriptCharacterCount} characters, ${scriptWordCount} words, ${scriptPageCount.toFixed(1)} pages, ${(scriptWordCount / 300).toFixed(1)} minutes read]`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // simulate request time
        step += 1
        wordCount += scriptWordCount
        characterCount += scriptCharacterCount
        pageCount += scriptPageCount
      }
    }
    const startTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
    await logResults(scriptPaths)
    const endTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
    const getTimeDifference = (startTime: string, endTime: string) : number => {
      return Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);
    }
    console.log(`🟣 ${numberOfSteps} scripts initialized, totalling ${characterCount} characters ${wordCount} words. It would take a human aproximately ${(wordCount / 300).toFixed(0)} minutes to that many words. It took me ${getTimeDifference(startTime, endTime)} seconds.`)
  })()
}
initializeScripts()

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
          await lexi.initSession()
          const {response, conversationId, messageId } = await lexi.sendMessage('Hello.', {
            onProgress: (partialResponse: any) => {
              console.log(partialResponse)
            }
          })
          console.log(response, conversationId, messageId)
          currentConversationId = conversationId
          currentMessageId = messageId
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