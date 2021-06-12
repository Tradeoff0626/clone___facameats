const app = require('./app.js');
const port = 3000;

const server = app.listen( port, function(){
    console.log('Express listening on port', port);
});


//서버에 socket.io 모듈 적용. 정상적으로 적용되면 'localosht:3000/socket.io/socket.io.js'로 확인 가능
const listen = require('socket.io');
const io = listen(server);

//socket io passport 접근하기 위한 미들웨어 적용
io.use( (socket, next) => {
    app.sessionMiddleWare(socket.request, socket.request.res, next);        //app.js에서 변수로 따로 분리하여 적용 처리
});

const socketConnection = require('./helpers/socketConnection');
socketConnection(io);
//require('./helpers/socketConnection')(io);   //한 줄로 줄임 가능