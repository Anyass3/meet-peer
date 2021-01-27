import colors from 'colors';
import * as connectome from 'connectome/server';
import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

// NOTE: _remotePubkeyHex===key===peerId

const { newServerKeypair: newKeypair, ConnectionsAcceptor } = connectome;

import { MirroringStore } from 'connectome/stores';

const MAX_PEERS = 100; // this is the max number allowed for chat room.

const state = { rooms: [] };

// import makeApi from './makeApi';

function makeApi(store) {
  const { state } = store;

  state.rooms = state.rooms || [];

  return {
    getRoom(roomId) {
      return state.rooms.find((room) => room.roomId === roomId);
    },
    getPeerRoom(peerId) {
      return state.rooms.find((room) => !!room.participants.find((peer) => peer.peerId === peerId));
    },
    join({ roomId, peerId, peerName }) {
      const room = this.getRoom(roomId);

      if (room) {
        room.participants = room.participants || [];

        if (!room.participants.find((peer) => peer.peerId === peerId)) {
          room.participants.push({ peerId, peerName });
          store.announceStateChange();
        }
      } else {
        state.rooms.push({ roomId, participants: [{ peerId, peerName }] });
        store.announceStateChange();
      }
    },
    leave({ roomId, peerId }) {
      const room = this.getRoom(roomId) || this.getPeerRoom(peerId);
      if (room && room.participants) {
        room.participants = room.participants.filter((peer) => peer.peerId !== peerId);
        store.announceStateChange();
      }
    },
  };
}

function init({ program }) {
  const store = new MirroringStore(state);

  let channelNum = 0;

  const api = makeApi(store);

  function onConnect({ channel }) {
    channelNum++;
    // channel.attachObject('dmtapp:meet:rooms', api);
    console.log(colors.blue(`channel ${channelNum}`));
  }

  const channelList = program.registerProtocol({
    protocol: 'dmtapp',
    lane: 'meet',
    onConnect,
  });

  const makeSocket = (key) => {
    class _socket_ {
      constructor(key) {
        this.channel = this.get(key, false);
        this.key = key;
      }
      in_room(key) {
        return this.room.participants.find((participant) => participant.peerId === key);
      }
      get room() {
        return api.getPeerRoom(this.key) || { participants: [] };
      }

      get(key, in_room = true) {
        const channel = channelList.channels.find((channel) => channel._remotePubkeyHex === key);
        if (in_room) {
          return this.in_room(key) ? channel : undefined;
        }
        return channel;
      }

      on(signal, fn) {
        this.channel.on(signal, fn);
      }

      emit(signal, data) {
        this.channel.send({ signal, data });
      }

      to(key) {
        const channel = this.get(key);
        const This = this;
        return {
          emit(signal, data) {
            if (!channel) {
              api.leave({ peerId: key });
              This.emit('signal-error', {
                key,
                code: 'CHANNEL-DISCONNECT',
                msg: `NOT in the room - channel key: ${key}`,
              });
              console.log('signal-error');
              return;
            }
            channel.send({ signal, data });
          },
        };
      }

      broadcast(signal, data) {
        this.room.participants.forEach((participant) => {
          const channel = this.get(participant.peerId);
          if (!channel) {
            this.emit('signal-error', {
              key,
              code: 'CHANNEL-DISCONNECT',
              msg: `NOT in the room - channel key: ${key}`,
            });
            console.log('signal-error');
            return;
          }
          if (channel._remotePubkeyHex !== this.key) channel.send({ signal, data });
        });
      }
    }
    return new _socket_(key);
  };

  // store.mirror(channelList);

  channelList.on('new_channel', (channel) => {
    const socket = makeSocket(channel._remotePubkeyHex);

    socket.on('signal-connect', () => {
      socket.emit('signal-connect');
    });

    socket.on('join-room', ({ roomId, peerName }) => {
      console.log('join-room: ', peerName);

      if (api.getRoom(roomId)) {
        const len = api.getRoom(roomId).participants.length;
        // console.log(len)
        // console.log('checking for whether room is full')
        if (len >= MAX_PEERS) {
          // console.log('room is full')
          socket.emit('room-full');
          api
            .getRoom(roomId)
            .participants.forEach((s) => socket.to(s.id).emit('notAllowed-room-full', peerName));
          return;
        }
        api.join({ peerId: socket.key, peerName, roomId });
      } else api.join({ peerId: socket.key, peerName, roomId });
      const peers = api
        .getRoom(roomId)
        .participants.filter((participant) => participant.peerId !== socket.key);
      // console.log(peers)
      socket.emit('joined-in-room', peers);
    });
    socket.on('signaling-peer', (payload) => {
      const signaledPeer = socket.to(payload.peerId);
      console.log('signaling-peer');
      if (payload.signal.type === 'offer')
        signaledPeer.emit('user-joined', {
          signal: payload.signal,
          peerId: socket.key,
          peerName: payload.peerName,
        });
      else
        signaledPeer.emit('receiving-candidate', {
          peerId: socket.key,
          signal: payload.signal,
        });
    });
    socket.on('returning-signal', (payload) => {
      socket.to(payload.peerId).emit('receiving-returned-signal', {
        signal: payload.signal,
        id: socket.key,
        peerName: payload.peerName,
      });
      console.log('returning-signal', payload.peerName);
    });
    socket.on('signal-disconnect', () => {
      socket.broadcast('peer-left', socket.key);
      api.leave({ peerId: socket.key });
      console.log('signal-disconnect');
      socket.emit('disconnect');
    });
  });
  // console.log('store', store, channelList);
}

function start({ port }) {
  // console.log(newKeypair);
  // define connections acceptor
  const keypair = newKeypair();
  const acceptor = new ConnectionsAcceptor({ port, keypair });

  acceptor.on('protocol_added', ({ protocol, lane }) => {
    console.log(`💡 Connectome protocol ${colors.cyan(protocol)}/${colors.cyan(lane)} ready.`);
    // console.log('acceptor', acceptor);
  });

  init({ program: acceptor });

  // start websocket server
  acceptor.start();

  // console.log('acceptor', acceptor);

  console.log(
    colors.green(`Connectome → Running websocket connections acceptor on port ${port} ...`)
  );
}
start({ port: 3700 });

// /connectome

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const express = require('express');

express()
  .use(compression({ threshold: 0 }), sirv('static', { dev }), sapper.middleware())
  .listen(PORT);
