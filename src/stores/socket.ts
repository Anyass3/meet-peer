// import io, { Socket } from 'socket.io-client';
import { get } from 'svelte/store';

export default {
  noStore: ['roomId', 'socket'],
  state: {
    socket: null,
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
    setSocket(state, socket) {
      state.socket = socket;
    },
  },
  actions: {
    joinMeet: ({ state, commit, dispatch, g }) => {
      if (!get(state.userName)) {
        state.notify.warning('Please input your name to join');
        return;
      }

      dispatch('startConnectome').then(() => {
        commit('setJoinRequest', true);

        const socket = g('getSocket');
        window['sk'] = socket;

        socket.on('signal-error', (error) => {
          if (error.code === 'CHANNEL-DISCONNECT' && error.key) dispatch('removePeer', error.key);
          console.error('signal-error', error.msg);
        });

        window.onbeforeunload = () => {
          socket.emit('signal-disconnect');
        };
        window.onoffline = () => {
          state.notify.danger('Oops!!. It seems you just went offline');
          window.ononline = () => {
            state.notify.success('Thankfully!!. It seems you are online again');
          };
        };

        socket.on('ready', () => {
          socket.emit('signal-connect');
        });

        socket.on('signal-connect', () => {
          if (get(state.joinRequest)) {
            socket.emit('join-room', { roomId: state.roomId, peerName: get(state.userName) });
            console.log('emitted join-room');

            commit('setHasLeftWillingly', false);

            dispatch('setReconnecting', false);
          } else dispatch('leaveMeet');

          console.log('signal connected');
        });

        socket.on('room-full', () => {
          state.notify.warning('Sorry room is already full');
          dispatch('leaveMeet');
        });

        // to get and setup peers already in the meet
        socket.on('joined-in-room', (joinedPeers) => {
          if (window) window.scrollTo(0, 0);

          state.notify.info(`${joinedPeers.length} peers are already in meet`);

          dispatch('setEnteredRoom', true);

          joinedPeers.forEach((i) => {
            console.log('creating peer');
            dispatch('createPeer', i.peerId, i.peerName);
          });

          console.log('joinedPeers', joinedPeers);
        });

        // to get and setup a newly joined peer
        socket.on('user-joined', (payload) => {
          console.log('user-joined');
          dispatch('addPeer', payload.signal, payload.peerId, payload.peerName).then(() => {
            state.notify.info(`${payload.peerName} Joined Meet`);
          });
        });
        socket.on('receiving-candidate', (payload) => {
          const item: any = g('getPeer', payload.peerId);
          item.peer.signal(payload.signal);
          console.log('received-candidate');
        });
        socket.on('receiving-returned-signal', (payload) => {
          const item: any = g('getPeer', payload.id);
          item.peer.signal(payload.signal);
          console.log('received-returned-signal');
        });
        socket.on('peer-left', (id) => {
          dispatch('removePeer', id).then((peerName) => {
            state.notify.info(`${peerName} has left meet`);
          });
        });
        socket.on('notAllowed-room-full', (peerName) => {
          state.notify.info(`${peerName} wanted to join but room is already full`);
        });
        socket.on('disconnect', () => dispatch('onDisconnect'));
        // socket.on('reconnect-attempt', (reason) => {
        //   console.log('reconnecting-attempt', reason);
        // });
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
            state.notify.danger(`reconnecting timeout`);
            // console.log('socket.disconnected leaving meet');
          } else {
            state.notify.success(`socket has re-connected re-joining meet`);
            // console.log('socket has re-connected re-joining meet');
          }
        }, 50000);
      } else {
        state.socket.disconnect();
        console.log('socket completed destroyed');
      }
    },
    leaveMeet: ({ state, commit, dispatch }) => {
      dispatch('setJoinRequest', false);
      commit('setHasLeftWillingly', true); //:)sorry

      dispatch('onDisconnect');

      dispatch('setEnteredRoom', false);
      if (get(state.sharingScreen)) dispatch('endScreenShare');
      dispatch('endMediaStream');
      state.notify.info(`You Have Left The Meet`);
    },
  },
};
