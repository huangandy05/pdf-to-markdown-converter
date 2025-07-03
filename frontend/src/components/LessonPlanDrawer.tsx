import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Lesson {
  id: string
  heading: string
  topic: string
  backgroundColor: string
}

interface LessonPlanDrawerProps {
  isOpen: boolean
  onClose: () => void
  lesson: Lesson
}

const dummyLessonPlan = `
# Lesson Plan: {{lesson_title}}

## Learning Objectives
- [ ] Understand the main concepts
- [ ] Apply knowledge to practical examples
- [ ] Complete hands-on exercises

## Topics to Cover

### 1. Introduction
- [ ] Review previous lesson
- [ ] Introduce new concepts
- [ ] Set learning goals

### 2. Core Content
- [ ] Explain fundamental principles
- [ ] Provide real-world examples
- [ ] Interactive demonstrations

### 3. Practice Activities
- [ ] Guided practice session
- [ ] Independent work time
- [ ] Group discussions

### 4. Assessment
- [ ] Quick knowledge check
- [ ] Q&A session
- [ ] Review key takeaways

## Additional Resources
- [ ] Reading materials
- [ ] Video tutorials
- [ ] External links

## Notes
- [ ] Remember to engage students
- [ ] Encourage questions
- [ ] Provide feedback

---
*This lesson plan was generated automatically and can be customized.*
`

export default function LessonPlanDrawer({ isOpen, onClose, lesson }: LessonPlanDrawerProps) {
  const lessonPlanContent = dummyLessonPlan.replace("{{lesson_title}}", lesson.heading)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Lesson Plan</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 h-full overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {lessonPlanContent.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-xl font-bold mb-4 text-gray-900">
                    {line.replace('# ', '')}
                  </h1>
                )
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-lg font-semibold mt-6 mb-3 text-gray-800">
                    {line.replace('## ', '')}
                  </h2>
                )
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-md font-medium mt-4 mb-2 text-gray-700">
                    {line.replace('### ', '')}
                  </h3>
                )
              }
              if (line.startsWith('- [ ] ')) {
                return (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {line.replace('- [ ] ', '')}
                    </span>
                  </div>
                )
              }
              if (line.startsWith('- ')) {
                return (
                  <div key={index} className="ml-4 mb-1">
                    <span className="text-sm text-gray-600">
                      • {line.replace('- ', '')}
                    </span>
                  </div>
                )
              }
              if (line.startsWith('---')) {
                return <hr key={index} className="my-4 border-gray-200" />
              }
              if (line.startsWith('*') && line.endsWith('*')) {
                return (
                  <p key={index} className="text-xs text-gray-500 italic mt-2">
                    {line.replace(/\*/g, '')}
                  </p>
                )
              }
              if (line.trim() === '') {
                return <div key={index} className="mb-2" />
              }
              return (
                <p key={index} className="text-sm text-gray-700 mb-2">
                  {line}
                </p>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Edit Plan
            </Button>
            <Button className="flex-1">
              Generate from Files
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}