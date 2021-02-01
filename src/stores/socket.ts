export default {
  noStore: ['roomId', 'socket'],
  state: {
    socket: {},
    joinRequest: false,
    enteredRoom: false,
    connected: false,
    reconnecting: false,
    reconnectingTimeout: 30000,
    hasLeftWillingly: false,
    userName: '',
    roomId: '',
  },
  getters: {
    getUserId: (state) => {
      return state.socket.id || 'userVideo';
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
        socket.on('settings', ({ reconnectingTimeout }) => {
          // this is incase when having a decentralized meeting the settings can be the same
          dispatch('setReconnectingTimeout', reconnectingTimeout);
        });

        socket.on('ready', () => {
          // this is because ready doesn't always mean it's connected to server
          socket.emit('signal-connect'); // this makes sure that we are infact connected to server

          const interval = setInterval(() => {
            socket.emitLocal('check-connect');
            // this is useful for reconection
            // we check before reconnecting
          }, 1000);
          socket.on('signal-connect', () => {
            clearInterval(interval);
          });
        });

        socket.on('signal-connect', () => {
          // in here means we are actually connected to server
          // so we can start signaling now

          dispatch('setConnected', true);

          if (state.joinRequest.get()) {
            // if (!state.reconnecting.get())
            socket.emit('join-room', { roomId: state.roomId, peerName: state.userName.get() });
            // console.log('emitted join-room');

            commit('setHasLeftWillingly', false);

            commit('setReconnecting', false);
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
          dispatch('setConnected', false);
          // if (reason === 'reconnecting') return;
          console.log('socket disconnected');
          //:)sorry
          socket.on('check-connect', () => {
            // if disconnected we check after onready every second
            // if signal not connected we reconnect it.
            if (!state.connected.get()) socket.reconnect();
            console.log('check-connect:: connected', state.connected.get());
          });

          if (!state.hasLeftWillingly.get()) {
            // socket.emit('reconnecting');
            dispatch('setReconnecting', true);
            console.log('Has not left willingly');

            setTimeout(() => {
              if (state.socket.disconnected && !state.connected.get()) {
                dispatch('setReconnecting', false).then(() => dispatch('leaveMeet'));
                state.notify.danger(`Reconnecting Timeout`);
                // console.log('socket.disconnected leaving meet');
              } //else if (!state.connected.get()) {
              // socket.reconnect();
              //   console.log('socket.reconnected');
              // }
            }, state.reconnectingTimeout.get());
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
