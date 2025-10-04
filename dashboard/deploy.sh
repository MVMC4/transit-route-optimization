#!/bin/bash

# Set variables
IMAGE_NAME="dashboard-app"
CONTAINER_NAME="dashboard"
PORT=4173

echo "🚀 Starting Docker deploy for $IMAGE_NAME..."

# Step 1: Stop and remove any existing container
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "🧹 Removing existing container..."
  docker stop $CONTAINER_NAME >/dev/null 2>&1
  docker rm $CONTAINER_NAME >/dev/null 2>&1
fi

# Step 2: Remove old image
if [ "$(docker images -q $IMAGE_NAME)" ]; then
  echo "🗑️  Removing old image..."
  docker rmi $IMAGE_NAME >/dev/null 2>&1
fi

# Step 3: Build a fresh image
echo "🔨 Building new Docker image..."
docker build -t $IMAGE_NAME .

# Step 4: Run new container
echo "🏃 Running new container..."
docker run -d -p ${PORT}:${PORT} --name $CONTAINER_NAME $IMAGE_NAME

# Step 5: Show container status
echo "✅ Deployment complete!"
docker ps | grep $CONTAINER_NAME

echo "🌐 Access at: http://localhost:${PORT} or via your Tailscale IP"

