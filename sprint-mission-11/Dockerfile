# 1. 노드가 설치된 알파인 OS 이미지 다운로드
# FROM node:24-alpine

# # 2. 작업 디렉토리 생성
# WORKDIR /server

# # 3. 코드 작업
# COPY . .
# RUN npm ci
# RUN npx prisma generate

# # 4. 포트 노출
# EXPOSE 4000

# # 5. 서버 실행
# CMD ["npm", "run", "dev"]

FROM node:24-alpine AS builder
WORKDIR /server
COPY prisma ./prisma
COPY src ./src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
RUN npm ci
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /server
COPY package.json .
COPY package-lock.json .
RUN npm ci --omit=dev 
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /server/node_modules/@prisma/client ./node_modules/@prisma/client
CMD ["npm", "run", "prod"]  

FROM node:24-alpine AS migrator
WORKDIR /migrator
COPY --from=builder /migrator/node_modules ./node_modules
COPY --from=builder /migrator/prisma ./prisma
COPY --from=builder /migrator/package.json ./package.json
CMD ["npx", "prisma", "migrate", "deploy"]  