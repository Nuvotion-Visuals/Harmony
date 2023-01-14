import { v4 as uuidv4 } from 'uuid'

async function connectToServer() {
    const ws = new WebSocket('wss://ws.lexi.studio');

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
        console.log(wsmessage)
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
