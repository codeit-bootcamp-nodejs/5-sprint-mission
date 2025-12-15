import { io } from "socket.io-client";

console.log("소켓 테스트 시작");

const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYXNkQGFzZC5jb20iLCJuaWNrbmFtZSI6IuyngO2YnCIsImlhdCI6MTc2NTc4OTY0MCwiZXhwIjoxNzY1NzkzMjQwfQ.vU_yTP2yBVpNE8HwUiTz1Pzy7Kf7DhUTrriaINqpuF4", // ⚠️ Bearer 붙이지 말 것
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
