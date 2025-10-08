# 🚍 Transit Route Optimization API

This repository contains the backend API and dashboard interface for optimizing public transit routes.

---

## 📁 Project Structure

```
transit-route-optimization/
├── backend/        # API and optimization logic
├── dashboard/      # Frontend dashboard
├── .gitignore
└── README.md
```

---

## ⚙️ Features

- Route optimization engine  
- Real-time route and stop management  
- RESTful API endpoints  
- Database ready (MongoDB or PostgreSQL)  
- Web dashboard for monitoring and control  
- Docker support for easy deployment  

---

## 🛠️ Installation

### Clone the Repository
```bash
git clone https://github.com/MVMC4/transit-route-optimization.git
cd transit-route-optimization
```

---

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend runs on **http://localhost:5000**

#### Environment Variables
Create a `.env` file inside `/backend`:
```
PORT=5000
DB_URI=mongodb://localhost:27017/transit
JWT_SECRET=your_secret_key
```

---

### Dashboard Setup
```bash
cd dashboard
npm install
npm run dev
```

The dashboard runs on **http://localhost:5173**

---

## 🐳 Docker Deployment

### Build and Run with Docker Compose
```bash
docker compose up --build -d
```

### Build Individually
```bash
cd backend
docker build -t transit-api .
docker run -d -p 5000:5000 transit-api
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/routes` | Get all routes |
| POST | `/api/routes` | Create new route |
| GET | `/api/routes/:id` | Get a specific route |
| PUT | `/api/routes/:id` | Update route |
| DELETE | `/api/routes/:id` | Delete route |
| POST | `/api/optimize` | Optimize route data |

---

## 🧩 Dashboard Overview

- Real-time route overview  
- Add and edit routes  
- Optimization result visualization  
- API and server health monitoring  

---

## 🚀 Deployment via SSH

```bash
cd ~/route-api
git pull origin main
cd dashboard
./deploy.sh
```

---

## 🤝 Contributing

Contributions are welcome.  
Please open an issue before submitting a pull request.

---

## 📄 License

MIT License © 2025 MVMC4
