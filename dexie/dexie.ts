import { Space, Guid, Channel, Asset, Group } from 'redux-tk/spaces/types'

import Dexie from "dexie";

export interface MyDatabase extends Dexie {
  spaces: Dexie.Table<Space, Guid>;
  channels: Dexie.Table<Channel, Guid>;
  assets: Dexie.Table<Asset, Guid>;
  groups: Dexie.Table<Group, Guid>;
}

const db = new Dexie("myDatabase") as MyDatabase;

db.version(1).stores({
  spaces: "guid, name, *groupGuids",
  channels: "guid, name, groupGuid, *assetGuids",
  assets: "guid, name, type, description, previewSrc",
  groups: "guid, name, *channelGuids",
});

export default db;
