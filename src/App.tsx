import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RSVP from "./pages/RSVP";
import Info from "./pages/Info";
import Accommodations from "./pages/Accommodations";
import Registry from "./pages/Registry";
import Photos from "./pages/Photos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/info" element={<Info />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/photos" element={<Photos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
