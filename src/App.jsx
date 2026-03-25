import { BrowserRouter, Routes, Route } from "react-router-dom";
import NKsStudySync from "./NKsStudySync";
import ContactPage from "./Contactpage";
import ScrollToTop from "./ScrollToTop.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<NKsStudySync />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;