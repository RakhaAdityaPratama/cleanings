import React, { useState, useEffect } from 'react';

import { supabase } from '../supabaseClient';
import './AdminLaporan.css';

const AdminLaporan = () => {
  const [configItems, setConfigItems] = useState([]);
  const [newItem, setNewItem] = useState({ item_name: '', item_type: '', input_type: 'checkbox' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchConfigItems();
  }, []);

  const fetchConfigItems = async () => {
    const { data, error } = await supabase.from('report_config').select('*');
    if (error) console.error('Error fetching report config:', error);
    else setConfigItems(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.item_name || !newItem.item_type) {
      alert('Nama item dan tipe item harus diisi.');
      return;
    }

    if (editingItem) {
      // Update logic
      const { error } = await supabase
        .from('report_config')
        .update({ item_name: newItem.item_name, item_type: newItem.item_type, input_type: newItem.input_type })
        .match({ id: editingItem.id });

      if (error) {
        console.error('Error updating item:', error);
      } else {
        fetchConfigItems();
        setNewItem({ item_name: '', item_type: '', input_type: 'checkbox' });
        setEditingItem(null);
      }
    } else {
      // Insert logic
      const { error } = await supabase.from('report_config').insert([newItem]);
      if (error) {
        console.error('Error adding item:', error);
      } else {
        fetchConfigItems();
        setNewItem({ item_name: '', item_type: '', input_type: 'checkbox' });
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setNewItem({ item_name: item.item_name, item_type: item.item_type, input_type: item.input_type });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewItem({ item_name: '', item_type: '', input_type: 'checkbox' });
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Anda yakin ingin menghapus item ini?')) {
      const { error } = await supabase.from('report_config').delete().match({ id });
      if (error) console.error('Error deleting item:', error);
      else fetchConfigItems();
    }
  };

  return (
    <div className="admin-page">
      
      <div className="admin-container">
        <div className="report-config-section">
          <h2>Pengaturan Checklist Laporan</h2>
          <form onSubmit={handleSubmit} className="config-form">
            <input
              type="text"
              placeholder="Nama Item (e.g., Sapu, Bersih)"
              value={newItem.item_name}
              onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
            />
            <select
              value={newItem.item_type}
              onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value })}
            >
              <option value="">Pilih Tipe</option>
              <option value="Keadaan Kelas">Keadaan Kelas</option>
              <option value="Alat Kebersihan">Alat Kebersihan</option>
            </select>
            <select
              value={newItem.input_type}
              onChange={(e) => setNewItem({ ...newItem, input_type: e.target.value })}
            >
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
            </select>
            <button type="submit">{editingItem ? 'Update Item' : 'Tambah Item'}</button>
            {editingItem && <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">Batal</button>}
          </form>
          <div className="config-list">
            {configItems.map(item => (
              <div key={item.id} className="config-item">
                <span>{item.item_name} ({item.item_type}) - [{item.input_type}]</span>
                <div className="item-buttons">
                  <button onClick={() => handleEditClick(item)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLaporan;