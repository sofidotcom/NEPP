import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages';
//this is  authentication and authorization
import Signup from './pages/signup';
import Login from './pages/login';
import Logout from './pages/logout';
import ProtectedRoute from './pages/auth/protectedRoute';

import TeacherSignup from './pages/adminpage/registerTeacher';

// role authentication/authorization
import StudentPage from './pages/studentspage/studentPage';
import Admin from './pages/adminpage/admin';
import Ap from './pages/teacherspage/components/p';//this is theacher page

//  add and display pages   
import BiologyExam from './pages/teacherspage/biology/addBiologyExam';
import BioExamDisplay from './pages/teacherspage/biology/bioExamDisplay';

import BiologyAddEntrance from './pages/teacherspage/biology/addentranceExam';
import UploadNoteForm from './pages/teacherspage/notePage'
import NotesBySubject from './pages/teacherspage/noteDisplayPage';

//import BioEntranceDisplay from './pages/teacherspage/biology/bioEntranceDisplay';


import SidebarR from './pages/studentspage/studentSideBar';
import EntranceLayout from './pages/layout/entranceLayout';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        
        {/* Public Routes */}
        
        <Route path="/" element={<Index />} />
        <Route path="/ap" element={<Ap/>} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/sign" element={<TeacherSignup />} />


       



        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/sidebar" element={<SidebarR />} />
          <Route path="/BiologyAddEntrance" element={<BiologyAddEntrance />} />
          <Route path="/BiologyExam" element={<BiologyExam />} />
          <Route path="/Display" element={<BioExamDisplay />} />
          <Route path="/bioEntrance/:year" element={<EntranceLayout />} />
          <Route path="/upload" element={<UploadNoteForm />} />
          <Route path="/notes/:subject" element={<NotesBySubject/>} />
          
          <Route path="/student/:id" element={<StudentPage />} />
          <Route path="/admin" element={<Admin />} />
        <Route path="/teacher/:id" element={<Ap/>} />

         
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;



