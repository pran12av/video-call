const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4 : uuidv4} = require('uuid');

const io = require('socket.io')(server);

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});


app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get( '/', (req,res) => {
    res.redirect(`/${uuidv4()}`);
})


app.get( '/:room', (req,res) => {
    res.render('room', {roomId: req.params.room});
})
let test;
io.on('connection', socket => {
    socket.on( 'join-room', (roomId, userId) => {
        test=roomId;
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        
        socket.on( 'message', (text, name) => {
            //console.log("rec");
            io.to(roomId).emit('chat-message', text, name);
        })
    
    })

    
   
})


server.listen(process.env.PORT || 3030);