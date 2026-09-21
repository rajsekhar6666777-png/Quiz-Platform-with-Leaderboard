import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import QuizPlay from './pages/QuizPlay';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import ManageQuizzes from './pages/ManageQuizzes';
import ManageQuestions from './pages/ManageQuestions';
import ManageUsers from './pages/ManageUsers';
import NotFound from './pages/NotFound';

function AppContent() {
  const { theme } = React.useContext(ThemeContext);
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
            <Route path="/result/:attemptId" element={<ProtectedRoute><Result /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/quizzes" element={<ProtectedRoute adminOnly={true}><ManageQuizzes /></ProtectedRoute>} />
            <Route path="/admin/questions/:quizId" element={<ProtectedRoute adminOnly={true}><ManageQuestions /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><ManageUsers /></ProtectedRoute>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" theme={theme === 'dark' ? 'dark' : 'light'} autoClose={3000} />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
