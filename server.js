const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');
const upload = require('express-fileupload');

app.use(upload());
app.use(express.static('client'));
server.listen(PORT);

app.post('/', (req,res)=>{
    if(req.files){
        var file = req.files.filename;
        var name = file.name;
        file.mv('./client//uploads/'+ name, (err)=>{
            if(err) throw err;
            res.send('Done!');
        })
    }
})


const users = {};
let no_of_users = 0;

io.on('connection', socket =>{
    no_of_users++;
    socket.broadcast.emit('user-count',{ no_of_users : no_of_users});
    socket.emit('user-count',{no_of_users: no_of_users});

    socket.on('new-user',name=>{
        users[socket.id] = name;
        socket.emit('account-details',{ name: users[socket.id] } );
        socket.broadcast.emit('user-connected',name);
    })
    socket.on('send-chat-message', msg =>{
        socket.broadcast.emit('chat-message',{ msg: msg , name : users[socket.id] });
    })

    
    socket.on('disconnect', ()=>{
        no_of_users--;
        socket.broadcast.emit('user-count',{ no_of_users : no_of_users});
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    })
    
})