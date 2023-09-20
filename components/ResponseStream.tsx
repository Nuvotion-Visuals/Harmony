import { Gap, Item as OriginalItem } from '@avsync.live/formation'
import { JsonValidator, scrollToBottom } from 'client/utils'
import React, { useEffect, useRef, useState, memo } from 'react'
import styled from 'styled-components'
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface Props {
  text?: string,
  icon: IconName,
  onClick: (prompt: string) => void,
  loading?: boolean
}

// Memoized Item component
const Item = memo(OriginalItem, (prevProps, nextProps) => {
  return (
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.icon === nextProps.icon
  )
})

export const ResponseStream = ({
  text,
  icon,
  onClick,
  loading
}: Props) => {
  const jsonValidator = useRef(new JsonValidator())
  const scrollContainerRef = useRef<HTMLElement>(null)
  const [suggestions, set_suggestions] = useState<string[]>([])

  useEffect(() => {
    if (text) {
      const validJsonText = jsonValidator.current.ensureValidJson(text)
      if (validJsonText) {
        scrollToBottom(scrollContainerRef)
        try {
          const parsed = JSON.parse(validJsonText)
          if (parsed?.suggestions && Array.isArray(parsed.suggestions)) {
            set_suggestions(parsed.suggestions as string[])
          }
        } 
        catch (error) {
          console.error('Failed to parse JSON:', error)
        }
      }
    }
  }, [text])

  return (
    <S.Container>
      <Gap gap={.25}>
        {suggestions.length > 0
          ? suggestions.map((prompt, index) =>
              <Item
                key={index}  // Keys help React identify which items have changed
                subtitle={prompt}
                icon={icon}
                onClick={() => {
                  onClick(prompt)
                  set_suggestions([])
                }}
              />
            )
          : loading
              ? <Item
                  icon={icon}
                  subtitle='Thinking...'
                />
              : null
        }
      </Gap>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    font-size: var(--F_Font_Size_Label);
    color: var(--F_Font_Color_Label);
    display: block;
    align-items: center;
    justify-content: center;
    white-space: pre-wrap;
  `
}
