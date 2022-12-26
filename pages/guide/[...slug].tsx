import { InferGetServerSidePropsType } from 'next'
import * as path from 'path'
import getConfig from 'next/config'
import { readDirectoryHierarchy, readMarkdownFileInDirectory } from '../../utils'
import { ParseHTML, StyleHTML } from '@avsync.live/formation'
const { serverRuntimeConfig } = getConfig()
const { PROJECT_ROOT } = serverRuntimeConfig

const Page = ({ data, params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    // will resolve posts to type Post[]
    return <>
     <StyleHTML>
      {
        data
          && <ParseHTML markdown={data} />
      }
     </StyleHTML>
    </>
  }
  
export default Page

export const getServerSideProps = async ({ params }: { params: { slug: string[] } }) => {
  const data = readMarkdownFileInDirectory(path.join(PROJECT_ROOT, 'Lexi'), ['guide', ...params.slug])
  
  return {
    props: {
      params,
      data,
    },
  };
};
 

