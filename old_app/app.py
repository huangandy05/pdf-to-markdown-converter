import os
import re
import shutil
from datetime import datetime
from flask import Flask, request, render_template, jsonify, send_file, send_from_directory
from werkzeug.utils import secure_filename
import markdown
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {
    'pdf', 'png', 'jpg', 'jpeg', 'ppt', 'pptx', 
    'doc', 'docx', 'xls', 'xlsx', 'html', 'epub'
}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_unique_directory(base_path, dir_name):
    """Get a unique directory name by appending numbers if needed"""
    counter = 1
    new_dir_path = os.path.join(base_path, dir_name)
    
    while os.path.exists(new_dir_path):
        new_dir_path = os.path.join(base_path, f"{dir_name}_{counter}")
        counter += 1
    
    return new_dir_path

def fix_image_paths_in_markdown(markdown_text, directory_name, available_images=None):
    """Fix image paths in markdown to reference the correct directory"""
    # Pattern to match image references like ![alt](_page_8_Figure_2.jpeg)
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
                new_path = f'/uploads/{directory_name}/{image_name}'
                return f'![{alt_text}]({new_path})'
            
            # Try to find a similar image (in case naming is slightly different)
            image_base = image_name.replace('.jpeg', '').replace('.jpg', '').replace('.png', '')
            for available_img in available_images:
                available_base = available_img.replace('.jpeg', '').replace('.jpg', '').replace('.png', '')
                if available_base in image_base or image_base in available_base:
                    new_path = f'/uploads/{directory_name}/{available_img}'
                    return f'![{alt_text}]({new_path})'
        
        # Default: use the original image name with correct path
        new_path = f'/uploads/{directory_name}/{image_name}'
        return f'![{alt_text}]({new_path})'
    
    return re.sub(pattern, replace_image_path, markdown_text)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file selected'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not supported'}), 400
        
        # Create uploads directory if it doesn't exist
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Create directory for this upload
        filename = secure_filename(file.filename)
        base_name = os.path.splitext(filename)[0]
        
        # Get unique directory name
        upload_dir = get_unique_directory(app.config['UPLOAD_FOLDER'], base_name)
        os.makedirs(upload_dir)
        
        # Save original file to the directory
        original_filepath = os.path.join(upload_dir, filename)
        file.save(original_filepath)
        
        # Convert to markdown
        try:
            converter = PdfConverter(
                artifact_dict=create_model_dict(),
            )
            rendered = converter(original_filepath)
            text, _, images = text_from_rendered(rendered)
            
            # Get directory name for image path fixing
            directory_name = os.path.basename(upload_dir)
            
            # Handle extracted images first to get list of available images
            saved_images = []
            if images and isinstance(images, dict):
                for image_name, pil_image in images.items():
                    try:
                        # Save PIL image to the upload directory
                        image_path = os.path.join(upload_dir, image_name)
                        pil_image.save(image_path)
                        saved_images.append(image_name)
                        print(f"Saved image: {image_name}")
                    except Exception as e:
                        print(f"Error saving image {image_name}: {e}")
            
            # Fix image paths in markdown with knowledge of available images
            fixed_markdown = fix_image_paths_in_markdown(text, directory_name, saved_images)
            
            # Save markdown file in the same directory
            md_filename = f"{base_name}.md"
            md_filepath = os.path.join(upload_dir, md_filename)
            
            with open(md_filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_markdown)
            
            # Also check for any additional image files that might have been saved to disk by marker-pdf
            for location in ['.', upload_dir]:
                if os.path.exists(location):
                    for file in os.listdir(location):
                        if (file.startswith('_page_') or file.startswith(f'{base_name}_page_')) and file.endswith(('.jpeg', '.jpg', '.png')):
                            source_path = os.path.join(location, file)
                            target_path = os.path.join(upload_dir, file)
                            
                            # Only move if it's not already in the target directory
                            if source_path != target_path and os.path.exists(source_path):
                                try:
                                    shutil.move(source_path, target_path)
                                    if file not in saved_images:
                                        saved_images.append(file)
                                        print(f"Moved additional image file: {file}")
                                except Exception as e:
                                    print(f"Error moving image {file}: {e}")
            
            print(f"Total images saved: {len(saved_images)}")
            if saved_images:
                print(f"Images: {', '.join(saved_images)}")
            
            # Convert markdown to HTML for display
            html_content = markdown.markdown(fixed_markdown, extensions=['tables', 'fenced_code'])
            
            return jsonify({
                'success': True,
                'markdown_content': fixed_markdown,
                'html_content': html_content,
                'directory_name': directory_name,
                'original_filename': filename,
                'pdf_path': f'/uploads/{directory_name}/{filename}',
                'md_path': f'/uploads/{directory_name}/{md_filename}'
            })
            
        except Exception as e:
            # Clean up directory if conversion fails
            if os.path.exists(upload_dir):
                shutil.rmtree(upload_dir)
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/directories')
def list_directories():
    """List all upload directories with metadata"""
    try:
        uploads_path = app.config['UPLOAD_FOLDER']
        if not os.path.exists(uploads_path):
            return jsonify({'directories': []})
        
        directories = []
        for item in os.listdir(uploads_path):
            item_path = os.path.join(uploads_path, item)
            if os.path.isdir(item_path):
                # Get creation time
                creation_time = os.path.getctime(item_path)
                creation_date = datetime.fromtimestamp(creation_time).strftime('%Y-%m-%d %H:%M')
                
                # Check for PDF and MD files
                files = os.listdir(item_path)
                pdf_file = next((f for f in files if f.lower().endswith('.pdf')), None)
                md_file = next((f for f in files if f.lower().endswith('.md')), None)
                
                directories.append({
                    'name': item,
                    'created': creation_date,
                    'pdf_file': pdf_file,
                    'md_file': md_file,
                    'has_pdf': pdf_file is not None,
                    'has_md': md_file is not None
                })
        
        # Sort by creation time (newest first)
        directories.sort(key=lambda x: x['created'], reverse=True)
        return jsonify({'directories': directories})
        
    except Exception as e:
        return jsonify({'error': f'Failed to list directories: {str(e)}'}), 500

@app.route('/uploads/<directory_name>/<filename>')
def serve_file(directory_name, filename):
    """Serve files from upload directories"""
    try:
        directory_path = os.path.join(app.config['UPLOAD_FOLDER'], directory_name)
        return send_from_directory(directory_path, filename)
    except Exception as e:
        return jsonify({'error': f'File not found: {str(e)}'}), 404

@app.route('/view/<directory_name>')
def view_directory(directory_name):
    """Get directory contents for viewing"""
    try:
        directory_path = os.path.join(app.config['UPLOAD_FOLDER'], directory_name)
        if not os.path.exists(directory_path):
            return jsonify({'error': 'Directory not found'}), 404
        
        files = os.listdir(directory_path)
        pdf_file = next((f for f in files if f.lower().endswith('.pdf')), None)
        md_file = next((f for f in files if f.lower().endswith('.md')), None)
        
        result = {
            'directory_name': directory_name,
            'pdf_file': pdf_file,
            'md_file': md_file,
            'pdf_path': f'/uploads/{directory_name}/{pdf_file}' if pdf_file else None,
            'md_path': f'/uploads/{directory_name}/{md_file}' if md_file else None
        }
        
        # If markdown file exists, read and process it
        if md_file:
            md_filepath = os.path.join(directory_path, md_file)
            with open(md_filepath, 'r', encoding='utf-8') as f:
                markdown_content = f.read()
            
            # Convert to HTML
            html_content = markdown.markdown(markdown_content, extensions=['tables', 'fenced_code'])
            result['markdown_content'] = markdown_content
            result['html_content'] = html_content
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': f'Failed to view directory: {str(e)}'}), 500

@app.route('/download/<directory_name>/<filename>')
def download_file(directory_name, filename):
    """Download files from upload directories"""
    try:
        directory_path = os.path.join(app.config['UPLOAD_FOLDER'], directory_name)
        return send_from_directory(directory_path, filename, as_attachment=True)
    except Exception as e:
        return jsonify({'error': f'Download failed: {str(e)}'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)