import { InferGetServerSidePropsType } from 'next'
import styled from 'styled-components'

type Post = {
  author: string
  content: string
}

const Page = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    // will resolve posts to type Post[]
  return (<S.App src='http://192.168.1.128:1620/admin/content-manager/collectionType/api::realm.realm?page=1&pageSize=100&sort=updatedAt:ASC' allow='camera;microphone' allowFullScreen></S.App>)
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

const S = {
  App: styled.iframe`
    width: 100%;
    height: calc(calc(100vh - calc(var(--F_Header_Height) + 300px)) - calc(var(--F_Input_Height) + 1.5rem)); 
  `
}

