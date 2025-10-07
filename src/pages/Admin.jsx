import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminNavbar from '../components/AdminNavbar';

const Admin = () => {
  const navigate = useNavigate();



  return (
    <div>
      <AdminNavbar />
      <Outlet />
    </div>
  );
};

export default Admin;