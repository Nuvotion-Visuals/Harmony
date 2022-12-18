import { Button } from '@avsync.live/formation'
import { InferGetServerSidePropsType } from 'next'
import { getWebsocketClient } from '../../Lexi/System/Connectvity/websocket-client'

type Post = {
  author: string
  content: string
}

const Page = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  const websocketClient = getWebsocketClient()
  return <>
    <Button
      text='Initialize personality'
      onClick={() => {
        const action = {
          type: 'script',
          message: 'Identity'
        }
        websocketClient.send(JSON.stringify(action))
      }}
    />
  </>
}
  
export default Page

export const getServerSideProps = async ({ params }: any) => {
//   const res = await fetch('https://.../posts')
console.log(params)
  const posts: Post[] = []

  return {
    props: {
      posts,
    },
  }
}

