import { Button, Page, ParseHTML, StyleHTML } from '@avsync.live/formation'
import { InferGetServerSidePropsType } from 'next'

async function readMarkdownFile(filePath: string): Promise<string> {
  try {
    const data: Buffer = await fs.promises.readFile(filePath);
    return data.toString();
  } catch (error: any) {
    throw new Error(`Failed to read markdown file at ${filePath}: ${error.message}`);
  }
}

const MyPage = ({ markdown, params, scriptNames }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  return <>
    <Page>
      <StyleHTML>
        <ParseHTML markdown={markdown} />
      </StyleHTML>
    </Page>
  </>
}
  
export default MyPage

import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

export const getServerSideProps = async ({ params }: any) => {
  const getDirectories = (source: string) =>
    fs.readdirSync(source, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent : any) => dirent.name)

  const scriptNames = getDirectories('./Lexi/Scripts/')
  const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)
  const scriptName = capitalize(params.scriptName)

  const scriptObject = scriptNames.reduce((a, v) => ({ ...a, [v.split(' ')[1]]: v.split(' ')[0].slice(0,-1)}), {}) 
  const markdown = await readMarkdownFile(path.join(serverRuntimeConfig.PROJECT_ROOT, `./Lexi/Scripts/${scriptObject[scriptName]}. ${scriptName}/Readme.md`))

  return {
    props: {
      markdown,
      params,
      scriptNames: scriptObject
    },
  }
}

