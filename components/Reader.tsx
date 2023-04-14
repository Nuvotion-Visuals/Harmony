import { Button, Page, Placeholders, RichTextEditor, LoadingSpinner } from '@avsync.live/formation';
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

interface Props {}

export const Reader: React.FC<Props> = () => {
  const router = useRouter();
  const { url } = router.query;

  const [content, set_content] = useState<string>()

  const setQuery = useLanguage_setQuery()

  const true100vh = use100vh()

  useEffect(() => {
    if (url) {
      insertContentByUrl(url as string, (newContent) => {
        set_content(newContent)
      })
    }
  }, [url])

  return (
    <S.reader>
      <S.Header>
        <Item
         
          content={<Button
            icon='chevron-left'
            iconPrefix='fas'
            minimal
            text='Back'
            onClick={() => {
              router.back();
            }}
          />}
          children={
            <>
              <Button
                icon='play'
                iconPrefix='fas'
                text='Speak'
                minimal
                onClick={() => {
                  speak(html2plaintext(content), () => {})
                }}
              />
              <Button
                icon='plus'
                iconPrefix='fas'
                text='Insert'
                minimal
                onClick={() => {
                  setQuery(content || '')
                  router.back();
                }}
              />
            </>
          }
        />
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