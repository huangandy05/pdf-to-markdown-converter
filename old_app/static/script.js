class DocumentConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.selectedFile = null;
        this.currentDirectory = null;
        this.pdfDoc = null;
        this.currentPage = 1;
        this.zoom = 1.0;
        
        // Configure PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    initializeElements() {
        // Upload elements
        this.fileDropArea = document.getElementById('fileDropArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.removeFileBtn = document.getElementById('removeFile');
        this.convertBtn = document.getElementById('convertBtn');
        this.viewDirectoriesBtn = document.getElementById('viewDirectoriesBtn');
        
        // Progress elements
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // Error elements
        this.errorSection = document.getElementById('errorSection');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Result elements
        this.resultSection = document.getElementById('resultSection');
        this.viewDocumentBtn = document.getElementById('viewDocumentBtn');
        this.newConversionBtn = document.getElementById('newConversionBtn');
        
        // Viewer elements
        this.viewerContainer = document.getElementById('viewerContainer');
        this.viewerTitle = document.getElementById('viewerTitle');
        this.backBtn = document.getElementById('backBtn');
        this.downloadPdfBtn = document.getElementById('downloadPdfBtn');
        this.downloadMdBtn = document.getElementById('downloadMdBtn');
        
        // Directory panel
        this.directoryList = document.getElementById('directoryList');
        
        // PDF panel
        this.pdfPagesContainer = document.getElementById('pdfPagesContainer');
        this.pdfControls = document.getElementById('pdfControls');
        this.zoomOutBtn = document.getElementById('zoomOut');
        this.zoomInBtn = document.getElementById('zoomIn');
        this.resetZoomBtn = document.getElementById('resetZoom');
        this.zoomInfo = document.getElementById('zoomInfo');
        
        // Markdown panel
        this.renderedContent = document.getElementById('renderedContent');
        this.markdownSource = document.getElementById('markdownSource');
        
        // Upload section
        this.uploadSection = document.getElementById('uploadSection');
        
        this.allowedTypes = [
            'application/pdf',
            'image/png', 'image/jpeg', 'image/jpg',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/html',
            'application/epub+zip'
        ];

        this.allowedExtensions = [
            '.pdf', '.png', '.jpg', '.jpeg', '.ppt', '.pptx',
            '.doc', '.docx', '.xls', '.xlsx', '.html', '.epub'
        ];
    }

    bindEvents() {
        // File drop area events
        this.fileDropArea.addEventListener('click', () => this.fileInput.click());
        this.fileDropArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.fileDropArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.fileDropArea.addEventListener('drop', this.handleDrop.bind(this));

        // File input change
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Remove file
        this.removeFileBtn.addEventListener('click', this.removeFile.bind(this));

        // Convert button
        this.convertBtn.addEventListener('click', this.convertFile.bind(this));

        // View directories button
        this.viewDirectoriesBtn.addEventListener('click', this.showViewer.bind(this));

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', this.switchTab.bind(this));
        });

        // Viewer buttons
        this.viewDocumentBtn?.addEventListener('click', this.viewCurrentDocument.bind(this));
        this.newConversionBtn.addEventListener('click', this.resetForNewConversion.bind(this));
        this.backBtn.addEventListener('click', this.backToUpload.bind(this));
        
        // Download buttons
        this.downloadPdfBtn?.addEventListener('click', this.downloadPdf.bind(this));
        this.downloadMdBtn?.addEventListener('click', this.downloadMarkdown.bind(this));

        // PDF controls
        this.zoomOutBtn?.addEventListener('click', this.zoomOut.bind(this));
        this.zoomInBtn?.addEventListener('click', this.zoomIn.bind(this));
        this.resetZoomBtn?.addEventListener('click', this.resetZoom.bind(this));

        // Browse link
        document.querySelector('.browse-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.fileInput.click();
        });
    }

    // File upload methods
    handleDragOver(e) {
        e.preventDefault();
        this.fileDropArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.fileDropArea.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.fileDropArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        if (!this.validateFile(file)) {
            return;
        }

        this.selectedFile = file;
        this.displayFileInfo(file);
        this.convertBtn.disabled = false;
        this.hideError();
    }

    validateFile(file) {
        // Check file size (100MB limit)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('File size exceeds 100MB limit.');
            return false;
        }

        // Check file type
        const fileName = file.name.toLowerCase();
        const isValidExtension = this.allowedExtensions.some(ext => fileName.endsWith(ext));
        const isValidMimeType = this.allowedTypes.includes(file.type);

        if (!isValidExtension && !isValidMimeType) {
            this.showError('File type not supported. Please select a PDF, image, Office document, HTML, or EPUB file.');
            return false;
        }

        return true;
    }

    displayFileInfo(file) {
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        this.fileInfo.style.display = 'flex';
        this.fileDropArea.style.display = 'none';
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    removeFile() {
        this.selectedFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.fileDropArea.style.display = 'block';
        this.convertBtn.disabled = true;
        this.hideError();
        this.hideResult();
    }

    async convertFile() {
        if (!this.selectedFile) return;

        this.showProgress();
        this.hideError();
        this.hideResult();

        try {
            const formData = new FormData();
            formData.append('file', this.selectedFile);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.currentConversionResult = result;
                this.showResult();
            } else {
                this.showError(result.error || 'Conversion failed');
            }
        } catch (error) {
            this.showError('Network error: ' + error.message);
        } finally {
            this.hideProgress();
        }
    }

    // Progress and error methods
    showProgress() {
        this.progressSection.style.display = 'block';
        this.convertBtn.disabled = true;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 90) progress = 90;
            this.progressFill.style.width = progress + '%';
        }, 200);

        this.progressInterval = interval;
    }

    hideProgress() {
        this.progressSection.style.display = 'none';
        this.convertBtn.disabled = false;
        this.progressFill.style.width = '0%';
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorSection.style.display = 'block';
    }

    hideError() {
        this.errorSection.style.display = 'none';
    }

    showResult() {
        this.resultSection.style.display = 'block';
        this.removeFile();
    }

    hideResult() {
        this.resultSection.style.display = 'none';
    }

    // Viewer methods
    async showViewer() {
        this.uploadSection.style.display = 'none';
        this.viewerContainer.style.display = 'block';
        this.hideError();
        this.hideResult();
        
        await this.loadDirectories();
    }

    backToUpload() {
        this.viewerContainer.style.display = 'none';
        this.uploadSection.style.display = 'block';
        this.clearViewer();
    }

    async viewCurrentDocument() {
        if (this.currentConversionResult) {
            await this.showViewer();
            await this.selectDirectory(this.currentConversionResult.directory_name);
        }
    }

    clearViewer() {
        this.clearPdfViewer();
        this.clearMarkdownViewer();
        this.currentDirectory = null;
    }

    // Directory management
    async loadDirectories() {
        this.directoryList.innerHTML = '<div class="loading">Loading directories...</div>';
        
        try {
            const response = await fetch('/directories');
            const result = await response.json();
            
            if (response.ok) {
                this.displayDirectories(result.directories);
            } else {
                this.directoryList.innerHTML = '<div class="error">Error loading directories</div>';
            }
        } catch (error) {
            this.directoryList.innerHTML = '<div class="error">Network error</div>';
        }
    }

    displayDirectories(directories) {
        if (directories.length === 0) {
            this.directoryList.innerHTML = '<div class="no-directories">No converted documents found</div>';
            return;
        }

        this.directoryList.innerHTML = '';
        
        directories.forEach(dir => {
            const dirElement = document.createElement('div');
            dirElement.className = 'directory-item';
            dirElement.dataset.directoryName = dir.name;
            
            dirElement.innerHTML = `
                <div class="directory-name">${dir.name}</div>
                <div class="directory-date">${dir.created}</div>
                <div class="directory-files">
                    ${dir.has_pdf ? '<span class="file-indicator pdf">PDF</span>' : ''}
                    ${dir.has_md ? '<span class="file-indicator md">MD</span>' : ''}
                </div>
            `;
            
            dirElement.addEventListener('click', () => this.selectDirectory(dir.name));
            this.directoryList.appendChild(dirElement);
        });
    }

    async selectDirectory(directoryName) {
        // Update selection
        document.querySelectorAll('.directory-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-directory-name="${directoryName}"]`)?.classList.add('selected');
        
        this.currentDirectory = directoryName;
        this.viewerTitle.textContent = `Viewing: ${directoryName}`;
        
        try {
            const response = await fetch(`/view/${directoryName}`);
            const result = await response.json();
            
            if (response.ok) {
                await this.displayDocument(result);
            } else {
                this.showError('Error loading document: ' + result.error);
            }
        } catch (error) {
            this.showError('Network error: ' + error.message);
        }
    }

    async displayDocument(docData) {
        // Update download buttons
        if (docData.pdf_path) {
            this.downloadPdfBtn.style.display = 'inline-block';
            this.downloadPdfBtn.onclick = () => window.open(`/download/${docData.directory_name}/${docData.pdf_file}`);
        } else {
            this.downloadPdfBtn.style.display = 'none';
        }
        
        if (docData.md_path) {
            this.downloadMdBtn.style.display = 'inline-block';
            this.downloadMdBtn.onclick = () => window.open(`/download/${docData.directory_name}/${docData.md_file}`);
        } else {
            this.downloadMdBtn.style.display = 'none';
        }
        
        // Load PDF
        if (docData.pdf_path) {
            await this.loadPdf(docData.pdf_path);
        } else {
            this.clearPdfViewer();
        }
        
        // Load Markdown
        if (docData.html_content && docData.markdown_content) {
            this.displayMarkdown(docData.html_content, docData.markdown_content);
        } else {
            this.clearMarkdownViewer();
        }
    }

    // PDF viewer methods
    async loadPdf(pdfPath) {
        try {
            const loadingTask = pdfjsLib.getDocument(pdfPath);
            this.pdfDoc = await loadingTask.promise;
            this.zoom = 1.0;
            
            await this.renderAllPages();
            this.pdfControls.style.display = 'flex';
            this.updateZoomInfo();
            
            // Hide no-pdf message and show pages container
            const noPdf = document.querySelector('.pdf-viewer .no-pdf');
            if (noPdf) noPdf.style.display = 'none';
            this.pdfPagesContainer.style.display = 'block';
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.clearPdfViewer();
        }
    }

    async renderAllPages() {
        if (!this.pdfDoc) return;
        
        // Clear existing pages
        this.pdfPagesContainer.innerHTML = '';
        
        // Render all pages
        for (let pageNum = 1; pageNum <= this.pdfDoc.numPages; pageNum++) {
            await this.renderPage(pageNum);
        }
    }

    async renderPage(pageNum) {
        if (!this.pdfDoc) return;
        
        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: this.zoom });
            
            // Create canvas for this page
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Create page container
            const pageDiv = document.createElement('div');
            pageDiv.className = 'pdf-page';
            pageDiv.appendChild(canvas);
            
            // Add page number label
            const pageLabel = document.createElement('div');
            pageLabel.textContent = `Page ${pageNum}`;
            pageLabel.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 5px; text-align: center;';
            pageDiv.insertBefore(pageLabel, canvas);
            
            this.pdfPagesContainer.appendChild(pageDiv);
            
            // Render the page
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
        } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
        }
    }

    updateZoomInfo() {
        const zoomPercent = Math.round(this.zoom * 100);
        this.zoomInfo.textContent = `${zoomPercent}%`;
    }

    async zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 3.0);
        await this.renderAllPages();
        this.updateZoomInfo();
    }

    async zoomOut() {
        this.zoom = Math.max(this.zoom / 1.2, 0.5);
        await this.renderAllPages();
        this.updateZoomInfo();
    }

    async resetZoom() {
        this.zoom = 1.0;
        await this.renderAllPages();
        this.updateZoomInfo();
    }

    clearPdfViewer() {
        this.pdfPagesContainer.style.display = 'none';
        this.pdfPagesContainer.innerHTML = '';
        this.pdfControls.style.display = 'none';
        this.pdfDoc = null;
        
        const noPdf = document.querySelector('.pdf-viewer .no-pdf');
        if (noPdf) noPdf.style.display = 'flex';
    }

    // Markdown viewer methods
    displayMarkdown(htmlContent, markdownContent) {
        this.renderedContent.innerHTML = htmlContent;
        this.markdownSource.textContent = markdownContent;
        
        // Hide no-markdown message
        const noMarkdown = document.querySelector('.no-markdown');
        if (noMarkdown) noMarkdown.style.display = 'none';
        
        // Handle broken images
        const images = this.renderedContent.querySelectorAll('img');
        images.forEach(img => {
            img.onerror = function() {
                this.style.display = 'inline-block';
                this.style.width = '200px';
                this.style.height = '100px';
                this.style.backgroundColor = '#f8f9fa';
                this.style.border = '2px dashed #dee2e6';
                this.style.color = '#6c757d';
                this.style.textAlign = 'center';
                this.style.lineHeight = '100px';
                this.style.fontSize = '14px';
                this.alt = 'Image not found: ' + (this.src ? this.src.split('/').pop() : 'unknown');
                this.removeAttribute('src');
            };
        });
    }

    clearMarkdownViewer() {
        this.renderedContent.innerHTML = '<div class="no-markdown">No markdown selected</div>';
        this.markdownSource.textContent = 'No markdown selected';
    }

    // Tab switching
    switchTab(e) {
        const tabName = e.target.getAttribute('data-tab');
        const parentPanel = e.target.closest('.markdown-panel') || e.target.closest('.tabs').parentElement;
        
        // Update tab buttons
        parentPanel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Update tab panes
        parentPanel.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        const targetPane = parentPanel.querySelector(`#${tabName}Tab`);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    }

    // Download methods
    downloadPdf() {
        if (this.currentDirectory) {
            // This will be handled by the onclick set in displayDocument
        }
    }

    downloadMarkdown() {
        if (this.currentDirectory) {
            // This will be handled by the onclick set in displayDocument
        }
    }

    resetForNewConversion() {
        this.removeFile();
        this.hideResult();
        this.hideError();
        this.currentConversionResult = null;
        
        // Reset tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-tab="rendered"]')?.classList.add('active');
        
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById('renderedTab')?.classList.add('active');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DocumentConverter();
});