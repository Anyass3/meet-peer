import { get } from 'svelte/store';
// import Peer from 'simple-peer';
// const Peer = require('simple-peer');
// let Peer: any;
// let SimplePeer;
export default {
  state: {
    peers: new Set(),
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
      //   const Peer: any = get(state.SimplePeer);
      const socket = get(state.socket);
      const stream: MediaStream = get(state.stream);
      console.log('CREATE STREAM', stream.getTracks());
      const peer = new window['SimplePeer']({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on('signal', (signal) => {
        // console.log('signaling-peer', signal);
        // console.log('socket', socket, state.socket);
        socket['emit']('signaling-peer', {
          peerId,
          signal,
          userId: socket['id'],
          name: get(state.userName),
        });
        peer.signaledPeer = true;
      });
      peer.on('stream', (s) => console.log('create)Scream is available from', peer));
      return peer;
    },
    // old comers waiting for signals
    addPeer: (state, incomingSignal, userID, name) => {
      //   const Peer: any = get(state.SimplePeer);
      const stream: MediaStream = get(state.stream);
      document.getElementById('userVideo')['srcObject'] = stream;
      console.log('ADD STREAM', stream.getTracks());
      const peer = new window['SimplePeer']({
        initiator: false,
        trickle: false,
        stream,
      });
      // peer will not signal now except after
      // being signaled by this user
      const socket = get(state.socket);
      peer.on('signal', (signal) => {
        // console.log('signal', signal);
        socket['emit']('returning-signal', { userID, signal, name });
      });
      peer.signal(incomingSignal);
      peer.on('stream', (s) => console.log('add)Scream is available from', peer));
      return peer;
    },
  },
  actions: {
    playVideos: ({ state, commit, dispatch }) => {
      const peers: Set<any> = get(state.peers);

      //   state.peers.subscribe((p) => (peers = p));

      //   console.log('playVideos', peers);
      peers.forEach((i) => {
        console.log('i', i.peer);
        if (!i.streaming)
          i.peer.on('stream', (stream) => {
            console.log('play', i.peer, stream);
            i.streaming = true;
            if (stream.getVideoTracks()[0].muted) {
              stream.getVideoTracks()[0].onunmute = () => {
                commit('setPeerVideo', i.peerId, stream, { muted: false });
              };
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
      const peerVideo: any = document.getElementById('peer' + id);
      // console.log(peerVideo)
      peerVideo.srcObject = null;
      const peers: Set<any> = get(state.peers);
      const peer = Array.from(peers).find((i) => i['peerId'] === id); //g('getPeer', id);
      //   console.log(peer, peers, id, peerVideo);
      peer.peer.destroy(); //destroy disconnected peer
      peers.delete(peer);
      dispatch('setPeers', peers);
    },
  },
};
