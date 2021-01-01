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
    getPeer(state, id) {
      Array.from(get(state.peers)).find((i) => i['peerId'] === id);
    },
  },
  mutations: {
    setPeerVideo(state, id, vidStream, options = {}) {
      // const peers: Set<any> = get(state.peers);
      const video: any = document.getElementById('peer' + id);
      video.srcObject = vidStream;
      for (let prop in options) video[prop] = options[prop];
    },
  },
  actions: {
    createPeer: ({ state, dispatch }, peerId, name) => {
      const stream: MediaStream = get(state.stream);
      const peer = new window['SimplePeer']({
        initiator: true,
        trickle: true,
        stream,
        config: state.iceConfig,
      });

      peer.on('signal', (signal) => {
        const socket: Socket = get(state.socket);
        socket.emit('signaling-peer', {
          peerId,
          signal,
          name: get(state.userName),
        });
      });
      state.peers.update((peers) =>
        peers.add({
          peerId: peerId,
          peer,
          name,
        })
      );
      peer.on('stream', (stream) => {
        dispatch('playVideo', stream, peerId);
      });
      // return peer;
    },
    // old comers waiting for signals
    addPeer: ({ state, dispatch }, incomingSignal, peerId, name) => {
      const stream: MediaStream = get(state.stream);
      const peer = new window['SimplePeer']({
        initiator: false,
        trickle: true,
        stream,
        config: state.iceConfig,
      });
      // peer will not signal now except after
      // being signaled by this user
      peer.on('signal', (signal) => {
        const socket: Socket = get(state.socket);
        socket.emit('returning-signal', { peerId, signal, name });
      });
      peer.signal(incomingSignal);
      state.peers.update((peers) =>
        peers.add({
          peerId: peerId,
          peer,
          name,
        })
      );
      peer.on('stream', (stream) => {
        dispatch('playVideo', stream, peerId);
      });

      // return peer;height
    },

    playVideo({ commit }, stream, peerId) {
      if (stream.getVideoTracks()[0].muted) {
        commit('setPeerVideo', peerId, new MediaStream([stream.getAudioTracks()[0]]), {
          muted: false,
        });
        console.log('VidinitVideoeo is muted');
        stream.getVideoTracks()[0].onunmute = () => {
          console.log('Video has unmuted');
          commit('setPeerVideo', peerId, stream, { muted: false });
        };
        stream.getVideoTracks()[0].onmute = () => {
          console.log('video MUTED Again', peerId);
          commit('setPeerVideo', peerId, new MediaStream([stream.getAudioTracks()[0]]), {
            muted: false,
          });
        };
      } else {
        // console.log('Video not muted');
        commit('setPeerVideo', peerId, stream, { muted: false });
      }
    },
    togglePing({ state, dispatch }, id) {
      const is_pinged = get(state.pinged) === id;
      console.log('is_pinged', is_pinged);
      dispatch('setPinged', is_pinged ? '' : id);
    },
    removePeer: ({ state, g, dispatch }, id) => {
      const peers: Set<any> = get(state.peers);
      const peer = Array.from(peers).find((i) => i['peerId'] === id);
      peers.delete(peer);
      dispatch('setPeers', peers);
      peer.peer.destroy();
      return peer.name;
    },
  },
};
