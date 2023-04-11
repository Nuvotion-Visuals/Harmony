import { Button, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor, ExpandableLists, ItemProps, LabelColor } from '@avsync.live/formation';
import { useLanguageAPI } from 'client/language/hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSpaces_addSpaceIncludingGroups } from 'redux-tk/spaces/hook';
import { MatrixLoading } from './MatrixLoading';

import { IconName } from '@fortawesome/fontawesome-svg-core';

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

export const AddSpace = React.memo(({}: Props) => {
  const router = useRouter();
  const addSpaceIncludingGroups = useSpaces_addSpaceIncludingGroups();
  const [name, set_name] = useState('');
  const [description, set_description] = useState('');
  const [prompt, set_prompt] = useState('');
  const [url, set_url] = useState<string | undefined>('');
  const { language, response, loading, error, completed } = useLanguageAPI('');
  const [suggested, set_suggested] = useState<Suggested>({ groups: [] });
  const { generateGroups } = language;
  const [value, set_value] = useState<ExpandableListProps[] | null>(null);

  useEffect(() => {
    if (response && completed) {
      try {
        let obj = JSON.parse(response);
        set_suggested(obj);
      } catch (e) {}
    }
  }, [response, completed]);

  useEffect(() => {
    if (suggested?.groups) {
      set_value(
        suggested.groups.map((group: Group, i: number) => ({
          reorderId: `list_${i}`,
          expanded: false,
          value: {
            item: {
              labelColor: 'none',
              subtitle: group.name,
              icon: 'caret-down' as IconName,
              iconPrefix: 'fas',
              minimalIcon: true,
            },
            list: group.channels.map((channel: Channel) => ({
              subtitle: channel.name,
              icon: 'hashtag' as IconName,
            })),
          },
        }))
      );
    }
  }, [suggested]);
  
  return (
    <Box wrap>
      <Box my={0.25} width='100%'>
        <Item icon='chevron-left' pageTitle='Add Space' href={`/spaces`} />
      </Box>
      <Box px={0.75} wrap>
        <Gap gap={0.75}>
          {url && (
            <AspectRatio ratio={2} backgroundSrc={url} coverBackground borderRadius={.75}/>
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
                onClick: () => set_url(`/image/prompt/${encodeURIComponent(prompt)}`),
              },
            ]}
          />
          <RichTextEditor
            placeholder='Description'
            value={description}
            onChange={(newValue) => set_description(newValue)}
          >
            <Button
              icon='bolt-lightning'
              iconPrefix='fas'
              minimal
              secondary
              circle
              expand
              disabled={!loading && !description}
              blink={!!description && !loading}
              onClick={() => {
                generateGroups(description);
                set_value(null);
              }}
            />
          </RichTextEditor>
         
          {
            loading && !value?.length 
            ? <MatrixLoading text={response!} />
            : value?.length ?
                <Box width='100%' wrap my={-.25}>
                  <ExpandableLists
                    value={value}
                    onExpand={(index) =>
                      set_value(
                        value.map((item, i) =>
                          i === index ? { ...item, expanded: !item.expanded } : item
                        )
                      )
                    }
                  />
                </Box>
                : null
          }
          <Button
            hero
            expand
            primary={name !== ''}
            disabled={name === ''}
            onClick={() => {
              const guid = generateUUID();
              addSpaceIncludingGroups({
                guid,
                space: {
                  guid,
                  name,
                  groupGuids: [],
                  previewSrc: url,
                  description,
                },
                suggested,
              });
              setTimeout(() => {
                router.push(`/spaces/${guid}`);
              }, 1);
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