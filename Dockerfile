FROM node:22-alpine AS builder

WORKDIR /server

COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /server
COPY package.json .
COPY package-lock.json .
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=builder /server/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
