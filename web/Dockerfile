FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,id=transitos-npm,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund \
    --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY . .

ARG NEXT_PUBLIC_API_BASE=http://localhost:8000
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
