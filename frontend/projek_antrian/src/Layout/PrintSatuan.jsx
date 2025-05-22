import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import "./PrintSatuan.css";
import { useLocation, useParams } from "react-router-dom";

const PrintSatuan = () => {
  const { id_antrian } = useParams();
  const location = useLocation();

  const [dataDetail, setDataDetail] = useState([]);

  // Ambil query params
  const queryParams = new URLSearchParams(location.search);
  const start = queryParams.get("start");
  const format = queryParams.get("format");
  const prefix = queryParams.get("prefix");

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/layout/antrian/${id_antrian}`
      );
      setDataDetail(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      alert("Gagal memproses data");
      console.log(error);
    }
  };

  const handlePrint = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/print/${id_antrian}`,
        { start: start, format_digit: format, prefix: prefix }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="body">
      <Container className="print-container">
        {
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
                <h5 key={index} className="sub-title mt-2">
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
        }
      </Container>
    </div>
  );
};

export default PrintSatuan;
