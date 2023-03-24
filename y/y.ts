import { Space, Guid, Channel, Group, Asset, Thread, Message } from 'redux-tk/spaces/types';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { store } from 'redux-tk/store';

interface MyDatabase {
  spaces: Y.Map<Space>;
  channels: Y.Map<Channel>;
  assets: Y.Map<Asset>;
  groups: Y.Map<Group>;
  threads: Y.Map<Thread>;
  messages: Y.Map<Message>;
}

let db: MyDatabase;

if (typeof window !== 'undefined') {
  const ydoc = new Y.Doc();
  const persistence = new IndexeddbPersistence('lexi', ydoc);
  const provider = new WebsocketProvider(process.env.NEXT_PUBLIC_LEXISYNC_URL || 'ws://localhost:1234', 'lexi', ydoc)
  provider.connect()

  provider.awareness.getStates().forEach(state => {
    const metadata = state.metadata
   console.log(metadata)
  })

  persistence.whenSynced.then(() => {
    // The data is now synchronized with IndexedDB
    // Update the UI with the latest data
  });

  db = {
    spaces: ydoc.getMap('spaces'),
    channels: ydoc.getMap('channels'),
    assets: ydoc.getMap('assets'),
    groups: ydoc.getMap('groups'),
    threads: ydoc.getMap('threads'),
    messages: ydoc.getMap('messages'),
  };

  Object.entries(db).forEach(([name, map]) => {
    map.observe((event: Y.YMapEvent<Space | Channel | Asset | Group | Thread | Message>) => {
        try {
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
            case 'threads':
              store.dispatch({ type: 'spaces/setThreads', payload });
              break;
            case 'messages':
              store.dispatch({ type: 'spaces/setMessages', payload });
              break;
            default:
              break;
          }
        }
        catch(e) {
          console.log(e)
        }
    });
  });
} 
else {
  db = {
    spaces: new Y.Map(),
    channels: new Y.Map(),
    assets: new Y.Map(),
    groups: new Y.Map(),
    threads: new Y.Map(),
    messages: new Y.Map(),
  };
}

export default db;
