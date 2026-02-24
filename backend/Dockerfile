FROM node:20-alpine

# Install bash and curl for wait-for-it.sh
RUN apk add --no-cache bash curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma client generation
RUN npx prisma generate

# Next.js build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
