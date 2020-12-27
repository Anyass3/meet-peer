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
    getPeerVideoId: (state, peerId) => {
      return 'peer-' + peerId;
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
        } else dispatch('leaveMeet');
      });

      socket.on('room-full', () => {
        alert('Sorry room is already full');
        commit('setJoinRequest', false);
        dispatch('setHasLeftWillingly', true); //:)sorry
        dispatch('leaveMeet');
      });

      // to get and setup peers already in the meet
      socket.on('joined-in-room', (joinedPeers) => {
        dispatch('setEnteredRoom', true);
        joinedPeers.forEach((i) => {
          const peer = commit('createPeer', i.id);
          state.peers.update((peers) =>
            peers.add({
              peerId: i.id,
              peer,
              name: i.name,
            })
          );
          dispatch('playVideos');
        });
      });

      // to get and setup a newly joined peer
      socket.on('user-joined', (payload) => {
        const peer = commit('addPeer', payload.signal, payload.userId, payload.name);
        state.peers.update((peers) =>
          peers.add({
            peerId: payload.userId,
            peer,
            name: payload.name,
          })
        );
        dispatch('playVideos');
      });
      socket.on('receiving-returned-signal', (payload) => {
        const peers: Set<any> = get(state.peers);
        const item = Array.from(peers).find((i) => i['peerId'] === payload.id);
        // const item: any = get(g('getPeer', payload.id));
        item.peer.signal(payload.signal);
      });
      socket.on('peer-left', (id) => {
        dispatch('removePeer', id);
        console.log('a peer left');
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
                dispatch('leaveMeet').then(() => dispatch('setEnteredRoom', false))
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
    },
  },
};
