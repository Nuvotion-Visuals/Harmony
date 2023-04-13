import { Button, Page, RichTextEditor } from '@avsync.live/formation';
import { getArticleContent, insertContentByUrl } from 'client/connectivity/fetch';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Item } from '@avsync.live/formation';

interface Props {}

const Reader: React.FC<Props> = () => {
  const router = useRouter();
  const { url } = router.query;

  const [content, set_content] = useState<string>()

  useEffect(() => {
    if (url) {
      insertContentByUrl(url as string, (newContent) => {
        set_content(newContent)
      })
    }
  }, [url])

  return (
    <S.reader>
 <Page>
      <Item
        icon='chevron-left'
        iconPrefix='fas'
        text='Back to search'
        onClick={() => {
          router.back();
        }}
        children={
          <Button
            icon='plus'
            iconPrefix='fas'
            text='Insert'
            minimal
            onClick={() => {

            }}
          />
        }
      />
      <RichTextEditor
        value={content || ''}
        readOnly
      />
    </Page>
    </S.reader>
   
  );
};

const S = {
  reader: styled.div`
    background: var(--F_Background_Alternating);
  `,
};

export default Reader;