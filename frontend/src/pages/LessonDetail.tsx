import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatSection from "@/components/ChatSection";
import FileUploadTab from "@/components/FileUploadTab";
import LessonPlanDrawer from "@/components/LessonPlanDrawer";

interface Lesson {
  id: string;
  heading: string;
  topic: string;
  backgroundColor: string;
}

export default function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;

      try {
        const response = await fetch(`http://localhost:8000/api/lessons`);
        if (response.ok) {
          const lessons = await response.json();
          const foundLesson = lessons.find((l: Lesson) => l.id === lessonId);
          if (foundLesson) {
            setLesson(foundLesson);
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button onClick={() => navigate("/")}>Back to Lessons</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{lesson.heading}</h1>
            {lesson.topic && <p className="text-gray-600">{lesson.topic}</p>}
          </div>
        </div>
      </div>

      {/* Main Content - Split layout with proper panels */}
      <div className="flex gap-6 p-2 h-[calc(100vh-5rem)] ">
        {/* Left Panel - Chat Section */}
        <div className="w-1/4">
          <div className="bg-white rounded-lg shadow-sm border h-full">
            <ChatSection />
          </div>
        </div>

        {/* Right Panel - Tabs Section */}
        <div className="w-3/4 h-full ">
          <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
            <Tabs defaultValue="files" className="h-full flex flex-col">
              <div className="border-b px-2 py-2 flex items-center justify-between flex-shrink-0">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="placeholder">Placeholder</TabsTrigger>
                </TabsList>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PanelRight className="w-4 h-4" />
                  Lesson Plan
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="files" className="m-0 h-full">
                  <FileUploadTab lessonId={lessonId!} />
                </TabsContent>

                <TabsContent
                  value="placeholder"
                  className="m-0 p-6 h-full overflow-auto"
                >
                  <div className="text-center text-gray-500">
                    <p>
                      This is a placeholder tab. Content will be added here
                      later.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Lesson Plan Drawer */}
      <LessonPlanDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lesson={lesson}
      />
    </div>
  );
}
