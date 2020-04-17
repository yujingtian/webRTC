var http = require("http")
var https = require("https")
var fs = require("fs")
var path = require("path")
var express = require("express")
var socketIo = require("socket.io")

var app = express()
// var httpServer = http.createServer(app)
var httpsConfig = {
    key:fs.readFileSync(path.resolve(__dirname, "../cert/privatekey.pem")),
    cert:fs.readFileSync(path.resolve(__dirname, "../cert/certificate.pem"))
}
var httpsServer = https.createServer(httpsConfig, app)
var io = socketIo(httpsServer)
var USERCOUNT = 2;
app.get("/",function(req,res){
    res.send("这是socket服务")
})
io.on("connection",function(socket){
    console.log("a user connected")
    socket.on('join', function(room){
        socket.join(room)
        var myroom = io.sockets.adapter.rooms[room]
        var users = myroom? Object.keys(myroom.sockets).length : 0
        console.log("join:the user number of  this room is :" , users)
        if(users < USERCOUNT){
            socket.emit("joined", room, socket.id)  //发送给除了自己之外的所有人
        }
    });
    socket.on("disconnect",function(){
        var myroom = io.sockets.adapter.rooms[1]
        var users = myroom? Object.keys(myroom.sockets).length : 0
        console.log("disconnect:the user number of  this room is :" , users)
    })
    socket.on('leave', function(room){
        socket.leave(room)
        var myroom = io.sockets.adapter.rooms[room]
        var users = myroom? Object.keys(myroom.sockets).length : 0
        console.log("leave:the user number of  this room is :" , users)
        socket.emit('leaved', room, socket.id);
    });
    socket.on('message', function(room, data){
        socket.to(room).emit('message', room, data);
    });
})
// httpServer.listen(3302,function(){
//     console.log("http服务已启动")
// })
httpsServer.listen(3303, function(){
    console.log("https服务已启动")
})