import React, { useEffect, useState } from 'react'
import { Box, Spacer, Gap, Icon, Dropdown, shareTextViaEmail, downloadFile, Button, copyToClipboard, StyleHTML, Avatar, LoadingSpinner, ParseHTML, HTMLtoMarkdown, markdownToHTML, RichTextEditor } from "@avsync.live/formation"
import styled from "styled-components"
//@ts-ignore
import { convert } from 'html-to-text'
import { speak } from '../Lexi/System/Language/speech'
import { useLexi } from 'redux-tk/lexi/hook'

const getTimeDifference = (startTime: string, endTime: string) : number => {
  return Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);
}

const highlightText = (html: string, currentlySpeaking: string | null): string => {
  const openingTag = `<span style="color: var(--F_Primary_Variant)">`;
  const closingTag = "</span>";
  let len = 0;
  if (currentlySpeaking) {
    len = currentlySpeaking.length;
  }

  let startIndex = 0;
  let index = currentlySpeaking ? html.indexOf(currentlySpeaking, startIndex) : -1;
  let highlightedHtml = "";

  while (index !== -1) {
    // Append the HTML before the match
    highlightedHtml += html.substring(startIndex, index);

    // Append the highlighted match
    highlightedHtml += openingTag + html.substring(index, index + len) + closingTag;

    // Update the start index and search for the next match
    startIndex = index + len;
    index = html.indexOf(currentlySpeaking as string, startIndex);
  }

  // Append any remaining HTML after the last match
  highlightedHtml += html.substring(startIndex);

  return highlightedHtml;
}

const Message = React.memo(({ 
  query, 
  speaker, 
  guid, 
  error,
  queryTime,
  responseTime,
  edited
}: { 
  query: string, 
  speaker?: string, 
  guid: string, 
  error?: string,
  queryTime?: string,
  responseTime?: string,
  edited?: boolean
}) => {
    const [edit, set_edit] = useState(false)

    const [speaking, set_speaking] = useState(false)

    const { updateMessage, currentlySpeaking } = useLexi()

    const isLexi = speaker === 'Lexi'

    const [localValue, set_localValue] = useState(markdownToHTML(query))

    useEffect(() => {
      set_localValue(highlightText(markdownToHTML(query), (currentlySpeaking || '')))
    }, [query, currentlySpeaking])

    return (<S.Message isLexi={isLexi}>
      <Box width='100%' wrap={true}>
        <Box width='100%' wrap={true} maxWidth={'700px'} >

        <S.AvatarContainer>
            <Box pt={1}>
              <Avatar 
                src={isLexi ? '/assets/lexi-circle.png' : undefined}
                icon={isLexi ? undefined : 'user'}
                iconPrefix='fas'
              />
            </Box>
           

            {
              query
                ? <Spacer>

                    <S.Content>
                      <RichTextEditor 
                        value={`${localValue}`}
                        readOnly={!edit}
                        onChange={(newValue : string) => set_localValue(newValue)}
                      >
                        <Button 
                          icon='save'
                          iconPrefix='fas'
                          minimal
                          onClick={() => {
                            set_edit(false)
                            if (isLexi) {
                              updateMessage({
                                guid,
                                response: localValue,
                              })
                            }
                            else {
                              updateMessage({
                                guid,
                                query: localValue
                              })
                            }
                          }}
                        />
                        <Button 
                          icon='ban'
                          iconPrefix='fas'
                          minimal
                          onClick={() => {
                            set_edit(false)
                            set_localValue(query)
                          }}
                        />
                        <Box height='100%' />
                      </RichTextEditor>
                    </S.Content>

                  </Spacer>
                : error
                  ? <Spacer>
                    <S.Content>
                      <StyleHTML>
                        <ParseHTML markdown={`I tried to answer your question, but experienced this error with my system: <pre>${error}</pre>`}/>
                      </StyleHTML>
                    </S.Content>
                </Spacer>
                  : <Box py={1} width='100%'>
                      <Gap gap={1}>
                        <LoadingSpinner chat={true}/>
                      </Gap>
                    </Box>
            }

            </S.AvatarContainer>
          <S.FlexStart wrap={true}>
            
            <Box width='100%'>
              <Box width='100%'>
              <Spacer />
              
              <Box pr={.25}>

              {
                edited && <Box mr={.5}><Icon icon='pencil' iconPrefix='fas' size='sm' /></Box>
              }
                            
              {
                !isLexi
                  ? <S.Meta>{new Date(queryTime || new Date()).toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'})}</S.Meta>
                  : responseTime && 
                      <S.Meta>
                        <Gap disableWrap={true}>
                          <Gap gap={.25} autoWidth={true}>
                            
                            <Icon
                              icon={'clock'}
                              iconPrefix='far'
                            />
                            <Box>
                              {
                                getTimeDifference(queryTime || '', responseTime)
                              }s
                            </Box>
                          </Gap>

                          <Box>
                            {
                              new Date(responseTime).toLocaleTimeString([], {
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: '2-digit', 
                                hour: '2-digit', 
                                minute: '2-digit'
                                }
                              )
                            }
                          </Box>
                        </Gap>
                      </S.Meta>
              }
              {
                query || error
                  ? <>
                      <Dropdown
                        icon='ellipsis-vertical'
                        iconPrefix='fas'
                        minimal
                        items={[
                          {
                            icon: 'copy',
                            iconPrefix: 'fas',
                            text: 'Copy Markdown',
                            onClick: () => copyToClipboard(HTMLtoMarkdown(query))
                          },
                          {
                            icon: 'copy',
                            iconPrefix: 'fas',
                            text: 'Copy HTML',
                            onClick: () => copyToClipboard(query)
                          },
                          {
                            icon: 'file-download',
                            iconPrefix: 'fas',
                            text: 'Save Markdown',
                            onClick: () => downloadFile(error ? error : query, `lexi-${guid}.md`, 'markdown')
                          },
                          {
                            icon: 'file-download',
                            iconPrefix: 'fas',
                            text: 'Save HTML',
                            onClick: () => downloadFile(error ? error : query, `lexi-${guid}.html`, 'html')
                          },
                          {
                            icon: 'edit',
                            iconPrefix: 'fas',
                            text: 'Edit',
                            onClick: () => set_edit(true)
                          },
                        ]}
                      />

                      <Button
                        icon={speaking ? 'stop' : 'play'}
                        blink={speaking}
                        minimal
                        iconPrefix='fas'
                        circle={true}
                        onClick={() => {
                          if (speaking) {
                            speak('', () => {})
                            set_speaking(false)
                          }
                          else {
                            set_speaking(true)
                            speak(error ? error : query, () => {
                              set_speaking(false)
                            })
                          }
                        }}
                      />

                      <Button
                        icon='copy'
                        iconPrefix='far'
                        minimal
                        circle={true}
                        onClick={() => copyToClipboard(HTMLtoMarkdown(query))}
                      />
                    </>
                  : null
              }
            </Box>
            </Box>
          </Box>
          </S.FlexStart>
        </Box>
      </Box>
    
    </S.Message>)
})
  
export default Message

const S = {
  Message: styled.div<{
    isLexi?: boolean
  }>`
    width: 100%;
    background: ${props => props.isLexi ? 'var(--F_Background_Alternating)': 'var(--F_Background)'};

    border-top: 1px solid var(--F_Surface_0);
  `,
  FlexStart: styled.div<{
    wrap?: boolean
  }>`
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-wrap: ${props => props.wrap? 'wrap' : 'noWrap'};
    max-width: calc(100vw - 1.5rem);
  `,
  Meta: styled.div<{
    monospace?: boolean
  }>`
    display: flex;
    align-items: center;
    color: var(--F_Font_Color_Disabled);
    font-size: 12px;
    font-family: ${props => props.monospace ? 'monospace' : 'inherit'};

  `,
  AvatarContainer: styled.div`
    display: flex;
    align-items: flex-start;
    height: 100%;
    width: 700px;
    max-width: calc(100vw - 1.25rem);

    gap: 1rem;
  `,
  Content: styled.div`
    width: 100%;
    max-width: calc(100vw - 4.25rem);
    padding: .5rem 0;
    @media screen and (min-width: 700px) {
      max-width: calc(700px - 2.75rem);
    }
    overflow: hidden;
  `
}
