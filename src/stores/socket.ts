// import { Socket } from 'socket.io'
import io, { Socket } from 'socket.io-client';
// import type { Store } from './interface'
import { get } from 'svelte/store';

export default {
  state: {
    socket: null,
    // socket_id: '',
    // user_id: '',
    enteredRoom: false,
  },
  getters: {
    getUserId: (state) => {
      const socket: Socket = get(state.socket);
      return socket ? socket['id'] : '';
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
        if (get(state.enteredRoom)) {
          socket.emit('join-room', { roomId, name: get(state.userName) });
          //***/ userVideo.id = getId(userId());
          console.log('socket connected');
          commit('setHasLeftWillingly', false);
        } else dispatch('leaveMeet');
      });

      socket.on('room-full', () => {
        alert('Sorry room is already full');
        commit('leaveMeet');
      });

      // to get and setup peers already in the meet
      socket.on('joined-in-room', (joinedPeers) => {
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
          // dispatch('setPeers', peers).then(() => );
          console.log('joined-in-room', i.name || 'Anonymous');
          // createVideo(i.id, i.name);
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
        // dispatch('setPeers', peers).then(() => );
        console.log('user-joined', payload.name || 'Anonymous');
        // console.log('user-joined','add')
        // createVideo(payload.userId, payload.name);
      });
      socket.on('receiving-returned-signal', (payload) => {
        const item: any = get(g('getPeer', payload.id));
        item.peer.signal(payload.signal);
        dispatch('playVideos');
      });
      socket.on('peer-left', (id) => {
        dispatch('removePeer', id);
        console.log('a peer left');
      });
      socket.on('disconnect', () => {
        const peers: any = get(state.peers);
        peers.forEach((p) => {
          dispatch('removePeer', p.peerId);
        });
        peers.clear();
        if (!get(state.hasLeftWillingly)) {
          // $('#leave').parent.$('p').show();
          setTimeout(() => {
            if (socket.disconnected) {
              // $('#leave').parent.$('p').hide();
              // $('#leave').$$.click();
            }
          }, 20000);
        }

        console.log('socket disconnected');
      });
    },
    leaveMeet: ({ state }) => {
      const socket: Socket = get(state.socket);
      socket.disconnect();
    },
  },
};
