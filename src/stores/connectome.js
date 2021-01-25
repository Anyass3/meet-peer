import { makeConnectedStore } from 'connectome/stores';

const client = typeof window !== 'undefined';
//  this is to avoid server failure
// as connetome/stores=>makeConnectedStore is not server side friendly

let store = {};
let socket;
// const apiName = 'dmtapp:meet:rooms';

if (client) {
  const address = window.location.hostname;

  const port = '3700';

  const protocol = 'dmtapp';

  const lane = 'meet';

  store = new makeConnectedStore({ address, protocol, port, lane });
  // store.state.connector.send({ signal: 'join-room', data: 'hi there' });
  socket = {
    emit(signal, data) {
      store.state.connector.send({ signal, data });
    },
    on(signal, fn) {
      store.state.connector.on(signal, fn);
    },
    get connected() {
      return store.state.connector.connected;
    },
    get disconnected() {
      return store.state.connector.closed();
    },
    disconnect() {}, // needs some work cuz even after force disconnect it connects again
    get id() {
      return store.state.connector.clientPublicKeyHex;
    },
  };
  socket.on('connect', () => console.log('ghjkhf'));
  socket.on('signal-error', (data) => console.error('signal-error', data.msg));
  socket.on('new-peer', (data) => console.log(`A new peer justed poped in ${data}`));
  socket.on('joined', (data) => console.log(data));
  window.onbeforeunload = () => {
    socket.emit('signal-disconnect');
  };
}
export default {
  noStore: ['ctmConnected', 'ctmState', 'ctmApi', 'socket'],
  defaults: { ctmConnected: false, ctmState: false },
  state: {
    socket,
    ctmConnected: store.connected,
    ctmState: store.state,
    // ctmApi: store.api ? store.api(apiName) : store.api,
  },
  getters: {
    ctmConnected(state) {
      return state.ctmConnected;
    },
    ctmState(state) {
      return state.ctmState;
    },
    // ctmApi(state) {
    //   return state.ctmApi;
    // },
  },
};
