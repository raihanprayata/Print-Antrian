import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EditLayout.css";

function EditLayout() {
  const [idAntrian, setIdAntrian] = useState("");
  const [urutan, setUrutan] = useState("");
  const [type, setType] = useState("");
  const [sizeFont, setSizeFont] = useState("");
  const [nama, setNama] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/layout/id/${id}`
        );
        const data = response.data.data;

        setIdAntrian(data.id_antrian);
        setUrutan(data.urutan);
        setType(data.type);
        setSizeFont(data.size_font);
        setNama(data.nama);
        setContent(data.content);
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat mengambil data layout");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id_antrian", idAntrian);
    formData.append("urutan", urutan);
    formData.append("type", type);
    formData.append("size_font", sizeFont);
    formData.append("nama", nama);

    if (type === "image" && file) {
      formData.append("content", file);
    } else if (type !== "image") {
      formData.append("content", content);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/layout/${id}`,
        formData
      );

      alert(response.data.message);
      navigate(`/layout/${idAntrian}`);
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Gagal update layout: " + error.response?.data?.message || error.message
      );
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Memuat data layout...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4 pt-4 pb-3">
                Edit Layout
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
                      <Form.Control type="number" value={idAntrian} disabled />
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
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="" disabled>
                          pilih tipe layout
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
                <Form.Group className="mb-3">
                  <Form.Label>Nama</Form.Label>
                  <Form.Control
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Konten</Form.Label>
                  {type === "image" ? (
                    <>
                      {content && (
                        <div className="mb-3">
                          <Image src={content} alt="Current" fluid thumbnail />
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </>
                  ) : (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  )}
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button variant="success" type="submit">
                    Simpan
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => navigate(`/layout/${idAntrian}`)}
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

export default EditLayout;
