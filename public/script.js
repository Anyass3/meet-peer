let startedVideoStream = false,
  startedAudioStream = false,
  enteredRoom = false,
  userVideo,
  cameraOff = true,
  audioMuted = true,
  hasLeftWillingly = false;

const userID = () => socket.id;
const getID = (id) => "peer-" + id;

// console.log(socket.id)

let peers = new Set(); // stores a set of {peerID,peer}

peers.get = (id) => Array.from(peers).find((i) => i.peerID === id);

createVideo = (id,name) => {
  if (id){
     $("<div>")
      .appendParent($("main#grid"))
      .$new("<video>")
      .prop({ id: getID(id), controls: false, muted: true })
      .parent.$('<div>').addClass('item').$('<p>').text=name||'Anonymous';
    return  $.id(getID(id))
  }
  else return $("video");
};

initVideo = (id, name, vidStream, options = {}) => {
  $.id(getID(id))
    .prop({ srcObject: vidStream, ...options })
    .attr({ playsInline: "", autoplay: "" });
  //add old browser support
};

playVideos = () => {
  peers.forEach((i) => {
    if (!i.streaming)
      i.peer.on("stream", (stream) => {
        i.streaming = true;
        initVideo(i.peerID, i.name, stream, { muted: false });
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
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let fakeVideoAudio = (...args) =>
    new MediaStream([fakeVideo(...args), fakeAudio()]);

  window.stream = fakeVideoAudio();
  userVideo = createVideo();
};

startStreaming = ({ video = false, audio = false } = {}) => {
  if (video === false && audio === false) return;

  try {
    navigator.mediaDevices.getUserMedia({ video, audio }).then((newStream) => {
      if (!startedVideoStream) startedVideoStream = !!video;
      if (!startedAudioStream) startedAudioStream = !!audio;
      if (audio && video) {
        window.stream = stream;
        userVideo.prop({ srcObject: stream, muted: true });
      } else if (video) {
        peers.forEach((p) => {
          p.peer.replaceTrack(
            stream.getVideoTracks()[0],
            newStream.getVideoTracks()[0],
            stream
          );
        });
        stream.removeTrack(stream.getVideoTracks()[0]);
        stream.addTrack(newStream.getVideoTracks()[0]);
        userVideo.prop({ srcObject: stream, muted: true });
      } else {
        peers.forEach((p) => {
          p.peer.replaceTrack(
            stream.getAudioTracks()[0],
            newStream.getAudioTracks()[0],
            stream
          );
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
  // startStreaming({video:{
  //     mandatory:{
  //         chromeMediaSource: 'screen'
  //     }
  // }})
};
startAudio = (audio = true) => {
  startStreaming({ audio });
};

removePeer = (id) => {
  const peerVideo = $.id(getID(id));
  // console.log(peerVideo)
  peerVideo.prop("srcObject", null);
  // peerVideo.detachParent()
  $("main#grid").detach(peerVideo.parent.detach(peerVideo));
  const peer = peers.get(id);
  peer.peer.destroy(); //destroy disconnected peer
  peers.delete(peer);
};

enableAudio = (v = true) => {
  if (!startedAudioStream) startAudio();
  stream.getAudioTracks().forEach((track) => (track.enabled = v));
  audioMuted = !v;
  $("#toggleAudio").toggleClass("enable");
};
enableCamera = (v = true) => {
  if (!startedVideoStream) startCamera();
  stream.getVideoTracks().forEach((track) => (track.enabled = v));
  cameraOff = !v;
  $("#toggleCamera").toggleClass("enable");
};
// the new comer signals to old comers
createPeer = (peerID) => {
  const peer = new SimplePeer({
    initiator: true,
    trickle: false,
    stream: stream,
  });

  peer.on("signal", (signal) => {
    // console.log('signaling-peer', signal)
    // if(!peer.signaledPeer)
    socket.emit("signaling-peer", { peerID, signal, userID:userID(), name:$('#p-name-input').val });

    peer.signaledPeer = true;
  });
  // peer.on('stream', stream=>{
  //     initVideo(userID,stream)
  // })
  // socket.on('newUser', signal => {
  //     peer.signal(signal)
  //     console.log('newUser entered',signal)
  // })
  return peer;
};

// old comers waiting for signals
addPeer = (incomingSignal, userID, name) => {
  const peer = new SimplePeer({
    initiator: false,
    trickle: false,
    stream: stream,
  });
  // peer will not signal now except after
  // being signaled by this user
  peer.on("signal", (signal) => {
    // console.log('signal',signal)
    socket.emit("returning-signal", { userID, signal, name });
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
  return peer;
};

leaveMeet = () => {
  socket.disconnect();
};

joinMeet = () => {
  window.socket = io("/");
  socket.on("connect", () => {
    if (enteredRoom) {
      $("#joinMeet").hide().parent.hide();
      socket.emit("join-room", {roomID, name:$('#p-name-input').val});
      $('#p-name-input').hide();
      $('#p-name').show().text=($('#p-name-input').val||'Anonymous')+' (me)'
      userVideo.id = getID(userID());
      $("#leave").show();
      $("#joinMeet").text="Enter Meet Now";
      console.log("socket connected");
    } else leaveMeet();
  });

  socket.on("room-full", () => {
    alert("Sorry room is already full");
    leaveMeet();
  });

  // to get and setup peers already in the meet
  socket.on("joined-in-room", joinedPeers => {
    joinedPeers.forEach(i => {
      const peer = createPeer(i.id);
      peers.add({
        peerID: i.id,
        peer,
        name: i.name
      });
      console.log("joined-in-room",i.name)
      createVideo(i.id,i.name);
      playVideos();
    });
  });

  // to get and setup a newly joined peer
  socket.on("user-joined", (payload) => {
    const peer = addPeer(payload.signal, payload.userID, payload.name);
    peers.add({
      peerID: payload.userID,
      peer,
      name: payload.name
    });
    console.log("user-joined",payload.name)
    // console.log('user-joined','add')
    createVideo(payload.userID,payload.name);
    playVideos();
  });
  socket.on("receiving-returned-signal", (payload) => {
    const item = peers.get(payload.id);
    item.peer.signal(payload.signal);
    // playVideos()
  });
  socket.on("peer-left", (id) => {
    removePeer(id);
    console.log("a peer left");
  });
  socket.on("disconnect", () => {
    peers.forEach((p) => {
      removePeer(p.peerID);
    });
    peers.clear();
    if (hasLeftWillingly)
      setTimeout(() => {
        if (socket.disconnected) {
          $("#leave").hide();
          $("#joinMeet").show().parent.show();
          $('#p-name-input').show();
          $('#p-name').hide()
        }
      }, 30000);

    console.log("socket disconnected");
  });
};

// initiator
$(() => {
  fakeStream();
  $("#joinMeet").throttle(
    "click",
    (ev) => {
      joinMeet();
      enteredRoom = true;
      $("#joinMeet").text="Joining..."
    },
    5000
  );
  $("#leave").throttle("click", (ev) => {
    leaveMeet();
    $("#leave").hide();
    $("#joinMeet").show().parent.show();
    $('#p-name-input').show();
    $('#p-name').hide()
    hasLeftWillingly = true;
    enteredRoom = false;
  });
  $("#toggleCamera").click((e) => {
    enableCamera(cameraOff);
    $(e.target).toggleClass("enabled");
  });
  $("#toggleAudio").click((e) => {
    enableAudio(audioMuted);
    $(e.target).toggleClass("enabled");
  });
});
