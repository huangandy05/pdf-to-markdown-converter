# React + FastAPI App

A full-stack application with React frontend and FastAPI backend.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tool
- **React Router** for routing
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components

### Backend
- **FastAPI** for API
- **Uvicorn** ASGI server

## Getting Started

### Prerequisites
- Node.js (v20.19.0+ or v22.12.0+)
- Python 3.8+
- pip

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

### Development

1. Start both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:8000

2. Or run them separately:
```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend
```

### Build

Build the frontend for production:
```bash
npm run build
```

## Project Structure

```
├── frontend/           # React app
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utilities
│   └── ...
├── backend/            # FastAPI app
│   ├── main.py         # FastAPI application
│   └── requirements.txt
└── package.json        # Root package.json with scripts
```

## API Endpoints

- `GET /` - Hello World
- `GET /api/health` - Health check

## Development Notes

- The frontend is configured to proxy API requests to the backend
- CORS is configured to allow requests from the frontend
- shadcn/ui components are ready to use with proper styling