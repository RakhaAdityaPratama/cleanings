import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">Cleanings</a>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a href="/" className="nav-link">Home</a>
        </li>
        <li className="nav-item">
          <a href="/laporan" className="nav-link">Laporan</a>
        </li>
        <li className="nav-item">
          <a href="/kelas" className="nav-link">Kelas</a>
        </li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
