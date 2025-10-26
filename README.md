# Sprint Mission 4

### 인증
- [x] User 스키마 작성 (id, email, nickname, image, password, createdAt, updatedAt)
- [x] 회원가입 API (email, nickname, password 입력 → 비밀번호 해싱 저장)
- [x] 로그인 API (성공 시 Access Token 발급)

### 상품 기능 인가
- [x] 로그인한 유저만 상품 등록 가능
- [x] 상품 등록한 유저만 해당 상품 수정/삭제 가능

### 게시글 기능 인가
- [x] 로그인한 유저만 게시글 등록 가능
- [x] 게시글 등록한 유저만 해당 게시글 수정/삭제 가능

### 댓글 기능 인가
- [x] 로그인한 유저만 상품에 댓글 등록 가능
- [x] 로그인한 유저만 게시글에 댓글 등록 가능
- [x] 댓글 등록한 유저만 해당 댓글 수정/삭제 가능

### 유저 정보
- [x] 유저 자신의 정보 조회 기능
- [x] 유저 자신의 정보 수정 기능
- [x] 유저 자신의 비밀번호 변경 기능
- [x] 유저가 등록한 상품 목록 조회 기능
- [x] 유저 비밀번호는 응답에 노출되지 않음

### 심화 요구사항
#### 인증
- [x] Refresh Token으로 Access Token 갱신 기능

#### 좋아요 기능
- [x] 로그인한 유저는 상품에 좋아요/좋아요 취소 가능
- [x] 로그인한 유저는 게시글에 좋아요/좋아요 취소 가능
- [x] 상품/게시글 조회 시 isLiked 불린 필드 포함
- [x] 유저가 좋아요한 상품 목록 조회 기능

# 실행 방법

1. 실행 방법
- 패키지 설치 npm install

2. .env 파일 생성
- DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB> schema=public"
- JWT_SECRET="your_access_secret"
- REFRESH_SECRET="your_refresh_secret"

3. Prisma 클라이언트 생성
- npx prisma generate

4. DB 마이그레이션
- npx prisma migrate dev --name init

5. 시드 데이터 삽입

6. 실행
- npm run dev
