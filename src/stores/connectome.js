import { makeConnectedStore } from 'connectome/stores';

const client = typeof window !== 'undefined';
//  this is to avoid server failure
// as connetome/stores=>makeConnectedStore is not server side friendly

const address = 'localhost';
const port = '7780';

const protocol = 'dmtapp';
const lane = 'search';

let store = {};

if (client) {
  // store = new makeConnectedStore({ address, protocol, port, lane });
}
export default {
  noStore: ['ctmConnected', 'ctmState', 'ctmApi'],
  defaults: false,
  state: {
    ctmConnected: store.connected,
    ctmState: store.state,
    ctmApi: store.api,
  },
  getters: {
    ctmConnected(state) {
      return state.ctmConnected;
    },
    ctmState(state) {
      return state.ctmState;
    },
    ctmApi(state) {
      return state.ctmApi;
    },
  },
};
