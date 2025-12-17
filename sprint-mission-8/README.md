## 미션 목표
- 알림 기능 구현하기
- 웹소켓 또는 Socket.IO를 사용해 실시간 기능 구현하기

## 요구사항
기존에 작업한 판다마켓 미션과 이어서 진행됩니다.
판다마켓 최종 디자인을 참고해주세요.

### 알림
- 사용자는 자신의 알림 목록을 조회할 수 있습니다.
- 사용자는 자신의 안 읽은 알림의 개수를 조회할 수 있습니다.
- 사용자는 자신의 알림을 읽음 처리 할 수 있습니다.
- 클라이언트에서는 실시간으로 알림을 받을 수 있습니다.

### 알림 전송
- 좋아요한 상품의 가격이 변동되었을 때 알림을 보내주세요.
- 자신이 작성한 게시글에 댓글이 달렸을 때 알림을 보내주세요.


---
#### 이전 스프린트를 제대로 완료하지 못하여서, 스프린트 5의 모범답안을 기반으로 스프린트를 진행하였습니다.
#### 작성 및 수정한 코드는 다음과 같습니다.

생성:
- src/controllers/notificationsController.ts
- src/repositories/notificationsRepository.ts
- src/routers/notificationsRouter.ts
- src/services/notificationsService.ts
- src/services/socketService.ts
- src/types/Notification.ts

수정 :
- src/controllers/usersController.ts => getMyNotis 추가
- src/repositories/favoritesRepository.ts => getFavoritesByProductId 추가
- src/routers/userRouter.ts => '/me/notifications' 엔드포인트 추가
- src/services/commentsService.ts => createComment에 알림 기능 추가
- src/services/productsService.ts => updateProduct에 알림 기능 추가
- src/types/usersStructs.ts => GetMyNotificationsParamsStruct 추가

기존 코드의 구성과 맞추려고 하였고, 최대한 함수형 프로그램으로 구현하려고 하였습니다.