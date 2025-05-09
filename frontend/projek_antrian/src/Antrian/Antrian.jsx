import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Antrian.css";

function Antrian() {
  const [antrian, setAntrian] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/antrian");
      setAntrian(response.data.data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit_antrian/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:3000/api/antrian/${id}`);
      alert(response.data.message);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const handleAdd = () => {
    navigate("/tambah_antrian");
  };

  const handleLayout = (id_antrian) => {
    navigate(`/layout/${id_antrian}`);
  };

  return (
    <div className="antrian-container">
      <div className="header-section">
        <h1 className="page-title">Data Antrian</h1>
        <div className="action-buttons-header">
          <button className="add-btn" onClick={handleAdd}>
            <span className="plus-icon">+</span> Tambah Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="antrian-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Antrian</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {antrian.length > 0 ? (
                antrian.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nama_antrian}</td>
                    <td className="action-buttons">
                      <button className="layout-btn" onClick={() => handleLayout(item.id)}>
                        <i className="fas fa-th-large"></i> Layout
                      </button>
                      <button className="edit-btn" onClick={() => handleEdit(item.id)}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                        <i className="fas fa-trash"></i> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    Tidak ada data antrian
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Antrian;
