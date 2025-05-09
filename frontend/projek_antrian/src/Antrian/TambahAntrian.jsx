import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function TambahAntrian() {
  const [namaAntrian, setNamaAntrian] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaAntrian.trim()) {
      alert("Nama antrian tidak boleh kosong!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/antrian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama_antrian: namaAntrian }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/antrian");
      } else {
        alert("Gagal tambah data: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan data");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4 pt-4 pb-3">Tambah Antrian</Card.Title>
              <Form onSubmit={handleSubmit} className="p-4">
                <Form.Group controlId="namaAntrian" className="mb-3">
                  <Form.Label>Nama Antrian</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan nama antrian"
                    value={namaAntrian}
                    onChange={(e) => setNamaAntrian(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button variant="success" type="submit">
                    Simpan
                  </Button>
                  <Button variant="danger" onClick={() => navigate("/antrian")}>
                    Batal
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TambahAntrian;
