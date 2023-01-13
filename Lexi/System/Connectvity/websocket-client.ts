async function connectToServer() {
    const ws = new WebSocket('wss://ws.lexi.studio');
    setInterval(() => {
      ws.send(JSON.stringify({
        type: 'ping'
      }))
    }, 30 * 1000)
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
