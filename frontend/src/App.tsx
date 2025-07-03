import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Lessons from "./pages/Lessons"
import LessonDetail from "./pages/LessonDetail"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Lessons />} />
          <Route path="lesson/:lessonId" element={<LessonDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
