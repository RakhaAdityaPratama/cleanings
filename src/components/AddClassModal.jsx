import React, { useState } from 'react';
import './AddClassModal.css';

const AddClassModal = ({ onClose, onAddClass }) => {
  const [tingkat, setTingkat] = useState('');
  const [kelas, setKelas] = useState('');
  const [jenjang, setJenjang] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [nomor, setNomor] = useState('');
  const [noWali, setNoWali] = useState('');

  const handleAdd = () => {
    if (!tingkat) {
      alert('Tingkat harus diisi.');
      return;
    }

    let fullClassName;
    if (['X', 'XI', 'XII'].includes(tingkat)) {
      if (!jenjang) {
        alert('Jenjang harus diisi.');
        return;
      }
      if (jenjang === 'SMA') {
        if (!jurusan || !nomor) {
          alert('Jurusan dan nomor SMA harus diisi.');
          return;
        }
        fullClassName = `${tingkat} ${jurusan} ${nomor}`;
      } else if (jenjang === 'SMK') {
        if (!jurusan || !kelas) {
          alert('Jurusan dan kelas SMK harus diisi.');
          return;
        }
        fullClassName = `${tingkat} ${jurusan} ${kelas}`;
      }
    } else {
      if (!kelas) {
        alert('Kelas harus diisi.');
        return;
      }
      fullClassName = `${tingkat} ${kelas}`;
    }

    onAddClass({ tingkat, kelas: fullClassName.replace(`${tingkat} `, ''), no_wali: noWali });
  };

  const tingkatOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const kelasOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const smkJurusanOptions = ['PPLG', 'APL', 'MPLB'];
  const smkKelasOptions = ['A', 'B', 'C', 'D'];
  const smaJurusanOptions = ['IPA', 'IPS'];
  const smaNomorOptions = ['1', '2', '3', '4', '5'];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tambah Kelas</h2>
        <div className="form-group">
          <label>Tingkat</label>
          <select value={tingkat} onChange={(e) => setTingkat(e.target.value)}>
            <option value="">Pilih Tingkat</option>
            {tingkatOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {tingkat && !['X', 'XI', 'XII'].includes(tingkat) && (
          <div className="form-group">
            <label>Kelas</label>
            <select value={kelas} onChange={(e) => setKelas(e.target.value)}>
              <option value="">Pilih Kelas</option>
              {kelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        )}

        {['X', 'XI', 'XII'].includes(tingkat) && (
          <>
            <div className="form-group">
              <label>Jenjang</label>
              <select value={jenjang} onChange={(e) => setJenjang(e.target.value)}>
                <option value="">Pilih Jenjang</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
              </select>
            </div>

            {jenjang === 'SMA' && (
              <>
                <div className="form-group">
                  <label>Jurusan</label>
                  <select value={jurusan} onChange={(e) => setJurusan(e.target.value)}>
                    <option value="">Pilih Jurusan</option>
                    {smaJurusanOptions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                {jurusan && (
                  <div className="form-group">
                    <label>Nomor</label>
                    <select value={nomor} onChange={(e) => setNomor(e.target.value)}>
                      <option value="">Pilih Nomor</option>
                      {smaNomorOptions.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}

            {jenjang === 'SMK' && (
              <>
                <div className="form-group">
                  <label>Jurusan</label>
                  <select value={jurusan} onChange={(e) => setJurusan(e.target.value)}>
                    <option value="">Pilih Jurusan</option>
                    {smkJurusanOptions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                {jurusan && (
                  <div className="form-group">
                    <label>Kelas</label>
                    <select value={kelas} onChange={(e) => setKelas(e.target.value)}>
                      <option value="">Pilih Kelas</option>
                      {smkKelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="form-group">
          <label>No Wali Kelas</label>
          <input type="text" placeholder="Masukkan nomor wali kelas" value={noWali} onChange={(e) => setNoWali(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button onClick={handleAdd} className="add-button">Tambah</button>
          <button onClick={onClose} className="cancel-button">Batal</button>
        </div>
      </div>
    </div>
  );
};

export default AddClassModal;
