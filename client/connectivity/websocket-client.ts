import { store } from 'redux-tk/store';
import { generateUUID, scrollToElementById } from '@avsync.live/formation';
import { Message as MessageProps } from 'redux-tk/spaces/types'
import { speakStream } from 'client/speech/speech';

async function connectToServer() {
  let ws = {} as any
  if (typeof window !== 'undefined') {
    ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKETSERVER_URL || 'ws://localhost:1619');
  }

  let latestPing = null
  let latestPong = null

  const ping = () => {
    latestPing = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
    ws.send(JSON.stringify({
      type: 'ping',
      time: latestPing,
      guid: generateUUID()
    }))
  }

  ws.onopen = () => {
    ping()
    setInterval(() => {
      ping()
    }, 30 * 1000)
  }
  

  ws.onmessage = (ev: any) => {
    const wsmessage = JSON.parse(ev.data.toString())
    if (wsmessage.type === 'pong') {
    }

    const { 
      guid, 
      message, 
      type,
      conversationId,
      parentMessageId,
      personaLabel,
      systemMessage,
      userLabel,
    } = JSON.parse(ev.data.toString())

    if (type === 'response') {
      console.log('response')
      const targetThreadMessageGuids = store.getState().spaces.threadsByGuid[conversationId].messageGuids
      const targetMessageGuid = targetThreadMessageGuids.slice(-1)[0]

      const newMessage ={
        guid: targetMessageGuid,
        message,
        conversationId,
        parentMessageId,
        userLabel: 'Harmony',
        complete: true
      } as MessageProps

      store.dispatch({
        type: 'spaces/updateMessage',
        payload: { guid: targetMessageGuid, message: newMessage }
      })

      speakStream(message, targetMessageGuid)

      scrollToElementById(`bottom_${conversationId}`, {
        behavior: 'auto',
        block: 'end',
        inline: 'nearest'
      })
    }

    if (type === 'partial-response') {
      const targetThreadMessageGuids = store.getState().spaces.threadsByGuid[conversationId].messageGuids
      const targetMessageGuid = targetThreadMessageGuids.slice(-1)[0]

      const newMessage ={
        guid: targetMessageGuid,
        message,
        conversationId,
        parentMessageId,
        userLabel: 'Harmony',
        complete: false
      } as MessageProps

      store.dispatch({
        type: 'spaces/updateMessage',
        payload: { guid: targetMessageGuid, message: newMessage }
      })

      speakStream(message, targetMessageGuid)

      scrollToElementById(`bottom_${conversationId}`, {
        behavior: 'auto',
        block: 'end',
        inline: 'nearest'
      })
    }
  }

  return new Promise<WebSocket>((resolve, reject) => {
    const timer = setInterval(() => {
      if(ws.readyState === 1) {
        clearInterval(timer)
        resolve(ws)
      }
    }, 10)
  })
}

let websocketClient = {} as WebSocket

export const getWebsocketClient = () => websocketClient;

(async () => {
websocketClient = await connectToServer()
})()

setInterval(() => {
  if (!getWebsocketClient()) {
    (async () => {
      websocketClient = await connectToServer()
      })()
  }
}, 5000)