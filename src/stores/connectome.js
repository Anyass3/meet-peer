import { connectBrowser } from 'connectome';

export default {
  actions: {
    startConnectome({ commit, dispatch }) {
      //  needs some work and thinking on how to make decentralized connection between user nodes
      // but soon

      const address = window.location.hostname;

      const port = '7780';

      const endpoint =
        (window.location.protocol.includes('s') ? 'wss' : 'ws') + '://' + window.location.host;

      const protocol = 'dmtapp';

      const lane = 'meet';

      class Socket {
        constructor() {
          this.connector = connectBrowser({ address, protocol, port, lane, endpoint });
        }
        emitLocal(signal, data) {
          this.connector.emit(signal, data);
        }
        emit(signal, data) {
          this.connector.signal(signal, data);
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
        reconnect() {
          this.connector.connection.terminate();
          // this.emitLocal('reconnecting');
          // this.emit('reconnected'); // it will only reach the server if connected
        }
        disconnect() {
          this.emit('signal-disconnect');
          this.connector.connection.terminate();
          this.connector.decommission();
          dispatch('setSocket', {});
        }
        get id() {
          return this.connector.clientPublicKeyHex;
        }
      }
      commit('setSocket', new Socket());
    },
  },
};
