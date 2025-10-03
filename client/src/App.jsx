import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Exams from './pages/Exams';
import ExamTaker from './pages/ExamTaker';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import CreateTest from './pages/CreateTest';
import Tests from './pages/Tests';
import TakeTest from './pages/TakeTest';
import TestResult from './pages/TestResult';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Admin Routes */}
        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create-test" element={<CreateTest />} />
        </Route>

        {/* Student Routes */}
        <Route element={<PrivateRoute requiredRole="student" />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:id" element={<ExamTaker />} />
          <Route path="/student/tests" element={<Tests />} />
          <Route path="/student/tests/:id" element={<TakeTest />} />
          <Route path="/student/test-result" element={<TestResult />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
