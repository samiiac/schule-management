# Schüle Management System

A backend API for managing a school — users, departments, courses, enrollments, grades, and waitlists.


## Features

- **Authentication** — JWT access + refresh tokens, password change required on first login
- **Role-based access control** — ADMIN / INSTRUCTOR / STUDENT / PARENT, with scoped permissions (`:any`, `:own`, `:taught`)
- **Departments & courses** — full CRUD with department/instructor ownership rules
- **Enrollments** — atomic seat reservation (no overselling under concurrent load), waitlist with auto-enroll when a seat frees
- **Grades** — instructor-only grading with automatic GPA recalculation
- **Rate limiting** — per-route limits on auth endpoints to prevent brute-force attacks

## Getting started

### Prerequisites

- Node.js 24+
- Docker

### Run with Docker (recommended)

```bash
git clone https://github.com/samiiac/schule-management.git
cd schule-management
cp .env.example .env.docker
# fill in .env.docker 

docker compose up -d
docker compose exec app npx prisma migrate deploy
