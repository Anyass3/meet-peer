const socket=io('/')
const userID =()=>socket.id
const getID=(id)=>'peer-'+id
// console.log(socket.id)
socket.on('connect',()=>{
    console.log('connected')
})
const peers=[],// stores a list of {peerID,peer}
peersObj={};// stores key(peerID) & value(peer) 
$(()=>startStreaming())
createVideo=(id)=>{
    return $.new('video')
    .prop({id:getID(id),controls:false,muted:true})
    .css({background:'gray'})
    .appendParent($('main#grid'))
}
removePeer=(id)=>{
    const peerVideo=$.id(getID(id))
    .rmAttr('src')
    // .css({disp:'gray'})
    $('main#grid').detach(peerVideo)
    peersObj[id].destroy()
}
startVideo=(id, vidStream,options={})=>{
    $.id(getID(id)).prop({srcObject:vidStream,...options}).$$.play()
    //add old browser support
}

playVideos=()=>{
    peers.forEach(i=>{
        if(!i.streaming)
        i.peer.on('stream',stream=>{
            i.streaming=true;
            startVideo(i.peerID, stream, {muted:false})
        });
    })
}
startStreaming = ({video=true,audio=true}={})=>{
    try {
        navigator.mediaDevices.getUserMedia({video,audio})
        .then(stream=>{
            window.stream=stream
            createVideo(userID())
            socket.emit("join-room",roomID)
            socket.on('room-full',()=>alert('Sorry Room is already full'))
            // to get and setup follow peers already in the meet
            socket.on('joined-in-room',users=>{
                startVideo(socket.id,stream)
                users.forEach(id=>{
                    const peer= createPeer(id, userID(), stream)
                    peers.push({
                        peerID: id,
                        peer
                    });peersObj[id]=peer
                    createVideo(id)
                    playVideos()
                })
            })

            // to get and setup a new joined user
            socket.on('user-joined', payload=>{
                const peer=addPeer(payload.signal, payload.userID, stream);
                peers.push({
                    peerID: payload.userID,
                    peer
                });peersObj[payload.userID]=peer;
                console.log('user-joined','add')
                createVideo(payload.userID)
                playVideos()
            })
            socket.on('receiving-returned-signal', payload=>{
                const item = peers.find(i=>i.peerID===payload.id);
                item.peer.signal(payload.signal);
                // playVideos()
            })

        })
    } catch (err) {
        console.log(err.name, err.message)
    };
}
// $("button#start").click(()=>startStreaming())

// for users already in the meet
createPeer=(peerID, userID, stream)=>{
    const peer=new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
    });

    peer.on("signal", signal=>{
        socket.emit('signaling-peer',{peerID, userID, signal})
    })
    // peer.on('stream', stream=>{
    //     startVideo(userID,stream)
    // })
    // socket.on('newUser', signal => {
    //     peer.signal(signal)
    //     console.log('newUser entered',signal)
    // })
    return peer;
}

// for newly joined users
addPeer=(incomingSignal, userID, stream)=>{
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
    //     startVideo(userID,stream)
    // })
    // socket.on('newUser', signal => {
    //     peer.signal(signal)
    //     console.log('newUser entered',signal)
    // })
    peer.signal(incomingSignal);
    return peer;
}


// socket.on('user-connected',({userID,data})=>{
//     console.log('user-connected',userID)
//     console.log('data',data)
//     createVideo(userID)
// })
socket.on('peer-left',id=>{
    console.log('a peer left')
    removePeer(id)
})