FROM node:18 AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-slim AS app

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]
