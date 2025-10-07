import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminKelasView.css';
import AddClassModal from '../components/AddClassModal';
import { supabase } from '../supabaseClient';

const AdminKelasView = () => {
  const [kelasData, setKelasData] = useState({});
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);

  useEffect(() => {
    getClasses();
  }, []);

  const getClasses = async () => {
    const { data, error } = await supabase.from('kelas').select('*');
    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      const formattedData = data.reduce((acc, { tingkat, nama_kelas }) => {
        if (tingkat && nama_kelas) { // Only process entries with tingkat and nama_kelas
          if (!acc[tingkat]) {
            acc[tingkat] = [];
          }
          acc[tingkat].push(nama_kelas);
          acc[tingkat].sort();
        }
        return acc;
      }, {});
      setKelasData(formattedData);
    }
  };

  const handleAddClass = async (newClass) => {
    const { tingkat, kelas, no_wali } = newClass;
    const { error } = await supabase.from('kelas').insert([{ tingkat, nama_kelas: kelas, no_wali }]);
    if (error) {
      console.error('Error adding class:', error);
      alert(`Gagal menambahkan kelas. Penyebab: ${error.message}`); // Show alert
    } else {
      getClasses(); // Re-fetch classes to update the UI
      // Log history
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const user_email = user ? user.email : 'System';
        const action = `telah menambahkan kelas ${tingkat} ${kelas}`;
        await supabase.from('riwayat').insert([{ user_email, action }]);
      } catch (logError) {
        console.error('Error logging history:', logError);
      }
    }
    setShowAddClassModal(false);
  };

  const handleDeleteClick = () => {
    setIsDeleting(!isDeleting);
    setSelectedClasses([]); // Clear selections when toggling delete mode
  };

  const handleSelectClass = (tingkat, kelas) => {
    const classId = `${tingkat}-${kelas}`;
    setSelectedClasses(prevSelected =>
      prevSelected.includes(classId)
        ? prevSelected.filter(id => id !== classId)
        : [...prevSelected, classId]
    );
  };

  const handleConfirmDelete = async () => {
    if (window.confirm(`Anda yakin ingin menghapus ${selectedClasses.length} kelas yang dipilih?`)) {
      const deletePromises = selectedClasses.map(classId => {
        const [tingkat, ...kelasParts] = classId.split('-');
        const nama_kelas = kelasParts.join(' ');
        return supabase.from('kelas').delete().match({ tingkat, nama_kelas });
      });

      const results = await Promise.all(deletePromises);
      
      const errors = results.filter(res => res.error);
      if (errors.length > 0) {
        errors.forEach(({ error }) => console.error('Error deleting class:', error));
      } else {
        // Log history only if all deletions were successful
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const user_email = user ? user.email : 'System';
          const formattedClassNames = selectedClasses.map(id => id.replace('-', ' ')).join(', ');
          const action = `telah menghapus ${selectedClasses.length} kelas: ${formattedClassNames}`;
          await supabase.from('riwayat').insert([{ user_email, action }]);
        } catch (logError) {
          console.error('Error logging history:', logError);
        }
      }

      getClasses(); // Re-fetch classes
      setIsDeleting(false);
      setSelectedClasses([]);
    }
  };

  const romanOrder = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  return (
    <div className="kelas-container">
      <h1>Daftar Kelas</h1>
      <div className="action-buttons">
        <button onClick={() => setShowAddClassModal(true)} className="add-class-button" disabled={isDeleting}>
          Tambah Kelas
        </button>
        <button onClick={handleDeleteClick} className="delete-class-button">
          {isDeleting ? 'Batal' : 'Delete Kelas'}
        </button>
        {isDeleting && selectedClasses.length > 0 && (
          <button onClick={handleConfirmDelete} className="confirm-delete-button">
            Konfirmasi Hapus ({selectedClasses.length})
          </button>
        )}
      </div>

      <div className="kelas-grid">
        {Object.keys(kelasData).sort((a, b) => romanOrder.indexOf(a) - romanOrder.indexOf(b)).map((tingkat) => (
          <div className="kelas-card" key={tingkat}>
            <h2>Kelas {tingkat}</h2>
            <ul>
              {kelasData[tingkat].map((kelas) => {
                const classId = `${tingkat}-${kelas}`;
                const isSelected = selectedClasses.includes(classId);
                return (
                  <li key={kelas} className={`${isDeleting ? 'deleting' : ''} ${isSelected ? 'selected' : ''}`}>
                    {isDeleting ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectClass(tingkat, kelas)}
                        />
                        {tingkat} {kelas}
                      </label>
                    ) : (
                      <Link to={`/kelas/${tingkat}-${kelas.replace(/ /g, '-')}`}>
                        {tingkat} {kelas}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {showAddClassModal && (
        <AddClassModal
          onClose={() => setShowAddClassModal(false)}
          onAddClass={handleAddClass}
        />
      )}
    </div>
  );
};

export default AdminKelasView;
