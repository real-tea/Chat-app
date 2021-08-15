const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const { generateMessages,generateURL } = require('./utils/messages.js')
const { addUser,removeUser,getUser,getUserinRoom } = require('./utils/users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '../public')));


io.on('connection',(socket)=>{
    // console.log("CONNECTED !!");

    socket.on('join',({username,room},callback)=>{
        socket.join(room)
        const { error,user } = addUser({id : socket.id,username,room})
        
        if(error)
        {
            return callback(error)
        }


            
        socket.emit('message',generateMessages("Welcome to Wat-Cord"));
        socket.broadcast.to(user.room).emit('message',generateMessages(user.username+' has landed! '))
        //io.to.emit --> emits only to people in same room
        //socket.broadcast.to.emit --> emits to all people except one in a room
        io.to(user.room).emit('roomData',{
            room : user.room,
            users : getUserinRoom(user.room)
        })
        callback()
    })

    socket.on('SendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessages(user.username,message))
        callback('delivered!')
        
    })

    socket.on('SendLocation',(coords)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateURL(user.username,'https://google.com/maps?q='+coords.latitude+','+coords.longitude))
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessages(user.username+' has disconnected'))
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getUserinRoom(user.room)
            })
        }
        
    })

})

server.listen(port,()=>{
    console.log("server up and running on "+port);
})