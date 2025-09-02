### API 리퀘스트 보내는 기사, 물품 관리

# 간단 소개
  - 물품과 기사(글)에 대한 등록/조회/수정/삭제를 API로 관리하는 시스템

# 기술 스택
  - 사용한 언어 - Node.js

  - API 요청 도구
      - article - axios 이용 비동기 처리 .then(), .catch()
      - product - axios 이용 비동기 처리 async/await

# 프로젝트 구조
```bash
  C:.
  ├─ app.js                  // 프로그램 전반적인 실행 구조
  ├─ main.js                 // 프로그램 실행
  ├─ package.json            // 프로젝트 패키지 및 의존성 관리
  ├─ README.md               // 프로젝트 설명 문서
  ├─ dto                     // Data Transfer Object
  │  ├─ load-article-res.js       // 단일 기사 응답 DTO
  │  ├─ load-articleId-res.js     // 기사 ID만 응답 DTO
  │  ├─ load-articles-res.js      // 여러 기사 목록 응답 DTO
  │  ├─ load-product-res.js       // 단일 상품 응답 DTO
  │  ├─ load-productId-res.js     // 상품 ID만 응답 DTO
  │  └─ load-products-res.js      // 여러 상품 목록 응답 DTO
  ├─ entity                  // 엔티티 (DB/도메인 모델 정의)
  │  ├─ article-id.js             // 기사 ID 모델
  │  ├─ article.js                // 기사 모델
  │  ├─ electronic-product.js     // 전자 제품 모델
  │  ├─ product-id.js             // 상품 ID 모델
  │  └─ product.js                // 상품 모델
  ├─ repository              // 데이터 접근 계층 (CRUD)
  │  ├─ article-repository.js     // 기사 관련 접근
  │  ├─ base-repository.js        // 부모 로직
  │  └─ product-repository.js     // 상품 관련 접근
  ├─ service                 // 비즈니스 로직 계층
  │  ├─ article-service.js        // 기사 관련 서비스 로직
  │  └─ product-service.js        // 상품 관련 서비스 로직
  └─ ui                      // UI 계층 (CLI 화면 출력, 유저 인터페이스)
    ├─ article-screen.js         // 기사 화면
    ├─ base-screen.js            // 기본 화면 컴포넌트
    ├─ home-screen.js            // 홈 화면
    ├─ product-screen.js         // 상품 화면
    └─ prompt-util.js            // 입력/프롬프트 유틸
```   
    ui CLI 화면 예시
      home-screen.js
      =============== Home ================
      [1].물품 관리 [2].기사 관리 [3].종료 ->

      product-screen.js
      ========== Product ==========
      [1].물품 등록 [2].물품들 확인 [3].전자제품 물품들 확인 [4].특정 물품 확인(찜)
      [5].물품 수정 [6].물품 삭제 [7].이전으로... [8].종료 ->

      article-screen.js 
      ========== Article ==========
      [1].기사 등록 [2].기사들 확인 [3].특정 기사 확인(좋아요)  
      [4].기사 수정 [5].기사 삭제 [6].이전으로... [7]. 종료 -> 

