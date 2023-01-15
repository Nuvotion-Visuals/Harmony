import { InferGetServerSidePropsType } from 'next'
import styled from 'styled-components'

type Post = {
  author: string
  content: string
}

const Page = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    // will resolve posts to type Post[]
  return (<S.App src='https://framework.lexi.studio/admin/content-manager/collectionType/api::character.character?page=1&pageSize=10&sort=updatedAt:ASC' allow='camera;microphone' allowFullScreen></S.App>)
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
    height: calc(calc(calc(100vh - calc(var(--F_Header_Height) + var(--L_Prompt_Height))) - calc(var(--L_Prompt_Padding) * 2)) - calc(var(--F_Input_Height) + .75rem));
  `
}

