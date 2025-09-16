import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Laporan from './pages/Laporan';
import Kelas from './pages/Kelas';
import KelasDetail from './pages/KelasDetail';
import './App.css';

function App() {
  const location = useLocation();
  const showHeaderFooter = !/^\/kelas\/.+/.test(location.pathname);

  return (
    <div className="App">
      {showHeaderFooter && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/kelas/:classId" element={<KelasDetail />} />
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
