# Infrastructure

Docker and deployment configurations for NudibranchID.io

## Quick Start

### Development Environment

```bash
docker-compose up --build
```

This will start:
- Backend API on http://localhost:8000
- Frontend app on http://localhost:3000
- PostgreSQL database on localhost:5432

### Individual Services

```bash
# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend

# Database only
docker-compose up db
```

## Configuration Files

- `docker-compose.yml` - Main orchestration file
- `Dockerfile.backend` - Backend container definition
- `Dockerfile.frontend` - Frontend container definition

## Volumes

- `postgres_data` - Persistent database storage

## Environment Variables

Configure in `docker-compose.yml` or create `.env` files:

**Backend:**
- DATABASE_URL
- MODEL_PATH
- SECRET_KEY

**Frontend:**
- REACT_APP_API_URL

## Production Deployment

For production, consider:
1. Using production-optimized Dockerfiles
2. Implementing proper secrets management
3. Setting up reverse proxy (nginx)
4. Configuring SSL/TLS certificates
5. Implementing health checks and monitoring

