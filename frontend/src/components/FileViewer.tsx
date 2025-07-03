import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

// Declare PDF.js types
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface FileViewerProps {
  lessonId: string;
  fileId: string;
  fileName: string;
  onBack: () => void;
}

interface MarkdownData {
  exists: boolean;
  markdown_source?: string;
  html_content?: string;
  filename?: string;
  error?: string;
}

interface SummaryData {
  exists: boolean;
  markdown_source?: string;
  html_content?: string;
  filename?: string;
  error?: string;
}

export default function FileViewer({
  lessonId,
  fileId,
  fileName,
  onBack,
}: FileViewerProps) {
  const [markdownData, setMarkdownData] = useState<MarkdownData | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configure PDF.js worker
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    const fetchContent = async () => {
      setLoading(true);

      // Check if PDF exists and load it
      try {
        const pdfResponse = await fetch(
          `http://localhost:8000/api/lessons/${lessonId}/files/${fileId}/pdf`
        );
        if (pdfResponse.ok) {
          setPdfExists(true);
          await loadPdf(
            `http://localhost:8000/api/lessons/${lessonId}/files/${fileId}/pdf`
          );
        } else {
          setPdfExists(false);
        }
      } catch (error) {
        setPdfExists(false);
      }

      // Fetch markdown content
      try {
        const markdownResponse = await fetch(
          `http://localhost:8000/api/lessons/${lessonId}/files/${fileId}/markdown`
        );
        if (markdownResponse.ok) {
          const data = await markdownResponse.json();
          console.log("Markdown data received:", data);
          console.log("Has markdown_source:", !!data.markdown_source);
          console.log("Markdown source length:", data.markdown_source?.length);
          console.log(
            "First 200 chars:",
            data.markdown_source?.substring(0, 200)
          );
          setMarkdownData(data);
        } else {
          console.error("Markdown response not ok:", markdownResponse.status);
          setMarkdownData({ exists: false, error: "Failed to load markdown" });
        }
      } catch (error) {
        console.error("Error fetching markdown:", error);
        setMarkdownData({ exists: false, error: "Failed to load markdown" });
      }

      // Fetch summary content
      await fetchSummaryData();

      setLoading(false);
    };

    fetchContent();
  }, [lessonId, fileId]);

  const fetchSummaryData = async () => {
    try {
      const summaryResponse = await fetch(
        `http://localhost:8000/api/lessons/${lessonId}/files/${fileId}/summary`
      );
      if (summaryResponse.ok) {
        const data = await summaryResponse.json();
        console.log("Summary data received:", data);
        setSummaryData(data);
      } else {
        console.error("Summary response not ok:", summaryResponse.status);
        setSummaryData({ exists: false, error: "Failed to load summary" });
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummaryData({ exists: false, error: "Failed to load summary" });
    }
  };

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/lessons/${lessonId}/files/${fileId}/generate-summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model_name: "mistral",
            chunk_size: 2000,
            chunk_overlap: 200,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.summary) {
          setSummaryData(result.summary);
          // Optional: Show success message
        } else {
          throw new Error(result.message || "Failed to generate summary");
        }
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            `HTTP ${response.status}: Failed to generate summary`
        );
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate summary";

      // Show error to user
      if (errorMessage.includes("Ollama service not available")) {
        alert(
          "Ollama service is not running. Please start Ollama and ensure the llama3.2 model is installed."
        );
      } else if (errorMessage.includes("HTTP 503")) {
        alert(
          "Summary generation service is unavailable. Please check that Ollama is running."
        );
      } else {
        alert(`Error generating summary: ${errorMessage}`);
      }
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Custom image component for react-markdown that handles errors
  const ImageComponent = ({ src, alt, ...props }: any) => {
    const [imageState, setImageState] = useState<
      "loading" | "loaded" | "error"
    >("loading");
    const [debugInfo, setDebugInfo] = useState("");

    const handleImageLoad = () => {
      setImageState("loaded");
      setDebugInfo("");
    };

    const handleImageError = (e: any) => {
      setImageState("error");
      setDebugInfo(`Failed to load: ${src}`);
      console.error("Image failed to load:", src);
    };

    if (imageState === "error") {
      return (
        <div
          style={{
            display: "inline-block",
            width: "400px",
            height: "200px",
            backgroundColor: "#f8f9fa",
            border: "2px dashed #dee2e6",
            color: "#6c757d",
            textAlign: "center",
            lineHeight: "200px",
            fontSize: "14px",
            margin: "1em 0",
          }}
        >
          Image not found: {src ? src.split("/").pop() : "unknown"}
        </div>
      );
    }

    return (
      <div style={{ margin: "1em 0", textAlign: "center" }}>
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            maxWidth: "100%",
            height: "auto",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          {...props}
        />
        {imageState === "loading" && (
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Loading image...
          </div>
        )}
        {debugInfo && (
          <div style={{ fontSize: "10px", color: "red", marginTop: "5px" }}>
            {debugInfo}
          </div>
        )}
      </div>
    );
  };
  const loadPdf = async (pdfUrl: string) => {
    console.log("Loading PDF from:", pdfUrl);

    if (!window.pdfjsLib) {
      console.error("PDF.js not loaded");
      return;
    }

    try {
      console.log("Creating PDF loading task...");
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      console.log("PDF loaded successfully, pages:", pdf.numPages);
      setPdfDoc(pdf);
      await renderAllPages(pdf);
    } catch (error) {
      console.error("Error loading PDF:", error, "URL:", pdfUrl);
      setPdfExists(false);
    }
  };

  const renderAllPages = async (pdf: any) => {
    console.log(
      "Rendering all pages, container ref:",
      !!pdfContainerRef.current,
      "pdf:",
      !!pdf
    );
    if (!pdfContainerRef.current || !pdf) {
      console.error("Missing container or pdf:", {
        container: !!pdfContainerRef.current,
        pdf: !!pdf,
      });
      return;
    }

    // Clear existing content
    pdfContainerRef.current.innerHTML = "";
    console.log("Cleared container, rendering", pdf.numPages, "pages");

    // Render all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log("Rendering page", pageNum);
      await renderPage(pdf, pageNum);
    }
    console.log("All pages rendered");
  };

  const renderPage = async (pdf: any, pageNum: number) => {
    if (!pdfContainerRef.current || !pdf) return;

    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: zoom });

      // Create canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Create page container
      const pageDiv = document.createElement("div");
      pageDiv.style.marginBottom = "20px";
      pageDiv.style.textAlign = "center";

      // Add page label
      const pageLabel = document.createElement("div");
      pageLabel.textContent = `Page ${pageNum}`;
      pageLabel.style.fontSize = "12px";
      pageLabel.style.color = "#666";
      pageLabel.style.marginBottom = "5px";
      pageDiv.appendChild(pageLabel);
      pageDiv.appendChild(canvas);

      pdfContainerRef.current.appendChild(pageDiv);

      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error(`Error rendering page ${pageNum}:`, error);
    }
  };

  const handleZoomIn = async () => {
    const newZoom = Math.min(zoom * 1.2, 3.0);
    setZoom(newZoom);
    if (pdfDoc) {
      await renderAllPages(pdfDoc);
    }
  };

  const handleZoomOut = async () => {
    const newZoom = Math.max(zoom / 1.2, 0.5);
    setZoom(newZoom);
    if (pdfDoc) {
      await renderAllPages(pdfDoc);
    }
  };

  const handleResetZoom = async () => {
    setZoom(1.0);
    if (pdfDoc) {
      await renderAllPages(pdfDoc);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Loading file content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden p-1">
      {/* Header */}
      <div className="border-b px-2 py-2 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Files
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{fileName}</h2>
          </div>
        </div>
      </div>

      {/* Two-panel layout with fixed height */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - PDF Viewer */}
        <div className="w-1/2 border-r bg-white flex flex-col overflow-hidden">
          <div className="border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
            <h3 className="font-semibold">PDF View</h3>
            {pdfExists && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetZoom}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {pdfExists ? (
              <div ref={pdfContainerRef} className="pdf-pages-container" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">PDF not available</p>
                  <p className="text-sm">
                    This file doesn't have a PDF version
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Markdown Viewer */}
        <div className="w-1/2 bg-white flex flex-col overflow-hidden bg-gray-50">
          <div className="border-b px-4 py-3 flex-shrink-0">
            <h3 className="font-semibold">Markdown View</h3>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {markdownData?.exists ? (
              <Tabs
                defaultValue="rendered"
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="border-b p-1 flex-shrink-0">
                  <TabsList className="grid w-72 grid-cols-3">
                    <TabsTrigger value="rendered">Rendered</TabsTrigger>
                    <TabsTrigger value="source">Source</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 relative overflow-hidden">
                  <TabsContent
                    value="rendered"
                    className="absolute inset-0 m-0 data-[state=active]:flex data-[state=inactive]:hidden flex-col"
                  >
                    <div className="flex-1 overflow-y-auto px-4">
                      <div
                        className="prose max-w-none"
                        style={{
                          lineHeight: "1.6",
                          fontSize: "12px",
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      >
                        {markdownData?.exists &&
                        markdownData.markdown_source ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeKatex]}
                            components={{
                              img: ImageComponent,
                              h1: ({ node, ...props }) => (
                                <h1
                                  style={{
                                    fontSize: "2em",
                                    fontWeight: "bold",
                                    marginTop: "1em",
                                    marginBottom: "0.5em",
                                    borderBottom: "2px solid #eee",
                                    paddingBottom: "0.3em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  style={{
                                    fontSize: "1.5em",
                                    fontWeight: "bold",
                                    marginTop: "1em",
                                    marginBottom: "0.5em",
                                    borderBottom: "1px solid #eee",
                                    paddingBottom: "0.2em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  style={{
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                    marginTop: "0.8em",
                                    marginBottom: "0.4em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              h4: ({ node, ...props }) => (
                                <h4
                                  style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                    marginTop: "0.6em",
                                    marginBottom: "0.3em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              h5: ({ node, ...props }) => (
                                <h5
                                  style={{
                                    fontSize: "1em",
                                    fontWeight: "bold",
                                    marginTop: "0.5em",
                                    marginBottom: "0.3em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              h6: ({ node, ...props }) => (
                                <h6
                                  style={{
                                    fontSize: "0.9em",
                                    fontWeight: "bold",
                                    marginTop: "0.5em",
                                    marginBottom: "0.3em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  style={{
                                    marginBottom: "1em",
                                    lineHeight: "1.6",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  style={{
                                    borderLeft: "4px solid #ddd",
                                    paddingLeft: "1em",
                                    margin: "1em 0",
                                    fontStyle: "italic",
                                    color: "#666",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              table: ({ node, ...props }) => (
                                <div
                                  style={{ overflowX: "auto", margin: "1em 0" }}
                                >
                                  <table
                                    style={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                      minWidth: "500px",
                                    }}
                                    {...props}
                                  />
                                </div>
                              ),
                              th: ({ node, ...props }) => (
                                <th
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    backgroundColor: "#f5f5f5",
                                    fontWeight: "bold",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              td: ({ node, ...props }) => (
                                <td
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  style={{
                                    marginBottom: "1em",
                                    paddingLeft: "2em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  style={{
                                    marginBottom: "1em",
                                    paddingLeft: "2em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li
                                  style={{
                                    marginBottom: "0.3em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              code: ({ node, inline, ...props }) =>
                                inline ? (
                                  <code
                                    style={{
                                      backgroundColor: "#f5f5f5",
                                      padding: "2px 4px",
                                      borderRadius: "3px",
                                      fontSize: "0.9em",
                                      wordWrap: "break-word",
                                    }}
                                    {...props}
                                  />
                                ) : (
                                  <code
                                    style={{
                                      display: "block",
                                      backgroundColor: "#f5f5f5",
                                      padding: "1em",
                                      borderRadius: "5px",
                                      overflow: "auto",
                                      fontSize: "0.9em",
                                      maxWidth: "100%",
                                      wordWrap: "break-word",
                                    }}
                                    {...props}
                                  />
                                ),
                              pre: ({ node, ...props }) => (
                                <pre
                                  style={{
                                    backgroundColor: "#f5f5f5",
                                    padding: "1em",
                                    borderRadius: "5px",
                                    overflow: "auto",
                                    marginBottom: "1em",
                                    maxWidth: "100%",
                                    wordWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                  }}
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {(() => {
                              const processedMarkdown =
                                markdownData.markdown_source.replace(
                                  /!\[([^\]]*)\]\(\/lessons\/([^\/]+)\/([^\/]+)\/([^)]+)\)/g,
                                  (match, alt, lessonId, fileId, imageName) => {
                                    const newUrl = `http://localhost:8000/api/lessons/${lessonId}/files/${fileId}/images/${imageName}`;
                                    console.log(
                                      "Image URL conversion:",
                                      match,
                                      "->",
                                      `![${alt}](${newUrl})`
                                    );
                                    return `![${alt}](${newUrl})`;
                                  }
                                );
                              return processedMarkdown;
                            })()}
                          </ReactMarkdown>
                        ) : (
                          <div>No content available</div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="source"
                    className="absolute inset-0 m-0 data-[state=active]:flex data-[state=inactive]:hidden flex-col"
                  >
                    <div className="flex-1 overflow-y-auto p-3">
                      <pre className="text-sm bg-gray-50 p-4 rounded border whitespace-pre-wrap">
                        {markdownData?.exists && markdownData.markdown_source
                          ? markdownData.markdown_source
                          : "No content available"}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="summary"
                    className="absolute inset-0 m-0 data-[state=active]:flex data-[state=inactive]:hidden flex-col"
                  >
                    <div className="flex-1 overflow-y-auto px-4">
                      {summaryData?.exists && summaryData.markdown_source ? (
                        <div
                          className="prose max-w-none"
                          style={{
                            lineHeight: "1.6",
                            fontSize: "12px",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                          }}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeKatex]}
                            components={{
                              img: ImageComponent,
                              h1: ({ node, ...props }) => (
                                <h1
                                  style={{
                                    fontSize: "2em",
                                    fontWeight: "bold",
                                    marginTop: "1em",
                                    marginBottom: "0.5em",
                                    borderBottom: "2px solid #eee",
                                    paddingBottom: "0.3em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  style={{
                                    fontSize: "1.5em",
                                    fontWeight: "bold",
                                    marginTop: "1em",
                                    marginBottom: "0.5em",
                                    borderBottom: "1px solid #eee",
                                    paddingBottom: "0.2em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  style={{
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                    marginTop: "0.8em",
                                    marginBottom: "0.4em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  style={{
                                    marginBottom: "1em",
                                    lineHeight: "1.6",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  style={{
                                    marginBottom: "1em",
                                    paddingLeft: "2em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li
                                  style={{
                                    marginBottom: "0.3em",
                                    wordWrap: "break-word",
                                  }}
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {summaryData.markdown_source}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                          {generatingSummary ? (
                            <div className="text-center">
                              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                              <p className="text-lg font-medium">
                                Generating Summary...
                              </p>
                              <p className="text-sm text-gray-500 mt-2">
                                This may take a few minutes depending on
                                document size
                              </p>
                            </div>
                          ) : (
                            <Button
                              onClick={handleGenerateSummary}
                              className="px-6 py-3 text-lg"
                            >
                              Generate Summary
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">Markdown not available</p>
                  <p className="text-sm">
                    {markdownData?.error ||
                      "This file doesn't have a markdown version"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
