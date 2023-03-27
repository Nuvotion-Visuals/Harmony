import { Button, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor, ItemProps } from '@avsync.live/formation';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_channelsByGuid, useSpaces_updateChannel } from 'redux-tk/spaces/hook';

interface Channel {
  name: string;
  description: string;
}

interface Group {
  name: string;
  description: string;
  channels: Channel[];
}

interface Suggested {
  groups: Group[];
}

export interface ExpandableListProps {
  value: {
    item: ItemProps;
    list: ItemProps[];
  };
  expanded?: boolean;
  onExpand?: (newExpanded: boolean) => void;
  onReorder?: (newList: ItemProps[]) => void;
  reorderId: string;
}

interface Props {}

export const EditChannel = React.memo(({}: Props) => {
  const router = useRouter();
  const channelGuid = router.query.channelGuid as string

  const updateChannel = useSpaces_updateChannel()
  const activeGroup = useSpaces_activeGroup()
  const activeSpace = useSpaces_activeSpace()
  const activeChannel = useSpaces_activeChannel()
  const channelsByGuid = useSpaces_channelsByGuid()

  const [name, set_name] = useState(activeChannel?.name || '');
  const [description, set_description] = useState(activeChannel?.description || '');
  const [prompt, set_prompt] = useState(decodeURI(activeChannel?.previewSrc?.match(/[^/]*$/)?.[0] ?? ""));
  const [url, set_url] = useState<string | undefined>(activeChannel?.previewSrc);
  
  return (
    <Box wrap>
      <Box my={0.25} width='100%'>
        <Item icon='chevron-left' pageTitle='Edit channel' href={`/spaces/${activeSpace?.guid}/groups/${activeGroup?.guid}/channels/${channelGuid}`} />
      </Box>
      <Box px={0.75} wrap>
        <Gap gap={0.75}>
          {url && (
            <AspectRatio ratio={2} backgroundSrc={url} coverBackground borderRadius={.75} />
          )}
         
          <TextInput
            label='Name'
            value={name}
            onChange={(newValue) => set_name(newValue)}
            autoFocus
          />
          <TextInput
            label='Poster prompt'
            value={prompt}
            canClear={!!prompt}
            onChange={(newValue) => set_prompt(newValue)}
            buttons={[
              {
                icon: 'bolt-lightning',
                iconPrefix: 'fas',
                secondary: true,
                circle: true,
                minimal: true,
                disabled: prompt === '',
                blink: !!prompt && !url,
                onClick: () => set_url(`https://lexi.studio/image/prompt/${encodeURIComponent(prompt)}`),
              },
            ]}
          />
          <RichTextEditor
            placeholder='Description'
            value={description}
            onChange={(newValue) => set_description(newValue)}
          >
           
          </RichTextEditor>
         
          <Button
            hero
            expand
            primary={name !== ''}
            disabled={name === ''}
            onClick={() => {
              if (name && activeSpace?.guid) {
                updateChannel({
                  guid: channelGuid,
                  channel: {
                    ...channelsByGuid[channelGuid],
                    name,
                    previewSrc: url,
                    description,
                  },
                });
                setTimeout(() => {
                  router.push(`/spaces/${activeSpace?.guid}/groups/${activeGroup?.guid}/channels/${channelGuid}`);
                }, 1);
              }
            }}
            text='Save'
            icon='save'
            iconPrefix='fas'
          />
          <Box height={4} width='100%' />
        </Gap>
      </Box>
    </Box>
  );
});