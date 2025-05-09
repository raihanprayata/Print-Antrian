import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TambahLayout.css";

function TambahLayout() {
  const { id_antrian } = useParams();

  const [urutan, setUrutan] = useState("");
  const [type, setType] = useState("");
  const [sizeFont, setSizeFont] = useState("");
  const [nama, setNama] = useState("");
  const [content, setContent] = useState(null);

  const navigate = useNavigate();
  console.log("id antrian: ", id_antrian);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id_antrian", id_antrian);
    formData.append("urutan", urutan);
    formData.append("type", type);
    formData.append("size_font", sizeFont);
    formData.append("nama", nama);

    if (type === "image") {
      formData.append("content", content); // File
    } else {
      formData.append("content", content); // Teks
    }

    try {
      const response = await fetch("http://localhost:3000/api/layout", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate(`/layout/${id_antrian}`);
      } else {
        alert("Gagal tambah data: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan data layout");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4 pt-4 pb-3">
                Tambah Layout
              </Card.Title>
              <Form
                onSubmit={handleSubmit}
                className="p-4"
                encType="multipart/form-data"
              >
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ID Antrian</Form.Label>
                      <Form.Control type="number" value={id_antrian} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Urutan</Form.Label>
                      <Form.Control
                        type="text"
                        value={urutan}
                        onChange={(e) => setUrutan(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipe</Form.Label>
                      <Form.Select
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value);
                          setContent(""); // Reset content saat tipe berubah
                        }}
                      >
                        <option value="" disabled>
                          Pilih tipe layout
                        </option>
                        <option value="text">Text</option>
                        <option value="antrian">Antrian</option>
                        <option value="image">Image</option>
                        <option value="line">Line</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ukuran Font</Form.Label>
                      <Form.Control
                        type="number"
                        value={sizeFont}
                        onChange={(e) => setSizeFont(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nama</Form.Label>
                      <Form.Control
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Content</Form.Label>
                      {type === "image" ? (
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => setContent(e.target.files[0])}
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          placeholder="Masukkan konten"
                          value={content || ""}
                          onChange={(e) => setContent(e.target.value)}
                        />
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between">
                  <Button variant="success" type="submit">
                    Simpan
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => navigate(`/layout/${id_antrian}`)}
                  >
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

export default TambahLayout;
