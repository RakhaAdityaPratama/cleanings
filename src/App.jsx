import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Laporan from './pages/Laporan';
import Kelas from './pages/Kelas';
import KelasDetail from './pages/KelasDetail';
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import AdminLaporan from './pages/AdminLaporan';
import AdminKelas from './pages/AdminKelas';
import AdminRiwayat from './pages/AdminRiwayat';
import Admin from './pages/Admin';

import { supabase } from './supabaseClient';
import './App.css';

import { useAuth } from './context/AuthProvider';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { session } = useAuth();
  return session ? element : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/update-password'].includes(location.pathname);
  const isKelasDetail = /\/kelas\/.+/.test(location.pathname);

  const showHeaderFooter = !isAdminRoute && !isAuthRoute && !isKelasDetail;


  return (
    <div className="App">
      {showHeaderFooter && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/kelas/:classId" element={<KelasDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update-password" element={<ResetPassword />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} />}>
            <Route path="" element={<AdminHome />} />
            <Route path="laporan" element={<AdminLaporan />} />
            <Route path="kelas" element={<AdminKelas />} />
            <Route path="riwayat" element={<AdminRiwayat />} />
          </Route>
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;