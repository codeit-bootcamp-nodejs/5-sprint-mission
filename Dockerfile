
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
COPY prisma ./prisma
COPY src ./src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=builder /server/dist ./dist

CMD ["npm", "run", "prod"]