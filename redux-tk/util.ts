import { getStore } from './store';  // Replace with the actual path to your Redux store
import { Guid } from './spaces/types';

export type RelationshipObject = {
  threadGuid: Guid | null,
  channelGuid: Guid | null,
  groupGuid: Guid | null,
  spaceGuid: Guid | null
}

export const findRelationships = (guid: Guid, type: 'Messages' | 'Threads' | 'Channels' | 'Groups' | 'Spaces'): RelationshipObject => {
  console.log(type)
  const state = getStore().getState().spaces
  const {
    messagesByGuid,
    threadsByGuid,
    channelsByGuid,
    groupsByGuid,
    spacesByGuid
  } = state

  const result: RelationshipObject = {
    threadGuid: null,
    channelGuid: null,
    groupGuid: null,
    spaceGuid: null
  }

  if (type === 'Messages') {
    for (const [threadGuid, thread] of Object.entries(threadsByGuid)) {
      if (thread.messageGuids.includes(guid)) {
        result.threadGuid = threadGuid
        result.channelGuid = threadsByGuid[threadGuid]?.channelGuid || null
        // Find the groupGuid from groupsByGuid
        for (const [groupGuid, group] of Object.entries(groupsByGuid)) {
          if (group.channelGuids.includes(result.channelGuid!!)) {
            result.groupGuid = groupGuid
            break
          }
        }
        // Find the spaceGuid from spacesByGuid
        for (const [spaceGuid, space] of Object.entries(spacesByGuid)) {
          if (space.groupGuids.includes(result.groupGuid!!)) {
            result.spaceGuid = spaceGuid
            break
          }
        }
        break
      }
    }
  } 
  else if (type === 'Threads') {
    result.threadGuid = guid
    result.channelGuid = threadsByGuid[guid]?.channelGuid || null
    // Find the groupGuid from groupsByGuid
    for (const [groupGuid, group] of Object.entries(groupsByGuid)) {
      if (group.channelGuids.includes(result.channelGuid!!)) {
        result.groupGuid = groupGuid
        break
      }
    }
    // Find the spaceGuid from spacesByGuid
    for (const [spaceGuid, space] of Object.entries(spacesByGuid)) {
      if (space.groupGuids.includes(result.groupGuid!!)) {
        result.spaceGuid = spaceGuid
        break
      }
    }
  } 
  else if (type === 'Channels') {
    result.channelGuid = guid
    // Find the groupGuid from groupsByGuid
    for (const [groupGuid, group] of Object.entries(groupsByGuid)) {
      if (group.channelGuids.includes(guid)) {
        result.groupGuid = groupGuid
        break
      }
    }
    // Find the spaceGuid from spacesByGuid
    for (const [spaceGuid, space] of Object.entries(spacesByGuid)) {
      if (space.groupGuids.includes(result.groupGuid!!)) {
        result.spaceGuid = spaceGuid
        break
      }
    }
  } 
  else if (type === 'Groups') {
    result.groupGuid = guid
    // Find the spaceGuid from spacesByGuid
    for (const [spaceGuid, space] of Object.entries(spacesByGuid)) {
      if (space.groupGuids.includes(guid)) {
        result.spaceGuid = spaceGuid
        break
      }
    }
  } 
  else if (type === 'Spaces') {
    result.spaceGuid = guid
  }

  return result
}