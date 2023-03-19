import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor, ExpandableLists, ItemProps, LabelColor } from '@avsync.live/formation';
import { useLanguageAPI } from "Lexi/System/Language/hooks";
import { language_generateGroups } from "Lexi/System/Language/language-ws";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSpaces } from "redux-tk/spaces/hook";
import styled from "styled-components";
import { MatrixLoading } from "./MatrixLoading";

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

export const AddSpace = ({}: Props) => {
  const router = useRouter();

  const { addSpace, addSpaceIncludingGroups } = useSpaces();

  const [name, set_name] = useState("");
  const [description, set_description] = useState("");
  const [prompt, set_prompt] = useState("");

  const [url, set_url] = useState<string | undefined>('');

  const { language, response, loading, error, completed } = useLanguageAPI('');

  const [suggested, set_suggested] = useState<Suggested>({ groups: [] });

  const { generateGroups } = language;

  useEffect(() => {
    if (response && completed) {
      try {
        let obj = JSON.parse(response);
        set_suggested(obj);
      } catch (e) {}
    }
  }, [response, completed]);
  

  const [value, set_value] = useState<ExpandableListProps[] | null>(null);

  useEffect(() => {
    if (suggested?.groups) {
      set_value(
        suggested.groups.map((group: Group, i: number) => ({
          reorderId: `list_${i}`, // Add reorderId here
          expanded: false,
          value: {
            item: {
              labelColor: 'none' as LabelColor, // Update labelColor here
              subtitle: group.name,
            },
            list: group.channels.map((channel: Channel) => ({
              subtitle: channel.name,
              icon: "hashtag" as IconName, // Update icon here
            })),
          },
        }))
        .map((expandableList: ExpandableListProps) => ({
          ...expandableList,
          value: {
            item: {
              ...expandableList.value.item,
              icon: "caret-down" as IconName,
              iconPrefix: "fas",
              minimalIcon: true,
            },
            list: expandableList.value.list.map((listItem: ItemProps) => ({
              ...listItem,
            })),
          },
        }))
      );
    }
  }, [suggested]);
  
  return (
    <S.new>
      <Box my={0.25}>
        <Item icon="chevron-left" pageTitle="Add Space"  href={`/spaces`} />
      </Box>
     
    

        <Box px={0.75} wrap>
          <Gap gap={0.75}>
            {
              url &&
              <AspectRatio
                ratio={2}
                backgroundSrc={url}
                coverBackground
              ></AspectRatio>
            }
            <TextInput
              icon='image'
              placeholder="Image prompt"
              compact
              hideOutline
              value={prompt}
              onChange={(newValue) => set_prompt(newValue)}
              buttons={[
                {
                  icon: "bolt-lightning",
                  iconPrefix: "fas",
                  secondary: true,
                  circle: true,
                  minimal: true,
                  disabled: prompt === "",
                  blink: !!prompt && !url,
                  onClick: () => {
                    set_url(
                      `https://lexi.studio/image/prompt/${encodeURIComponent(prompt)}`
                    );
                  }
                }
              ]}
            />
            <TextInput
              label="Name"
              value={name}
              onChange={(newValue) => set_name(newValue)}
              autoFocus
            />
            <RichTextEditor
              placeholder="Description"
              value={description}
              onChange={(newValue) => set_description(newValue)}
            />
            <Button
              icon="bolt-lightning"
              iconPrefix="fas"
              text={`${completed ? "Reg" : "G"}enerate Channels`}
              expand
              disabled={!loading && !description}
              blink={!!prompt && !url}
              onClick={() => {
                generateGroups(description);
                set_value(null);
              }}
            />
      
            {loading && !value?.length ? (
              <MatrixLoading text={response!} />
            ) : (
              <>
                {value?.map && (
                  <Box width="100%" wrap>
                    <ExpandableLists
                      value={value}
                      onExpand={(index) =>
                        set_value(
                          value.map((item, i) =>
                            i === index
                              ? { ...item, expanded: !item.expanded }
                              : item
                          )
                        )
                      }
                    />
                  </Box>
                )}
              </>
            )}
      
            <Button
              hero
              expand
              primary={name !== ""}
              disabled={name === ""}
              onClick={() => {
                const guid = generateUUID()
                addSpaceIncludingGroups({
                  guid,
                  space: {
                    guid,
                    name,
                    groupGuids: [],
                    previewSrc: url,
                    description
                  },
                  suggested
                })
                setTimeout(() => {
                  router.push(`/spaces/${guid}`)
                }, 1)
              }}
              
              text="Save"
              icon="save"
              iconPrefix="fas"
            />
      
            <Box height={4} width="100%" />
          </Gap>
        </Box>
      </S.new>
    );
};
      
const S = {
  new: styled.div`
    position: relative;
  `
};