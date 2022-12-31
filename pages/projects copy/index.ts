import { InferGetServerSidePropsType } from 'next'

type Post = {
  author: string
  content: string
}

const Page = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    // will resolve posts to type Post[]
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

