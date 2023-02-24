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

const getTimeDifference = (startTime: string, endTime: string) : number => {
  return Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);
}

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
const port = parseInt(process.env.PORT || '1618', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let languageModel = {} as any
let ready = false

let currentConversationId = 'NO_CURRENT_CONVERSATION_ID'
let currentMessageId = 'NO_CURRENT_MESSAGE_ID'

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
      const { response, messageId } = await languageModel.sendMessage(`${message}\n(You are a creative AGI named Lexi developed by AVsync.LIVE who assists creative professionals with their projects)`, {
        conversationId: currentConversationId,
        parentMessageId: currentMessageId,
        timeoutMs: 2 * 60 * 1000,
        onProgress: (partialResponse: any) => {
          onProgress({ status: 200, data: { response: partialResponse.response } })
          currentMessageId = partialResponse.messageId
        }
      })
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
const wss = new WSS({ port: 1619 });
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
          console.log('🟣', `[${currentConversationId} - ${currentMessageId}] Sending my partial response to the user: ${data.response}`)
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
    // if (action.type === 'initialize') {
    //   (async () => {
    //     if (!initialized) {
    //       initialized = true

    //       const scriptInitializationTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})

    //       const getDirectories = (source: string) =>
    //         fs.readdirSync(source, { withFileTypes: true })
    //           .filter((dirent: any) => dirent.isDirectory())
    //           .map((dirent : any) => dirent.name)
              
    //       const scriptNames = sortByNumber(getDirectories('./Lexi/Scripts/'))
    //       const scriptPaths = scriptNames.map(scriptName => `./Lexi/Scripts/${scriptName}/Readme.md`)
    //       let pageCount = 0
    //       let wordCount = 0
    //       let characterCount = 0
    //       let numberOfSteps = 0
    //       let step = 1

    //       ws.send(JSON.stringify({
    //         type: 'initialize-response',
    //         message: null,
    //         response: `Hi there. I'm about to begin reading my artificial general intelligence (AGI) scripts. I have ${scriptNames.length} to read. The time this will take will largely depend on the current responsiveness of the language model. I'll update you with my progress as I read them.`,
    //         guid: 'Initialize',
    //         status: 200,
    //         scriptName: 'Introduction'
    //       }))

    //       const logResults = async (scripts: string[]) => {
    //         numberOfSteps = scripts.length

    //         for (const script of scripts) {
    //           const result = await readMarkdownFile(script)
    //           const scriptName = extractScriptNameFromPath(script)
    //           const scriptWordCount = countWords(result)
    //           const scriptCharacterCount = result.length
    //           const scriptPageCount = scriptWordCount / 250
             
    //           const messageTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
              
    //           // keep trying if it fails
    //           let keepTrying
    //           let failCount = 0
    //           let messageId = ''
    //           let response = 'I failed to connect'

    //           console.log(`Making async function call: ${scriptName}`);

    //             try {
    //               const data = await languageModel.sendMessage(result, {
    //                 conversationId: currentConversationId,
    //                 parentMessageId: currentMessageId,
    //                 timeoutMs: 2 * 60 * 1000
    //               })
    //               messageId = data.messageId
    //               response = data.response

    //               currentMessageId = messageId
    //               const responseTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
    //               wordCount += scriptWordCount
    //               characterCount += scriptCharacterCount
    //               pageCount += scriptPageCount
    //               const fullResponse = `${response} That was ${step} of ${numberOfSteps} scripts I'm currently in the process of reading. It was ${numberWithCommas(scriptCharacterCount)} characters, which is ${numberWithCommas(scriptWordCount)} words or ${numberWithCommas(scriptPageCount.toFixed(1))} pages, and would take a human ${numberWithCommas((scriptWordCount / 300).toFixed(1))} minutes to read. It took me ${(getTimeDifference(messageTime, responseTime) / 60).toFixed(0) === '0' ? `${(getTimeDifference(messageTime, responseTime))} seconds` : `${(getTimeDifference(messageTime, responseTime) /60).toFixed(1)} minutes`}. I have been reading scripts for ${(getTimeDifference(scriptInitializationTime, responseTime) / 60).toFixed(1)} minutes and have read ${numberWithCommas(pageCount.toFixed(1))} pages.`
    //               step += 1
                  
    //               console.log('🟣', fullResponse)
    //               ws.send(JSON.stringify({
    //                 type: 'message',
    //                 message: `Read your ${scriptName}`,
    //                 response: fullResponse,
    //                 guid: `${scriptName}`,
    //                 status: 200,
    //                 messageTime,
    //                 responseTime,
    //                 scriptName,
    //               }))
    //             } catch (error) {
    //               console.error(error);
    //               // add failure message
    //             }
    //           }
    //       }     
          
    //       const startTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
    //       await logResults(scriptPaths)
    //       const endTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})

    //       await new Promise(resolve => setTimeout(resolve, 5000));
    //       // add failure message
    //       const response = 
    //         wordCount === 0
    //           ? `I wasn't able to read any of my scripts. I likely lost my connection to the language model. I suggest that you log out and log in again.`
    //           : `I read ${step - 1} scripts, totalling ${characterCount} characters, ${wordCount} words or ${pageCount} pages. It would take a human aproximately ${(wordCount / 300).toFixed(0)} minutes to read that many words. It took me ${(getTimeDifference(startTime, endTime) / 60).toFixed(0)} minutes.`
    //       console.log('🟣', response)
    //       ws.send(JSON.stringify({
    //         type: 'message',
    //         message: null,
    //         response: response,
    //         guid: `${Math.random()})`,
    //         status: 200,
    //         messageTime: startTime,
    //         responseTime: endTime
    //       }))
    //     }
    //     else {
    //       ws.send(JSON.stringify({
    //         type: 'message',
    //         message: null,
    //         response: `I have already read my scripts.`,
    //         guid: 'Already Initialize',
    //         status: 200
    //       }))
    //     }
    //   })()
    // }
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


  // login
  server.post('/auth/login', async (req: any, res: any) => {
    const { email, password } = req.body
    try {
      (async() => {
        try {
          const { ChatGPTAPIBrowser } = await import('chatgpt')

          languageModel = new ChatGPTAPIBrowser({
            email,
            password
          })
          await languageModel.initSession()

          const identityScript = await readMarkdownFile('./Lexi/Scripts/1. Identity/Readme.md')
          const {response, conversationId, messageId } = await languageModel.sendMessage(identityScript, {
            onProgress: (partialResponse: any) => {
              currentMessageId = partialResponse.messageId
            }
          })

          console.log('🟣', `[${currentConversationId} - ${currentMessageId}] Sending my reponse to the user: ${response}`)
          currentConversationId = conversationId
          currentMessageId = messageId

          req.session.loggedIn = true
          ready = true
          res.send({ status: 200 })
        }
        catch(e) {
          const error = e as any
          console.log('🟣', `[${currentConversationId} - ${currentMessageId}] I experienced the following error: ${error}`)
          const status = error.statusCode || error.code || 500
          const message = error.message || 'internal error'
          res.send({ status, message })
        }
      })()
    }
    catch(e) {
      console.log('🟣', `[${currentConversationId} - ${currentMessageId}] I experienced the following error: ${e}`)
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

  server.listen(<number>port, (err: any) => {
    if (err) throw err
    console.log('🟣', `I'm listening on port ${port}.`)
  })
})