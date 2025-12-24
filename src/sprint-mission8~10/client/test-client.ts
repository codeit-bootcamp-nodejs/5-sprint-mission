import { io, Socket } from "socket.io-client";

type TestUser = {
  name: string;
  token: string;
};

const USERS: TestUser[] = [
  {
    name: "USER-1",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NmI5NGUwMi0zYmZmLTRiMjYtYTFmMy0zZGFiMjFmOWYwM2IiLCJpYXQiOjE3NjYyMjE0NzEsImV4cCI6MTc2NjI0MzA3MX0.uPqxH-nurMTXR2nxECiQq7zBpWivgCeomCu6YrxsUyQ",
  },
  {
    name: "USER-2",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NzRiNWU2OC1jZTkzLTQ3ZTEtODkyOS05OTY4MmE5YzNhZWQiLCJpYXQiOjE3NjYyMjE1MzQsImV4cCI6MTc2NjI0MzEzNH0.5i9kJU1SNFVM5SdIWyQPkLjSM68x_y0cyQE51oOr3rA",
  },
  {
    name: "USER-3",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NGM5M2FjMy1jODdlLTRiOTYtYTI0NC1mOWYxZjI4OTFhZmYiLCJpYXQiOjE3NjYyMjE1NTAsImV4cCI6MTc2NjI0MzE1MH0.O43a-6zPeOivfnwZurB2PYbkPlcsa1WXwpSW55BK3Iw",
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

  socket.on("notification", (payload) => {
    console.log(`🔔 [${user.name}] notification`, payload);

    const { type, message } = payload;

    switch (type) {
      case "PRODUCT_PRICE_CHANGED":
        console.log("💰 가격 변경:", message);
        break;

      case "ARTICLE_COMMENT_CREATED":
        console.log("💬 댓글 알림:", message);
        break;

      default:
        console.log("📢 기타 알림:", message);
    }
  });

  // socket.onAny((event, ...args) => {
  //   console.log(`📩 [${user.name}] event=${event}`, args);
  // });

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
