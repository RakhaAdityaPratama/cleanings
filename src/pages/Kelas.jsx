import React from 'react';
import { Link } from 'react-router-dom';
import './Kelas.css';

const Kelas = () => {
  const kelasData = {
    VII: ['A', 'B', 'C', 'D'],
    VIII: ['A', 'B', 'C', 'D'],
    IX: ['A', 'B', 'C', 'D'],
    X: ['IPA-1', 'IPS-1', 'A-SMK', 'B-SMK'],
    XI: ['IPA-1', 'IPS-1', 'A-SMK', 'B-SMK'],
    XII: ['IPA-1', 'IPS-1', 'A-SMK', 'B-SMK'],
  };

  return (
    <div className="kelas-container">
      <h1>Daftar Kelas</h1>
      <div className="kelas-grid">
        {Object.keys(kelasData).map((tingkat) => (
          <div className="kelas-card" key={tingkat}>
            <h2>Kelas {tingkat}</h2>
            <ul>
              {kelasData[tingkat].map((kelas) => (
                <li key={kelas}>
                  <Link to={`/kelas/${tingkat}-${kelas.replace(' ', '-')}`}>
                    {tingkat} {kelas}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kelas;
