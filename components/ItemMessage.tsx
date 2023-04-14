import { Avatar, Box, Button, Dropdown, Item, LoadingSpinner, markdownToHTML, RichTextEditor, Spacer } from '@avsync.live/formation'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Message as MessageProps } from 'redux-tk/spaces/types'
import { useSpaces_removeMessage, useSpaces_removeMessageFromThread, useSpaces_updateMessage } from 'redux-tk/spaces/hook'
import { speak } from 'client/speech/speech'
import { useLanguage_currentlySpeaking } from 'redux-tk/language/hook'
import { useMemo, useCallback } from 'react';

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


interface Props extends MessageProps {
  threadGuid: string
}

export const ItemMessage = React.memo((props: Props) => {
  const { 
    guid,
    userLabel,
    message,
    threadGuid,
  } = props
  const [edit, set_edit] = useState(false)

  const isLexi = userLabel === 'Lexi'

  const [localValue, set_localValue] = useState(markdownToHTML(message))

  const removeMessage = useSpaces_removeMessage()
  const removeMessageFromThread = useSpaces_removeMessageFromThread()
  const updateMessage = useSpaces_updateMessage()

  const copy = useCallback((str: string) => {
    const tempElement = document.createElement("textarea");
    tempElement.style.position = "fixed";
    tempElement.style.top = "-9999px";
    tempElement.style.left = "-9999px";
    tempElement.value = str;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
  }, []);

  const [isSpeaking, set_isSpeaking] = useState(false)


  useEffect(() => {
    set_localValue(highlightText(markdownToHTML(message), ''))
  }, [message])

  const Message = React.memo(({ text } : { text: string }) => (
    <S.ItemMessage>
      <Box width={2} height='100%' wrap>
        <S.Avatar>
          <Avatar
            labelColor={'gray'}
            src={isLexi ? '/assets/lexi-circle.png' : undefined}
            icon={isLexi ? undefined : 'user'}
          />
        </S.Avatar>
        <S.VerticalSpacer />
      </Box>

      <Box width='100%' maxWidth='calc(100% - 2.5rem)' wrap>
        <S.MessageInfo>
          <S.DisplayName>
            {
              userLabel
            }
          </S.DisplayName>
          <S.Date>
            { new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
          </S.Date>
          <Spacer />
          <Box>
            <Button
              icon='play'
              iconPrefix='fas'
              minimal
              minimalIcon
              onClick={() => {
                speak(message, () => {})
                set_isSpeaking(true)
              }}
            />
            <Dropdown
              icon='ellipsis-h'
              iconPrefix='fas'
              minimalIcon
              minimal
              onClick={e => {
              
              }}
              items={[
                {
                  icon: 'copy',
                  name: 'Copy',
                  onClick: () => copy(message)
                },
                {
                  icon: 'edit',
                  name: 'Edit',
                  onClick: () => set_edit(true)
                },
                {
                  icon: 'trash-alt',
                  name: 'Delete',
                  onClick: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (threadGuid) {
                      removeMessageFromThread({ threadGuid, messageGuid: guid})
                      removeMessage(guid)
                    }
                  }
                }
              ]}
            />
          </Box>
        </S.MessageInfo>
        
        {
          text
            ?  <RichTextEditor
                value={text}
                readOnly={!edit}
                onChange={(newValue : string) => set_localValue(newValue)}
              >
                {
                  edit &&
                    <>
                      <Button
                        icon='save'
                        iconPrefix='fas'
                        onClick={() => {
                          const newMessage = {
                            ...props,
                            message: localValue,
                          } as MessageProps
                          updateMessage({ guid, message: newMessage })
                          set_edit(false)
                        }}
                        minimal
                      />
                      <Button
                        icon='times'
                        iconPrefix='fas'
                        onClick={() => {
                          set_localValue(highlightText(markdownToHTML(message), ('')))
                          set_edit(false)
                        }}
                        minimal
                      />
                      <Box height='100%' />
                    </>
                }
              </RichTextEditor>
            : <S.PartialResponse id={`${guid}_message`}>
              </S.PartialResponse>
        }
       
        <Spacer />
      </Box>
    </S.ItemMessage>
  ))

  return (<>
    <Message 
      text={localValue}
    />
  </>)
})

const S = {
  ItemMessage: styled.div`
    width: 100%;
    display: flex;
    padding: .325rem 0;
    transition: height 0.3s ease-out;
  `,
  VerticalSpacer: styled.div`
    height: 100%;
    width: 100%;
  `,
  Avatar: styled.div`
    transform: scale(.75);
  `,
  MessageInfo: styled.div`
    display: flex;
    align-items: center;
    padding-bottom: .25rem;
    width: 100%;
    padding-top: .3rem;
  `,
  DisplayName: styled.div`
    font-size: 14px;
    color: var(--F_Font_Color);
  `,
  Date: styled.div`
    padding-left: .75rem;
    font-size: 11px;
    color: var(--F_Font_Color_Disabled);
  `,
  PartialResponse: styled.div`
    font-size: var(--F_Font_Size);
    line-height: 1.66;
  `
}