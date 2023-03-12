import { Space, Guid, Channel, Asset, Group } from 'redux-tk/spaces/types';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { store } from 'redux-tk/store';

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
  const provider = new WebsocketProvider('ws://localhost:1234', 'lexi', ydoc)
  provider.connect()

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

  Object.entries(db).forEach(([name, map]) => {
    map.observe((event: Y.YMapEvent<Space | Channel | Asset | Group>) => {
      // console.log(`Data changed in ${name}: ${JSON.stringify(map.toJSON(), null, 2)}`);
      setTimeout(() => {
        const payload = map.toJSON()

        switch (name) {
          case 'spaces':
            store.dispatch({ type: 'spaces/setSpaces', payload });
            break;
          case 'groups':
            store.dispatch({ type: 'spaces/setGroups', payload });
            break;
          case 'channels':
            store.dispatch({ type: 'spaces/setChannels', payload });
            break;
          case 'assets':
            store.dispatch({ type: 'spaces/setAssets', payload });
            break;
          default:
            break;
        }
      }, Math.random())
     
    });
  });

  //store.dispatch(fetchInitialData());
} else {
  db = {
    spaces: new Y.Map(),
    channels: new Y.Map(),
    assets: new Y.Map(),
    groups: new Y.Map(),
  };
}

export default db;