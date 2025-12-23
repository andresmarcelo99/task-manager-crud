# Insight CRUD - Task List Application

A full-stack Task List application with Authentication and CRUD operations built with modern technologies.

## ✨ Features

✅ **Complete Task CRUD Operations:**
- Create Task
- Edit Task  
- Delete Task
- Mark a task as Done (Using dedicated API web service)

✅ **Frontend:** React 19 + TypeScript + Vite

✅ **Backend:** NestJS + TypeScript

✅ **Communication:** JSON REST API with JWT Authentication

✅ **Authentication:** AWS Cognito integration

✅ **UI Library:** Material-UI (MUI) components

✅ **Database:** Postgres with Prisma ORM 

✅ **Mark Done Service:** Dedicated API service for marking tasks complete

✅ **Comprehensive Testing:**
- Unit Tests: Jest for backend services
- E2E Tests: Cypress for frontend user flows
- Mock authentication for development

## 🚀 Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Prerequisites
- Node.js v18+
- MySQL database
- AWS Cognito User Pool

### Development
```bash
# Backend
cd api
npm install
npm run start:dev

# Frontend (in new terminal)
cd ui
npm install  
npm run dev
```

### Testing
```bash
# Unit tests
cd api && npm test

# E2E tests  
cd ui && npm run test:e2e
```

## 🏗️ Architecture

- **Backend API** (Port 3001): NestJS + Prisma + AWS Cognito
- **Frontend UI** (Port 5173): React + Vite + Material-UI
- **Database**: MySQL with user/task relationships
- **Authentication**: AWS Cognito + JWT tokens
- **Testing**: Jest (unit) + Cypress (E2E)

## 📋 Project Structure

```
├── api/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/        # AWS Cognito authentication
│   │   ├── tasks/       # Task CRUD + Mark Done service
│   │   └── database/    # Prisma configuration
│   └── prisma/          # Database schema
├── ui/                  # React Frontend  
│   ├── src/
│   │   ├── components/  # Material-UI components
│   │   ├── pages/       # Route pages
│   │   └── services/    # API clients
│   └── cypress/         # E2E tests
└── SETUP.md            # Detailed setup guide
```
