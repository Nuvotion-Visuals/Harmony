import { Gap, Item } from '@avsync.live/formation'
import { JsonValidator, scrollToBottom } from 'client/utils'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface Props {
  text?: string,
  icon: IconName,
}

export const ResponseStream = ({ 
  text,
  icon,
}: Props) => {
  const jsonValidator = useRef(new JsonValidator())  // Initialize JsonValidator
  const scrollContainerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (text) {
      const validJsonText = jsonValidator.current.ensureValidJson(text)
      if (validJsonText) {
        scrollToBottom(scrollContainerRef)
      }
    }
  }, [text])

  const validText = text ? jsonValidator.current.ensureValidJson(text) : '{}'
  let suggestions: string[] = []

  if (validText) {
    try {
      const parsed = JSON.parse(validText)
      if (parsed?.suggestions && Array.isArray(parsed.suggestions)) {
        suggestions = parsed.suggestions as string[]
      }
    } catch (error) {
      console.error('Failed to parse JSON:', error)
    }
  }

  useEffect(() => {
    console.log(jsonValidator.current.ensureValidJson(text || ''))
  }, [suggestions.length > 0])

  return (
    <S.Container>
      <Gap gap={.25}>
        {suggestions.length > 0 ? (
          suggestions.map(prompt =>
            <Item
              subtitle={prompt}
              icon={icon}
              onClick={() => {
                
              }}
            >
            </Item>
          )
        ) : (
          <Item
            subtitle={'Thinking...'}
            icon={icon}
            onClick={() => {
              
            }}
          >
          </Item>
        )}
      </Gap>
    </S.Container>
  )
}


const S = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    min-height: var(--F_Input_Height);
    position: relative;
    overflow: hidden;
    font-size: var(--F_Font_Size_Label);
    color: var(--F_Font_Color_Label);
    display: block;
    align-items: center;
    justify-content: center;
    line-height: 1.33;
    white-space: pre-wrap;
  `
}
