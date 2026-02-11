import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@pages/HomePage'
import AboutPage from '@pages/AboutPage'
import FormationsPage from '@pages/FormationsPage'
import ContactPage from '@pages/ContactPage'
import StudentServicesPage from '@pages/StudentServicesPage'
import ApplicationPage from '@pages/ApplicationPage'
import EnrollPage from '@pages/EnrollPage'
import SuggestionsPage from '@pages/SuggestionsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/formations" element={<FormationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/student-services" element={<StudentServicesPage />} />
        <Route path="/apply" element={<ApplicationPage />} />
        <Route path="/enroll" element={<EnrollPage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
      </Routes>
    </Router>
  )
}

export default App
