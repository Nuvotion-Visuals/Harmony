import { Space, Guid, Channel, Asset, Group } from 'redux-tk/spaces/types';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

interface MyDatabase {
  spaces: Y.Map<Space>;
  channels: Y.Map<Channel>;
  assets: Y.Map<Asset>;
  groups: Y.Map<Group>;
}

let db: MyDatabase;

if (typeof window !== 'undefined') {
  const ydoc = new Y.Doc();
  const persistence = new IndexeddbPersistence('lexi', ydoc);

  persistence.whenSynced.then(() => {
    // The data is now synchronized with IndexedDB
    // Update the UI with the latest data
  });

  db = {
    spaces: ydoc.getMap('spaces'),
    channels: ydoc.getMap('channels'),
    assets: ydoc.getMap('assets'),
    groups: ydoc.getMap('groups'),
  };
} else {
  db = {
    spaces: new Y.Map(),
    channels: new Y.Map(),
    assets: new Y.Map(),
    groups: new Y.Map(),
  };
}

export default db;
