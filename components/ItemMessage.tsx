import { Avatar, Box, Button, Dropdown, Item, LoadingSpinner, markdownToHTML, RichTextEditor, Spacer } from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Message as MessageProps } from 'redux-tk/spaces/types'
import { useSpaces } from 'redux-tk/spaces/hook'

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

    useEffect(() => {
      set_localValue(highlightText(markdownToHTML(message), ('')))
    }, [message])


  const { removeMessage, removeMessageFromThread, updateMessage } = useSpaces()

  const copy = (str: string) => {
    const tempElement = document.createElement("textarea");
    tempElement.style.position = "fixed";
    tempElement.style.top = "-9999px";
    tempElement.style.left = "-9999px";
    tempElement.value = str;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
  }

  const Message = ({ text } : { text: string }) => (
    <S.ItemMessage>
      <Box width={3} height='100%'>
        <Avatar
          labelColor={'gray'}
          src={isLexi ? '/assets/lexi-circle.png' : undefined}
          icon={isLexi ? undefined : 'user'}
        />
        <S.VerticalSpacer />
      </Box>

      <Box width='100%' maxWidth='calc(100% - 3.75rem)' wrap>
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
            <Dropdown
              icon='ellipsis-h'
              iconPrefix='fas'
              minimal
              minimalIcon
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
                    }
                    removeMessage(guid)
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
            : <Box pt={.5}>
                <LoadingSpinner chat />
              </Box>
        }
       
        <Spacer />
      
      </Box>
        
    </S.ItemMessage>
  )

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
    padding: .75rem 0;
    transition: height 0.3s ease-out;
  `,
  VerticalSpacer: styled.div`
    height: 100%;
  `,
  MessageInfo: styled.div`
    display: flex;
    align-items: center;
    padding-bottom: .25rem;
    width: 100%;
  `,
  DisplayName: styled.div`
    font-weight: 600;
  `,
  Date: styled.div`
    padding-left: 1rem;
    font-size: 11px;
    color: var(--F_Font_Color_Disabled);
  `
}