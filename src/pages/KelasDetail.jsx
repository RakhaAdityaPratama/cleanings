import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './KelasDetail.css';
import { supabase } from '../supabaseClient';

const KelasDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [tingkat, kelas] = classId.split('-');

  // --- Placeholder for teacher's phone numbers ---
  // Please replace these with the actual phone numbers
  const waliKelasNumbers = {
    'VII-A': '6288210037641', // Example: 6281234567890
    'VII-B': '62895621047690',
    // ... add all other classes here
  };
  // -----------------------------------------

  const [keadaan, setKeadaan] = useState('');
  const [alat, setAlat] = useState([]); // Changed to array
  const [masalah, setMasalah] = useState('');

  const handleAlatChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAlat([...alat, value]);
    } else {
      setAlat(alat.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if 'keadaan' is selected
    if (!keadaan) {
      alert('Silakan pilih keadaan kelas (Bersih atau Kotor).');
      return; // Stop the submission
    }

    const newLaporan = {
      kelas: `${tingkat} ${kelas.replace('-', ' ')}`,
      keadaan,
      alat: alat.join(', '),
      masalah,
      // timestamp is handled by the database
    };

    try {
      const { error } = await supabase.from('laporan').insert([newLaporan]);

      if (error) {
        throw error;
      }

      // 2. Open WhatsApp
      const fullClassName = `${tingkat} ${kelas.replace('-', ' ')}`;
      const phoneNumber = waliKelasNumbers[classId];

      if (!phoneNumber) {
        alert('Nomor WhatsApp wali kelas tidak ditemukan.');
        // Still save to history even if number is not found
        navigate('/laporan');
        return;
      }

      const message = `
Laporan Kebersihan Kelas ${fullClassName}

Keadaan Kelas: ${keadaan}
Alat Kebersihan: ${alat.join(', ')}
Masalah Lainnya: ${masalah}
      `;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank');

      // 3. Navigate to laporan page
      navigate('/laporan');

    } catch (error) {
      console.error('There was a problem with your insert operation:', error);
      alert('Gagal mengirim laporan. Silakan coba lagi.');
    }
  };

  return (
    <div className="kelas-detail-container">
      <h1>Laporan Kebersihan Kelas {tingkat} {kelas.replace('-', ' ')}</h1>
      <form onSubmit={handleSubmit} className="laporan-form">
        <div className="form-group">
          <label>Keadaan Kelas</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="bersih"
                checked={keadaan === 'bersih'}
                onChange={(e) => setKeadaan(e.target.value)}
                required // Makes this field mandatory
              />
              Bersih
            </label>
            <label>
              <input
                type="radio"
                value="kotor"
                checked={keadaan === 'kotor'}
                onChange={(e) => setKeadaan(e.target.value)}
              />
              Kotor
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Alat Kebersihan</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" value="sapu" onChange={handleAlatChange} />
              Sapu
            </label>
            <label>
              <input type="checkbox" value="pel" onChange={handleAlatChange} />
              Pel
            </label>
            <label>
              <input type="checkbox" value="pengki" onChange={handleAlatChange} />
              Pengki
            </label>
            <label>
              <input type="checkbox" value="serokan air" onChange={handleAlatChange} />
              Serokan Air
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="masalah">Masalah Lainnya</label>
          <textarea
            id="masalah"
            value={masalah}
            onChange={(e) => setMasalah(e.target.value)}
            rows="4"
          ></textarea>
        </div>
        <button type="submit">Kirim Laporan via WhatsApp & Simpan</button>
      </form>
    </div>
  );
};

export default KelasDetail;

