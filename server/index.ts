// @ts-ignore
const next = require('next')

const fs = require('fs')

const express = require('express')
const { join } = require('path')
const { fetchTranscript } = require('youtube-transcript').default

const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { extract } = require('@extractus/article-extractor')
const { getSubtitles } = require('youtube-captions-scraper')

const numberWithCommas = (x: number | string) =>
  (typeof x === 'string' ? x : x.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const errorMessagesLanguageModelServer = {
  400: {
    meaning: 'Bad Request',
    message: 'This status code indicates that the language model server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',
    recommendation: 'If you are seeing a 400 status code, it may indicate that there is a problem with the format or content of the request. Check the syntax and structure of the request to make sure it is correct and try again. If the problem persists, it may be necessary to contact the language model server administrator or the client application developer for further assistance.'
  },
  401: {
    meaning: 'Unauthorized',
    message: 'This status code indicates that the request requires HTTP authentication. The request should be accompanied by an Authorization header field containing a credential suitable for accessing the requested resource.',
    recommendation: 'If you are seeing a 401 status code, it may indicate that you are trying to access a resource that requires authentication. Check that you have provided the correct credentials in the request and try again. If the problem persists, it may be necessary to contact the language model server administrator or the client application developer for further assistance.'
  },
  403: {
    meaning: 'Forbidden',
    message: 'This status code indicates that the language model server understood the request but refuses to authorize it. A 403 response is not a guarantee that the client will not be able to access the resource at some point in the future. When the language model server returns a 403 response, it generally means that the client must authenticate itself to get the requested response.',
    recommendation: 'If you are seeing a 403 status code, it may indicate that you do not have permission to access the requested resource. Check that you have the correct permissions and try again. If the problem persists, it may be necessary to contact the language model server administrator or the client application developer for further assistance.'
  },
  404: {
    meaning: 'Not Found',
    message: 'This status code indicates that the language model server cannot find the requested resource. This may be because the resource does not exist or because the language model server is unable to access the resource.',
    recommendation: 'If you are seeing a 404 error, you may want to check that the URL you are trying to access is correct. If it is correct, the resource may have been moved or deleted. You may also want to check the language model server logs to see if there are any issues that may be causing the language model server to be unable to access the resource.'
  },
  408: {
    meaning: 'Request Timeout',
    message: 'This status code indicates that the language model server did not receive a complete request message within the time that it was prepared to wait. This may be because the request took too long to be sent or because the language model server was too busy to process the request.',
    recommendation: 'If you are seeing a 408 error, you may want to check the network connection and try the request again. If the error persists, it may be due to a problem with the language model server or network infrastructure. You may want to check the language model server logs for more information.'
  },
  413: { 
    meaning: 'Request Entity Too Large', 
    message: 'This status code indicates that the server is unable to process the request because the request payload is too large. This may be because the request contains too much data or because the server has a size limit for requests.', 
    recommendation: 'If you are seeing a 413 error, you may want to try reducing the size of the request payload. This may involve reducing the number of data points or the size of any attached files. You may also want to check with the server administrator to see if there are any size limits for requests. The limit of ChatGPT, the language model I use, is about 4,000 characters.' },
  429: {
    meaning: 'Too Many Requests',
    message: 'This status code indicates that the user has sent too many requests in a given amount of time. This may be because the user is making too many requests or because the language model server is unable to handle the volume of requests being made.',
    recommendation: 'If you are seeing a 429 error, you may want to check that you are not making too many requests in a short period of time. You may also want to check the language model server logs to see if there are any issues that may be causing the language model server to be unable to handle the volume of requests being made.'
  },
  500: {
    meaning: 'Internal Server Error',
    message: 'This status code indicates that an unexpected condition was encountered by the language model server while processing the request. This could be due to a bug in the language model server software or a problem with the language model server hardware.',
    recommendation: 'This usually occurs when the language model is not able to process your text. Try again, try shortening it, or try rephrasing it.'
  },
  503: {
    meaning: 'Service Unavailable',
    message: 'This status code indicates that the language model server is currently unable to handle the request due to maintenance or capacity issues. the language model server may be offline or under heavy load.',
    recommendation: 'If you are seeing a 503 status code, it is likely that the language model server is temporarily unavailable. In this case, you should try accessing the website again later. If the problem persists, you may want to contact the language model server administrator or the website owner for further assistance.'
  },
  504: {
    meaning: 'Gateway Timeout',
    message: 'This status code indicates that the language model server, while acting as a gateway or proxy, did not receive a timely response from the upstream server. This could be due to a problem with the network or a problem with the upstream server.',
    recommendation: 'If you are seeing a 504 status code, it is likely that there is a problem with the network or the upstream server. In this case, you should try accessing the website again later. If the problem persists, you may want to contact the language model server administrator or the website owner for further assistance.'
  },
  511: {
    meaning: 'Network Authentication Required',
    message: 'This status code indicates that the client must authenticate itself to get the requested response. This is similar to 401 (Unauthorized), but indicates that the client must authenticate itself to get the requested response. The client may repeat the request with a suitable Authorization header field.',
    recommendation: 'If you are seeing a 511 status code, it means that you need to authenticate yourself in order to access the requested resource. In this case, you should provide the appropriate authentication credentials in the request header. If you are unsure of how to do this or if the problem persists, you may want to contact the language model server administrator or the website owner for further assistance.'
  }
}

require('dotenv').config()
const LEXISERVER_PORT = parseInt(process.env.LEXISERVER_PORT || '1618')
const LEXIWEBSOCKETSERVER_PORT = parseInt(process.env.LEXIWEBSOCKETSERVER_PORT || '1619')
const DEV = process.env.NODE_ENV !== 'production'

const app = next({ dev: DEV })
const handle = app.getRequestHandler()

let languageModel = {} as any
let ready = false

let currentConversationId = 'NO_CURRENT_CONVERSATION_ID'
let currentMessageId = 'NO_CURRENT_MESSAGE_ID'

const initializeLanguageModel = () => {
  (async() => {
    try {

      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // @ts-ignore
      const { ChatGPTClient } = await import('@waylaidwanderer/chatgpt-api')
      const identityScript = await readMarkdownFile('./Lexi/IdentityAndBehavior.md')
      languageModel = new ChatGPTClient(
        process.env.OPENAI_API_KEY,
        {
          modelOptions: {
            model: 'gpt-3.5-turbo',
          },
          promptPrefix: `${identityScript}\nCurrent date: ${dateString}`,
          chatGptLabel: 'Lexi',
          debug: false,
        }, 
        {
          // cache options
        }
      );

      const { response, conversationId, messageId } = await languageModel.sendMessage('Hello?');

      console.log('🟣', `[${currentConversationId} - ${currentMessageId}] Sending my reponse to the user: ${response}`)
      currentConversationId = conversationId
      currentMessageId = messageId

      ready = true
    }
    catch(e) {
      const error = e as any
      console.log('🟣', `[${currentConversationId} - ${currentMessageId}] I experienced the following error: ${error}`)
      const status = error.statusCode || error.code || 500
      const message = error.message || 'internal error'
      console.log(status, message)
    }
  })()
}

// send message to language model
const sendMessageToLanguageModel = (
  message: string,
  onComplete: (arg0: {
    status: number,
    message?: string,
    data: {
      response: string
    }
  }) => void,
  onProgress: (arg0: {
    status: number,
    message?: string,
    data: {
      response: string
    }
  }) => void
) => {
  (async () => {
    try {
      const { response, conversationId, messageId } = await languageModel.sendMessage(`${message}`, {
        conversationId: currentConversationId,
        parentMessageId: currentMessageId,
        onProgress: (token: string) => {
          onProgress({ status: 200, data: { response: token } })
        }
      });

      currentMessageId = messageId
      onComplete({ status: 200, data: { response } })
    }
    catch(error) {
      if (error instanceof Error) {
        console.log('🟣', `[${currentConversationId} - ${currentMessageId}] I experienced the following error: ${error}`)

        const errorCodeRegex = /error (\d+)/;
        // @ts-ignore
        const errorCode = Number((error.message || 'error 500').match(errorCodeRegex)?.[1])

        onComplete({ 
          status: 500, 
          data: { 
            response: `I experienced the following error when trying to access my language model.<br />${(errorMessagesLanguageModelServer as any)?.[errorCode]?.meaning ? `<p>${(errorMessagesLanguageModelServer as any)?.[errorCode]?.meaning}</p><p>${(errorMessagesLanguageModelServer as any)?.[errorCode]?.recommendation}</p>` : ''}<br><pre>${error.message}</pre><pre>${error.stack}</pre>`
          }})
      }
    }
  })()
}

// initalize websocket server
const WSS = require('ws').WebSocketServer;
const wss = new WSS({ port: LEXIWEBSOCKETSERVER_PORT });
let websock = {} as typeof WSS
const serverStartTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});

let initialized = false
wss.on('connection', function connection(ws: typeof WSS) {
  console.log('🟣', `[${currentConversationId} - ${currentMessageId}] My web socket server is ready for connections`)
  // receive message from client
  ws.onmessage = (message: { data: string }) => {
    
    const action = JSON.parse(message.data) as {
      type: string,
      message: string,
      guid: string,
      messageTime: string,
    }
    // client sent ping
    if (action.type === 'ping') {
      ws.send(JSON.stringify({
        type: 'pong',
        message: {

        },
        time: new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}),
        guid: action.guid,
        status: 200,
        messageTime: action.messageTime
      }))
    }

    // client sent message
    if (action.type === 'message') {
      sendMessageToLanguageModel(
        action.message,
        ({ data, status }) => {
          ws.send(JSON.stringify({
            // server send complete response to message
            type: 'response',
            message: data.response || '',
            guid: action.guid,
            status,
            messageTime: action.messageTime
          }))
        },
        ({ data, status }) => {
          ws.send(JSON.stringify({
            // server sent partial response to message
            type: 'partial-response',
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

  initializeLanguageModel()

  // redirect if not logged in
  // server.use((req: any, res: any, next: any) => {
  //   if (
  //     req.originalUrl !== '/login' && 
  //     !req.session.loggedIn &&
  //     !req.originalUrl.startsWith('/_next') &&
  //     !req.originalUrl.startsWith('/assets') &&
  //     !req.originalUrl.startsWith('/auth')
  //   ) {
  //     res.redirect('/login')
  //     return
  //   }
    
  //   next()
  //   return
  // })

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
        console.log('🟣', `[${currentConversationId} - ${currentMessageId}] I experienced the following error: ${error}`)
        const status = error.statusCode || error.code || 500
        const message = error.message || 'internal error'
        res.send({ status, message })
      })
    }
    catch(e) {
      const error = e as any
      console.log('🟣', `[${currentConversationId} - ${currentMessageId}] I experienced the following error: ${error}`)
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
      console.log('🟣', `[${currentConversationId} - ${currentMessageId}] I experienced the following error: ${error}`)
      const status = error.statusCode || error.code || 500
      const message = error.message || 'internal error'
      res.send({ status, message })
    }
  })
  
  server.all('/next/*', async (req: Request, res: any) => {
    res.status(400).json({ error: 'Next API route not found' })
  })
  
  server.all('*', (req: Request, res: Response) => handle(req, res))

  server.listen(<number>LEXISERVER_PORT, (err: any) => {
    if (err) throw err
    console.log('🟣', `I'm listening on port ${LEXISERVER_PORT}.`)
  })
})