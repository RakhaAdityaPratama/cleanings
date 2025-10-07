import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './KelasDetail.css';
import { supabase } from '../supabaseClient';
import Modal from '../components/Modal'; // Import Modal

const KelasDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const firstHyphenIndex = classId.indexOf('-');
  const tingkat = classId.substring(0, firstHyphenIndex);
  const kelas = classId.substring(firstHyphenIndex + 1);

  const [noWali, setNoWali] = useState('');

  useEffect(() => {
    const fetchClassDetails = async () => {
      const { data, error } = await supabase
        .from('kelas')
        .select('no_wali')
        .eq('tingkat', tingkat)
        .eq('nama_kelas', kelas.replace('-', ' '))
        .single();

      if (error) {
        console.error('Error fetching class details:', error);
      } else if (data) {
        setNoWali(data.no_wali);
      }
    };

    fetchClassDetails();
  }, [tingkat, kelas]);

  const [keadaan, setKeadaan] = useState('');
  const [alat, setAlat] = useState([]); // Changed to array
  const [masalah, setMasalah] = useState('');
  const [showModal, setShowModal] = useState(false); // Add modal state
  const [formOptions, setFormOptions] = useState({ keadaan: [], alat: [] });

  useEffect(() => {
    const fetchFormOptions = async () => {
      const { data, error } = await supabase.from('report_config').select('*');
      if (error) {
        console.error('Error fetching form options:', error);
      } else {
        const options = data.reduce((acc, item) => {
          if (item.item_type === 'Keadaan Kelas') {
            acc.keadaan.push(item);
          } else if (item.item_type === 'Alat Kebersihan') {
            acc.alat.push(item);
          }
          return acc;
        }, { keadaan: [], alat: [] });
        setFormOptions(options);
      }
    };

    fetchFormOptions();
  }, []);

  const handleAlatChange = (e) => {
    const { value, checked } = e.target;

    if (value === 'tidak ada') {
      if (checked) {
        setAlat(['tidak ada']);
      } else {
        setAlat([]);
      }
    } else {
      if (checked) {
        setAlat([...alat.filter(item => item !== 'tidak ada'), value]);
      } else {
        setAlat(alat.filter((item) => item !== value));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if 'keadaan' is selected
    if (!keadaan) {
      alert('Silakan pilih keadaan kelas (Bersih atau Kotor).');
      return; // Stop the submission
    }

    // Validation: Check if 'alat' is selected
    if (alat.length === 0) {
      alert('Silakan pilih alat kebersihan yang tersedia.');
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

      // Log history
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const user_email = user ? user.email : 'System'; // Fallback to 'System' if user is not available
        const action = `telah membuat laporan untuk kelas ${newLaporan.kelas}`;
        await supabase.from('riwayat').insert([{ user_email, action }]);
      } catch (logError) {
        console.error('Error logging history:', logError);
      }

      // 2. Open WhatsApp
      const fullClassName = `${tingkat} ${kelas.replace('-', ' ')}`;
      const phoneNumber = noWali;

      if (!phoneNumber) {
        alert('Nomor WhatsApp wali kelas tidak ditemukan.');
        // Still save to history even if number is not found
        setShowModal(true); // Show modal even if number is not found
        return;
      }

      let formattedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters

      if (formattedPhoneNumber.startsWith('0')) {
        formattedPhoneNumber = `62${formattedPhoneNumber.substring(1)}`;
      }

      const message = `
Laporan Kebersihan Kelas ${fullClassName}

Keadaan Kelas: ${keadaan}
Alat Kebersihan: ${alat.join(', ')}
Masalah Lainnya: ${masalah}
      `;

      const whatsappUrl = `https://wa.me/${formattedPhoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank');

      // 3. Show success modal
      setShowModal(true);
      setKeadaan('');
      setAlat([]);
      setMasalah('');

    } catch (error) {
      console.error('Supabase insert error:', error);
      alert('Gagal mengirim laporan. Silakan periksa konsol untuk detailnya.');
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="kelas-detail-container">
      <h1>Laporan Kebersihan Kelas {tingkat} {kelas.replace('-', ' ')}</h1>
      <form onSubmit={handleSubmit} className="laporan-form">
        <div className="form-group">
          <label>Keadaan Kelas</label>
          <div className="radio-group">
            {formOptions.keadaan.map(option => (
              <label key={option.id}>
                <input
                  type="radio"
                  value={option.item_name}
                  checked={keadaan === option.item_name}
                  onChange={(e) => setKeadaan(e.target.value)}
                  required
                />
                {option.item_name}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Alat Kebersihan</label>
          <div className="checkbox-group">
            {formOptions.alat.map(option => (
              <label key={option.id}>
                <input
                  type="checkbox"
                  value={option.item_name}
                  checked={alat.includes(option.item_name)}
                  onChange={handleAlatChange}
                />
                {option.item_name}
              </label>
            ))}
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
      {showModal && (
        <Modal
          message="Laporan berhasil dikirim!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default KelasDetail;