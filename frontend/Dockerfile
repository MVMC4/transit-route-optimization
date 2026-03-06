# Stage 1: Build
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of your code
COPY . .

# Build production files
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

# Install a lightweight static file server
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist /app

# Expose the port (Vite build output defaults to 4173 or 3000, we’ll use 4173)
EXPOSE 4173

# Serve the static site
CMD ["serve", "-s", "/app", "-l", "4173"]
