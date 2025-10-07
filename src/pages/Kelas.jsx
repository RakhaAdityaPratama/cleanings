import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Kelas.css';
import { supabase } from '../supabaseClient';

const Kelas = () => {
  const [kelasData, setKelasData] = useState({});

  useEffect(() => {
    getClasses();
  }, []);

  const getClasses = async () => {
    const { data, error } = await supabase.from('kelas').select('*');
    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      const formattedData = data.reduce((acc, { tingkat, nama_kelas }) => {
        if (!acc[tingkat]) {
          acc[tingkat] = [];
        }
        acc[tingkat].push(nama_kelas);
        acc[tingkat].sort();
        return acc;
      }, {});
      setKelasData(formattedData);
    }
  };

  const romanOrder = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  return (
    <div className="kelas-container">
      <h1>Daftar Kelas</h1>

      <div className="kelas-grid">
        {Object.keys(kelasData).sort((a, b) => romanOrder.indexOf(a) - romanOrder.indexOf(b)).map((tingkat) => (
          <div className="kelas-card" key={tingkat}>
            <h2>Kelas {tingkat}</h2>
            <ul>
              {kelasData[tingkat].map((kelas) => {
                return (
                  <li key={kelas}>
                    <Link to={`/kelas/${tingkat}-${kelas.replace(/ /g, '-')}`}>
                      {tingkat} {kelas}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kelas;