# Task List Application Setup Guide

This is a full-stack Task List application with Authentication and CRUD operations built according to your specifications.

## 🏗️ Architecture

### Backend (API)
- **Framework**: NestJS with TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: AWS Cognito + JWT
- **Testing**: Jest for unit tests
- **API Type**: REST API

### Frontend (UI)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **Testing**: Cypress for E2E tests
- **State Management**: Context API

## 🚀 Getting Started

### Prerequisites
1. Node.js (v18 or later)
2. MySQL database
3. AWS Cognito User Pool (configured)

### Backend Setup

1. **Navigate to API directory:**
   ```bash
   cd api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update these values in `.env`:
   - `DATABASE_URL`: Your MySQL connection string
   - `AWS_COGNITO_USER_POOL_ID`: Your Cognito User Pool ID
   - `AWS_COGNITO_CLIENT_ID`: Your Cognito App Client ID
   - `AWS_COGNITO_REGION`: Your AWS region
   - `JWT_SECRET`: A secure random string

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start the development server:**
   ```bash
   npm run start:dev
   ```
   
   The API will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to UI directory:**
   ```bash
   cd ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The UI will be available at `http://localhost:5173`

## 🧪 Testing

### Backend Unit Tests (Jest)
```bash
cd api
npm test
```

### Frontend E2E Tests (Cypress)
```bash
cd ui
# Start the frontend first (in another terminal)
npm run dev

# Run Cypress tests
npm run test:e2e        # Headless mode
npm run test:e2e:open   # Interactive mode
```

## 📋 Features Implemented

### ✅ Authentication (AWS Cognito)
- User registration with email confirmation
- User login with JWT tokens
- Protected routes and API endpoints
- Automatic token refresh handling

### ✅ Task CRUD Operations
- **Create Task**: Add new tasks with title and description
- **Read Tasks**: View all user tasks with status
- **Update Task**: Edit task details
- **Delete Task**: Remove tasks permanently
- **Mark as Done**: Special endpoint using dedicated service (Cloud Function equivalent)

### ✅ UI Components (Material-UI)
- Responsive design with Material-UI components
- Task cards with status indicators
- Dialog forms for task creation/editing
- Loading spinners and error handling
- Navigation with authentication state

### ✅ Testing
- **Unit Tests**: Backend service logic with Jest
- **E2E Tests**: Frontend user flows with Cypress
- Mocked authentication for testing

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/confirm-signup` - Confirm email
- `POST /auth/login` - User login

### Tasks (Protected)
- `GET /tasks` - Get all user tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/mark-done` - Mark task as completed (Special service)

## 🎯 Special Features

### Mark as Done Service
The application includes a dedicated `MarkDoneService` that handles marking tasks as completed. This satisfies the requirement for a "Cloud Function or API web service or Custom Resolver" specifically for this operation.

### Security Features
- JWT-based authentication
- Protected API endpoints
- CORS configuration
- Input validation with class-validator
- Secure password handling via AWS Cognito

### Database Design
- User-Task relationship with foreign keys
- Soft timestamps (createdAt, updatedAt, completedAt)
- Proper indexing on email and cognitoId

## 🚀 Deployment Notes

### Database
- Use PlanetScale (MySQL) or MongoDB Atlas as suggested
- Update DATABASE_URL in production environment

### AWS Cognito Setup
1. Create User Pool in AWS Cognito
2. Configure App Client (disable client secret for frontend)
3. Set up hosted UI (optional)
4. Update environment variables

### Production Environment Variables
Make sure to set secure values for:
- `JWT_SECRET` (use a strong random string)
- `DATABASE_URL` (production database)
- AWS Cognito credentials
- `NODE_ENV=production`

## 📱 Usage Flow

1. **Registration**: User signs up with email/password
2. **Email Confirmation**: User enters verification code from email
3. **Login**: User signs in and receives JWT token
4. **Task Management**: User can create, edit, delete, and mark tasks as done
5. **Logout**: User can safely log out (token removed)

## 🛠️ Development Commands

### Backend (api/)
```bash
npm run start:dev      # Development server with hot reload
npm run build          # Build for production
npm run start:prod     # Start production server
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run lint           # Run ESLint
```

### Frontend (ui/)
```bash
npm run dev            # Development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run test:e2e       # Run E2E tests
npm run cypress:open   # Open Cypress UI
```

This application meets all your requirements including TypeScript, NestJS backend, React+Vite frontend, Material-UI components, AWS Cognito authentication, MySQL database support, REST API communication, dedicated Mark Done service, and comprehensive testing with Jest and Cypress.