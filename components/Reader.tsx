import { Button, Page, Placeholders, RichTextEditor, LoadingSpinner, useBreakpoint } from '@avsync.live/formation';
import { getArticleContent, insertContentByUrl } from 'client/connectivity/fetch';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Item } from '@avsync.live/formation';
import { use100vh } from 'react-div-100vh';
import { useLanguage_setQuery } from 'redux-tk/language/hook';
import { speak, speakStream } from 'client/speech/speech';
// @ts-ignore
import html2plaintext from 'html2plaintext'
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook';
import { useSpaces_activeChannel, useSpaces_activeSpace, useSpaces_activeGroup, useSpaces_threadsByGuid, useSpaces_activeThreadGuid, useSpaces_setActiveThreadGuid } from 'redux-tk/spaces/hook';

interface Props {}

function replaceLinks(
  htmlString: string,
  spaceGuid: string,
  groupGuid: string,
  channelGuid: string
): string {
  const prefix = `/spaces/${spaceGuid}/groups/${groupGuid}/channels/${channelGuid}?url=`;
  const pattern = /(href=[\'"]?)([^\'" >]+)/g;

  function replace(match: string, p1: string, p2: string) {
    const url = p2;
    return `${p1}${prefix}${url}`;
  }

  return htmlString.replace(pattern, replace);
}

export const Reader: React.FC<Props> = () => {
  const router = useRouter();
  const { url, spaceGuid, groupGuid, channelGuid } = router.query;

  const [content, set_content] = useState<string>()

  const setQuery = useLanguage_setQuery()

  const true100vh = use100vh()

  const decrementActiveSwipeIndex = useLayout_decrementActiveSwipeIndex()

  const activeChannel = useSpaces_activeChannel()
  const activeSpace = useSpaces_activeSpace()
  const activeGroup = useSpaces_activeGroup()
  const { isDesktop } = useBreakpoint()

  useEffect(() => {
    if (url) {
      insertContentByUrl(url as string, (newContent) => {
        if (activeSpace?.guid &&  activeGroup?.guid && activeChannel?.guid) {
          set_content(`${replaceLinks(newContent, activeSpace?.guid, activeGroup?.guid, activeChannel?.guid)}`)
        }
        else {
          set_content(`${newContent}`)
        }
      },
        (e) => {
      })
    }
  }, [url])

  return (
    <S.reader>
      <S.Header>
      <Item
          subtitle={activeSpace?.name && `${activeSpace?.name} > ${activeGroup?.name} > ${activeChannel?.name}`}
          onClick={() => {
            if (!isDesktop) {
              decrementActiveSwipeIndex()
            }
          }}
          
        />
       <>
          <Button
            icon='plus'
            iconPrefix='fas'
            minimal
            onClick={() => {
              setQuery(content || '')
              router.push(`/spaces/${spaceGuid}/groups/${groupGuid}/channels/${channelGuid}`);
            }}
          />
          <Button
            icon='play'
            iconPrefix='fas'
            minimal
            onClick={() => {
              speak(html2plaintext(content), () => {})
            }}
          />
          <Button
            icon='times'
            iconPrefix='fas'
            minimal
            circle
            onClick={() => {
              router.push(`/spaces/${spaceGuid}/groups/${groupGuid}/channels/${channelGuid}`);
            }}
          />
        </>
      </S.Header>
     
      <S.Content true100vh={true100vh || 0}>
        <Page>
          {
            content
              ?  <RichTextEditor
                  value={content || ''}
                  readOnly
                />
              : <Placeholders
                  // @ts-ignore
                  message={<LoadingSpinner />}
                />
          }
        </Page>
      </S.Content>
   
    </S.reader>
   
  );
};

const S = {
  reader: styled.div`
    background: var(--F_Background_Alternating);
  `,
  Header: styled.div`
    width: 100%;
    height: var(--F_Header_Height);
    display: flex;
    align-items: center;
  `,
  Content: styled.div<{
    true100vh: number,
  }>`

    height: ${props => `calc(${props.true100vh}px - var(--F_Header_Height));`};
    width: 100%;
    overflow-y: auto;
  `,
};