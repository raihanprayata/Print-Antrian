import React, { useEffect, useState } from "react";
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
  const [start, setStart] = useState(Number(queryParams.get("start")) || 0);
  const [format, setFormat] = useState(Number(queryParams.get("format")) || 1);
  const [prefix, setPrefix] = useState(queryParams.get("prefix") || "");

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

  const showPrintSettings = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Pengaturan Nomor Antrian",
      html: `
        <div>
          <label for="swal-input1">Mulai dari nomor</label>
          <input id="swal-input1" type="number" class="swal2-input" value="${start}" placeholder="Contoh: 1" value="0">
          
          <label for="swal-input2">Jumlah yang dicetak</label>
          <input id="swal-input2" type="number" class="swal2-input" value="${format}" placeholder="Contoh: 10" value="1">
          
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

      // Update query params di URL
      queryParams.set("start", inputStart);
      queryParams.set("format", inputFormat);
      queryParams.set("prefix", inputPrefix);
      window.history.replaceState(null, "", `?${queryParams.toString()}`);

      return true;
    } else {
      navigate(-1); // Kembali jika dibatalkan
      return false;
    }
  };

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

      setStart((prev) => prev + 1);
    } catch (error) {
      console.log("Gagal print:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await getData();
      setIsInitialized(true);
    };

    init();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      showPrintSettings();
    }
  }, [isInitialized]);

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
