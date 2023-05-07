import { HTMLtoPlaintext, Button, Page, Placeholders, RichTextEditor, LoadingSpinner, useBreakpoint, Dropdown, Box, Select, AutocompleteDropdown, Label } from '@avsync.live/formation';
import { getArticleContent, insertContentByUrl } from 'client/connectivity/fetch';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Item } from '@avsync.live/formation';
import { use100vh } from 'react-div-100vh';
import { useLanguage_setQuery } from 'redux-tk/language/hook';
import { speak, speakStream } from 'client/speech/speech';
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

  const [lineHeight, set_lineHeight] = useState(parseFloat(localStorage.getItem('lineHeight') || '1') || 1);
  const [maxWidth, set_maxWidth] = useState(parseFloat(localStorage.getItem('maxWidth') || '1') || 1);
  const [textSize, set_textSize] = useState(parseFloat(localStorage.getItem('textSize') || '1') || 1);
  const [font, set_font] = useState(localStorage.getItem('font') || 'Poppins');
  const [justify, set_justify] = useState(localStorage.getItem('justify') || 'left');
  const [letterSpacing, set_letterSpacing] = useState(parseFloat(localStorage.getItem('letterSpacing') || '1') || 1);

  useEffect(() => {
    localStorage.setItem('lineHeight', JSON.stringify(lineHeight));
  }, [lineHeight]);
  
  useEffect(() => {
    localStorage.setItem('maxWidth', JSON.stringify(maxWidth));
  }, [maxWidth]);
  
  useEffect(() => {
    localStorage.setItem('textSize', JSON.stringify(textSize));
  }, [textSize]);
  
  useEffect(() => {
    localStorage.setItem('font', font);
  }, [font]);
  
  useEffect(() => {
    localStorage.setItem('justify', justify);
  }, [justify]);

  useEffect(() => {
    localStorage.setItem('letterSpacing', justify);
  }, [letterSpacing]);

  const incrementLineHeight = () => {
    set_lineHeight(prevValue => prevValue + .05);
  };
  
  const decrementLineHeight = () => {
    set_lineHeight(prevValue => prevValue - .05);
  };
  
  const incrementMaxWidth = () => {
    set_maxWidth(prevValue => prevValue + .03);
  };
  
  const decrementMaxWidth = () => {
    set_maxWidth(prevValue => prevValue - .03);
  };
  
  const incrementTextSize = () => {
    set_textSize(prevValue => prevValue + .03);
  };
  
  const decrementTextSize = () => {
    set_textSize(prevValue => prevValue - .03);
  };
  
  const incrementLetterSpacing = () => {
    set_letterSpacing(prevValue => prevValue + .03);
  };
  
  const decrementLetterSpacing = () => {
    set_letterSpacing(prevValue => prevValue - .03);
  };

  const fonts = [
    'Poppins',
    'Georgia',
    'Open Sans',
    'Lato',
    'Palatino',
    'Verdana'
  ];

  return (
    <S.reader>
      <S.Header>
      <Item
        subtitle={activeSpace?.name && `${activeSpace?.name} > ${activeGroup?.name || '·'} > ${activeChannel?.name || '·'}`}
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
              speak(HTMLtoPlaintext(content || ''), () => {})
            }}
          />
          <Box pr={.5}>
          <Dropdown
            icon='font'
            iconPrefix='fas'
            minimal
            
            items={[
              {
                icon: 'paragraph',
                iconPrefix: 'fas',
                text: 'Justify',
                children: <>
                  <Button 
                    icon='align-left' 
                    iconPrefix='fas'
                    minimal={justify !== 'left'}
                    circle
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      set_justify('left')
                    }}
                  />

                  <Button 
                    icon='align-justify' 
                    iconPrefix='fas' 
                    circle
                    minimal={justify !== 'justify'}
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      set_justify('justify')
                    }}
                  />
                </>
              },
              {
                icon: 'font',
                iconPrefix: 'fas',
                text: 'Size',
                subtitle: textSize !== 1 ? `${(textSize * 100).toFixed(0)}%` : undefined,
                children: <>
                  <Button 
                    icon='minus' 
                    iconPrefix='fas'
                    minimal 
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      decrementTextSize()
                    }}
                  />

                  <Button 
                    icon='plus' 
                    iconPrefix='fas' 
                    minimal
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      incrementTextSize()
                    }}
                  />
                </>
              },
              {
                icon: 'arrows-up-down',
                iconPrefix: 'fas',
                text: 'Line',
                subtitle: lineHeight !== 1 ? `${(lineHeight * 100).toFixed(0)}%` : undefined,
                children: <>
                  <Button 
                    icon='minus' 
                    iconPrefix='fas'
                    minimal 
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      decrementLineHeight()
                    }}
                  />

                  <Button 
                    icon='plus' 
                    iconPrefix='fas' 
                    minimal
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      incrementLineHeight()
                    }}
                  />
                </>
              },
              {
                icon: 'arrows-left-right',
                iconPrefix: 'fas',
                text: 'Width',
                subtitle: maxWidth !== 1 ? `${(maxWidth * 100).toFixed(0)}%` : undefined,
                children: <>
                  <Button 
                    icon='minus' 
                    iconPrefix='fas'
                    minimal 
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      decrementMaxWidth()
                    }}
                  />

                  <Button 
                    icon='plus' 
                    iconPrefix='fas' 
                    minimal
                    disabled={maxWidth > 1}
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      incrementMaxWidth()
                    }}
                  />
                </>
              },
              {
                icon: 'text-width',
                iconPrefix: 'fas',
                text: 'Letter',
                subtitle: letterSpacing !== 1 ? `${(letterSpacing * 100).toFixed(0)}%` : undefined,
                children: <>
                  <Button 
                    icon='minus' 
                    iconPrefix='fas'
                    minimal 
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      decrementLetterSpacing()
                    }}
                  />

                  <Button 
                    icon='plus' 
                    iconPrefix='fas' 
                    minimal
                    onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                      incrementLetterSpacing()
                    }}
                  />
                </>
              },
              ...fonts.map(thisFont =>
                ({
                  active: font === thisFont,
                  onClick: (e: any) => {
                    e.stopPropagation()
                    e.preventDefault()
                    set_font(thisFont)
                  },
                  content: <S.FontPreview 
                    font={thisFont} 
                   
                  >
                    { thisFont }
                  </S.FontPreview>
                }) 
              ),
              {
                icon: 'refresh',
                iconPrefix: 'fas',
                text: 'Reset',
                onClick: () => {
                  set_lineHeight(1)
                  set_maxWidth(1)
                  set_textSize(1)
                  set_letterSpacing(1)
                  set_font('Poppins')
                  set_justify('left')
                }
              }
            ]}
          />
          </Box>
           
        </>
      </S.Header>
     
      <S.Content 
        true100vh={true100vh || 0} 
        textSize={textSize} 
        lineHeight={lineHeight} 
        maxWidth={maxWidth}
        justify={justify}
        font={font}
        letterSpacing={letterSpacing}
      >
        <Page>
          <Box width='100%' mb={2}>
            <Box width={`calc(${maxWidth} * 100%)`}>
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
            </Box>
          </Box>
        </Page>
      </S.Content>
   
    </S.reader>
   
  );
};

const S = {
  reader: styled.div`
    background: var(--F_Background_Alternating);
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  `,
  Header: styled.div`
    width: 100%;
    height: var(--F_Header_Height);
    display: flex;
    align-items: center;
  `,
  Content: styled.div<{
    true100vh: number,
    textSize: number,
    maxWidth: number,
    lineHeight: number,
    letterSpacing: number,
    justify: string,
    font: string
  }>`

    height: ${props => `calc(${props.true100vh}px - var(--F_Header_Height));`};
    width: 100%;
    overflow-y: auto;
    * {
      font-size: ${props => `calc(1em * ${props.textSize})`};
      line-height: ${props => `calc(1.6 * ${props.lineHeight})`};
      letter-spacing: ${props => `calc(calc(1px * ${props.letterSpacing}) - 1px)`};
      font-family: ${props => props.font};
    }
    p {
      text-align: ${props => props.justify};
    }
  `,
  FontPreview: styled.div<{
    font: string
  }>`
    font-family: ${props => props.font};
    font-size: var(--F_Font_Size);
    height: var(--F_Input_Height);
    padding-left: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
  `
};