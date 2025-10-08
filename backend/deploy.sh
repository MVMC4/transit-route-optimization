#!/bin/bash
set -e  # Exit immediately if any command fails

APP_NAME="route-api"
APP_PORT=8080

echo "🚀 Building Spring Boot JAR..."
mvn clean package -DskipTests

echo "🐳 Building Docker image..."
sudo docker build -t ${APP_NAME} .

echo "🛑 Stopping old containers (if running)..."
# Stop containers if they exist
sudo docker stop ${APP_NAME} || true
sudo docker rm ${APP_NAME} || true

# Stop old MongoDB container only if it conflicts
if sudo docker ps -a --format '{{.Names}}' | grep -q '^mongodb$'; then
    echo "⚠️ Old MongoDB container exists, leaving it running to preserve data..."
fi

echo "▶️ Starting services with Docker Compose..."
# Use compose up to rebuild and start all services, preserves volumes
sudo docker compose up -d --build

echo "✅ Deployment complete!"
echo "Test the API locally:"
echo "  curl http://localhost:${APP_PORT}/api/routes"
echo "Or from another device:"
echo "  curl http://server-0-kaiser.tail10c51a.ts.net:${APP_PORT}/api/routes"
