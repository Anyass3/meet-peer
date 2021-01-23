import dmt from 'dmt/bridge';
import { MirroringStore } from 'dmt/connectome-stores';

import state from './state';

import makeApi from './makeApi';

function init({ program }) {
  const store = new MirroringStore(state);

  const api = makeApi(store);

  function onConnect({ channel }) {
    channel.attachObject('dmtapp:meet:rooms', api);
  }

  const channelList = program.registerProtocol({ protocol: 'dmtapp', lane: 'meet', onConnect });
  store.mirror(channelList);
}

export { init };
