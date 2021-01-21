import { get } from 'svelte/store';
import type { Socket } from 'socket.io-client';
import { notifier } from '@beyonk/svelte-notifications';
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
      return Array.from(get(state.peers)).find((i) => i['peerId'] === id);
    },
    getPeerScreen(state, id) {
      const screens: Set<any> = get(state.screens);
      return Array.from(screens).find((i) => i['id'] === 'peer-screen-' + id);
    },
    getPeerVideoId: (state, peerId) => {
      return 'peer-' + peerId;
    },
  },
  mutations: {
    setPeerMedia(state, id, mediaStream, options = {}) {
      // const peers: Set<any> = get(state.peers);
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
    savePeer(state, peer, peerId, name) {
      state.peers.update((peers) =>
        peers.add({
          peerId: peerId,
          peer,
          name,
        })
      );
    },
  },
  actions: {
    // this user creates an offer to a peer
    // new comers notifying old comers of the by signaling
    createPeer: ({ state, commit, dispatch }, peerId, name) => {
      const peer = new window['SimplePeer']({
        initiator: true,
        trickle: true,
        streams: [get(state.stream), get(state.screenStream)],
        config: state.iceConfig,
      });
      // window['peer'] = peer._pc;

      //this peer is already in the meet
      //I have to initiate({ initiator: true, }) so it will signal as soon as created
      //this to inform it that I have just joined so it can call addPeer
      peer.on('signal', (signal) => {
        const socket: Socket = get(state.socket);
        socket.emit('signaling-peer', {
          peerId,
          signal,
          name: get(state.userName),
        });
      });
      commit('savePeer', peer, peerId, name);
      peer.on('stream', (stream) => {
        if (stream.getTracks().length === 2) dispatch('playVideo', stream, peerId);
        else dispatch('playShare', peer, stream, peerId, name);
      });
      peer.on('error', (error) => {
        if (error.code === 'ERR_CONNECTION_FAILURE') {
          // const socket: Socket = get(state.socket);
          // window['sk'] = socket;
          // state.notifier.warning('Connection failure')
        }
        console.error('peer-error:', error.code);
      });
    },
    // this user creates an answer to a peer who sends an offer
    // old comers waiting for signals
    addPeer: ({ state, dispatch, commit }, incomingSignal, peerId, name) => {
      const peer = new window['SimplePeer']({
        initiator: false,
        trickle: true,
        streams: [get(state.stream), get(state.screenStream)],
        config: state.iceConfig,
      });

      // window['peer'] = peer._pc;
      // peer will not signal now except after
      // being signaled by this user because { initiator: false,}
      peer.on('signal', (signal) => {
        const socket: Socket = get(state.socket);
        socket.emit('returning-signal', { peerId, signal, name });
      });

      peer.signal(incomingSignal);

      commit('savePeer', peer, peerId, name);

      peer.on('stream', (stream) => {
        if (stream.getTracks().length === 2) dispatch('playVideo', stream, peerId);
        else dispatch('playShare', peer, stream, peerId, name);
      });
      peer.on('connect', () => {
        if (get(state.sharingScreen)) peer.send(get(state.socket)['id'] + ' sharing screen');
      });
      peer.on('error', (error) => {
        if (error.code === 'ERR_CONNECTION_FAILURE') {
          // const socket: Socket = get(state.socket);
          // window['sk'] = socket;
        }
        console.error('peer-error:', error.code);
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
        video.play();
      } catch (error) {}
      try {
        audio.play();
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
          state.notify.info(`${peerName} has stopped started sharing screen`, 7000);
          sharing = true;
        }
      });
    },
    togglePing({ state, dispatch }, id) {
      const was_pinged = get(state.pinged) === id;
      dispatch('setPinged', was_pinged ? '' : id).then(() => {
        if (!was_pinged && window) window.scrollTo(0, 0);
      });
    },
    removePeer: ({ state, g, commit }, peerId) => {
      const peer = g('getPeer', peerId);
      state.peers.update((peers) => {
        peers.delete(peer);
        return peers;
      });
      peer.peer.destroy();
      commit('deletePeerScreen', g, peerId);
      return peer.name;
    },
  },
};
