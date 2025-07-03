import { useState, useRef, useEffect } from "react"
import { Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FileViewer from "./FileViewer"

interface UploadedFile {
  id: string
  name: string
  size: number
  upload_date: string
  has_pdf: boolean
  has_md: boolean
}

interface FileUploadTabProps {
  lessonId: string
}

const ALLOWED_EXTENSIONS = [
  'pdf', 'png', 'jpg', 'jpeg', 'ppt', 'pptx', 
  'doc', 'docx', 'xls', 'xlsx', 'html', 'epub'
]

export default function FileUploadTab({ lessonId }: FileUploadTabProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch existing files for this lesson
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}/files`)
        if (response.ok) {
          const data = await response.json()
          setFiles(data)
        }
      } catch (error) {
        console.error("Failed to fetch files:", error)
      }
    }

    fetchFiles()
  }, [lessonId])

  const handleFileSelection = (uploadedFiles: FileList) => {
    if (uploadedFiles.length > 0) {
      setSelectedFile(uploadedFiles[0]) // Only take the first file
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}/upload`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // Refresh the files list
        const filesResponse = await fetch(`http://localhost:8000/api/lessons/${lessonId}/files`)
        if (filesResponse.ok) {
          const data = await filesResponse.json()
          setFiles(data)
        }
        setSelectedFile(null) // Clear selection after successful upload
      } else {
        const error = await response.json()
        alert(`Failed to upload ${selectedFile.name}: ${error.detail || "Unknown error"}`)
      }
    } catch (error) {
      console.error(`Failed to upload ${selectedFile.name}:`, error)
      alert(`Failed to upload ${selectedFile.name}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFileSelection(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    )
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(parseFloat(timestamp) * 1000)
    return date.toLocaleDateString()
  }

  const handleFileClick = (file: UploadedFile, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setViewingFile(file)
  }

  const handleBackToFiles = () => {
    setViewingFile(null)
  }

  // If viewing a file, show the FileViewer component
  if (viewingFile) {
    return (
      <FileViewer
        lessonId={lessonId}
        fileId={viewingFile.id}
        fileName={viewingFile.name}
        onBack={handleBackToFiles}
      />
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto">
        {/* File List - Show above upload area */}
        {files.length > 0 && (
          <div className="p-6 pb-0">
            <h4 className="font-medium mb-4">Uploaded Files ({files.length})</h4>
            <div className="space-y-2">
              {files.map((file) => (
                <Card 
                  key={file.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={(e) => handleFileClick(file, e)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <File className="w-8 h-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {formatDate(file.upload_date)}
                        </p>
                        {/* File type indicators */}
                        {(file.has_pdf || file.has_md) && (
                          <div className="mt-2 flex gap-2">
                            {file.has_pdf && (
                              <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
                                PDF
                              </span>
                            )}
                            {file.has_md && (
                              <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">
                                MD
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="p-6 pb-0">
            <h4 className="font-medium mb-4">Selected File</h4>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">{selectedFile.name}</p>
                    <p className="text-sm text-blue-700">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || "Unknown type"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Area */}
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            } ${isUploading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium mb-2">
              {isUploading ? "Processing..." : "Select File"}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Supported: {ALLOWED_EXTENSIONS.join(', ')}
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
            />
          </div>
          
          {/* Pre-process and Upload Button - Outside the clickable area */}
          {selectedFile && (
            <div className="mt-4">
              <Button
                onClick={handleFileUpload}
                disabled={!selectedFile || isUploading}
                size="sm"
                className="w-full"
              >
                {isUploading
                  ? "Processing..."
                  : selectedFile
                  ? `Pre-process and Upload (${formatFileSize(selectedFile.size)})`
                  : "Pre-process and Upload"
                }
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}