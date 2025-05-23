import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Layout.css";

function Layout() {
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState(0); // nilai awal nomor cetak
  const [format_digit, setFormatDigit] = useState(1); // jumlah digit atau sampai nomor
  const [prefix, setPrefix] = useState(""); // prefix opsional

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

  // const handlePrintSatuan = (id) => {
  //   navigate(`/print-satuan/${id}`);
  // };
  const handlePrintSatuan = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Pengaturan Nomor Antrian",
      html: `
      <div>
        <label for="swal-input1">Mulai dari nomor</label>
        <input id="swal-input1" type="number" class="swal2-input" value="${start}" placeholder="Contoh: 1">
        
        <label for="swal-input2">Jumlah yang dicetak</label>
        <input id="swal-input2" type="number" class="swal2-input" value="${format_digit}" placeholder="Contoh: 10">
        
        <label for="swal-input3">Prefix (opsional)</label>
        <input id="swal-input3" type="text" class="swal2-input" value="${prefix}" placeholder="Contoh: A">
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Cetak",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const inputStart = document.getElementById("swal-input1").value;
        const inputFormat = document.getElementById("swal-input2").value;
        const inputPrefix = document.getElementById("swal-input3").value;

        if (!inputStart || !inputFormat) {
          Swal.showValidationMessage("Nomor mulai dan jumlah harus diisi");
          return false;
        }

        return [inputStart, inputFormat, inputPrefix];
      },
    });

    if (formValues) {
      const [inputStart, inputFormat, inputPrefix] = formValues;

      navigate(
        `/print-satuan/${id_antrian}?start=${inputStart}&format=${inputFormat}&prefix=${inputPrefix}`
      );
    }
  };

  const handlePrintLayout = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Cetak Layout",
      html: `
      <div style="display: flex; flex-direction: column; gap: 20px; width: 100%;" class="swal2-form-container">

        <!-- Baris 1: Dua Kolom -->
        <div style="display: flex; gap: 20px; width: 100%; justify-content: center; align-item: center">
          <!-- Kolom Kiri -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
            <div class="swal2-form-group">
              <label for="swal-input1" style="margin-bottom: 5px; font-weight: 500; color: #555;">Mulai dari nomor</label>
              <input id="swal-input1" type="number" style="width: 150px; box-sizing: border-box;" class="swal2-input" placeholder="Contoh: 1">
            </div>
            <div class="swal2-form-group">
              <label for="swal-input2" style="margin-bottom: 5px; font-weight: 500; color: #555;">Sampai nomor</label>
              <input id="swal-input2" type="number" style="width: 150px; box-sizing: border-box;" class="swal2-input" placeholder="Contoh: 100">
            </div>
          </div>

          <!-- Kolom Kanan -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
            <div class="swal2-form-group">
              <label for="swal-input3" style="margin-bottom: 5px; font-weight: 500; color: #555;">Jumlah format digit</label>
              <input id="swal-input3" type="number" style="width: 150px; box-sizing: border-box;" class="swal2-input" placeholder="Contoh: 3" value="1">
            </div>
            <div class="swal2-form-group">
              <label for="swal-input4" style="margin-bottom: 5px; font-weight: 500; color: #555;">Prefix (opsional)</label>
              <input id="swal-input4" type="text" style="width: 150px; box-sizing: border-box;" class="swal2-input" placeholder="Contoh: ANT-">
            </div>
          </div>
        </div>

        <!-- Baris 2: Delay (Full Width) -->
        <div class="swal2-form-group">
          <label for="swal-input5" style="margin-bottom: 5px; font-weight: 500; color: #555;">Delay (milliseconds)</label>
          <input id="swal-input5" type="number" style="width: 300px; box-sizing: border-box;" class="swal2-input" placeholder="Contoh: 500" value="1000">
        </div>

      </div>
    `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
          document.getElementById("swal-input4").value,
          document.getElementById("swal-input5").value,
        ];
      },
    });

    if (formValues) {
      try {
        const [start, end, format_digit, prefix, delayMs] = formValues;
        const response = await axios.post(
          `http://localhost:3000/api/print/${id_antrian}`,
          {
            start: parseInt(start),
            end: parseInt(end),
            format_digit: parseInt(format_digit),
            prefix: prefix,
            delayMs: parseInt(delayMs),
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
          <button
            className="print-satuan-btn"
            style={{ color: "white" }}
            onClick={() => handlePrintSatuan(id_antrian)}
          >
            Print Satuan
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
