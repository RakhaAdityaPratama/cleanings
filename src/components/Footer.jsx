import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3 className="footer-title">Tentang Kami</h3>
          <p>
            Cleanings adalah aplikasi untuk membantu memanajemen kebersihan kelas secara efisien dan modern.
          </p>
        </div>
        <div className="footer-section links">
          <h3 className="footer-title">Menu Cepat</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/kelas">Kelas</Link></li>
            <li><Link to="/laporan">Laporan</Link></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3 className="footer-title">Hubungi Kami</h3>
          <span><i className="fas fa-envelope"></i> email@example.com</span>
          <span><i className="fas fa-phone"></i> +62 123 4567 890</span>
          <span><i className="fas fa-map-marker-alt"></i> Alamat Sekolah, Kota</span>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2025 Cleanings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;