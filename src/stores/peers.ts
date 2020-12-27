import { get } from 'svelte/store';
import type { Socket } from 'socket.io-client';
export default {
  default: { iceConfig: false },
  state: {
    peers: new Set(),
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
      const peers: Set<any> = get(state.peers);
      const video: any = document.getElementById('peer' + id);
      video.srcObject = vidStream;
      for (let prop in options) video[prop] = options[prop];
    },
    // the new comer signals to old comers
    createPeer: (state, peerId) => {
      const stream: MediaStream = get(state.stream);
      const peer = new window['SimplePeer']({
        initiator: true,
        trickle: false,
        stream,
        config: get(state.iceConfig),
      });

      peer.on('signal', (signal) => {
        const socket: Socket = get(state.socket);
        socket.emit('signaling-peer', {
          peerId,
          signal,
          userId: socket['id'],
          name: get(state.userName),
        });
      });
      return peer;
    },
    // old comers waiting for signals
    addPeer: (state, incomingSignal, userId, name) => {
      const stream: MediaStream = get(state.stream);
      const peer = new window['SimplePeer']({
        initiator: false,
        trickle: true,
        stream,
        config: get(state.iceConfig),
      });
      // peer will not signal now except after
      // being signaled by this user
      peer.on('signal', (signal) => {
        const socket: Socket = get(state.socket);
        socket.emit('returning-signal', { userId, signal, name });
      });
      peer.signal(incomingSignal);
      return peer;
    },
  },
  actions: {
    playVideos: ({ state, commit, dispatch }) => {
      const peers: Set<any> = get(state.peers);
      peers.forEach((i) => {
        if (!i.streaming)
          i.peer.on('stream', (stream) => {
            i.streaming = true;
            if (stream.getVideoTracks()[0].muted) {
              stream.getVideoTracks()[0].onunmute = () =>
                commit('setPeerVideo', i.peerId, stream, { muted: false });
              commit(
                'setPeerVideo',
                i.peerId,
                new MediaStream([get(state.fakeVideoStream), stream.getAudioTracks()[0]]),
                { muted: false }
              );
            } else dispatch('setFakeVideoStream', i.peerId, stream, { muted: false });
          });
      });
    },
    removePeer: ({ state, g, dispatch }, id) => {
      const peers: Set<any> = get(state.peers);
      const peer = Array.from(peers).find((i) => i['peerId'] === id);
      peers.delete(peer);
      dispatch('setPeers', peers);
    },
  },
};
