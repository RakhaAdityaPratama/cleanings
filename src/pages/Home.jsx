import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <h1>Selamat Datang di Cleanings</h1>
          <p>Aplikasi kebersihan untuk sekolah.</p>
          
        </div>
      </header>

      <section className="features">
        <h2>Fitur Kami</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Daftar Kelas</h3>
            <p>Lihat daftar semua kelas yang terdaftar.</p>
          </div>
          <div className="card">
            <h3>Laporan Kebersihan</h3>
            <p>Lihat laporan kebersihan dari setiap kelas.</p>
          </div>
          <div className="card">
            <h3>Detail Kelas</h3>
            <p>Lihat detail kebersihan dari setiap kelas.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
