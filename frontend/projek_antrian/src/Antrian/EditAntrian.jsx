import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function EditAntrian() {
  const [namaAntrian, setNamaAntrian] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/antrian/id/${id}`);
        const result = await response.json();
        if (response.ok) {
          setNamaAntrian(result.data.nama_antrian);
        } else {
          alert("Gagal mengambil data antrian");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaAntrian.trim()) {
      alert("Nama antrian tidak boleh kosong!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/antrian/${id}`, {
        method: "PUT",
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
        alert("Gagal edit data: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengedit data");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Memuat data...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4 pt-4 pb-3">Edit Antrian</Card.Title>
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

export default EditAntrian;
