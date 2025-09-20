#!/bin/bash
set -e

APP_NAME="route-api"
APP_PORT=8080

echo "🚀 Building Spring Boot JAR..."
mvn clean package -DskipTests

echo "🐳 Building Docker image..."
sudo docker build -t $APP_NAME .

echo "🛑 Stopping old container (if running)..."
sudo docker stop $APP_NAME || true
sudo docker rm $APP_NAME || true

echo "▶️ Starting new container..."
sudo docker compose run -d -p ${APP_PORT}:8080 --name $APP_NAME $APP_NAME

echo "✅ Deployment complete!"
echo "Test the API with:"
echo "  curl http://localhost:${APP_PORT}/api/routes"

echo "Or from another Tailscale device:"
echo "  curl http://server-0-kaiser.tail10c51a.ts.net:${APP_PORT}/api/routes"
