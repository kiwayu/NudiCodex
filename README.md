# NudibranchID.io

A comprehensive web application for nudibranch identification using machine learning and computer vision.

## 🏗️ Monorepo Structure

```
nudibranchid-io/
├── backend/           # FastAPI backend application
├── frontend/          # React + TypeScript frontend
├── infrastructure/    # Docker and deployment configurations
├── data/             # Datasets and ML models
├── scripts/          # Automation and utility scripts
├── docs/             # Project documentation
└── README.md         # This file
```

## 📋 Prerequisites

- **Python 3.9+** - For backend development
- **Node.js 18+** - For frontend development
- **Docker & Docker Compose** - For containerization
- **Git** - Version control

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker Setup

```bash
cd infrastructure
docker-compose up --build
```

## 📦 Project Components

### Backend (`/backend`)
FastAPI-based REST API providing:
- Image upload and processing
- ML model inference
- Species identification
- Database management

### Frontend (`/frontend`)
React + TypeScript web application featuring:
- Modern, responsive UI
- Image upload interface
- Real-time identification results
- Species information display

### Infrastructure (`/infrastructure`)
Docker configurations for:
- Development environment
- Production deployment
- Database services
- Reverse proxy setup

### Data (`/data`)
Machine learning assets:
- Training datasets
- Preprocessed data
- Trained models
- Model weights

### Scripts (`/scripts`)
Automation tools:
- Data preprocessing
- Model training pipelines
- Deployment scripts
- Database migrations

### Documentation (`/docs`)
Project documentation:
- API documentation
- Architecture diagrams
- Development guides
- Deployment instructions

## 🛠️ Development

### Code Style

- **Backend**: Follow PEP 8, use `black` for formatting
- **Frontend**: Use ESLint + Prettier with TypeScript strict mode

### Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Environment Variables

Create `.env` files in respective directories:

**Backend `.env`:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/nudibranchid
MODEL_PATH=../data/models/nudibranch_classifier.h5
SECRET_KEY=your-secret-key
```

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Authors

[Your Team/Name Here]

## 🔗 Links

- [Documentation](./docs)
- [API Documentation](http://localhost:8000/docs)
- [Issues](https://github.com/yourusername/nudibranchid-io/issues)

