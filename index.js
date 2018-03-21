



var express = require("express");
var app = express();
app.use(express.static(".public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server =require("http").Server(app);
server.listen(3309);
var io = require('socket.io')(server, { wsEngine: 'ws' });
var taikhoan = [];
var taikhoan2 = [];
io.on("connection", function(socket) {
  console.log(socket.id + " connected");
  io.sockets.emit("online",taikhoan);
  socket.on("dangky", function (data) {
    console.log(taikhoan.indexOf(data));
    if(taikhoan.indexOf(data)>-1){
      console.log('fail rồi')
      socket.emit("dangky",0);
    }else{
      socket.emit("dangky",1);
      taikhoan.push(data);
      taikhoan2.push({name:data, id:socket.id});
      io.sockets.emit("Server-send-data",'<i>'+data+" vừa vào phòng chat</i>");
      io.sockets.emit("online",taikhoan);
    }
    console.log(taikhoan);
  });
  socket.on("disconnect",function () {
    console.log(socket.id+" disconnect");
    var removeIndex = taikhoan2.map(function(item) {return item.id; }).indexOf(socket.id);
    taikhoan2.map( function(item) {
    if(item.id==socket.id){
    io.sockets.emit("Server-send-data", '<i>'+item.name+" Vừa rời khỏi phòng chat</i>");
    var i = taikhoan.indexOf(item.name);
        if (i != -1) {
        taikhoan.splice(i,1);
        }
      }
    });
    taikhoan2.splice(removeIndex, 1);
    console.log(taikhoan2);
  });
  socket.on("Client-send-data", function (data) {
    taikhoan2.map( function(item) {
      if(item.id==socket.id){
        socket.emit("Server-send-data", '<b style="color:red">'+item.name+"</b>"+":"+data);
        socket.broadcast.emit("Server-send-data", '<b style="color:blue">'+item.name+"</b>"+":"+data);
      }
    });
  });
})
app.get('/',function (req,res) {
  res.render('trangchu');
})
