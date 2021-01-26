// import { connectBrowser, newClientKeypair } from 'connectome';
import { ConnectedStore } from 'connectome/stores';

export default {
  // noStore: ['ctmConnected', 'ctmState', 'ctmApi'],
  // defaults: { ctmConnected: { getters: false }, ctmState: { getters: false } },
  state: {
    // ctmConnected: null,
    // ctmState: null,
    // ctmApi: store.api ? store.api(apiName) : store.api,
  },
  getters: {
    // ctmConnected(state) {
    //   return state.ctmConnected;
    // },
    // ctmState(state) {
    //   return state.ctmState;
    // },
    // ctmApi(state) {
    //   return state.ctmApi;
    // },
  },
  actions: {
    startConnectome({ commit }) {
      //  needs some work and thinking on how to make decentralized connection between user nodes
      // but soon

      const address = window.location.hostname;

      const port = '3700';

      const protocol = 'dmtapp';
      // const keypair = newClientKeypair();

      const lane = 'meet';

      class Store {
        constructor() {
          // const store = connectBrowser({ address, ssl: false, protocol, port, lane, keypair });
          const store = new ConnectedStore({ address, protocol, port, lane });
          this.connector = store.connector;
        }
        emit(signal, data) {
          this.connector.send({ signal, data });
        }
        on(signal, fn) {
          this.connector.on(signal, fn);
        }
        get connected() {
          return this.connector.connected;
        }
        get disconnected() {
          return this.connector.closed();
        }
        disconnect() {
          this.connector.connection.terminate();
          this.connector.decommission();
        }
        get id() {
          return this.connector.clientPublicKeyHex;
        }
      }
      commit('setSocket', new Store());
    },
  },
};
