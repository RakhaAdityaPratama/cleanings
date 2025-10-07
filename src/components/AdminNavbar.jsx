import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/admin">Admin Panel</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/admin" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/laporan" className="nav-link">Laporan</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/kelas" className="nav-link">Kelas</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/riwayat" className="nav-link">Riwayat</Link>
        </li>

      </ul>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </nav>
  );
};

export default AdminNavbar;
