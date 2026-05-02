import { useNavigate } from "react-router-dom";
import InternshipHelpDesk from "./Internshiphelpdesk ";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #111111;
    color: #fff;
    overflow-x: hidden;
    margin-top:50px;
  }

  .ip-nav {
    position: fixed; top: 0; width: 100%; z-index: 1000;
    padding: 1.1rem 5%;
    display: flex; align-items: center; justify-content: space-between;
    background: #E09000;
    border-bottom: 3px solid #111;
    box-shadow: 0 4px 0 #111;
  }
  .ip-nav-logo {
    font-family: 'Oswald', sans-serif;
    font-size: 1.4rem; font-weight: 700;
    color: #111; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .ip-nav-logo .red { color: #D32F2F; }
  .ip-back-btn {
    background: #111; color: #F5A300;
    border: 2px solid #111; padding: 0.55rem 1.3rem;
    font-family: 'Oswald', sans-serif; font-size: 0.9rem; font-weight: 700;
    letter-spacing: 0.06em; cursor: pointer; border-radius: 8px;
    box-shadow: 3px 3px 0 #D32F2F;
    transition: all 0.3s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .ip-back-btn:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #D32F2F; }

  .ip-hero {
    padding: 130px 5% 60px;
    background: linear-gradient(160deg, #111 0%, #1a1a1a 100%);
    border-bottom: 4px solid #F5A300;
    text-align: center;
  }
  .ip-hero-tag {
    display: inline-block; background: #F5A300; color: #111;
    font-family: 'Oswald', sans-serif; font-size: 0.75rem;
    letter-spacing: 0.15em; padding: 0.3rem 1rem;
    border-radius: 100px; margin-bottom: 1.25rem; font-weight: 700;
  }
  .ip-hero-title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(2.8rem, 6vw, 4.5rem);
    color: #F5A300; font-weight: 700;
    line-height: 1.05; margin-bottom: 1rem;
  }
  .ip-hero-title span { color: #fff; }
  .ip-hero-sub {
    color: rgba(255,255,255,0.6);
    font-size: 1.05rem; font-weight: 600;
    max-width: 640px; margin: 0 auto;
    line-height: 1.75;
  }
`;

export default function InternshipPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>

      {/* Nav */}
      <nav className="ip-nav">
        <div className="ip-nav-logo" onClick={() => navigate("/")}>
          <span><span className="red">Nk's</span> StudySync</span>
        </div>
        <button className="ip-back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </nav>

      {/* Hero */}
      

      {/* Full internship component */}
      <InternshipHelpDesk />
    </>
  );
}