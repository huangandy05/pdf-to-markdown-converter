# Document to Markdown Converter

A simple, single-page local web application that converts supported document types (PDF, Word, PowerPoint, Excel, images, HTML, EPUB) into Markdown using the marker-pdf Python package.

## Features

- 📁 **Drag-and-drop or file selection** for common document formats
- ⚡ **Automatic conversion** to Markdown using marker-pdf
- 💾 **Local file saving** - .md files saved in the same directory as uploaded files
- 👀 **Live preview** - view rendered Markdown as HTML in the browser
- 🔒 **Runs entirely locally** - no external server calls or cloud storage
- 📱 **Responsive design** - works on desktop and mobile devices

## Supported File Types

- **PDF**: `.pdf`
- **Images**: `.png`, `.jpg`, `.jpeg`
- **Microsoft Office**: `.ppt`, `.pptx`, `.doc`, `.docx`, `.xls`, `.xlsx`
- **Web**: `.html`
- **E-books**: `.epub`

## Installation

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**:
   ```bash
   python app.py
   ```

3. **Open your browser** and navigate to:
   ```
   http://127.0.0.1:5000
   ```

## Usage

1. **Upload a file**: 
   - Drag and drop a supported file onto the upload area, or
   - Click "browse files" to select a file

2. **Convert**: 
   - Click the "Convert to Markdown" button
   - Wait for the conversion to complete

3. **View results**:
   - Switch between "Rendered View" (HTML) and "Markdown Source" tabs
   - Download the generated .md file
   - Start a new conversion if needed

## Requirements

- Python 3.7+
- Dependencies listed in `requirements.txt`:
  - Flask
  - marker-pdf
  - markdown
  - Werkzeug

## File Structure

```
marker-pdf/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main web interface
├── static/
│   ├── style.css         # Application styling
│   └── script.js         # Client-side functionality
├── uploads/              # Temporary file storage (created automatically)
└── README.md            # This file
```

## Error Handling

The application includes comprehensive error handling for:

- **Unsupported file types** - Only allowed extensions are processed
- **File size limits** - Maximum 100MB per file
- **Conversion errors** - Clear error messages if marker-pdf fails
- **File access issues** - Permission and path-related errors
- **Network issues** - Frontend handles connection problems gracefully

## Technical Details

- **Backend**: Flask web framework with marker-pdf integration
- **Frontend**: Vanilla HTML/CSS/JavaScript with modern ES6+ features
- **File handling**: Secure filename processing with collision prevention
- **Conversion**: Uses marker-pdf's PdfConverter with create_model_dict artifacts
- **Output**: Markdown files saved locally, HTML rendered in browser

## Security Features

- File type validation (client and server-side)
- Secure filename handling
- File size limits
- Local-only operation (no external requests)

## Browser Compatibility

- Modern browsers supporting ES6+ (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Responsive design works on mobile devices

## Troubleshooting

**Application won't start:**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check Python version (3.7+ required)

**Conversion fails:**
- Verify the file type is supported
- Check file isn't corrupted
- Ensure sufficient disk space for output files

**Files not found:**
- Check that uploads/ directory has write permissions
- Verify file paths don't contain special characters

## License

This project is for local use and educational purposes.