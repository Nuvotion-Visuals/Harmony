import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor, ExpandableLists, ItemProps, LabelColor } from '@avsync.live/formation';
import { useGenerateGroups } from "Lexi/System/Language/hooks";
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

export const EditSpace = ({}: Props) => {
  const router = useRouter();

  const { activeSpace, updateSpace } = useSpaces();

  const [name, set_name] = useState(activeSpace?.name || "");
  const [description, set_description] = useState(activeSpace?.description || "");
  const [prompt, set_prompt] = useState(activeSpace?.description || "");

  const [url, set_url] = useState<string | undefined>(activeSpace?.previewSrc);

  const [generateGroups, completed, response, loading, error] = useGenerateGroups(description);

  const [suggested, set_suggested] = useState<Suggested>({ groups: [] });

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
        <Button
          icon="chevron-left"
          iconPrefix="fas"
          href={`/spaces/${activeSpace?.guid}`}
          minimal
        />
        <Item pageTitle="Edit Space" />
      </Box>

      <AspectRatio
        ratio={2}
        backgroundSrc={url}
        coverBackground
      ></AspectRatio>
      <Box p={0.5}>
        <Gap disableWrap>
          <TextInput
            placeholder="Image prompt"
            compact
            value={prompt}
            onChange={(newValue) => set_prompt(newValue)}
            hideOutline
            />
            <Button
              icon="bolt-lightning"
              iconPrefix="fas"
              secondary
              circle
              minimal
              disabled={prompt === ""}
              primary={prompt !== ""}
              blink={!!prompt && !url}
              onClick={() => {
                set_url(
                  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
                );
              }}
            />
          </Gap>
        </Box>
      
        <Box px={0.75} wrap>
          <Gap gap={0.75}>
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
              secondary
              disabled={!loading && !description}
              blink={!!prompt && !url}
              onClick={() => {
                generateGroups();
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
                if (name && activeSpace?.guid) {
                  updateSpace({
                    guid: activeSpace.guid,
                    space: {
                      guid: activeSpace.guid,
                      groupGuids: activeSpace.groupGuids,
                      name,
                      previewSrc: url,
                      description,
                    },
                  });
                  setTimeout(() => {
                    router.push(`/spaces/${activeSpace.guid}`);
                  }, 1);
                }
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