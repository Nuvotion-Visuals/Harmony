import React, { useEffect, useRef, useState } from 'react'
import { JsonValidator, scrollToBottom } from 'client/utils'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { ExpandableLists } from '@avsync.live/formation'

interface Props {
  text?: string
}

interface Group {
  name: string
  description: string
  channels: Channel[]
}

interface Channel {
  name: string
  description: string
}

export const SpaceResponseStream = ({
  text,
}: Props) => {
  const jsonValidator = useRef(new JsonValidator())
  const scrollContainerRef = useRef<HTMLElement>(null)
  const [value, setValue] = useState<any[]>([])

  useEffect(() => {
    const validJsonText = text ? jsonValidator.current.ensureValidJson(text) : '{}'
    if (validJsonText) {
      try {
        const parsed: { groups: Group[] } = JSON.parse(validJsonText)
        if (parsed?.groups) {
          const newValue = parsed.groups.map((group, i) => ({
            reorderId: `list_${i}`,
            expanded: true,
            value: {
              item: {
                subtitle: group.name,
                icon: 'caret-down' as IconName,
                iconPrefix: 'fas',
                minimalIcon: true,
              },
              list: group.channels.map((channel) => ({
                subtitle: channel.name,
                icon: 'hashtag' as IconName,
              })),
            },
          }))
          setValue(newValue)
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error)
      }
      scrollToBottom(scrollContainerRef)
    }
  }, [text])

  return (
    <div>
      <ExpandableLists
        value={value}
        onExpand={(index) => {
          setValue(
            value.map((item, i) =>
              i === index ? { ...item, expanded: !item.expanded } : item
            )
          )
        }}
      />
    </div>
  )
}
