# Modular URL Shortener & Telemetry Pipeline

A high-performance Single Page Application (SPA) URL Shortener built with React, Vite, and Material UI. The application features an automatic batch-generation workspace, client-side route redirection analytics, and an integrated real-time logging telemetry pipeline that connects directly to the central campus evaluation engine.

---

## 🏗️ Project Architecture

The workspace is organized into two primary components:
* `notification-app-fe/` - The main front-end workspace built with React and Vite, running explicitly on Port `3000`.
* `logging-middleware/` - The asynchronous telemetry logging module that standardizes and pushes system health metrics.

---

## 🛠️ Setup & Installation Instructions

Follow these steps to configure the environment variables and boot the application workspace locally.

### 1. Environment Configuration
Create a `.env` file inside the `notification-app-fe/` directory and configure the target evaluation endpoints:

```env
VITE_API_URL=[http://4.224.186.213/evaluation-service/logs](http://4.224.186.213/evaluation-service/logs)
VITE_AUTH_TOKEN=your_fresh_bearer_token_here


cd notification-app-fe
npm install


npm run dev

