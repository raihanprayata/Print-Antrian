import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Antrian from "./Antrian/Antrian";
import TambahAntrian from "./Antrian/TambahAntrian";
import EditAntrian from "./Antrian/EditAntrian";
import Layout from "./Layout/Layout";
import TambahLayout from "./Layout/TambahLayout";
import EditLayout from "./Layout/EditLayout";
import PrintSatuan from "./Layout/PrintSatuan";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/antrian" element={<Antrian />} />
          <Route path="/tambah_antrian" element={<TambahAntrian />} />
          <Route path="/edit_antrian/:id" element={<EditAntrian />} />
          <Route path="/layout/:id_antrian" element={<Layout />} />
          <Route path="/tambah_layout/:id_antrian" element={<TambahLayout />} />
          <Route path="/print-satuan" element={<PrintSatuan />} />
          <Route path="/edit_layout/:id" element={<EditLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
