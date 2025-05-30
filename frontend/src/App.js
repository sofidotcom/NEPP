import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages';
import Signup from './pages/signup';
import Login from './pages/login';
import Logout from './pages/logout';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';
import ProtectedRoute from './pages/auth/protectedRoute';
import TeacherSignup from './pages/adminpage/registerTeacher';
import StudentPage from './pages/studentspage/studentPage';
import Profile from './pages/studentspage/studentProfilepage';
import Admin from './pages/adminpage/admin';
import TeacherBoard from './pages/teacherspage/teacherDashboard';
import BiologyExam from './pages/teacherspage/biology/addBiologyExam';
import BioExamDisplay from './pages/teacherspage/biology/bioExamDisplay';
import BiologyAddEntrance from './pages/teacherspage/biology/addentranceExam';
import UploadNoteForm from './pages/teacherspage/notePage';
import NotesBySubject from './pages/teacherspage/noteDisplayPage';
import SidebarR from './pages/studentspage/studentSideBar';
import EntranceLayout from './pages/layout/entranceLayout';
import UploadPDF from './pages/teacherspage/pdfUploadPage';
import StudentPDFList from './pages/studentspage/dawnloadPage';
import NotificationBell from './pages/studentspage/notificationDisplaypage';
import ChatRoom from './pages/components/chatRoom';
import ChatRoomsList from './pages/components/chatRoomsList';
import Leaderboard from './pages/leaderBoard';
import EntranceLeaderboard from './pages/components/entranceLeaderBoard';
import QuizLeaderboard from './pages/components/quizLeaderboard';
import StudentDisplay from './pages/adminpage/studentDisplay';
import TeacherDisplay from './pages/adminpage/displayTeachers';
import SocialStudentPage from './pages/studentspage/socialStudentPage';
import SocialSidebarR from './pages/studentspage/socialSidebar';
import OtpPage from './pages/otp';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/opt" element={<OtpPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/sign" element={<TeacherSignup />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/el" element={<EntranceLeaderboard />} />
        <Route path="/ql" element={<QuizLeaderboard />} />


        {/* Protected Routes - Require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/sidebar" element={<SidebarR />} />
          <Route path="/ssidebar" element={<SocialSidebarR />} />
          <Route path="/BiologyAddEntrance" element={<BiologyAddEntrance />} />
          <Route path="/BiologyExam" element={<BiologyExam />} />
          <Route path="/quiz" element={<BioExamDisplay />} />
          <Route path="/entrance/:subject/:year" element={<EntranceLayout />} />
          <Route path="/upload" element={<UploadNoteForm />} />
          <Route path="/notes/:subject/:grade" element={<NotesBySubject />} />
          <Route path="/pdf" element={<UploadPDF />} />
          <Route path="/download" element={<StudentPDFList />} />
          <Route path="/notification" element={<NotificationBell />} />
          <Route path="/studentDisplay" element={<StudentDisplay />} />
          <Route path="/teacherDisplay" element={<TeacherDisplay />} />
          <Route path="/profile/:id" element={<Profile />} />
          {/* Student dashboard routes based on stream */}
          <Route path="/student/:id" element={<StudentPage />} />
          <Route path="/Social/:id" element={<SocialStudentPage />} />
          <Route path="/teacher/:id" element={<TeacherBoard />} />
          <Route path="/chat-rooms" element={<ChatRoomsList />} />
          <Route path="/chat-room/:roomId" element={<ChatRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

