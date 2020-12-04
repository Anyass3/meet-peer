
let startedVideoStream=false,startedAudioStream=false,
userVideo,cameraOff=true,audioMuted=true;

const userID =()=>socket.id
const getID=(id)=>'peer-'+id
$(()=>{
    fakeStream()
    $('#joinMeet').click((ev)=>{
        joinMeet()
        $(ev.target).hide()
    })
    $('#leave').click(ev=>{
        leaveMeet()
        $('#leave').addClass('d-none')
    })
    $('#toggleCamera').click((e)=>{
        enableCamera(cameraOff)
        $(e.target).toggleClass('enabled')
    })
    $('#toggleAudio').click((e)=>{
        enableAudio(audioMuted)
        $(e.target).toggleClass('enabled')
    })
})
// console.log(socket.id)

const peers=[],// stores a list of {peerID,peer}
peersObj={};// stores key(peerID) & value(peer)


createVideo=(id)=>{
    if(id)
    return $('<div>').appendParent($('main#grid')).$new('<video>')
    .prop({id:getID(id),controls:false,muted:true})
    else return $('video')
    // if(!id).append(video).appendParent($('main#grid'))
    // .css({position:'relative'}).$new('<a>',2)
    // .css({position:absolute,bottom:0});
    // else video.appendParent($('main#grid'))
    // return video
}

initVideo=(id, vidStream,options={})=>{
    $.id(getID(id)).prop({srcObject:vidStream,playsInline:true,...options}).$$.play()
    //add old browser support
}

playVideos=()=>{
    peers.forEach(i=>{
        if(!i.streaming)
        i.peer.on('stream',stream=>{
            i.streaming=true;
            initVideo(i.peerID, stream, {muted:false})
        });
    })
}


fakeStream=()=>{
    let fakeAudio = () => {
        let ctx = new AudioContext(), oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        return Object.assign(dst.stream.getAudioTracks()[0], {enabled: false});
      }
      
      let fakeVideo = ({width = 640, height = 480} = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), {width, height});
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], {enabled: false});
      }
      
      let fakeVideoAudio = (...args) => new MediaStream([fakeVideo(...args), fakeAudio()]);
      
      window.stream = fakeVideoAudio();
      userVideo=createVideo()
}

startStreaming = ({video=false,audio=false}={})=>{
    if(video===false&&audio===false)return;
    
    try {
        navigator.mediaDevices.getUserMedia({video,audio})
        .then(newStream=>{
            if(!startedVideoStream)startedVideoStream=!!video;
            if(!startedAudioStream)startedAudioStream=!!audio;
            if(audio&&video){
                 window.stream=stream;
                 userVideo.prop({srcObject:stream,muted:true})
                }
            else if(video){
                peers.forEach(p=>{
                    p.peer.replaceTrack(
                        stream.getVideoTracks()[0],
                        newStream.getVideoTracks()[0],
                        stream)
                });
                stream.removeTrack(stream.getVideoTracks()[0])
                stream.addTrack(newStream.getVideoTracks()[0])
                userVideo.prop({srcObject:stream,muted:true})
            }
            else {
                peers.forEach(p=>{
                    p.peer.replaceTrack(
                        stream.getAudioTracks()[0],
                        newStream.getAudioTracks()[0],
                        stream)
                    });
                    stream.removeTrack(stream.getAudioTracks()[0])
                    stream.addTrack(newStream.getAudioTracks()[0])
            }
        })
    } catch (err) {console.log(err.name, err.message)}
}

startCamera=(video=true)=>{
    startStreaming({video});

}

startAudio=(audio=true)=>{
    startStreaming({audio})
}

// $("button#start").click(()=>startStreaming())

removePeer=(id)=>{
    const peerVideo=$.id(getID(id))
    peerVideo.rmAttr('src').$$.pause()

    // peerVideo.detachParent()
    $('main#grid').detach(peerVideo.parent.detach(peerVideo))
}


enableAudio = (v=true)=>{
    if(!startedAudioStream) startAudio()
    stream.getAudioTracks().forEach(track => track.enabled=v);
    audioMuted=!v
    $('#toggleAudio').toggleClass('enable')
}
enableCamera =(v=true)=>{
    if(!startedVideoStream) startCamera()
    stream.getVideoTracks().forEach(track => track.enabled=v);
    cameraOff=!v
    $('#toggleCamera').toggleClass('enable')
}
// the new comer signals to old comers
createPeer=(peerID, userID)=>{
    const peer=new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
    });

    peer.on("signal", signal=>{
        console.log('signaling-peer', signal)
        // if(!peer.signaledPeer)
        socket.emit('signaling-peer',{peerID, userID, signal});

        peer.signaledPeer=true
    })
    // peer.on('stream', stream=>{
    //     initVideo(userID,stream)
    // })
    // socket.on('newUser', signal => {
    //     peer.signal(signal)
    //     console.log('newUser entered',signal)
    // })
    return peer;
}

// old comers waiting for signals
addPeer=(incomingSignal, userID)=>{
    const peer=new SimplePeer({
        initiator: false,
        trickle: false,
        stream: stream,
    });
    // peer will not signal now except after 
    // being signaled by this user
    peer.on("signal", signal=>{
        console.log('signal',signal)
        socket.emit('returning-signal',{userID, signal})
    })
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
}


leaveMeet=()=>socket.disconnect();

joinMeet=()=>{
    window.socket=io('/')
    socket.on('connect',()=>{
        console.log('socket connected')
        userVideo.id=getID(userID())
        $('#leave').rmClass('d-none')
    })

    socket.emit("join-room",roomID)

        socket.on('room-full',()=>{
            alert('Sorry room is already full')
            leaveMeet()
        })
        
        // to get and setup peers already in the meet
        socket.on('joined-in-room',users=>{
            users.forEach(id=>{
                const peer= createPeer(id, userID())
                peers.push({
                    peerID: id,
                    peer
                });peersObj[id]=peer
                createVideo(id)
                playVideos()
            })
        })

        // to get and setup a newly joined peer
        socket.on('user-joined', payload=>{
            const peer=addPeer(payload.signal, payload.userID);
            peers.push({
                peerID: payload.userID,
                peer
            });peersObj[payload.userID]=peer;
            // console.log('user-joined','add')
            createVideo(payload.userID)
            playVideos()
        })
        socket.on('receiving-returned-signal', payload=>{
            const item = peers.find(i=>i.peerID===payload.id);
            item.peer.signal(payload.signal);
            // playVideos()
        })

    // socket.on('user-connected',({userID,data})=>{
    //     console.log('user-connected',userID)
    //     console.log('data',data)
    //     createVideo(userID)
    // })
    socket.on('peer-left',id=>{
        console.log('a peer left')
        removePeer(id)
        peersObj[id].destroy() //destroy disconnected peer
    })
    socket.on('disconnect',()=>{
        peers.forEach(p=>{
            console.log(p.peerID)
            removePeer(p.peerID)
            p.peer.destroy()
        })
        $('#joinMeet').show()
    })

}