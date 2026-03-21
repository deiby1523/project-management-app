# Project Management App

## Overview

This project is a fullstack application designed to manage projects, tasks, and team collaboration. It allows users to create projects, assign tasks, collaborate with other users, and track progress through comments and task status.

The system supports multiple users working together within shared projects, providing a structured environment for task management and communication.

---

## Architecture

The application follows a **client-server architecture** and is composed of three main components:

### Backend
- **Technology:** Spring Boot
- **Type:** REST API
- **Responsibilities:**
  - User authentication using JWT
  - Business logic and validation
  - Data persistence using JPA/Hibernate
  - Managing projects, tasks, members, and comments

### Frontend
- **Technology:** Next.js
- **Responsibilities:**
  - User interface
  - Consuming backend API
  - Handling user interactions

### Database
- **Technology:** MySQL
- **Responsibilities:**
  - Persistent storage of application data

---

## Domain Model

The core entities of the system are:

- **User:** Represents an authenticated user
- **Project:** A workspace where tasks are organized
- **Task:** A unit of work within a project
- **Comment:** Messages attached to tasks
- **ProjectMember:** Defines collaboration between users and projects, including roles such as `OWNER` and `MEMBER`

This design allows multiple users to collaborate within the same project while maintaining proper access control.

---

## Technologies Used

- Java 17
- Spring Boot
- Spring Security (JWT Authentication)
- JPA / Hibernate
- MySQL
- Next.js
- Docker
- Docker Compose

---

## Project Structure

```
project-management-app/
├── backend/
│   └── Spring Boot API
├── database/
|   └── init.sql
├── frontend/
│   └── Next.js application
├── docker-compose.yml
└── README.md
```

## Running the Application

The application is fully containerized and can be started with a single command.

### Requirements

- Docker
- Docker Compose

### Steps

1. Clone the repository:

```bash
git clone https://github.com/deiby1523/project-management-app.git

cd project-management-app
```

2. Run the application:

```bash
docker compose up
```

## Services
Once the application is running, the services will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MySQL Database: localhost:3307

## How It Works

- The backend connects to MySQL using environment variables defined in Docker Compose.
- The frontend communicates with the backend API.
- All services are networked internally using Docker.

## Notes
- The backend uses JWT for authentication.
- Users must register and log in to access protected endpoints.
- Projects support collaboration through members.
- Tasks can be assigned only to users within the same project.

## Future Improvements
- Pagination and filtering
- Unit and integration tests
- API documentation with Swagger
- Deployment configuration (CI/CD)

