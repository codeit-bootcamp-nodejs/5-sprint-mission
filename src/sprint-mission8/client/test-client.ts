import { io, Socket } from "socket.io-client";

type TestUser = {
  name: string;
  token: string;
};

const USERS: TestUser[] = [
  {
    name: "USER-1",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NGM5M2FjMy1jODdlLTRiOTYtYTI0NC1mOWYxZjI4OTFhZmYiLCJpYXQiOjE3NjU3ODg2MjYsImV4cCI6MTc2NTc5MjIyNn0.vmUoVLTdvljL0QiCTxQWvoVn03xDQK3j4ihBbNkAawA",
  },
  {
    name: "USER-2",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzRiNWU2OC1jZTkzLTQ3ZTEtODkyOS05OTY4MmE5YzNhZWQiLCJpYXQiOjE3NjU3ODg2NzEsImV4cCI6MTc2NTc5MjI3MX0.F9qKLCPbCRMHLm0T85OgH9-IIC9oyCR2uLmfeeJR9KY",
  },
  {
    name: "USER-3",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NmI5NGUwMi0zYmZmLTRiMjYtYTFmMy0zZGFiMjFmOWYwM2IiLCJpYXQiOjE3NjU3ODg2OTMsImV4cCI6MTc2NTc5MjI5M30.5naJOvvFGHNcr3D-UhzMvi5pQlbGBcAuvfA5gGyEpxw",
  },
];

function connectUser(user: TestUser): Socket {
  const socket = io("http://localhost:4000/notifications", {
    transports: ["websocket"],
    extraHeaders: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  socket.on("connect", () => {
    console.log(`✅ ${user.name} connected | socketId=${socket.id}`);
    socket.emit("getNotifications");
  });

  socket.onAny((event, ...args) => {
    console.log(`📩 [${user.name}] event=${event}`, args);
  });

  socket.on("disconnect", () => {
    console.log(`⚠️ ${user.name} disconnected`);
  });

  socket.on("connect_error", (err) => {
    console.error(`❌ ${user.name} connect_error:`, err.message);
  });

  return socket;
}

// 🔥 3명 동시에 연결
const sockets = USERS.map(connectUser);

// Ctrl + C 종료 시 정리
process.on("SIGINT", () => {
  sockets.forEach((s) => s.disconnect());
  process.exit();
});
