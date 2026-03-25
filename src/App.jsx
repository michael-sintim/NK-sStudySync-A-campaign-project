import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import NKsStudySync from "./NKsStudySync";
import ContactPage from "./Contactpage";
import ScrollToTop from "./ScrollToTop.jsx";

// Wrapper for Home page
function HomeWrapper() {
  const navigate = useNavigate();
  return <NKsStudySync onContact={() => navigate("/contact")} />;
}

// Wrapper for Contact page
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;