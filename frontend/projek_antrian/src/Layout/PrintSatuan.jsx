import React, { useEffect, useState, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import "./PrintSatuan.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const PrintSatuan = () => {
  const { id_antrian } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [dataDetail, setDataDetail] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const queryParams = new URLSearchParams(location.search);

  // Ambil nilai start dari localStorage jika tersedia, jika tidak pakai query param
  const localStart = localStorage.getItem(`start-${id_antrian}`);
  const [start, setStart] = useState(
    localStart !== null
      ? Number(localStart)
      : Number(queryParams.get("start")) || 0
  );

  const [format, setFormat] = useState(Number(queryParams.get("format")) || 1);
  const [prefix, setPrefix] = useState(queryParams.get("prefix") || "");

  // PERBAIKAN: Langsung baca dari localStorage saat inisialisasi state
  const [hasShownAlert, setHasShownAlert] = useState(() => {
    return localStorage.getItem(`alertShown-${id_antrian}`) === "true";
  });

  // Fetch data antrian dari backend
  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/layout/antrian/${id_antrian}`
      );
      setDataDetail(response.data.data);
    } catch (error) {
      alert("Gagal memproses data");
      console.log(error);
    }
  };

  // SweetAlert untuk pengaturan print
  const showPrintSettings = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Pengaturan Nomor Antrian",
      html: `
        <div>
          <label for="swal-input1">Mulai dari nomor</label>
          <input id="swal-input1" type="number" class="swal2-input" value="0" placeholder="Contoh: 1">
          
          <label for="swal-input2">Jumlah yang dicetak</label>
          <input id="swal-input2" type="number" class="swal2-input" value="${format}" placeholder="Contoh: 10">
          
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

        return { inputStart, inputFormat, inputPrefix };
      },
    });

    if (isConfirmed && formValues) {
      const { inputStart, inputFormat, inputPrefix } = formValues;
      setStart(Number(inputStart));
      setFormat(Number(inputFormat));
      setPrefix(inputPrefix);

      // Simpan ke localStorage
      localStorage.setItem(`start-${id_antrian}`, inputStart);
      localStorage.setItem(`alertShown-${id_antrian}`, "true");
      setHasShownAlert(true);

      // Update URL query
      queryParams.set("start", inputStart);
      queryParams.set("format", inputFormat);
      queryParams.set("prefix", inputPrefix);
      window.history.replaceState(null, "", `?${queryParams.toString()}`);

      return true;
    } else {
      navigate(-1); // kembali jika dibatalkan
      return false;
    }
  };

  // Fungsi untuk handle tombol Print
  const handlePrint = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/printSatuan/${id_antrian}`,
        {
          start: Number(start),
          format_digit: Number(format),
          prefix: prefix,
        }
      );

      console.log("Data dikirim:", { start, format, prefix });
      console.log("Respon:", response.data);

      // Update start +1 dan simpan ke localStorage
      setStart((prev) => {
        const newStart = prev + 1;
        localStorage.setItem(`start-${id_antrian}`, newStart);
        return newStart;
      });
    } catch (error) {
      console.log("Gagal print:", error);
    }
  };

  // Ambil data awal dan tandai bahwa inisialisasi selesai
  useEffect(() => {
    const init = async () => {
      await getData();
      setIsInitialized(true);
    };

    init();
  }, []);

  // Jalankan SweetAlert hanya jika belum pernah tampil
  useEffect(() => {
    if (isInitialized && !hasShownAlert) {
      showPrintSettings().then((confirmed) => {
        if (!confirmed) {
          localStorage.setItem(`alertShown-${id_antrian}`, "true");
          setHasShownAlert(true);
        }
      });
    }
  }, [isInitialized, hasShownAlert]);

  // PERBAIKAN: Gunakan sessionStorage untuk mendeteksi refresh vs navigation
  useEffect(() => {
    // Set marker bahwa halaman ini sedang aktif
    const pageMarker = `page-active-${id_antrian}`;
    sessionStorage.setItem(pageMarker, "true");

    // Cleanup function: hapus localStorage hanya jika bukan refresh
    return () => {
      // Cek apakah sessionStorage masih ada (berarti refresh) atau hilang (berarti navigasi/close)
      const isStillActive = sessionStorage.getItem(pageMarker);

      // Tambahkan delay kecil untuk memastikan sessionStorage check yang akurat
      setTimeout(() => {
        const finalCheck = sessionStorage.getItem(pageMarker);

        if (!finalCheck) {
          // SessionStorage hilang = user benar-benar meninggalkan halaman
          console.log("User left page - cleaning localStorage");
          localStorage.removeItem(`alertShown-${id_antrian}`);
          localStorage.removeItem(`start-${id_antrian}`);
        } else {
          // SessionStorage masih ada = kemungkinan refresh
          console.log("Page refresh detected - preserving localStorage");
          // Bersihkan sessionStorage marker untuk cleanup berikutnya
          sessionStorage.removeItem(pageMarker);
        }
      }, 100);
    };
  }, [id_antrian]);

  // TAMBAHAN: Effect untuk handle visibility change (tab switching, minimizing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switch tab atau minimize - jangan hapus localStorage
        console.log("Page hidden - preserving localStorage");
      } else {
        // User kembali ke tab - refresh marker
        const pageMarker = `page-active-${id_antrian}`;
        sessionStorage.setItem(pageMarker, "true");
        console.log("Page visible - refreshing marker");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [id_antrian]);

  // TAMBAHAN: Backup cleanup untuk browser close/refresh detection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Set temporary marker untuk distinguish refresh vs close
      const tempMarker = `temp-unload-${id_antrian}`;
      sessionStorage.setItem(tempMarker, Date.now().toString());

      // Set timeout untuk hapus marker jika ini refresh (halaman akan load lagi)
      setTimeout(() => {
        const marker = sessionStorage.getItem(tempMarker);
        if (marker) {
          // Marker masih ada setelah delay = kemungkinan browser close
          console.log("Browser close detected");
          sessionStorage.removeItem(tempMarker);
        }
      }, 1000);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id_antrian]);

  return (
    <div className="body">
      <Container className="print-container">
        <div className="text-center">
          <h4 className="title mt-4">
            {
              dataDetail.find(
                (item) => item.type === "text" && item.nama === "Judul"
              )?.content
            }
          </h4>

          {dataDetail
            .filter((item) => item.type === "text" && item.nama !== "Judul")
            .map((item, index) => (
              <h5 key={index} className="sub-title mt-3">
                {item.content}
              </h5>
            ))}

          <h1 className="no-antrian mt-4">
            {prefix}
            {start}
          </h1>

          <Button className="btn-print mt-5" onClick={handlePrint}>
            Print
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default PrintSatuan;
