import { InferGetStaticPropsType } from 'next'

type Post = {
  author: string
  content: string
}

function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
    // will resolve posts to type Post[]
  }
  
  export default Blog

export const getStaticProps = async () => {
//   const res = await fetch('https://.../posts')
  const posts: Post[] = []

  return {
    props: {
      posts,
    },
  }
}

