FROM node:18 AS builder

WORKDIR /app

COPY backend/package.json ./
COPY backend/package-lock.json ./

RUN npm install

COPY backend .

RUN npm run build

FROM node:18-slim AS app

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY backend/views ./views
COPY chain/snarks/gte_js/gte.wasm ./zk/gte.wasm
COPY chain/snarks/gte_plonk.zkey ./zk/gte.zkey

CMD ["node", "dist/main.js"]
