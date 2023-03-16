import { store } from 'redux-tk/store';
import { v4 as uuidv4 } from 'uuid'
import { Message as MessageProps } from 'redux-tk/spaces/types'

async function connectToServer() {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_LEXIWEBSOCKETSERVER_URL || 'ws://localhost:1619');

    let latestPing = null
    let latestPong = null

    const ping = () => {
      latestPing = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
      ws.send(JSON.stringify({
        type: 'ping',
        time: latestPing,
        guid: uuidv4()
      }))
    }

    ws.onopen = () => {
      ping()
    }
    setInterval(() => {
      ping()
    }, 30 * 1000)

    ws.onmessage = (ev) => {
      const wsmessage = JSON.parse(ev.data.toString())
      if (wsmessage.type === 'pong') {
        // console.log(wsmessage)
      }

      const { 
        guid, 
        message, 
        type,
        conversationId,
        parentMessageId,
        chatGptLabel,
        promptPrefix,
        userLabel,
      } = JSON.parse(ev.data.toString())
      console.log(type, message)

      if (type === 'response') {
        const targetThreadMessageGuids = store.getState().spaces.threadsByGuid[conversationId].messageGuids
        const targetMessageGuid = targetThreadMessageGuids.slice(-1)[0]

        const newMessage ={
          guid: targetMessageGuid,
          message,
          conversationId,
          parentMessageId,
          userLabel: 'Lexi'
        } as MessageProps

        store.dispatch({
          type: 'spaces/updateMessage',
          payload: { guid: targetMessageGuid, message: newMessage }
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
