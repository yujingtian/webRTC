var http = require("http")
var express = require("express")
var socketIo = require("socket.io")

var app = express()
var httpServer = http.createServer(app)
var io = socketIo(httpServer)
app.get("/",function(req,res){
    res.send("这是socket服务")
})
io.on("connection",function(socket){
    console.log("a user connected")
    socket.on('join', function(room){
        console.log(room)
    });
    socket.on('leave', function(room){
        console.log(room)
    });
    socket.on('message', function(room,data){
        console.log(room, data)
    });
})
httpServer.listen(3302,function(){
    console.log("服务已启动")
})