import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import "./PrintSatuan.css";
import { useParams } from "react-router-dom";

const PrintSatuan = () => {
  const { id_antrian } = useParams();
  const [start, setStart] = useState(0);
  const [formatDigit, setFormatDigit] = useState(1);
  const [prefix, setPrefix] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/printSatuan/${id_antrian}`,
        {
          start: parseInt(start),
          format_digit: parseInt(formatDigit),
          prefix: prefix,
        }
      );

      // Auto-increment start untuk kenyamanan input berikutnya
      setStart((prev) => parseInt(prev) + 1);

      Swal.fire("Sukses", response.data.message, "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Terjadi kesalahan saat mencetak.", "error");
    }
  };

  return (
    <div className="body">
      <Container className="print-container">
        <div className="text-center">
          <h4 className="title-form">Print Satuan</h4>
          <p>( Halaman untuk print satu layout )</p>
        </div>
        <div>
          <Form className="form" onSubmit={handleSubmit}>
            <Form.Label className="label-name">Mulai Dari</Form.Label>
            <Form.Control
              type="number"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Contoh: 0"
            />

            <Form.Label className="label-name">Format Digit</Form.Label>
            <Form.Control
              type="number"
              value={formatDigit}
              onChange={(e) => setFormatDigit(e.target.value)}
              placeholder="Contoh: 3"
            />

            <Form.Label className="label-name">Prefix (Opsional)</Form.Label>
            <Form.Control
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Contoh: ANT-"
            />

            <div className="border-button">
              <Button
                type="submit"
                className="btn-success"
                style={{ fontWeight: "bold" }}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default PrintSatuan;
