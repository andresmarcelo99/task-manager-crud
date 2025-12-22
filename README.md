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

✅ **Database:** MySQL with Prisma ORM (ready for PlanetScale)

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


Frontend (React/TypeScript) Challenges
1. Task Filtering & Search
Add filter buttons: "All", "Completed", "Pending"
Implement search functionality by task title/description
Add a "Clear All Completed" button
Skills shown: State management, array methods, conditional rendering
2. Task Priority System
Add priority field (High, Medium, Low) to tasks
Color-code task cards based on priority
Sort tasks by priority by default
Add priority filter dropdown
Skills shown: Database schema changes, UI design, sorting algorithms
3. Task Due Dates & Reminders
Add due date picker to task creation/editing
Show overdue tasks in red
Display "Due today" vs "Due in X days"
Sort by due date option
Skills shown: Date handling, conditional styling, business logic
4. Dark Mode Toggle
Implement theme switching with Material-UI
Persist theme preference in localStorage
Add smooth transitions between themes
Skills shown: Theme management, localStorage, React context
5. Bulk Operations
Add checkboxes to select multiple tasks
"Mark all selected as complete" button
"Delete selected tasks" with confirmation dialog
"Select all" / "Deselect all" functionality
Skills shown: Complex state management, array operations, UX patterns
Backend (NestJS/Database) Challenges
6. Task Categories/Tags System
Create Category model with many-to-many relationship
API endpoints: GET/POST/DELETE categories
Assign categories to tasks
Filter tasks by category
Skills shown: Database relationships, API design, data modeling
7. Task Activity Log
Track all task changes (created, updated, completed, etc.)
Store timestamps and user actions
Create endpoint to get task history
Display activity timeline in task details
Skills shown: Audit logging, database design, API development
8. User Profile Management
Create user profile update endpoint
Allow users to change name, email
Add profile picture upload (use cloudinary/S3)
Password change functionality
Skills shown: File uploads, validation, security, form handling
9. Task Sharing & Collaboration
Add ability to share tasks with other users
Permission system (view/edit/delete)
Email invitations to shared tasks
Notification system for task updates
Skills shown: Complex authorization, email integration, real-time updates
10. Analytics & Reporting
Create dashboard with task completion stats
Charts showing productivity over time
Daily/weekly/monthly task summaries
Export tasks to CSV functionality
Skills shown: Data aggregation, charting libraries, file generation
Bonus Advanced Challenges
11. Real-time Updates
WebSocket integration for live task updates
Show when other users are viewing shared tasks
Live notifications for task assignments
Skills shown: WebSockets, real-time communication
12. Mobile Responsive Design
Optimize for mobile/tablet screens
Add swipe gestures for task actions
Mobile-first responsive layouts
Skills shown: Responsive design, touch interactions