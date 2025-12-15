import { io } from "socket.io-client";

console.log("소켓 테스트 시작");

const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYXNkQGFzZC5jb20iLCJuaWNrbmFtZSI6IuyngO2YnCIsImlhdCI6MTc2NTc5NTU0NywiZXhwIjoxNzY1Nzk5MTQ3fQ.ylK55vKFi78B1w1fw29JnhFb5hK_DpxC0U_aPS4tL6g",
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("소켓 연결", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("연결 에러:", err.message);
});

socket.on("notification", (data) => {
  console.log("실시간 알림 수신");
  console.log(data);
});

socket.on("disconnect", (reason) => {
  console.log("소켓 연결 안됨", reason);
});
