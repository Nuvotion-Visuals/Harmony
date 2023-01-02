async function connectToServer() {
    const ws = new WebSocket('ws://192.168.1.128:1619');
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
})();
