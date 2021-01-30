export default {
  noStore: ['roomId', 'socket'],
  state: {
    socket: {},
    joinRequest: false,
    enteredRoom: false,
    reconnecting: false,
    hasLeftWillingly: false,
    userName: '',
    roomId: '',
  },
  getters: {
    getUserId: (state) => {
      return state.socket ? state.socket['id'] : 'userVideo';
    },
    getUserVideoId(this, state) {
      return 'user-' + this.getUserId(state);
    },
    getUserScreen(state) {
      return Array.from(state.screens.get()).find((i) => i['id'] === 'userVideo-share-screen');
    },
  },
  actions: {
    joinMeet: ({ state, commit, dispatch, g }) => {
      if (!state.userName.get()) {
        state.notify.warning('Please input your name to join');
        return;
      }

      dispatch('startConnectome').then(() => {
        commit('setJoinRequest', true);

        const socket = g('getSocket');
        // window['sk'] = socket;

        socket.on('signal-error', (error) => {
          if (error.code === 'CHANNEL-DISCONNECT' && error.key) dispatch('removePeer', error.key);
          console.error('signal-error', error.msg);
        });

        window.onbeforeunload = () => {
          socket.emit('signal-disconnect');
        };
        window.onoffline = () => {
          state.notify.danger('Oops!!. It seems you just went offline');
          socket.on('peer-error', () => {
            if (state.peers.get()['size'] === 0 && socket.connected) {
              console.log('socket is still connected');
              socket.on('online', () => {
                socket.reconnect();
              });
            }
          });

          window.ononline = () => {
            state.notify.success('Thankfully!!. It seems you are back online');
            socket.emitLocal('online');
            // socket.emit('am-back-online');
          };
        };

        socket.on('ready', () => {
          if (state.joinRequest.get()) {
            socket.emit('join-room', { roomId: state.roomId, peerName: state.userName.get() });
            // console.log('emitted join-room');

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
          // console.log('user-joined');
          dispatch('addPeer', payload.signal, payload.peerId, payload.peerName).then(() => {
            state.notify.info(`${payload.peerName} Joined Meet`);
          });
        });
        socket.on('receiving-candidate', (payload) => {
          const item: any = g('getPeer', payload.peerId);
          item.peer.signal(payload.signal);
          // console.log('received-candidate');
        });
        socket.on('receiving-returned-signal', (payload) => {
          const item: any = g('getPeer', payload.id);
          item.peer.signal(payload.signal);
          // console.log('received-returned-signal');
        });
        socket.on('peer-disconnect', (id) => {
          dispatch('removePeer', id).then((peerName) => {
            state.notify.info(`${peerName} has left meet`);
          });
        });
        socket.on('notAllowed-room-full', (peerName) => {
          state.notify.info(`${peerName} wanted to join but room is already full`);
        });
        socket.on('disconnect', (reason) => {
          if (reason === 'reconnecting') return;
          console.log('socket disconnected');

          if (!state.hasLeftWillingly.get()) {
            socket.emit('signal-disconnect');
            dispatch('setReconnecting', true);
            console.log('Has not left willingly');

            setTimeout(() => {
              if (state.socket.disconnected) {
                dispatch('setReconnecting', false).then(() => dispatch('leaveMeet'));
                state.notify.danger(`Reconnecting Timeout`);
                // console.log('socket.disconnected leaving meet');
              } else socket.reconnect();
            }, 30000);
          } else {
            console.log('socket completed destroyed');
          }
        });
      });
    },
    leaveMeet: ({ state, commit, dispatch }) => {
      dispatch('setJoinRequest', false);
      commit('setHasLeftWillingly', true); //:)sorry

      dispatch('removeAllPeers');
      state.socket.disconnect();

      dispatch('setEnteredRoom', false);
      if (state.sharingScreen.get()) dispatch('endScreenShare');
      dispatch('endMediaStream');
      state.notify.success(`You have successfully left the meet`, 7000);
    },
  },
};
