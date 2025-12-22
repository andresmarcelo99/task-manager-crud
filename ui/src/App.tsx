
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmSignUpPage from './pages/ConfirmSignUpPage';
import TasksPage from './pages/TasksPage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/tasks" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/tasks" replace /> : <RegisterPage />
            }
          />
          <Route
            path="/confirm-signup"
            element={
              isAuthenticated ? <Navigate to="/tasks" replace /> : <ConfirmSignUpPage />
            }
          />
          <Route
            path="/tasks"
            element={
              isAuthenticated ? <TasksPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/tasks" : "/login"} replace />
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
