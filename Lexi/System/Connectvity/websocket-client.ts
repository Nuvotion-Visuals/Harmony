async function connectToServer() {
    const ws = new WebSocket('wss://ws.lexi.studio');
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
export const reconnect = () => {
  (async () => {
    websocketClient = await connectToServer()
  })()
}

(async () => {
  websocketClient = await connectToServer()
})()
