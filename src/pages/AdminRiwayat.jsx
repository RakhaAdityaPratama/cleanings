import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AdminRiwayat.css';

const AdminRiwayat = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('riwayat')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          throw error;
        }
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="riwayat-content">
            <h2>Riwayat Aktivitas</h2>
            <p>Memuat riwayat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="riwayat-content">
            <h2>Riwayat Aktivitas</h2>
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="riwayat-content">
          <h2>Riwayat Aktivitas</h2>
          {history.length === 0 ? (
            <p className="no-history">Tidak ada riwayat aktivitas.</p>
          ) : (
            <ul className="riwayat-list">
              {history.map((entry) => (
                <li key={entry.id} className="riwayat-entry">
                  <span className="riwayat-user">{entry.user_email}</span>
                  <span className="riwayat-action">{entry.action}</span>
                  <span className="riwayat-timestamp">
                    {new Date(entry.created_at).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRiwayat;