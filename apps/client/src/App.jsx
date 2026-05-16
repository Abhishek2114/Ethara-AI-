import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { ToastProvider } from "./hooks/useToast";
import { SocketProvider } from "./contexts/SocketContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TaskTrackLayout } from "./components/layout/TaskTrackLayout";
import AuthPage from "./pages/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import TaskersPage from "./pages/TaskersPage";
import TaskReviewPage from "./pages/TaskReviewPage";
import AttendancePage from "./pages/AttendancePage";
import LeavePage from "./pages/LeavePage";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/register" element={<Navigate to="/auth" replace />} />
            <Route
              element={
                <ProtectedRoute>
                  <TaskTrackLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/taskers" element={<TaskersPage />} />
              <Route path="/task-review" element={<TaskReviewPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
