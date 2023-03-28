import { store } from 'redux-tk/store';
import { v4 as uuidv4 } from 'uuid'
import { Message as MessageProps } from 'redux-tk/spaces/types'
import { speakStream } from '../Language/speech';
import { markdownToHTML } from '@avsync.live/formation';

const highlightText = (html: string, currentlySpeaking: string | null): string => {
  const openingTag = `<span style="color: var(--F_Primary_Variant)">`;
  const closingTag = "</span>";
  let len = 0;
  if (currentlySpeaking) {
    len = currentlySpeaking.length;
  }

  let startIndex = 0;
  let index = currentlySpeaking ? html.indexOf(currentlySpeaking, startIndex) : -1;
  let highlightedHtml = "";

  while (index !== -1) {
    // Append the HTML before the match
    highlightedHtml += html.substring(startIndex, index);

    // Append the highlighted match
    highlightedHtml += openingTag + html.substring(index, index + len) + closingTag;

    // Update the start index and search for the next match
    startIndex = index + len;
    index = html.indexOf(currentlySpeaking as string, startIndex);
  }

  // Append any remaining HTML after the last match
  highlightedHtml += html.substring(startIndex);

  return highlightedHtml;
}


async function connectToServer() {
  let ws = {} as any
  if (typeof window !== 'undefined') {
    ws = new WebSocket(process.env.NEXT_PUBLIC_LEXIWEBSOCKETSERVER_URL || 'ws://localhost:1619');
  }

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
    setInterval(() => {
      ping()
    }, 30 * 1000)
  }
  

  ws.onmessage = (ev: any) => {
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
      personaLabel,
      systemMessage,
      userLabel,
    } = JSON.parse(ev.data.toString())
    // console.log(type, message)

    if (type === 'response') {
      console.log('response')
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

      speakStream(message, guid)

      setTimeout(() => {
        const target = document.getElementById(`bottom_${conversationId}`)
        if (target) {
          target.scrollIntoView({
            behavior: "auto", // "auto" or "smooth"
            block: "end", // "start", "center", "end", or "nearest"
            inline: "nearest" // "start", "center", "end", or "nearest"
          });
        }
      }, 100)
     
    }

    if (type === 'partial-response') {
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

      speakStream(message, guid)

      setTimeout(() => {
        const target = document.getElementById(`bottom_${conversationId}`)
        if (target) {
          target.scrollIntoView({
            behavior: "auto", // "auto" or "smooth"
            block: "end", // "start", "center", "end", or "nearest"
            inline: "nearest" // "start", "center", "end", or "nearest"
          });
        }
      }, 100)
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