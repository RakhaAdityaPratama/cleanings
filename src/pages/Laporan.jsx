import React, { useEffect, useState, useRef, useMemo } from 'react';
import './Laporan.css';

// Helper function to get a string representation of the week's start date in DD-MM-YYYY format
const getWeekId = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Adjust to the Monday of the current week
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));

  const formattedDay = String(monday.getDate()).padStart(2, '0');
  const formattedMonth = String(monday.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = monday.getFullYear();

  return `${formattedDay}-${formattedMonth}-${year}`;
};

function Laporan() {
  const [laporan, setLaporan] = useState([]);
  const [groupedLaporan, setGroupedLaporan] = useState({});
  const laporanRefs = useRef([]);
  const [selectionState, setSelectionState] = useState({
    activeGroup: null,
    selectedItems: new Set(),
  });

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await fetch('https://laporan-api.up.railway.app/laporan');
        const data = await response.json();
        // Sort data by timestamp descending
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLaporan(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLaporan();
  }, []);

  useEffect(() => {
    // Group reports by week
    const groups = laporan.reduce((acc, report) => {
      try {
        const weekId = getWeekId(new Date(report.timestamp));
        if (!acc[weekId]) {
          acc[weekId] = [];
        }
        acc[weekId].push(report);
      } catch (e) {
        console.error("Invalid timestamp for report:", report, e);
      }
      return acc;
    }, {});
    setGroupedLaporan(groups);
  }, [laporan]);

  

  const handleGroupDeleteStart = (weekId) => {
    setSelectionState({
      activeGroup: weekId,
      selectedItems: new Set(),
    });
  };

  const handleItemSelection = (itemId) => {
    setSelectionState(prev => {
      const newSelectedItems = new Set(prev.selectedItems);
      if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
      } else {
        // Only non-static items can be selected
        const item = laporan.find(l => l.id === itemId);
        if (item && !item.id.toString().startsWith('static-')) {
          newSelectedItems.add(itemId);
        }
      }
      return { ...prev, selectedItems: newSelectedItems };
    });
  };

  const handleConfirmGroupDelete = async () => {
    const { selectedItems } = selectionState;

    if (selectedItems.size === 0) {
      alert("Pilih dulu data yang mau dihapus.");
      return;
    }

    if (window.confirm('Yakin mau hapus?')) {
      try {
        const deletePromises = Array.from(selectedItems).map(id =>
          fetch(`https://laporan-api.up.railway.app/laporan/${id}`, {
            method: 'DELETE',
          })
        );

        const responses = await Promise.all(deletePromises);

        const allOk = responses.every(res => res.ok);

        if (allOk) {
          const updatedLaporan = laporan.filter(item => !selectedItems.has(item.id));
          setLaporan(updatedLaporan);
          setSelectionState({ activeGroup: null, selectedItems: new Set() });
        } else {
          console.error('Failed to delete some items:', responses);
          alert('Gagal menghapus beberapa data. Silakan coba lagi.');
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Terjadi kesalahan saat menghapus data. Silakan coba lagi.');
      }
    }
  };

  const handleCancelGroupDelete = () => {
    setSelectionState({ activeGroup: null, selectedItems: new Set() });
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = laporanRefs.current;
    refs.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [laporan]);

  return (
    <div className="laporan-container">
      <h1>Laporan Kebersihan</h1>
      <div className="laporan-list">
        {Object.keys(groupedLaporan).map((weekId) => (
          <div key={weekId} className="week-group">
            <div className="week-group-header">
              <h2>{weekId}</h2>
              {selectionState.activeGroup === weekId ? (
                <div className="group-delete-actions">
                  <button onClick={handleConfirmGroupDelete} className="delete-button confirm">Konfirmasi Hapus</button>
                  <button onClick={handleCancelGroupDelete} className="delete-button cancel">Batal</button>
                </div>
              ) : (
                <button onClick={() => handleGroupDeleteStart(weekId)} className="delete-button">
                  Hapus
                </button>
              )}
            </div>
            {groupedLaporan[weekId].map((item, index) => (
              <div
                key={item.id || index}
                className={`laporan-item ${selectionState.activeGroup === weekId ? 'in-selection' : ''}`}
                ref={(el) => (laporanRefs.current[index] = el)}
              >
                {selectionState.activeGroup === weekId && !item.id.toString().startsWith('static-') && (
                  <input
                    type="checkbox"
                    className="delete-checkbox"
                    onChange={() => handleItemSelection(item.id)}
                    checked={selectionState.selectedItems.has(item.id)}
                  />
                )}
                <div className="laporan-item-content">
                  <h3>Kelas: {item.kelas}</h3>
                  <p><strong>Keadaan:</strong> {item.keadaan}</p>
                  <p><strong>Alat:</strong> {item.alat}</p>
                  <p><strong>Masalah:</strong> {item.masalah}</p>
                  <p><em>{new Date(item.timestamp).toTimeString().slice(0,5).replace(':', '.')}</em></p>
                  
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Laporan;