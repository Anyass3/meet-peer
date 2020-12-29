let startedVideoStream = false,
  startedAudioStream = false,
  enteredRoom = false,
  userVideo,
  cameraOff = true,
  audioMuted = true,
  hasLeftWillingly = false;

const userID = () => socket.id;
const getID = (id) => 'peer-' + id;

// console.log(socket.id)

let peers = new Set(); // stores a set of {peerID,peer}

peers.get = (id) => Array.from(peers).find((i) => i.peerID === id);

createVideo = (id, name) => {
  if (id) {
    $('<div>')
      .appendParent($('main#grid'))
      .$new('<video>')
      .prop({ id: getID(id), controls: false, muted: true })
      .parent.$('<div>')
      .addClass('item')
      .$('<p>').text = name || 'Anonymous';
    return $.id(getID(id));
  } else return $('video');
};

initVideo = (id, vidStream, options = {}) => {
  let v = $.id(getID(id));
  if (!v.$$) return;
  v.prop({ srcObject: vidStream, ...options }).attr({ playsInline: '', autoplay: '' });
  if (!('srcObject' in v.$$)) v.attr('src', URL.createObjectURL(vidStream));
};

playVideos = () => {
  peers.forEach((i) => {
    if (!i.streaming)
      i.peer.on('stream', (stream) => {
        i.streaming = true;
        if (stream.getVideoTracks()[0].muted) {
          initVideo(i.peerID, new MediaStream([fakeVideoStream, stream.getAudioTracks()[0]]), {
            muted: false,
          });
          // console.log('VidinitVideoeo is muted');
          stream.getVideoTracks()[0].onunmute = () => {
            // console.log('Video has unmuted');
            initVideo(i.peerID, stream, { muted: false });
          };
          stream.getVideoTracks()[0].onmute = () => {
            // console.log('video MUTED Again', i.peerID);
            initVideo(i.peerID, new MediaStream([fakeVideoStream, stream.getAudioTracks()[0]]), {
              muted: false,
            });
          };
        } else {
          console.log('Video not muted');
          initVideo(i.peerID, stream, { muted: false });
        }
      });
  });
};

fakeStream = () => {
  let fakeAudio = () => {
    let ctx = new AudioContext(),
      oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let fakeVideo = ({ width = 640, height = 480 } = {}) => {
    let canvas = document.createElement('canvas');

    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let fakeVideoAudio = (...args) => new MediaStream([fakeVideo(...args), fakeAudio()]);
  window.fakeVideoStream = fakeVideo();
  window.stream = fakeVideoAudio();
  userVideo = createVideo();
  userVideo.prop({ srcObject: stream, muted: true });
};

startStreaming = ({ video = false, audio = false } = {}) => {
  if (video === false && audio === false) return;

  try {
    navigator.mediaDevices.getUserMedia({ video, audio }).then((newStream) => {
      if (!startedVideoStream) startedVideoStream = !!video;
      if (!startedAudioStream) startedAudioStream = !!audio;
      // userVideo.prop({ srcObject: stream, muted: true });
      if (audio && video) {
        window.stream = stream;
        // userVideo.prop({ srcObject: stream, muted: true });
      } else if (video) {
        peers.forEach((p) => {
          p.peer.replaceTrack(stream.getVideoTracks()[0], newStream.getVideoTracks()[0], stream);
        });
        stream.removeTrack(stream.getVideoTracks()[0]);
        stream.addTrack(newStream.getVideoTracks()[0]);
        // userVideo.prop({ srcObject: stream, muted: true });
      } else {
        peers.forEach((p) => {
          p.peer.replaceTrack(stream.getAudioTracks()[0], newStream.getAudioTracks()[0], stream);
        });
        stream.removeTrack(stream.getAudioTracks()[0]);
        stream.addTrack(newStream.getAudioTracks()[0]);
      }
    });
  } catch (err) {
    console.log(err.name, err.message);
  }
};

startCamera = (video = true) => {
  startStreaming({ video });
};
shareScreen = () => {
  // please share your screen
};
startAudio = (audio = true) => {
  startStreaming({ audio });
};

removePeer = (id) => {
  const peerVideo = $.id(getID(id));
  // console.log(peerVideo)
  peerVideo.prop('srcObject', null);
  // peerVideo.detachParent()
  $('main#grid').detach(peerVideo.parent.detach(peerVideo));
  const peer = peers.get(id);
  peer.peer.destroy(); //destroy disconnected peer
  peers.delete(peer);
};

enableAudio = (v = true) => {
  if (!startedAudioStream) startAudio();
  stream.getAudioTracks().forEach((track) => (track.enabled = v));
  audioMuted = !v;
  $('#toggleAudio').toggleClass('enable');
};
enableCamera = (v = true) => {
  if (!startedVideoStream) startCamera();
  stream.getVideoTracks().forEach((track) => (track.enabled = v));
  cameraOff = !v;
  $('#toggleCamera').toggleClass('enable');
};

iceConfig = {
  iceServers: [
    { urls: 'stun:134.209.28.98:3478' },
    {
      urls: 'turn:134.209.28.98:3478',
      username: 'anyass',
      credential: 'te8V62xqLQ2GOEibYHCsRBnNE6M=',
    },
  ],
};
// the new comer signals to old comers
createPeer = (peerID, name) => {
  const peer = new SimplePeer({
    initiator: true,
    trickle: true,
    stream: stream,
    config: iceConfig,
  });

  peer.on('signal', (signal) => {
    // if(!peer.signaledPeer)
    socket.emit('signaling-peer', {
      peerID,
      signal,
      name: $('#p-name-input').val,
    });

    console.log('signaling peer=>id', peerID, signal);
  });
  peers.add({
    peerID,
    peer,
    name,
  });
  // socket.on('newUser', signal => {
  //     peer.signal(signal)
  //     console.log('newUser entered',signal)
  // })
};

// old comers waiting for signals
addPeer = (incomingSignal, peerID, name) => {
  const peer = new SimplePeer({
    initiator: false,
    trickle: true,
    stream: stream,
    config: iceConfig,
  });
  // peer will not signal now except after
  // being signaled by this user
  peer.on('signal', (signal) => {
    socket.emit('returning-signal', { peerID, signal, name });
    console.log('replying to a new signal id=>', peerID, signal);
  });
  peers.add({
    peerID,
    peer,
    name,
  });
  // peer.on('stream', stream=>{
  //     console.log(stream)
  //     initVideo(userID,stream)
  // })
  // socket.on('newUser', signal => {
  //     peer.signal(signal)
  //     console.log('newUser entered',signal)
  // })
  peer.signal(incomingSignal);
};

leaveMeet = () => {
  socket.disconnect();
};

joinMeet = () => {
  window.socket = io('/');
  socket.on('connect', () => {
    if (enteredRoom) {
      socket.emit('join-room', { roomID, name: $('#p-name-input').val });
      $('#joinMeet').hide().parent.hide({ delay: 0 });
      $('#p-name-input').addClass('d-none');
      $('#p-name').show().text = ($('#p-name-input').val || 'Anonymous') + ' (Me)';
      userVideo.id = getID(userID());
      $('#leave').show();
      $('#joinMeet').rmAttr('disabled').text = 'Enter Meet Now';
      console.log('socket connected');
      hasLeftWillingly = false;
      $('#leave').parent.$('p').hide();
    } else leaveMeet();
  });

  socket.on('room-full', () => {
    alert('Sorry room is already full');
    leaveMeet();
  });

  // to get and setup peers already in the meet
  socket.on('joined-in-room', (joinedPeers) => {
    console.log(`${joinedPeers.length} peers are already in meet`);
    joinedPeers.forEach((p) => {
      createPeer(p.id, p.name);
      createVideo(p.id, p.name);
      playVideos();
      console.log('connected to user', p.name);
    });
  });

  // to get and setup a newly joined peer
  socket.on('user-joined', (payload) => {
    addPeer(payload.signal, payload.peerID, payload.name);
    console.log('user-joined', payload.name);
    // console.log('user-joined','add')
    createVideo(payload.peerID, payload.name);
    playVideos();
  });
  socket.on('receiving-candidate', (payload) => {
    const item = peers.get(payload.peerID);
    item.peer.signal(payload.signal);
    console.log('received-candidate', payload.signal);
  });
  socket.on('receiving-returned-signal', (payload) => {
    const item = peers.get(payload.id);
    item.peer.signal(payload.signal);
    console.log('received-returned-signal', payload.signal);
  });
  socket.on('peer-left', (id) => {
    removePeer(id);
    console.log('a peer left');
  });
  socket.on('disconnect', () => {
    peers.forEach((p) => {
      removePeer(p.peerID);
    });
    peers.clear();
    console.log('hasLeftWillingly', hasLeftWillingly);
    if (!hasLeftWillingly) {
      console.log('hehehehh');
      $('#leave').parent.$('p').show();
      setTimeout(() => {
        console.log('socket hmmm');
        if (socket.disconnected) {
          $('#leave').parent.$('p').hide();
          $('#leave').$$.click();
        }
      }, 20000);
    }

    console.log('socket disconnected');
  });
};

// initiator
$(() => {
  fakeStream();
  $('#joinMeet').throttle(
    'click',
    (ev) => {
      joinMeet();
      enteredRoom = true;
      $('#joinMeet').attr('disabled', '').text = 'Connecting...';
    },
    5000
  );
  $('#leave').throttle('click', (ev) => {
    hasLeftWillingly = true;
    leaveMeet();
    $('#leave').hide();
    $('#joinMeet').show().parent.show();
    $('#p-name').addClass('d-none');
    $('#p-name-input').show();
    enteredRoom = false;
  });
  $('#toggleCamera').click((e) => {
    enableCamera(cameraOff);
    $(e.target).toggleClass('enabled');
  });
  $('#toggleAudio').click((e) => {
    enableAudio(audioMuted);
    $(e.target).toggleClass('enabled');
  });
});
