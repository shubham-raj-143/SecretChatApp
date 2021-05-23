// node server which will handel socket io connections
/*
1>cd .\nodeserver\
2> npm init

 ------package name: (nodeserver)
version: (1.0.0)
description: The Node Server for Realtime Chat Application
entry point: (index.js)
test command:
git repository:
keywords:
author: shubham
license: (ISC)
About to write to D:\WebDevelopment\project\Realtime Chat Webpage\nodeserver\package.json:

{
  "name": "nodeserver",
  "version": "1.0.0",
  "description": "The Node Server for Realtime Chat Application",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
}


Is this OK? (yes) yes-------------------------------


3>npm i socket.io
4>npm i nodemon
5>nodemon .\index.js
*/
const io = require('socket.io')(8000);  //This attaches with HTTP instance
var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(
    serveStatic("../angularjs")
).listen(5000);
const users = {};


//"io.on" means this is socket.io instance which will listen many socket connections like if shubham has connected or shubhra has connected.
//"socket.on" handeles what something will happen with some particular connection
io.on('connection', socket => {
    socket.on('new-user-joined', name => {           //what to do,  if socket.on sends new user joined event
        console.log("New user", name);

        users[socket.id] = name; //whwever get  user-joined event then name is set in to users
        socket.broadcast.emit('user-joined', name); // The new user joined message will be informed to all users except the one who has joined.
    });
    socket.on('send', message => {  //if anyone has "send" message then handle it
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];

    });

});
