FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,id=transitos-marketing-npm,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund
COPY . .

ARG NEXT_PUBLIC_RIDER_URL=http://localhost:3002
ARG NEXT_PUBLIC_OPS_URL=http://localhost:3001
ARG NEXT_PUBLIC_DOCS_URL=http://localhost:3003
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_BASE=http://localhost:8000
ENV NEXT_PUBLIC_RIDER_URL=$NEXT_PUBLIC_RIDER_URL
ENV NEXT_PUBLIC_OPS_URL=$NEXT_PUBLIC_OPS_URL
ENV NEXT_PUBLIC_DOCS_URL=$NEXT_PUBLIC_DOCS_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
