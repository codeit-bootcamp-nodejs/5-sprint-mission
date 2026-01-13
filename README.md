## 요구사항

- Github Actions를 활용한 테스트 및 배포 자동화와 Docker 기반 Express 서버 환경 구성 구현

## 기본

### 1. Pull Request 이벤트

- [x] 브랜치에 `pull request`가 발생하면 테스트를 실행하는 Action을 구현합니다.

### 2. Push 이벤트

- [x] `main` 브랜치에 `push`가 발생하면 AWS 배포를 수행하는 Action을 구현합니다.

### 3. 검증

- [x] 개인 Github 리포지터리에서 Actions가 정상적으로 동작하는 것을 확인합니다.

## 주의사항

- AWS 인증 정보(Access Key, Secret Key 등)는 코드에 포함하지 않습니다.
- Github Actions 설정 파일은 다음 경로에 저장합니다.

```
text
.github/workflows/
```

## 심화

## 스크린샷

![image](이미지url)

## 멘토에게

- 셀프 코드 리뷰를 통해 질문 이어가겠습니다.
