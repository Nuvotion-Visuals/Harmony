import { Gap, Item, LoadingSpinner } from '@avsync.live/formation'
import { scrollToBottom } from 'client/utils'
import React, { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface Props {
  text?: string,
  icon: IconName,
}

let lastValidJson = ''

const ensureValidJson = (str: string): string | null => {
  try {
    if (str === 'null') {
      return lastValidJson
    }
    JSON.parse(str)
    lastValidJson = str
    return str
  } catch (error) {
    let repairedString = str
    let stack: string[] = []
    let withinString = false

    for (let i = 0; i < str.length; i++) {
      const char = str[i]

      if (char === '"' && (i === 0 || str[i - 1] !== '\\')) {
        withinString = !withinString
      }

      if (!withinString) {
        if (char === '{' || char === '[') {
          stack.push(char)
        } else if (char === '}' || char === ']') {
          const lastOpen = stack.pop()
          if ((char === '}' && lastOpen !== '{') || (char === ']' && lastOpen !== '[')) {
            if (lastOpen) stack.push(lastOpen)
            return lastValidJson  // Too complex to repair; return last known valid.
          }
        }
      }
    }

    if (withinString) {
      repairedString += '"'
    }

    while (stack.length > 0) {
      const lastOpen = stack.pop()
      if (lastOpen === '{') {
        repairedString += '}'
      } else if (lastOpen === '[') {
        repairedString += ']'
      }
    }

    try {
      JSON.parse(repairedString)
      lastValidJson = repairedString
      return repairedString
    } catch (finalError) {
      return lastValidJson
    }
  }
}



export const ResponseStream = ({ 
  text,
  icon,
}: Props) => {
  const scrollContainerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (text) {
      const validJsonText = ensureValidJson(text)
      if (validJsonText) {
        scrollToBottom(scrollContainerRef)
      }
    }
  }, [text])

  const validText = text ? ensureValidJson(text) : '{}'
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
    console.log(ensureValidJson(text || ''))
  }, [suggestions.length > 0 ])

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
