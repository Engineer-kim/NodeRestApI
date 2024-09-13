let io;

module.exports ={
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "http://localhost:3000", // 허용할 출처
                methods: "*", // 허용할 메서드
                allowedHeaders: ["Content-Type" , "Authorization"], // 허용할 헤더
                credentials: true, // 인증 정보 포함 여부
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
}