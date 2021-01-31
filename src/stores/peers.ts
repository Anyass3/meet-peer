import { notifier } from '@beyonk/svelte-notifications';
import socket from './socket';
export default {
  default: { iceConfig: false, notifier: false },
  noStore: ['iceConfig', 'notify'],
  state: {
    peers: new Set(),
    speaking: null,
    pinged: null,
    notify: notifier,
    iceConfig: {
      iceServers: [
        { urls: 'stun:134.209.28.98:3478' },
        {
          urls: 'turn:134.209.28.98:3478',
          username: 'anyass',
          credential: 'te8V62xqLQ2GOEibYHCsRBnNE6M=',
        },
      ],
    },
  },
  getters: {
    getPeer: (state, id) => {
      return Array.from(state.peers.get()).find((i) => i['peerId'] === id);
    },
    getPeerScreen(state, id) {
      return Array.from(state.screens.get()).find((i) => i['id'] === 'peer-screen-' + id);
    },
    getPeerVideoId: (state, peerId) => {
      return 'peer-' + peerId;
    },
  },
  mutations: {
    setPeerMedia(state, id, mediaStream, options = {}) {
      const media: any = document.getElementById('peer' + id);
      media.srcObject = mediaStream;
      for (let prop in options) media[prop] = options[prop];
      return media;
    },
    deletePeerScreen(state, g, peerId) {
      state.screens.update((set) => {
        const screen = g('getPeerScreen', peerId);
        set.delete(screen);
        return set;
      });
    },
    addPeerScreen(state, peerId, peerName) {
      state.screens.update((set) =>
        set.add({
          id: 'peer-screen-' + peerId,
          name: peerName + '(Screen)',
        })
      );
    },
    savePeer(state, peer, peerId, peerName) {
      state.peers.update((peers) =>
        peers.add({
          peerId: peerId,
          peer,
          peerName,
        })
      );
    },
    deletePeer(state, peer) {
      state.peers.update((peers) => {
        peers.delete(peer);
        return peers;
      });
    },
    clearPeers(state) {
      state.peers.get().clear();
    },
  },
  actions: {
    // this user creates an offer to a peer
    // new comers notifying old comers of the by signaling
    createPeer: ({ state, dispatch }, peerId, peerName) => {
      const peer = new window['SimplePeer']({
        initiator: true,
        trickle: true,
        streams: [state.stream.get(), state.screenStream.get()],
        config: state.iceConfig,
      });

      dispatch('applyPeer', peer, peerId, peerName);

      //this peer is already in the meet
      //I have to initiate({ initiator: true, }) so it will signal as soon as created
      //this to inform it that I have just joined so it can call addPeer
      peer.on('signal', (signal) => {
        // console.log('created', signal);
        state.socket.emit('signaling-peer', {
          peerId,
          signal,
          peerName: state.userName.get(),
        });
      });
    },
    // this user creates an answer to a peer who sends an offer
    // old comers waiting for signals
    addPeer: ({ state, dispatch, commit }, incomingSignal, peerId, peerName) => {
      const peer = new window['SimplePeer']({
        initiator: false,
        trickle: true,
        streams: [state.stream.get(), state.screenStream.get()],
        config: state.iceConfig,
      });

      dispatch('applyPeer', peer, peerId, peerName);

      // window['peer'] = peer._pc;
      // peer will not signal now except after
      // being signaled by this user because { initiator: false,}
      peer.on('signal', (signal) => {
        // console.log('add', signal);
        state.socket.emit('returning-signal', { peerId, signal, peerName });
      });

      peer.signal(incomingSignal);

      peer.on('connect', () => {
        if (state.sharingScreen.get()) peer.send(state.socket['id'] + ' sharing screen');
      });
    },
    applyPeer({ state, dispatch, commit, g }, peer, peerId, peerName) {
      if (g('getPeer', peerId))
        dispatch('removePeer', peerId).then((peerName) => {
          state.notify.info(`${peerName} is being reconnected due to some issue`);
          commit('savePeer', peer, peerId, peerName);
        });
      else commit('savePeer', peer, peerId, peerName);

      peer.on('stream', (stream) => {
        if (stream.getTracks().length === 2) dispatch('playVideo', stream, peerId);
        else dispatch('playShare', peer, stream, peerId, peerName);
      });

      peer.on('error', (error) => {
        // if (state.socket.disconnected) state.socket.reconnect();
        if (error.code === 'ERR_CONNECTION_FAILURE') {
          dispatch('removePeer', peerId).then((peerName) => {
            state.notify.info(`${peerName} disconnected due to some issues`);
            state.socket.emitLocal('peer-error');
          });
        }
        // else if (error.code === 'ERR_SET_REMOTE_DESCRIPTION') {
        //   dispatch('createPeer', peerId, peerName);
        // }
        console.error('peer-error:', error);
      });
    },
    playVideo({ commit }, stream, peerId) {
      const video = commit('setPeerMedia', peerId, new MediaStream([stream.getVideoTracks()[0]]), {
        muted: true,
      });
      const audio = commit(
        'setPeerMedia',
        peerId + 'audio',
        new MediaStream([stream.getAudioTracks()[0]]),
        {
          muted: false,
        }
      );

      try {
        if (video.paused) video.play();
      } catch (error) {}
      try {
        if (audio.paused) audio.play();
      } catch (error) {}
    },
    playShare({ state, g, dispatch, commit }, peer, stream, peerId, peerName) {
      let sharing = true;
      peer.on('data', (data) => {
        // console.log('data from', peerId, data);
        if (sharing) {
          commit('addPeerScreen', peerId, peerName);
          setTimeout(() => {
            const video = commit(
              'setPeerMedia',
              '-screen-' + peerId,
              new MediaStream([stream.getVideoTracks()[0]]),
              {
                muted: true,
              }
            );
            try {
              video.play();
            } catch (error) {}
            state.notify.success(`${peerName} started sharing screen`, 7000);
          }, 100);
          dispatch('togglePing', 'peer-screen-' + peerId);
          sharing = false;
        } else {
          commit('deletePeerScreen', g, peerId);
          state.notify.info(`${peerName} has stopped sharing screen`, 7000);
          sharing = true;
        }
      });
    },
    togglePing({ state, dispatch }, id) {
      const was_pinged = state.pinged.get() === id;
      dispatch('setPinged', was_pinged ? '' : id).then(() => {
        if (!was_pinged && window) window.scrollTo(0, 0);
      });
    },
    removePeer: ({ g, commit }, peerId) => {
      const peer = g('getPeer', peerId);
      commit('deletePeer', peer);
      peer.peer.destroy();
      commit('deletePeerScreen', g, peerId);
      return peer.peerName;
    },
    removeAllPeers({ state, commit, dispatch }) {
      state.peers.get().forEach((p) => {
        dispatch('removePeer', p.peerId);
      });
      commit('clearPeers');
    },
  },
};
