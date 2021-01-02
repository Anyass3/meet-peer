import io, { Socket } from 'socket.io-client';
import { get } from 'svelte/store';

export default {
  state: {
    socket: null,
    joinRequest: false,
    enteredRoom: false,
    reconnecting: false,
    hasLeftWillingly: false,
    userName: '',
  },
  getters: {
    getUserId: (state) => {
      const socket: Socket = get(state.socket);
      return socket ? socket['id'] : 'userVideo';
    },
    getUserVideoId: (state) => {
      const _this: any = this;
      return 'user-' + _this.getUserId(state);
    },
    getUserScreen(state) {
      const screens: Set<any> = get(state.screens);
      return Array.from(screens).find((i) => i['id'] === 'userVideo-share-screen');
    },
  },
  actions: {
    joinMeet: ({ state, commit, dispatch, g }, roomId) => {
      const socket: Socket = io.io('/');
      dispatch('setSocket', socket);
      socket.on('connect', () => {
        if (get(state.joinRequest)) {
          socket.emit('join-room', { roomId, name: get(state.userName) });
          console.log('socket connected');
          commit('setHasLeftWillingly', false);
          dispatch('setReconnecting', false);
        } else dispatch('leaveMeet');
      });

      socket.on('room-full', () => {
        state.notify.warning('Sorry room is already full');
        commit('setJoinRequest', false);
        dispatch('setHasLeftWillingly', true); //:)sorry
        dispatch('leaveMeet');
      });

      // to get and setup peers already in the meet
      socket.on('joined-in-room', (joinedPeers) => {
        if (window) window.scrollTo(0, 0);
        state.notify.info(`${joinedPeers.length} peers are already in meet`);
        dispatch('setEnteredRoom', true);
        joinedPeers.forEach((i) => {
          dispatch('createPeer', i.id, i.name);
          // dispatch('playVideos');
        });
      });

      // to get and setup a newly joined peer
      socket.on('user-joined', (payload) => {
        dispatch('addPeer', payload.signal, payload.peerId, payload.name).then(() => {
          state.notify.info(`${payload.name || 'Anonymous'} Joined Meet`);
        });
        // dispatch('playVideos');
      });
      socket.on('receiving-candidate', (payload) => {
        const peers: Set<any> = get(state.peers);
        const item = Array.from(peers).find((i) => i['peerId'] === payload.peerId);
        // const item: any = get(g('getPeer', payload.id));
        item.peer.signal(payload.signal);
      });
      socket.on('receiving-returned-signal', (payload) => {
        const peers: Set<any> = get(state.peers);
        const item = Array.from(peers).find((i) => i['peerId'] === payload.id);
        // const item: any = get(g('getPeer', payload.id));
        item.peer.signal(payload.signal);
      });
      socket.on('peer-left', (id) => {
        dispatch('removePeer', id).then((name) => {
          state.notify.info(`${name === 'OK' ? 'Anonymous' : name || 'Anonymous'} left meet`);
        });
      });
      socket.on('notAllowed-room-full', (name) => {
        state.notify.info(`${name || 'Someone'} wanted to join but room is already full`);
      });
      socket.on('disconnect', () => {
        console.log('socket disconnected');
        const peers: any = get(state.peers);
        peers.forEach((p) => {
          dispatch('removePeer', p.peerId);
        });
        peers.clear();
        if (!get(state.hasLeftWillingly)) {
          dispatch('setReconnecting', true);
          console.log('Has not left willingly');
          // $('#leave').parent.$('p').show();
          setTimeout(() => {
            if (socket.disconnected) {
              console.log('socket.disconnected)');
              commit('setJoinedRequest', false);
              dispatch('setReconnecting', false).then(() =>
                dispatch('leaveMeet')
                  .then(() => dispatch('setEnteredRoom', false))
                  .then(() => state.notify.info(`You Left Meet`))
              );
            }
          }, 50000);
        }

        console.log('socket disconnected', !get(state.hasLeftWillingly));
      });
    },
    leaveMeet: ({ state }) => {
      const socket: Socket = get(state.socket);
      socket.disconnect();
      state.notify.info(`You Left Meet`);
    },
  },
};
