# Marker PDF - Document Processing and Lesson Management System

A full-stack application that allows you to upload PDF documents and other files, automatically convert them to structured markdown using AI, and organize them into lessons with an intuitive web interface.

## Features

- **Document Upload & Processing**: Upload PDFs, images, and other document formats
- **AI-Powered Conversion**: Automatic conversion to markdown with image extraction using marker-pdf
- **Lesson Organization**: Create and manage lesson folders with custom topics and styling
- **File Management**: View, organize, and delete uploaded files
- **Dual View**: Switch between PDF and markdown views of your documents
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **FastAPI** - Python web framework
- **marker-pdf** - AI document processing library
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Radix UI** - UI components
- **Vite** - Build tool

## Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

## Installation

### Quick Start (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev
```

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marker-pdf
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Development Mode

**Option 1: Run both servers simultaneously**
```bash
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

### Production Build

```bash
npm run build
```

## Usage

1. **Access the application**
   - Open your browser to `http://localhost:5173`
   - The backend API runs on `http://localhost:8000`

2. **Create a lesson**
   - Click "New Lesson" to create a lesson folder
   - Add a title, topic, and choose a background color

3. **Upload documents**
   - Navigate to a lesson
   - Upload PDF files or other supported formats
   - The system will automatically:
     - Extract text and convert to markdown
     - Extract and save images
     - Create a folder structure for organization

4. **View documents**
   - Switch between PDF and markdown views
   - Images are automatically embedded in the markdown
   - Original files are preserved alongside processed versions

## API Endpoints

### Lessons
- `GET /api/lessons` - List all lessons
- `POST /api/lessons` - Create a new lesson
- `PUT /api/lessons/{lesson_id}` - Update a lesson
- `DELETE /api/lessons/{lesson_id}` - Delete a lesson

### Files
- `POST /api/lessons/{lesson_id}/upload` - Upload a file
- `GET /api/lessons/{lesson_id}/files` - List files in a lesson
- `DELETE /api/lessons/{lesson_id}/files/{file_id}` - Delete a file
- `GET /api/lessons/{lesson_id}/files/{file_id}/pdf` - Serve PDF file
- `GET /api/lessons/{lesson_id}/files/{file_id}/markdown` - Get markdown content
- `GET /api/lessons/{lesson_id}/files/{file_id}/images/{image_name}` - Serve images

## Supported File Formats

- **Documents**: PDF, DOC, DOCX, HTML, EPUB
- **Presentations**: PPT, PPTX
- **Spreadsheets**: XLS, XLSX
- **Images**: PNG, JPG, JPEG

## Project Structure

```
marker-pdf/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── server.log          # Server logs
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
├── lessons/                 # Uploaded lessons and files
├── package.json            # Root package.json with scripts
└── README.md              # This file
```

## Configuration

The application uses these default settings:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- CORS: Configured for local development

## Troubleshooting

1. **Installation Issues**
   - Ensure Python 3.8+ and Node.js 16+ are installed
   - Try `pip install --upgrade pip` before installing Python dependencies

2. **Port Conflicts**
   - Backend runs on port 8000, frontend on 5173
   - Modify the ports in `package.json` scripts if needed

3. **File Upload Issues**
   - Check file format is supported
   - Ensure sufficient disk space
   - Check backend logs for processing errors

4. **marker-pdf Processing**
   - Some complex PDFs may take longer to process
   - Check server logs for detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.