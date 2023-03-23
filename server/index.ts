// @ts-ignore
const next = require('next')

const fs = require('fs')

const express = require('express')
const { join } = require('path')
const { fetchTranscript } = require('youtube-transcript').default
const { v4: uuidv4 } = require('uuid');

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

interface SendMessageProps {
  conversationId: string;
  parentMessageId: string;
  chatGptLabel: string;
  promptPrefix: string;
  userLabel: string;
  message: string;
  threadId?: string;
  onComplete: (data: {
    conversationId: string;
    parentMessageId: string;
    chatGptLabel: string;
    promptPrefix: string;
    userLabel: string;
    message: string;
    response: string;
  }) => void;
  onProgress?: (data: {
    conversationId: string;
    parentMessageId: string;
    chatGptLabel: string;
    promptPrefix: string;
    userLabel: string;
    message: string;
    response: string;
    progress: number;
  }) => void;
}

let languageModels: { [key: string]: any } = {};

interface StoredMessage {
  conversationId: string;
  parentMessageId: string;
  chatGptLabel: string;
  promptPrefix: string;
  userLabel: string;
  message: string;
  response: string;
}

interface MessagesByGuid {
  [guid: string]: StoredMessage[];
}

interface StoredClient {
  api: any;
  chatGptLabel: string;
  promptPrefix: string;
  userLabel: string;
}

interface Clients {
  [key: string]: StoredClient;
}

interface MessageGuids {
  [guid: string]: boolean;
}

interface ThreadsByThreadId {
  [threadId: string]: string[]; // Array of GUIDs
}

const messagesByGuid: MessagesByGuid = {};
const clients: Clients = {};
const messageGuids: MessageGuids = {};
const threadsByThreadId: ThreadsByThreadId = {};

const sendMessage = async ({
  conversationId,
  parentMessageId,
  chatGptLabel,
  promptPrefix,
  userLabel,
  message,
  threadId,
  onComplete,
  onProgress,
}: SendMessageProps) => {
  const guid = uuidv4();
  messageGuids[guid] = true;

  let storedClient = clients[`${promptPrefix}-${chatGptLabel}-${userLabel}`];

  if (!storedClient) {
    // Dynamically import the ChatGPTAPI
    const { ChatGPTAPI } = await import('chatgpt');
    const api = new ChatGPTAPI({ 
      apiKey: process.env.OPENAI_API_KEY || '',

    });

    storedClient = {
      api,
      chatGptLabel,
      promptPrefix,
      userLabel,
    };
    clients[`${promptPrefix}-${chatGptLabel}-${userLabel}`] = storedClient;
  }

  const onCompleteWrapper = (data: StoredMessage) => {
    if (!messagesByGuid[guid]) {
      messagesByGuid[guid] = [];
    }
    messagesByGuid[guid].push(data);

    if (threadId) {
      if (!threadsByThreadId[threadId]) {
        threadsByThreadId[threadId] = [];
      }
      threadsByThreadId[threadId].push(guid);
    }

    onComplete(data);
  };

  const onProgressWrapper = (partialResponse: any) => {
    if (onProgress) {
      onProgress({
        conversationId,
        parentMessageId,
        chatGptLabel,
        promptPrefix,
        userLabel,
        message,
        response: partialResponse.text,
        progress: partialResponse.progress,
      });
    }
  };

  const res = await storedClient.api.sendMessage(`${message}`, {
    systemMessage: chatGptLabel,
    parentMessageId,
    onProgress: onProgressWrapper,
  });

  onCompleteWrapper({
    conversationId,
    parentMessageId: res.id,
    chatGptLabel,
    promptPrefix,
    userLabel,
    message,
    response: res.text,
  });

  return guid;
};


  interface Message {
    type: string,
    message: string,
    guid: string,
    parentMessageId: string,
    messageTime: string,
    chatGptLabel: string,
    promptPrefix: string,
    conversationId: string,
    userLabel: string
  }

 // initalize websocket server
  const WSS = require('ws').WebSocketServer;
  const wss = new WSS({ port: LEXIWEBSOCKETSERVER_PORT });
  let websock = {} as typeof WSS
  const serverStartTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});

  let initialized = false
  wss.on('connection', function connection(ws: typeof WSS) {
    // receive message from client
    ws.onmessage = (message: { data: string }) => {
      const action = JSON.parse(message.data) as Message
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
        console.log(action)
        sendMessage({
          conversationId: action.conversationId,
          parentMessageId: action.parentMessageId,
          chatGptLabel: action.chatGptLabel,
          promptPrefix: action.promptPrefix,
          userLabel: action.userLabel,
          message: action.message,
          onComplete: ({ response, parentMessageId, conversationId }) => {
            console.log('Sending response to client')
            ws.send(JSON.stringify({
              // server send complete response to message
              type: action.chatGptLabel === 'GENERATE' ? 'GENERATE_response' : 'response',
              message: response || '',
              guid: action.guid,
              conversationId: conversationId,
              parentMessageId: parentMessageId,
              chatGptLabel: action.chatGptLabel,
              promptPrefix: action.promptPrefix,
              userLabel: action.userLabel,
              status: 200,
              messageTime: action.messageTime
            }))
          },
          onProgress: ({ response, parentMessageId, conversationId }) => {
            ws.send(JSON.stringify({
              // server send complete response to message
              type: action.chatGptLabel === 'GENERATE' ? 'GENERATE_partial-response' : 'partial-response',
              message: response || '',
              guid: action.guid,
              conversationId: conversationId,
              parentMessageId: parentMessageId,
              chatGptLabel: action.chatGptLabel,
              promptPrefix: action.promptPrefix,
              userLabel: action.userLabel,
              status: 200,
              messageTime: action.messageTime
            }))
          },
        });
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

const https = require('https');
const stream = require('stream');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL/TLS certificate errors
});

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

  sendMessage({
    conversationId: '',
    parentMessageId: '',
    chatGptLabel: 'Lexi',
    promptPrefix: 'Your name is Lexi.',
    userLabel: 'user',
    message: 'State if you are functioning properly. What is your name?',
    onComplete: ({ response, parentMessageId, conversationId }) => {
      console.log(response)
    },
    onProgress: ({ response, parentMessageId, conversationId }) => {
    },
  });

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

  server.get('/send-message', async (req: any, res: any) => {
    try {
      // Extract the relevant data from the request query parameters
      const {
        conversationId,
        parentMessageId,
        chatGptLabel,
        promptPrefix,
        userLabel,
        message,
        threadId,
      } = req.query;

      console.log(res.query)

    // Call the sendMessage function with the extracted data
    await sendMessage({
      conversationId,
      parentMessageId,
      chatGptLabel,
      promptPrefix,
      userLabel,
      message,
      threadId,
      onComplete: (data) => {
        res.status(200).json({ ...data });
      },
    });
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while sending the message');
    }
  });

  // Set cache duration to 1 hour
  const CACHE_DURATION = 24 * 60 * 60 * 1000;
  const cache = require('memory-cache');
  server.get('/image/prompt/:prompt', async (req: any, res: any) => {
    const prompt = req.params.prompt;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    
    const cachedImage = cache.get(imageUrl);
    if (cachedImage) {
      res.setHeader('Content-Type', cachedImage.contentType);
      res.send(cachedImage.data);
      return;
    }

    try {
      const imageRes = await fetch(imageUrl, {
        agent: httpsAgent,
      } as RequestInit);

      if (!imageRes.ok) {
        throw new Error(`Error fetching image from ${imageUrl}: ${imageRes.status} ${imageRes.statusText}`);
      }

      const contentType = imageRes.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error(`Invalid content type for image: ${contentType}`);
      }

      // @ts-ignore
      const imageBuffer = await imageRes.buffer();
      res.setHeader('Content-Type', contentType);
      res.send(imageBuffer);

      // Store image in cache
      console.log(`Caching image ${imageUrl}`);
      cache.put(imageUrl, { contentType, data: imageBuffer }, CACHE_DURATION);
    } catch (err: any) {
      console.error(`Error fetching image from ${imageUrl}: ${err.message}`);
      const placeholderUrl = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
      try {
        const placeholderRes = await fetch(placeholderUrl, {
          agent: httpsAgent,
        } as RequestInit);
        if (!placeholderRes.ok) {
          throw new Error(`Error fetching placeholder image from ${placeholderUrl}: ${placeholderRes.status} ${placeholderRes.statusText}`);
        }
        const contentType = placeholderRes.headers.get('content-type');
        const placeholderBuffer = await placeholderRes.arrayBuffer();
        res.setHeader('Content-Type', contentType);
        res.send(Buffer.from(placeholderBuffer));
      } catch (placeholderErr: any) {
        console.error(`Error fetching placeholder image from ${placeholderUrl}: ${placeholderErr.message}`);
        res.status(500).send(`Error fetching image from ${imageUrl}`);
      }
    }
  });

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
        console.log('🟣', `[I experienced the following error: ${error}`)
        const status = error.statusCode || error.code || 500
        const message = error.message || 'internal error'
        res.send({ status, message })
      })
    }
    catch(e) {
      const error = e as any
      console.log('🟣', `[I experienced the following error: ${error}`)
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
      console.log('🟣', `I experienced the following error: ${error}`)
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