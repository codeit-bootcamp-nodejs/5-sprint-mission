# 🧩 토큰 기반 인증/인가 구현 프로젝트

## 🎯 미션 목표
- [x] 토큰 기반 유저 인증/인가 구현하기  
- [x] (심화) Refresh Token 구현하기  
- [x] (심화) Prisma로 관계형 데이터베이스 활용하기  

---

## 🚀 기본 요구사항

### 🔹 사전 준비
- [x] 스프린트 미션 3이 완료된 상태에서 시작하기  
- [x] Prisma 스키마 수정 시, 마이그레이션을 함께 진행하기  
- [x] 문제가 생길 경우 마이그레이션 파일 및 데이터베이스 초기화 후 재진행  

---

## 👤 인증 (Authentication)

- [x] User 스키마 작성 (`id`, `email`, `nickname`, `image`, `password`, `createdAt`, `updatedAt`)  
- [x] 회원가입 API 구현 (`email`, `nickname`, `password`)  
  - [x] 비밀번호는 **해싱하여 저장**  
- [x] 로그인 성공 시 **Access Token** 발급  

---

## 🛍️ 상품 기능 인가 (Product Authorization)

- [x] 로그인한 유저만 상품 등록 가능  
- [x] 상품 등록자만 해당 상품 **수정/삭제 가능**

---

## 📝 게시글 기능 인가 (Post Authorization)

- [x] 로그인한 유저만 게시글 등록 가능  
- [x] 게시글 작성자만 해당 게시글 **수정/삭제 가능**

---

## 💬 댓글 기능 인가 (Comment Authorization)

- [x] 로그인한 유저만 **상품 및 게시글**에 댓글 등록 가능  
- [x] 댓글 작성자만 해당 댓글 **수정/삭제 가능**

---

## 👤 유저 정보 (User Profile)

- [x] 유저 자신의 정보 조회 기능 구현  
- [x] 유저 자신의 정보 수정 기능 구현  
- [x] 유저 비밀번호 변경 기능 구현  
- [x] 유저가 등록한 상품 목록 조회 기능 구현  
- [x] 비밀번호는 **리스폰스에 포함되지 않도록 처리**

---

## 🌟 심화 요구사항 (Advanced)

### 🔐 인증
- [x] **Refresh Token**을 이용한 토큰 재발급 기능 구현

### ❤️ 좋아요 기능
- [x] 로그인한 유저는 상품에 ‘좋아요’ / ‘좋아요 취소’ 가능  
- [x] 로그인한 유저는 게시글에 ‘좋아요’ / ‘좋아요 취소’ 가능  
- [x] 상품 또는 게시글 조회 시, `isLiked` 필드 포함하여 유저의 좋아요 여부 확인  
- [x] 유저가 좋아요한 상품 목록 조회 기능 구현  

---

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
|------|------------|
| Language | TypeScript / JavaScript |
| Framework | Node.js / Express |
| ORM | Prisma |
| Database | PostgreSQL / MySQL |
| Auth | JWT (Access / Refresh Token) |
| 기타 | dotenv, bcrypt, jsonwebtoken 등 |

---

## 📦 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 코드 포맷팅
npm run format
