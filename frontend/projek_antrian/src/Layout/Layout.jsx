import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Layout.css";

function Layout() {
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id_antrian } = useParams();

  const fetchLayout = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/layout/antrian/${id_antrian}`
      );
      setLayout(response.data.data); // Mengambil data layout dari API
    } catch (error) {
      console.error("Gagal fetch data layout:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayout();
  }, [id_antrian]);

  const handleEdit = (id) => {
    navigate(`/edit_layout/${id}`);
  };

  const handlePrintLayout = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Cetak Layout",
      html:
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Mulai dari nomor">' +
        '<input id="swal-input2" type="number" class="swal2-input" placeholder="Sampai nomor">' +
        '<input id="swal-input3" type="number" class="swal2-input" placeholder="Format digit" value= "1">' +
        '<input id="swal-input4" type="text" class="swal2-input" placeholder="Prefix">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
          document.getElementById("swal-input4").value,
        ];
      },
    });

    if (formValues) {
      try {
        const [start, end, format_digit, prefix] = formValues;
        const response = await axios.post(
          `http://localhost:3000/api/print/${id_antrian}`,
          {
            start: parseInt(start),
            end: parseInt(end),
            format_digit: parseInt(format_digit),
            prefix: prefix,
          }
        );
        Swal.fire("Sukses", response.data.message, "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Gagal", "Terjadi kesalahan saat mencetak.", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus layout ini?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/layout/${id}`
      );
      alert(response.data.message);
      fetchLayout();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Gagal menghapus layout.");
    }
  };

  const renderContent = (content) => {
    if (!content) {
      return null; // tampilkan kosong
    }

    if (
      typeof content === "string" &&
      (content.startsWith("http://") || content.startsWith("https://"))
    ) {
      return (
        <img
          style={{ width: "200px", height: "200px" }}
          src={content}
          alt="Layout Content"
          className="layout-image"
        />
      );
    }

    return typeof content === "string" ? content : " ";
  };

  return (
    <div className="antrian-container">
      <div className="header-section">
        <h1 className="page-title">Layout - Antrian ID: {id_antrian}</h1>
        <div className="button-group">
          <button className="nav-btn" onClick={() => navigate("/antrian")}>
            <i className="fas fa-arrow-left"></i> Antrian
          </button>
          <button
            className="add-btn"
            onClick={() => navigate(`/tambah_layout/${id_antrian}`)}
          >
            <span className="plus-icon">+</span> Tambah Layout
          </button>
          <button className="print-btn" onClick={handlePrintLayout}>
            <i className="fas fa-print"></i> Print Layout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data layout...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="antrian-table">
            <thead>
              <tr className="text-center">
                <th className="text-center">No</th>
                <th className="text-center">Urutan</th>
                <th className="text-center">Tipe</th>
                <th className="text-center">Ukuran Font</th>
                <th className="text-center">Nama Layout</th>
                <th className="text-center">Content</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {layout.length > 0 ? (
                layout.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item.urutan}</td>
                    <td className="text-center">{item.type}</td>
                    <td className="text-center">{item.size_font}</td>
                    <td className="text-center">{item.nama}</td>
                    <td className="text-center">
                      {renderContent(item.content)}
                    </td>
                    {/* Memanggil fungsi renderContent */}
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item.id)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fas fa-trash"></i> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    Tidak ada data layout
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

export default Layout;
