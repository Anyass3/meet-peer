// import io, { Socket } from 'socket.io-client';
import { get } from 'svelte/store';

export default {
  noStore: ['roomId'],
  state: {
    // socket: null,
    joinRequest: false,
    enteredRoom: false,
    reconnecting: false,
    hasLeftWillingly: false,
    userName: '',
    roomId: null,
  },
  getters: {
    getUserId: (state) => {
      const socket: any = state.socket;
      return socket ? socket['id'] : 'userVideo';
    },
    getUserVideoId(this, state) {
      return 'user-' + this.getUserId(state);
    },
    getUserScreen(state) {
      const screens: Set<any> = get(state.screens);
      return Array.from(screens).find((i) => i['id'] === 'userVideo-share-screen');
    },
  },
  mutations: {
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
  },
  actions: {
    joinMeet: ({ state, commit, dispatch, g }) => {
      if (!get(state.userName)) {
        state.notify.warning('Please input your name to join');
        return;
      }
      commit('setJoinRequest', true);
      // const socket: Socket = io.io('/');
      // dispatch('setSocket', socket);
      const socket = g('getSocket');
      socket.emit('signal-connect');
      socket.on('error', (error) => {
        console.log(error);
      });
      socket.on('signal-connect', () => {
        console.log('signal connected');
        if (get(state.joinRequest)) {
          socket.emit('join-room', { roomId: state.roomId, name: get(state.userName) });
          console.log('socket connected');
          commit('setHasLeftWillingly', false);
          dispatch('setReconnecting', false);
        } else dispatch('leaveMeet');
      });

      socket.on('room-full', () => {
        state.notify.warning('Sorry room is already full');
        dispatch('leaveMeet');
      });

      // to get and setup peers already in the meet
      socket.on('joined-in-room', (joinedPeers) => {
        console.log('joinedPeers', joinedPeers);
        if (window) window.scrollTo(0, 0);
        state.notify.info(`${joinedPeers.length} peers are already in meet`);
        dispatch('setEnteredRoom', true);
        joinedPeers.forEach((i) => {
          console.log('creating peer');
          dispatch('createPeer', i.peerId, i.peerName);
        });
      });

      // to get and setup a newly joined peer
      socket.on('user-joined', (payload) => {
        console.log('user-joined');
        dispatch('addPeer', payload.signal, payload.peerId, payload.name).then(() => {
          state.notify.info(`${payload.name} Joined Meet`);
        });
      });
      socket.on('receiving-candidate', (payload) => {
        console.log('receiving-candidate');
        // const peers: Set<any> = get(state.peers);
        const item: any = g('getPeer', payload.peerId);
        item.peer.signal(payload.signal);
      });
      socket.on('receiving-returned-signal', (payload) => {
        console.log('receiving-returned-signal');
        const peers: Set<any> = get(state.peers);
        const item: any = g('getPeer', payload.id);
        item.peer.signal(payload.signal);
      });
      socket.on('peer-left', (id) => {
        dispatch('removePeer', id).then((name) => {
          state.notify.info(`${name} has left meet`);
        });
      });
      socket.on('notAllowed-room-full', (name) => {
        state.notify.info(`${name} wanted to join but room is already full`);
      });
      socket.on('disconect', () => dispatch('onDisconnect'));
      socket.on('reconnect-attempt', (reason) => {
        console.log('reconnecting-attempt', reason);
      });
    },
    onDisconnect({ state, dispatch }) {
      console.log('socket disconnected: ');
      const peers: any = get(state.peers);
      peers.forEach((p) => {
        dispatch('removePeer', p.peerId);
      });
      peers.clear();
      if (!get(state.hasLeftWillingly)) {
        dispatch('setReconnecting', true);
        console.log('Has not left willingly');
        setTimeout(() => {
          if (state.socket.disconnected) {
            dispatch('setReconnecting', false).then(() => dispatch('leaveMeet'));
            console.log('socket.disconnected leaving meet');
          } else console.log('socket has re-connected re-joining meet');
        }, 10000);
      }

      console.log('socket disconnected');
    },
    leaveMeet: ({ state, commit, dispatch }) => {
      state.socket.emit('signal-disconnect');
      commit('setJoinRequest', false);
      dispatch('setHasLeftWillingly', true); //:)sorry

      dispatch('onDisconnect');
      state.socket.disconnect(); /// not doing anything for now

      dispatch('setEnteredRoom', false);
      if (get(state.sharingScreen)) dispatch('endScreenShare');
      dispatch('endMediaStream');
      state.notify.info(`You Have Left The Meet`);
    },
  },
};
