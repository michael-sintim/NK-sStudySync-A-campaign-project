import { BrowserRouter, Routes, Route } from "react-router-dom";
import NKsStudySync from "./NKsStudySync";
import ContactPage from "./ContactPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NKsStudySync />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;