import { get } from 'svelte/store';
import type { Socket } from 'socket.io-client';
import { notifier } from '@beyonk/svelte-notifications';
export default {
  default: { iceConfig: false, notifier: false },
  noStore: ['iceConfig', 'notify'],
  state: {
    roomId: undefined,
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
        streams: [stream, get(state.screenStream)],
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
        console.log(stream.getTracks());
        if (stream.getTracks().length === 2) dispatch('playVideo', stream, peerId);
        else dispatch('playShare', peer, stream, peerId);
      });
      // peer.on('track', (track, stream) => {
      //   console.log('track', track, stream.getTracks());
      // });
      // return peer;
    },
    // old comers waiting for signals
    addPeer: ({ state, dispatch }, incomingSignal, peerId, name) => {
      const stream: MediaStream = get(state.stream);
      const peer = new window['SimplePeer']({
        initiator: false,
        trickle: true,
        streams: [stream, get(state.screenStream)],
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
        console.log(stream.getTracks());
        if (stream.getTracks().length === 2) dispatch('playVideo', stream, peerId);
        else {
          dispatch('playShare', peer, stream, peerId, name).then(() => {
            // if (get(state.sharingScreen)) peer.send(get(state.socket)['id'] + ' sharing screen');
          });
        }
      });
      peer.on('connect', () => {
        if (get(state.sharingScreen)) peer.send(get(state.socket)['id'] + ' sharing screen');
      });
      // peer.on('track', (track, stream) => {
      //   console.log('track', track, stream);
      // });

      // return peer;height
    },

    playVideo({ commit }, stream, peerId) {
      if (stream.getVideoTracks()[0].muted) {
        commit('setPeerVideo', peerId, new MediaStream([stream.getAudioTracks()[0]]), {
          muted: false,
        });
        console.log('VidinitVideoeo is muted');
        stream.getVideoTracks()[0].onunmute = () => {
          // console.log('Video has unmuted');
          commit('setPeerVideo', peerId, stream, { muted: false });
        };
        stream.getVideoTracks()[0].onmute = () => {
          // console.log('video MUTED Again', peerId);
          commit('setPeerVideo', peerId, new MediaStream([stream.getAudioTracks()[0]]), {
            muted: false,
          });
        };
      } else {
        // console.log('Video not muted');
        commit('setPeerVideoplayScreen', peerId, stream, { muted: false });
      }
    },
    playShare({ state, commit }, peer, stream, peerId, peerName) {
      let sharing = true;
      peer.on('data', (data) => {
        // console.log('data from', peerId, data);
        if (sharing) {
          state.screens.update((set) =>
            set.add({
              id: 'peer-screen-' + peerId,
              name: (peerName || 'Anonymous') + '-screen',
            })
          );
          setTimeout(() => {
            commit(
              'setPeerVideo',
              '-screen-' + peerId,
              new MediaStream([stream.getVideoTracks()[0]]),
              {
                muted: true,
              }
            );
            state.notify.success(`${peerName || 'Anonymous'} started sharing screen`);
          }, 100);
          sharing = false;
        } else {
          state.screens.update((set) => {
            const screen = Array.from(set).find((i) => i['id'] === 'peer-screen-' + peerId);
            set.delete(screen);
            return set;
          });
          state.notify.info(`${peerName || 'Anonymous'} has stopped started sharing screen`);
          sharing = true;
        }
      });
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
