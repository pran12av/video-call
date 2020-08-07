//const { PeerServer } = require("peer");

//const e = require("express");

var name= prompt("Type in Your name", "Bolo") || "user";
console.log(name);

let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;
const socket = io('/');

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

})


peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video =document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);

}

// let text= $('input').val();

// console.log(text);

$('html').keypress(e => {

    
    if(e.which == 13 )
    {
        let text= $('input');
        //console.log(text.length);

        if(text.val().length !== 0){
        socket.emit('message', text.val(), name);}
        text.val('');
    }
    
});

socket.on('chat-message', (msg,username) => {
    //console.log("here");
    $('ul').append(`<li class="message"><b style = "color: deeppink;">${username}</b></br> ${msg}</li>`);
})

const scrollToBottom = () =>{
    let d= $('.main_chat');
    d.scrollTop(d.prop("scrollHeight"));
}