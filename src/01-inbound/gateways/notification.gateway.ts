import { Server as DefaultWsServer, Namespace, Socket } from "socket.io";

import { BaseGateway } from "./base.gateway";
import { PersistNotificationEntity } from "../../02-domain/entity/notification";
import { IServices } from "../port/i.service";

export class NotificationGateway extends BaseGateway {
  private messageIo?: Namespace;
  private messages: PersistNotificationEntity[];

  constructor(services: IServices) {
    super(services);
    this.messages = [];
  }

  
  async register(io: DefaultWsServer) {
    /**
     * <WS 프로토콜 커넥션 생성 과정>
     *
     * 1. 클라이언트: HTTP 요청
     * http://localhost:4000/socket.io/...
     * Connection: Upgrade
     * Upgrade: websocket
     *
     * 2. 서버: HTTP 응답
     * 101 Switching Protocols
     *
     * 3. WS 프로토콜 커넥션 활성화
     * TCP 연결 유지
     * 양방향 데이터 전송 가능
     *
     *
     * <HTTP, WS 중요한 차이점>
     *
     * 1. HTTP: Stateless, WS: Stateful
     * HTTP: 모든 API 요청(Header)마다 토큰을 전송. 모든 요청마다 미들웨어 필요.
     * WS: 연결할 때 HTTP 헤더로 토큰을 한 번 전송. 연결할 때 1번 미들웨어 필요.
     *
     * 2. WS 주의 사항
     * 소켓이 연결되어 있는 동안에는 토큰이 만료되어도 연결은 유지
     * 그래서 보안이 엄청 중요한 금융권 뱅킹 앱 같은 곳에서는 소켓 연결 중이라도 타이머를 돌려서 주기적으로 재인증을 요구
     */
    this.messageIo = io.of("/messages");

    setInterval(() => {
      this.flush();
    }, 200);

    // this.messageIo.use(this.middlewares.auth.checkAuthWs);

    this.messageIo.on("connection", (socket: Socket) => {
      socket.join("lobby");
      socket
        .on(
          "create_message",
          this.catch(socket, async (data: unknown) => {
            /**
             * TODO: 대규모 트래픽 해결
             * 1. 패킷 쓰로틀링
             * 2. Bulk Insert
             * 3. 분산 서버 + Redis, Kafka
             */

            // 패킷으로 받기

            if (!socket.data.userId) {
                throw new Error("Unauthorized");
            }
            // const parsedData = this.validate(, data);

            // // create_message 이벤트가 1초에 1000번 발생
            // const message = await this.services.message.createMessage({
            //   content: parsedData.content,
            //   userId: socket.data.userId,
            // });

            // this.messages.push(message);
          }),
        )
        .on("disconnect", () => {});
    });
  }

  flush() {
    if (!this.messageIo) {
      return;
    }

    if (this.messages.length > 0) {
      // 나 자신에게 응답
      // socket.emit("broadcast_message", data);
      // 모두에게 응답
      // messageIo.emit("broadcast_message", data);
      // lobby에 join한 모두에게 응답
      // messageIo.to("lobby").emit("broadcast_message", message);
      // lobby에 join한 모두에게 응답(나를 제외)
      // socket.broadcast.to("lobby").emit("broadcast_message", message);
      this.messageIo.to("lobby").emit("broadcast_messages", this.messages);
      this.messages = [];
    }
  }
}
