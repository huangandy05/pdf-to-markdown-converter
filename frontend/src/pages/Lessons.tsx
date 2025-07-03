import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Lesson {
  id: string
  heading: string
  topic: string
  backgroundColor: string
}

const backgroundOptions = [
  { name: "Blue", value: "bg-gradient-to-br from-blue-100 to-blue-200" },
  { name: "Purple", value: "bg-gradient-to-br from-purple-100 to-purple-200" },
  { name: "Green", value: "bg-gradient-to-br from-green-100 to-green-200" },
  { name: "Orange", value: "bg-gradient-to-br from-orange-100 to-orange-200" },
  { name: "Pink", value: "bg-gradient-to-br from-pink-100 to-pink-200" },
  { name: "Yellow", value: "bg-gradient-to-br from-yellow-100 to-yellow-200" },
  { name: "Red", value: "bg-gradient-to-br from-red-100 to-red-200" },
  { name: "Indigo", value: "bg-gradient-to-br from-indigo-100 to-indigo-200" },
]

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newLesson, setNewLesson] = useState({
    heading: "",
    topic: "",
    backgroundColor: backgroundOptions[0].value,
  })

  // Fetch lessons from API
  const fetchLessons = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/lessons")
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (error) {
      console.error("Failed to fetch lessons:", error)
    }
  }

  // Load lessons on component mount
  useEffect(() => {
    fetchLessons()
  }, [])

  const handleLessonClick = (lessonId: string) => {
    window.location.href = `/lesson/${lessonId}`
  }

  const handleAddLesson = async () => {
    if (newLesson.heading.trim()) {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:8000/api/lessons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            heading: newLesson.heading.trim(),
            topic: newLesson.topic.trim(),
            backgroundColor: newLesson.backgroundColor,
          }),
        })

        if (response.ok) {
          const createdLesson = await response.json()
          setLessons([...lessons, createdLesson])
          setNewLesson({
            heading: "",
            topic: "",
            backgroundColor: backgroundOptions[0].value,
          })
          setIsModalOpen(false)
        } else {
          const error = await response.json()
          alert(error.detail || "Failed to create lesson")
        }
      } catch (error) {
        console.error("Failed to create lesson:", error)
        alert("Failed to create lesson")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-foreground">
        Lessons
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {lessons
          .sort((a, b) => a.heading.localeCompare(b.heading))
          .map((lesson) => (
          <Card
            key={lesson.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleLessonClick(lesson.id)}
          >
            <div className={`h-48 ${lesson.backgroundColor} p-6 flex flex-col justify-between`}>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {lesson.heading}
                </h3>
                {lesson.topic && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {lesson.topic}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}

        {/* Add New Card */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Card className="h-48 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-300 cursor-pointer">
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Add New Lesson</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={newLesson.heading}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, heading: e.target.value })
                  }
                  placeholder="e.g., My First Lesson"
                />
              </div>

              <div>
                <Label htmlFor="topic">Topic (Optional)</Label>
                <Input
                  id="topic"
                  value={newLesson.topic}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, topic: e.target.value })
                  }
                  placeholder="e.g., Introduction to React"
                />
              </div>

              <div>
                <Label htmlFor="background">Card Color</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {backgroundOptions.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() =>
                        setNewLesson({
                          ...newLesson,
                          backgroundColor: option.value,
                        })
                      }
                      className={`h-10 rounded-md border-2 transition-all ${
                        newLesson.backgroundColor === option.value
                          ? "border-gray-800 scale-105"
                          : "border-gray-200 hover:border-gray-400"
                      } ${option.value}`}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddLesson}
                  className="flex-1"
                  disabled={!newLesson.heading.trim() || isLoading}
                >
                  {isLoading ? "Creating..." : "Add Lesson"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}