import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import NKsStudySync from "./NKsStudySync";
import ContactPage from "./Contactpage";
import InternshipPage from "./InternshipPage";
import ScrollToTop from "./ScrollToTop.jsx";

function HomeWrapper() {
  const navigate = useNavigate();
  return <NKsStudySync onContact={() => navigate("/contact")} />;
}

function ContactWrapper() {
  const navigate = useNavigate();
  return <ContactPage onBack={() => navigate("/")} />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/contact" element={<ContactWrapper />} />
        <Route path="/internships" element={<InternshipPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 