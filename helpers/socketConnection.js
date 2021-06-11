module.exports = (io) => {
    io.on( 'connection', (socket) => {
        //console.log('소켓서버 접속');
        socket.on('client message', (data) => {         // 'client message'는 '/chat/index.html' 템플릿에서 emit()으로 전달한 임의의 ID값
            io.emit('server message', data.message);    // io는 서버에 연결된 모든 사용 대상. ''server message's는 임의의 ID. 
                                                        // ID를 사용자 ID로 설정하면 특정 대상자와 1:1 가능.
        });
    });
};