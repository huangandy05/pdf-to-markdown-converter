from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import json
import shutil
import re
import markdown
from typing import List, Optional
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

app = FastAPI(title="React App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LessonCreate(BaseModel):
    heading: str
    topic: Optional[str] = ""
    backgroundColor: str

class LessonUpdate(BaseModel):
    heading: Optional[str] = None
    topic: Optional[str] = None
    backgroundColor: Optional[str] = None

class Lesson(BaseModel):
    id: str
    heading: str
    topic: str
    backgroundColor: str

class FileInfo(BaseModel):
    id: str
    name: str
    size: int
    upload_date: str
    has_pdf: bool
    has_md: bool

# Configuration
ALLOWED_EXTENSIONS = {
    'pdf', 'png', 'jpg', 'jpeg', 'ppt', 'pptx', 
    'doc', 'docx', 'xls', 'xlsx', 'html', 'epub'
}

# Helper functions
def get_lessons_dir():
    return os.path.join(os.path.dirname(os.path.dirname(__file__)), "lessons")

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def fix_image_paths_in_markdown(markdown_text: str, directory_name: str, available_images: List[str] = None) -> str:
    """Fix image paths in markdown to reference the correct directory"""
    pattern = r'!\[([^\]]*)\]\(([^\)]+)\)'
    
    def replace_image_path(match):
        alt_text = match.group(1)
        image_name = match.group(2)
        
        # Extract just the filename if it's already a path
        if '/' in image_name:
            image_name = os.path.basename(image_name)
        
        # If we have a list of available images, try to find a match
        if available_images:
            # First try exact match
            if image_name in available_images:
                new_path = f'http://localhost:8000/api/lessons/{directory_name}/images/{image_name}'
                return f'![{alt_text}]({new_path})'
            
            # Try to find a similar image (in case naming is slightly different)
            image_base = image_name.replace('.jpeg', '').replace('.jpg', '').replace('.png', '')
            for available_img in available_images:
                available_base = available_img.replace('.jpeg', '').replace('.jpg', '').replace('.png', '')
                if available_base in image_base or image_base in available_base:
                    new_path = f'http://localhost:8000/api/lessons/{directory_name}/images/{available_img}'
                    return f'![{alt_text}]({new_path})'
        
        # Default: use the original image name with correct path
        new_path = f'http://localhost:8000/api/lessons/{directory_name}/images/{image_name}'
        return f'![{alt_text}]({new_path})'
    
    return re.sub(pattern, replace_image_path, markdown_text)

def folder_name_from_heading(heading: str) -> str:
    return heading.replace(" ", "_")

def create_lesson_folder(heading: str, topic: str, background_color: str):
    lessons_dir = get_lessons_dir()
    folder_name = folder_name_from_heading(heading)
    folder_path = os.path.join(lessons_dir, folder_name)
    
    os.makedirs(folder_path, exist_ok=True)
    
    metadata = {
        "subheading": topic,
        "backgroundColor": background_color
    }
    
    metadata_path = os.path.join(folder_path, "metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    
    return folder_name

def read_lesson_metadata(folder_name: str):
    lessons_dir = get_lessons_dir()
    metadata_path = os.path.join(lessons_dir, folder_name, "metadata.json")
    
    if not os.path.exists(metadata_path):
        return {"subheading": "", "backgroundColor": "bg-gradient-to-br from-blue-100 to-blue-200"}
    
    with open(metadata_path, "r") as f:
        return json.load(f)

def update_lesson_metadata(folder_name: str, metadata: dict):
    lessons_dir = get_lessons_dir()
    metadata_path = os.path.join(lessons_dir, folder_name, "metadata.json")
    
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

# API Routes
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/lessons", response_model=List[Lesson])
async def get_lessons():
    lessons_dir = get_lessons_dir()
    
    if not os.path.exists(lessons_dir):
        return []
    
    lessons = []
    for folder_name in os.listdir(lessons_dir):
        folder_path = os.path.join(lessons_dir, folder_name)
        
        if os.path.isdir(folder_path):
            metadata = read_lesson_metadata(folder_name)
            heading = folder_name.replace("_", " ")
            
            lessons.append(Lesson(
                id=folder_name,
                heading=heading,
                topic=metadata.get("subheading", ""),
                backgroundColor=metadata.get("backgroundColor", "bg-gradient-to-br from-blue-100 to-blue-200")
            ))
    
    return lessons

@app.post("/api/lessons", response_model=Lesson)
async def create_lesson(lesson: LessonCreate):
    lessons_dir = get_lessons_dir()
    folder_name = folder_name_from_heading(lesson.heading)
    folder_path = os.path.join(lessons_dir, folder_name)
    
    if os.path.exists(folder_path):
        raise HTTPException(status_code=400, detail="Lesson with this name already exists")
    
    created_folder = create_lesson_folder(lesson.heading, lesson.topic or "", lesson.backgroundColor)
    
    return Lesson(
        id=created_folder,
        heading=lesson.heading,
        topic=lesson.topic or "",
        backgroundColor=lesson.backgroundColor
    )

@app.put("/api/lessons/{lesson_id}", response_model=Lesson)
async def update_lesson(lesson_id: str, lesson_update: LessonUpdate):
    lessons_dir = get_lessons_dir()
    folder_path = os.path.join(lessons_dir, lesson_id)
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    metadata = read_lesson_metadata(lesson_id)
    current_heading = lesson_id.replace("_", " ")
    
    # Update metadata
    if lesson_update.topic is not None:
        metadata["subheading"] = lesson_update.topic
    if lesson_update.backgroundColor is not None:
        metadata["backgroundColor"] = lesson_update.backgroundColor
    
    # Handle folder rename if heading changed
    new_folder_name = lesson_id
    if lesson_update.heading is not None and lesson_update.heading != current_heading:
        new_folder_name = folder_name_from_heading(lesson_update.heading)
        new_folder_path = os.path.join(lessons_dir, new_folder_name)
        
        if os.path.exists(new_folder_path):
            raise HTTPException(status_code=400, detail="Lesson with this name already exists")
        
        os.rename(folder_path, new_folder_path)
        lesson_id = new_folder_name
    
    update_lesson_metadata(lesson_id, metadata)
    
    return Lesson(
        id=lesson_id,
        heading=lesson_update.heading or current_heading,
        topic=metadata["subheading"],
        backgroundColor=metadata["backgroundColor"]
    )

@app.delete("/api/lessons/{lesson_id}")
async def delete_lesson(lesson_id: str):
    lessons_dir = get_lessons_dir()
    folder_path = os.path.join(lessons_dir, lesson_id)
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    shutil.rmtree(folder_path)
    
    return {"message": "Lesson deleted successfully"}

# File upload endpoints
@app.post("/api/lessons/{lesson_id}/upload")
async def upload_file(lesson_id: str, file: UploadFile = File(...)):
    lessons_dir = get_lessons_dir()
    lesson_path = os.path.join(lessons_dir, lesson_id)
    
    if not os.path.exists(lesson_path):
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if file type is allowed
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not supported")
    
    # Create a folder with the filename (without extension) inside the lesson folder
    file_name_without_ext = os.path.splitext(file.filename)[0] if file.filename else "unnamed"
    file_folder_path = os.path.join(lesson_path, file_name_without_ext)
    
    # Check if folder already exists
    if os.path.exists(file_folder_path):
        raise HTTPException(status_code=400, detail="File with this name already exists")
    
    try:
        # Create the folder
        os.makedirs(file_folder_path)
        
        # Save the file in the created folder
        file_path = os.path.join(file_folder_path, file.filename)
        content = await file.read()
        
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Process file with marker-pdf
        try:
            converter = PdfConverter(
                artifact_dict=create_model_dict(),
            )
            rendered = converter(file_path)
            text, _, images = text_from_rendered(rendered)
            
            # Handle extracted images
            saved_images = []
            if images and isinstance(images, dict):
                for image_name, pil_image in images.items():
                    try:
                        # Save PIL image to the upload directory
                        image_path = os.path.join(file_folder_path, image_name)
                        pil_image.save(image_path)
                        saved_images.append(image_name)
                    except Exception as e:
                        print(f"Error saving image {image_name}: {e}")
            
            # Check for any additional image files that might have been saved to disk by marker-pdf
            for location in ['.', file_folder_path]:
                if os.path.exists(location):
                    for filename in os.listdir(location):
                        if (filename.startswith('_page_') or filename.startswith(f'{file_name_without_ext}_page_')) and filename.endswith(('.jpeg', '.jpg', '.png')):
                            source_path = os.path.join(location, filename)
                            target_path = os.path.join(file_folder_path, filename)
                            
                            # Only move if it's not already in the target directory
                            if source_path != target_path and os.path.exists(source_path):
                                try:
                                    shutil.move(source_path, target_path)
                                    if filename not in saved_images:
                                        saved_images.append(filename)
                                except Exception as e:
                                    print(f"Error moving image {filename}: {e}")
            
            # Fix image paths in markdown
            fixed_markdown = fix_image_paths_in_markdown(text, f"{lesson_id}/files/{file_name_without_ext}", saved_images)
            
            # Save markdown file in the same directory
            md_filename = f"{file_name_without_ext}.md"
            md_filepath = os.path.join(file_folder_path, md_filename)
            
            with open(md_filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_markdown)
            
            return {
                "id": file_name_without_ext,
                "name": file.filename,
                "size": len(content),
                "message": "File uploaded and processed successfully",
                "markdown_created": True,
                "images_extracted": len(saved_images)
            }
            
        except Exception as e:
            # If processing fails, clean up the entire folder and raise error
            if os.path.exists(file_folder_path):
                shutil.rmtree(file_folder_path)
            raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")
            
    except HTTPException:
        # Re-raise HTTP exceptions (like processing failed)
        raise
    except Exception as e:
        # Clean up folder if it was created
        if os.path.exists(file_folder_path):
            shutil.rmtree(file_folder_path)
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

@app.get("/api/lessons/{lesson_id}/files", response_model=List[FileInfo])
async def get_lesson_files(lesson_id: str):
    lessons_dir = get_lessons_dir()
    lesson_path = os.path.join(lessons_dir, lesson_id)
    
    if not os.path.exists(lesson_path):
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    files = []
    for item in os.listdir(lesson_path):
        item_path = os.path.join(lesson_path, item)
        
        # Skip metadata.json and only look at folders (which contain uploaded files)
        if os.path.isdir(item_path) and item != "metadata.json":
            # Look for files in the folder
            folder_files = os.listdir(item_path)
            has_pdf = any(f.lower().endswith('.pdf') for f in folder_files)
            has_md = any(f.lower().endswith('.md') for f in folder_files)
            
            # Find the main file (not .md and not image files)
            main_file = None
            for file_name in folder_files:
                if not file_name.lower().endswith('.md') and not file_name.startswith('_page_'):
                    file_path = os.path.join(item_path, file_name)
                    if os.path.isfile(file_path):
                        main_file = file_name
                        break
            
            if main_file:
                file_path = os.path.join(item_path, main_file)
                stat = os.stat(file_path)
                files.append(FileInfo(
                    id=item,  # folder name
                    name=main_file,
                    size=stat.st_size,
                    upload_date=str(stat.st_mtime),
                    has_pdf=has_pdf,
                    has_md=has_md
                ))
    
    return files

@app.delete("/api/lessons/{lesson_id}/files/{file_id}")
async def delete_file(lesson_id: str, file_id: str):
    lessons_dir = get_lessons_dir()
    lesson_path = os.path.join(lessons_dir, lesson_id)
    file_folder_path = os.path.join(lesson_path, file_id)
    
    if not os.path.exists(lesson_path):
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    if not os.path.exists(file_folder_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        shutil.rmtree(file_folder_path)
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

# File viewing endpoints
@app.get("/api/lessons/{lesson_id}/files/{file_id}/pdf")
async def serve_pdf(lesson_id: str, file_id: str):
    lessons_dir = get_lessons_dir()
    lesson_path = os.path.join(lessons_dir, lesson_id)
    file_folder_path = os.path.join(lesson_path, file_id)
    
    if not os.path.exists(file_folder_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Look for PDF file in the folder
    for filename in os.listdir(file_folder_path):
        if filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(file_folder_path, filename)
            return FileResponse(
                pdf_path, 
                media_type="application/pdf",
                headers={"Content-Disposition": "inline"}
            )
    
    raise HTTPException(status_code=404, detail="PDF file not found")

@app.get("/api/lessons/{lesson_id}/files/{file_id}/markdown")
async def get_markdown_content(lesson_id: str, file_id: str):
    lessons_dir = get_lessons_dir()
    lesson_path = os.path.join(lessons_dir, lesson_id)
    file_folder_path = os.path.join(lesson_path, file_id)
    
    if not os.path.exists(file_folder_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Look for markdown file in the folder
    md_file_path = None
    for filename in os.listdir(file_folder_path):
        if filename.lower().endswith('.md'):
            md_file_path = os.path.join(file_folder_path, filename)
            break
    
    if not md_file_path or not os.path.exists(md_file_path):
        return JSONResponse({
            "exists": False,
            "error": "Markdown file not found"
        })
    
    try:
        # Read markdown content
        with open(md_file_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Convert to HTML for rendered view
        html_content = markdown.markdown(markdown_content, extensions=['tables', 'fenced_code'])
        
        return JSONResponse({
            "exists": True,
            "markdown_source": markdown_content,
            "html_content": html_content,
            "filename": os.path.basename(md_file_path)
        })
        
    except Exception as e:
        return JSONResponse({
            "exists": False,
            "error": f"Failed to read markdown file: {str(e)}"
        })

# Serve static files (images) from lesson folders
@app.get("/api/lessons/{lesson_id}/files/{file_id}/images/{image_name}")
async def serve_image(lesson_id: str, file_id: str, image_name: str):
    lessons_dir = get_lessons_dir()
    lesson_path = os.path.join(lessons_dir, lesson_id)
    file_folder_path = os.path.join(lesson_path, file_id)
    image_path = os.path.join(file_folder_path, image_name)
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(image_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)