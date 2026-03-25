import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const THEME = {
  amber: "#F5A300",
  amberLight: "#FFB800",
  amberDark: "#E09000",
  black: "#111111",
  blackSoft: "#1A1A1A",
  red: "#D32F2F",
  redDark: "#B71C1C",
  white: "#FFFFFF",
  transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
};

const getStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  :root {
    --amber: ${THEME.amber};
    --amber-light: ${THEME.amberLight};
    --amber-dark: ${THEME.amberDark};
    --black: ${THEME.black};
    --black-soft: ${THEME.blackSoft};
    --red: ${THEME.red};
    --red-dark: ${THEME.redDark};
    --white: ${THEME.white};
    --ease: ${THEME.transition};
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--amber);
    color: var(--black);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ===== NAV ===== */
  .cp-nav {
    position: fixed; top: 0; width: 100%; z-index: 1000;
    padding: 1.1rem 5%;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--amber-dark);
    border-bottom: 3px solid var(--black);
    box-shadow: 0 4px 0 var(--black);
  }
  .cp-nav-logo {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Oswald', sans-serif; font-size: 1.4rem; font-weight: 700;
    color: var(--black); cursor: pointer; text-decoration: none;
  }
  .cp-logo-nk { color: var(--red); }
  .cp-logo-bolt {
    background: var(--black); color: var(--amber);
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; border-radius: 6px; border: 2px solid var(--black);
  }
  .cp-back-btn {
    background: var(--black); color: var(--amber);
    border: 2px solid var(--black); padding: 0.5rem 1.2rem;
    font-family: 'Oswald', sans-serif; font-size: 0.85rem; font-weight: 700;
    letter-spacing: 0.06em; cursor: pointer; border-radius: 8px;
    box-shadow: 3px 3px 0 var(--red); transition: var(--ease);
    text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
  }
  .cp-back-btn:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--red); }

  /* ===== HERO BANNER ===== */
  .cp-hero {
    width: 100%;
    background: linear-gradient(135deg, #FFB800 0%, #F5A300 40%, #E09000 70%, #C97E00 100%);
    padding: 120px 5% 60px;
    border-bottom: 4px solid var(--black);
    text-align: center;
    position: relative; overflow: hidden;
  }
  .cp-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }
  .cp-hero-tag {
    display: inline-block; background: var(--black); color: var(--amber);
    font-family: 'Oswald', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em;
    padding: 0.3rem 1rem; border-radius: 100px; margin-bottom: 1.2rem;
    border: 2px solid var(--red); box-shadow: 3px 3px 0 var(--red);
    position: relative; z-index: 1;
  }
  .cp-hero-title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700; color: var(--black); line-height: 1.0;
    margin-bottom: 1rem; position: relative; z-index: 1;
    text-shadow: 3px 3px 0 rgba(0,0,0,0.08);
  }
  .cp-hero-title span { color: var(--red); }
  .cp-hero-sub {
    font-size: clamp(0.95rem, 1.8vw, 1.15rem);
    color: rgba(13,13,13,0.65); font-weight: 600; line-height: 1.7;
    max-width: 600px; margin: 0 auto;
    position: relative; z-index: 1;
  }

  /* ===== FORM WRAPPER ===== */
  .cp-form-section {
    width: 100%; padding: 4rem 5% 6rem;
    background: linear-gradient(160deg, #FFB800 0%, #F5A300 50%, #E09000 100%);
    border-top: 4px solid var(--black);
  }
  .cp-form-card {
    max-width: 720px; width: 100%; margin: 0 auto;
    background: var(--white);
    border: 3px solid var(--black); border-radius: 20px;
    box-shadow: 10px 10px 0 var(--black);
    overflow: hidden;
  }
  .cp-form-header {
    background: var(--black); padding: 2rem 2.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .cp-form-header-icon {
    width: 48px; height: 48px; background: var(--amber);
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cp-form-header h2 {
    font-family: 'Oswald', sans-serif; font-size: 1.5rem;
    font-weight: 700; color: var(--amber); margin-bottom: 0.2rem;
  }
  .cp-form-header p {
    font-size: 0.82rem; color: rgba(255,255,255,0.5); font-weight: 600;
  }
  .cp-form-body { padding: 2.5rem; }

  /* ===== FORM FIELDS ===== */
  .cp-field-group {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem;
    margin-bottom: 1.2rem;
  }
  .cp-field-group.full { grid-template-columns: 1fr; }
  .cp-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .cp-label {
    font-family: 'Oswald', sans-serif; font-size: 0.78rem;
    font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--black);
  }
  .cp-label span { color: var(--red); margin-left: 2px; }
  .cp-input, .cp-select, .cp-textarea {
    padding: 0.7rem 1rem;
    background: #FAFAFA; border: 2px solid rgba(13,13,13,0.15);
    color: var(--black); font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem; font-weight: 600;
    outline: none; border-radius: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: var(--amber-dark);
    box-shadow: 0 0 0 3px rgba(245,163,0,0.15);
    background: var(--white);
  }
  .cp-input.error, .cp-select.error, .cp-textarea.error {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(211,47,47,0.1);
  }
  .cp-input::placeholder, .cp-textarea::placeholder { color: rgba(13,13,13,0.3); }
  .cp-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 2.5rem; cursor: pointer; }
  .cp-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
  .cp-error-msg { font-size: 0.75rem; color: var(--red); font-weight: 700; margin-top: 2px; }

  /* ===== CAMPUS STATUS TOGGLE ===== */
  .cp-toggle-group {
    display: flex; gap: 0.75rem; margin-top: 0.2rem;
  }
  .cp-toggle-btn {
    flex: 1; padding: 0.65rem 1rem;
    background: #FAFAFA; border: 2px solid rgba(13,13,13,0.15);
    font-family: 'Oswald', sans-serif; font-size: 0.85rem; font-weight: 700;
    letter-spacing: 0.05em; cursor: pointer; border-radius: 8px;
    transition: all 0.18s; color: rgba(13,13,13,0.5);
  }
  .cp-toggle-btn.active {
    background: var(--black); color: var(--amber);
    border-color: var(--black); box-shadow: 3px 3px 0 var(--red);
  }
  .cp-toggle-btn:hover:not(.active) {
    border-color: var(--black); color: var(--black);
  }

  /* ===== DIVIDER ===== */
  .cp-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.8rem 0 1.5rem;
  }
  .cp-divider-line { flex: 1; height: 2px; background: rgba(13,13,13,0.08); }
  .cp-divider-label {
    font-family: 'Oswald', sans-serif; font-size: 0.72rem;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(13,13,13,0.35); white-space: nowrap;
  }

  /* ===== SUBMIT BUTTON ===== */
  .cp-submit-btn {
    width: 100%; padding: 1rem 2rem;
    background: var(--black); color: var(--amber);
    border: 3px solid var(--black);
    font-family: 'Oswald', sans-serif; font-size: 1.05rem; font-weight: 700;
    letter-spacing: 0.08em; cursor: pointer; border-radius: 10px;
    box-shadow: 6px 6px 0 var(--red);
    transition: var(--ease); margin-top: 1.5rem;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cp-submit-btn:hover { transform: translate(3px, 3px); box-shadow: 3px 3px 0 var(--red); }
  .cp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: 6px 6px 0 var(--red); }

  /* ===== SUCCESS STATE ===== */
  .cp-success {
    text-align: center; padding: 4rem 2.5rem;
  }
  .cp-success-icon {
    width: 80px; height: 80px; background: rgba(211,47,47,0.08);
    border: 3px solid var(--red); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
  }
  .cp-success h3 {
    font-family: 'Oswald', sans-serif; font-size: 2rem;
    font-weight: 700; color: var(--black); margin-bottom: 0.75rem;
  }
  .cp-success h3 span { color: var(--red); }
  .cp-success p {
    color: rgba(13,13,13,0.6); font-size: 1rem;
    line-height: 1.8; font-weight: 600; max-width: 420px; margin: 0 auto 2rem;
  }
  .cp-success-back {
    background: var(--black); color: var(--amber);
    border: 3px solid var(--black); padding: 0.85rem 2rem;
    font-family: 'Oswald', sans-serif; font-size: 0.95rem; font-weight: 700;
    letter-spacing: 0.08em; cursor: pointer; border-radius: 8px;
    box-shadow: 5px 5px 0 var(--red); transition: var(--ease);
    text-decoration: none; display: inline-block;
  }
  .cp-success-back:hover { transform: translate(3px, 3px); box-shadow: 2px 2px 0 var(--red); }

  /* ===== FOOTER ===== */
  .cp-footer {
    background: #0A0A0A; padding: 2rem 5%;
    border-top: 4px solid var(--amber); text-align: center;
  }
  .cp-footer-copy { color: rgba(255,255,255,0.2); font-size: 0.8rem; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 600px) {
    .cp-field-group { grid-template-columns: 1fr; }
    .cp-form-body { padding: 1.5rem; }
    .cp-form-header { padding: 1.5rem; }
    .cp-hero { padding: 100px 5% 40px; }
  }
`;

const PROGRAMMES = [
  "Aerospace Engineering","Agricultural Engineering","Biomedical Engineering",
  "Chemical Engineering","Civil Engineering","Computer Engineering",
  "Electrical/Electronic Engineering","Geological Engineering","Geomatic Engineering",
  "Industrial Engineering","Materials Engineering","Mechanical Engineering",
  "Metallurgical Engineering","Petroleum Engineering","Petrochemical Engineering",
  "Telecommunication Engineering",
];

const LEVELS = ["Level 100","Level 200","Level 300","Level 400"];

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    level: "",
    programme: "",
    campus_status: "",
    hostel_name: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [styleVersion, setStyleVersion] = useState(0);

  useEffect(() => {
    const existingStyle = document.getElementById("cp-styles");
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const el = document.createElement("style");
    el.id = "cp-styles";
    el.setAttribute("data-version", Date.now().toString());
    el.innerHTML = getStyles();
    document.head.appendChild(el);
    
    return () => {
      const styleToRemove = document.getElementById("cp-styles");
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const styleElement = document.getElementById("cp-styles");
      if (styleElement) {
        const _ = window.getComputedStyle(styleElement).cssText;
        setStyleVersion(prev => prev + 1);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const e = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!emailRegex.test(form.email)) e.email = "Please enter a valid email address";
    if (!form.level) e.level = "Please select your level";
    if (!form.programme) e.programme = "Please select your programme";
    if (!form.campus_status) e.campus_status = "Please select on or off campus";
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { 
      setErrors(e); 
      return; 
    }
    setLoading(true);
    setServerError("");
    
    try {
      const { error } = await supabase.from("contact_signups").insert([{
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        level: form.level,
        programme: form.programme,
        campus_status: form.campus_status,
        hostel_name: form.hostel_name.trim() || null,
        reason: form.reason.trim() || null,
      }]);
      
      if (error) {
        if (error.code === "23505") {
          setServerError("This email is already registered!");
        } else {
          setServerError("Something went wrong. Please try again.");
          console.error("Supabase error:", error);
        }
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setServerError("Network error. Please check your connection.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-root" key={styleVersion}>
      <nav className="cp-nav">
        <div className="cp-nav-logo">
          <div className="cp-logo-bolt">⚡</div>
          <span><span className="cp-logo-nk">Nk's</span> StudySync</span>
        </div>
        <button className="cp-back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </nav>

      <div className="cp-hero">
        <div className="cp-hero-tag">JOIN THE MOVEMENT</div>
        <h1 className="cp-hero-title">
          Register for <span>NK's StudySync</span>
        </h1>
        <p className="cp-hero-sub">
          Fill in your details below to join our community of engineering students
          committed to academic excellence at KNUST.
        </p>
      </div>

      <div className="cp-form-section">
        <div className="cp-form-card">
          <div className="cp-form-header">
            <div className="cp-form-header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h2>Student Registration</h2>
              <p>All fields marked with * are required</p>
            </div>
          </div>

          <div className="cp-form-body">
            {submitted ? (
              <div className="cp-success">
                <div className="cp-success-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3>You're <span>In!</span></h3>
                <p>
                  Welcome to NK's StudySync, {form.full_name.split(" ")[0]}. We'll be in touch
                  with details about upcoming sessions, tutorials, and community resources.
                </p>
                <button className="cp-success-back" onClick={() => navigate("/")}>
                  ← Back to Home
                </button>
              </div>
            ) : (
              <>
                <div className="cp-divider">
                  <div className="cp-divider-line"/>
                  <span className="cp-divider-label">Personal Information</span>
                  <div className="cp-divider-line"/>
                </div>

                <div className="cp-field-group">
                  <div className="cp-field">
                    <label className="cp-label">Full Name <span>*</span></label>
                    <input
                      className={`cp-input${errors.full_name ? " error" : ""}`}
                      type="text"
                      placeholder="e.g. Kwame Mensah"
                      value={form.full_name}
                      onChange={e => handleChange("full_name", e.target.value)}
                    />
                    {errors.full_name && <span className="cp-error-msg">{errors.full_name}</span>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Email Address <span>*</span></label>
                    <input
                      className={`cp-input${errors.email ? " error" : ""}`}
                      type="email"
                      placeholder="e.g. kwame@st.knust.edu.gh"
                      value={form.email}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                    {errors.email && <span className="cp-error-msg">{errors.email}</span>}
                  </div>
                </div>

                <div className="cp-field-group full">
                  <div className="cp-field">
                    <label className="cp-label">Phone Number <span style={{ color:"rgba(13,13,13,0.3)", fontWeight:600 }}>(optional)</span></label>
                    <input
                      className="cp-input"
                      type="tel"
                      placeholder="e.g. 0244 123 456"
                      value={form.phone}
                      onChange={e => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="cp-divider">
                  <div className="cp-divider-line"/>
                  <span className="cp-divider-label">Academic Information</span>
                  <div className="cp-divider-line"/>
                </div>

                <div className="cp-field-group">
                  <div className="cp-field">
                    <label className="cp-label">Current Level <span>*</span></label>
                    <select
                      className={`cp-select${errors.level ? " error" : ""}`}
                      value={form.level}
                      onChange={e => handleChange("level", e.target.value)}
                    >
                      <option value="">Select your level</option>
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {errors.level && <span className="cp-error-msg">{errors.level}</span>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Programme <span>*</span></label>
                    <select
                      className={`cp-select${errors.programme ? " error" : ""}`}
                      value={form.programme}
                      onChange={e => handleChange("programme", e.target.value)}
                    >
                      <option value="">Select your programme</option>
                      {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.programme && <span className="cp-error-msg">{errors.programme}</span>}
                  </div>
                </div>

                <div className="cp-divider">
                  <div className="cp-divider-line"/>
                  <span className="cp-divider-label">Accommodation</span>
                  <div className="cp-divider-line"/>
                </div>

                <div className="cp-field-group full">
                  <div className="cp-field">
                    <label className="cp-label">Campus Status <span>*</span></label>
                    <div className="cp-toggle-group">
                      <button
                        type="button"
                        className={`cp-toggle-btn${form.campus_status === "On Campus" ? " active" : ""}`}
                        onClick={() => handleChange("campus_status", "On Campus")}
                      >
                        🏫 On Campus
                      </button>
                      <button
                        type="button"
                        className={`cp-toggle-btn${form.campus_status === "Off Campus" ? " active" : ""}`}
                        onClick={() => handleChange("campus_status", "Off Campus")}
                      >
                        🏠 Off Campus
                      </button>
                    </div>
                    {errors.campus_status && <span className="cp-error-msg">{errors.campus_status}</span>}
                  </div>
                </div>

                <div className="cp-field-group full" style={{ marginTop:"1.2rem" }}>
                  <div className="cp-field">
                    <label className="cp-label">
                      Hostel / Residence Name
                      <span style={{ color:"rgba(13,13,13,0.3)", fontWeight:600, marginLeft:6 }}>(optional)</span>
                    </label>
                    <input
                      className="cp-input"
                      type="text"
                      placeholder={form.campus_status === "Off Campus" ? "e.g. Unity Hall annexe, Ayeduase..." : "e.g. Independence Hall, Unity Hall..."}
                      value={form.hostel_name}
                      onChange={e => handleChange("hostel_name", e.target.value)}
                    />
                  </div>
                </div>

                <div className="cp-divider">
                  <div className="cp-divider-line"/>
                  <span className="cp-divider-label">Anything Else?</span>
                  <div className="cp-divider-line"/>
                </div>

                <div className="cp-field-group full">
                  <div className="cp-field">
                    <label className="cp-label">
                      Why are you joining NK's StudySync?
                      <span style={{ color:"rgba(13,13,13,0.3)", fontWeight:600, marginLeft:6 }}>(optional)</span>
                    </label>
                    <textarea
                      className="cp-textarea"
                      placeholder="Tell us what you're struggling with, what you hope to gain, or anything you'd like us to know..."
                      value={form.reason}
                      onChange={e => handleChange("reason", e.target.value)}
                    />
                  </div>
                </div>

                {serverError && (
                  <p style={{ color:"var(--red)", fontWeight:700, fontSize:"0.88rem", marginTop:"1rem", textAlign:"center" }}>
                    ⚠️ {serverError}
                  </p>
                )}

                <button
                  className="cp-submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" strokeDasharray="30 30" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Join NK's StudySync →
                    </>
                  )}
                </button>

                <p style={{ textAlign:"center", fontSize:"0.75rem", color:"rgba(13,13,13,0.35)", fontWeight:600, marginTop:"1rem" }}>
                  By submitting you agree to be contacted about NK's StudySync sessions and updates.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="cp-footer">
        <p className="cp-footer-copy">© 2026 Nk's StudySync. Built by students, for students.</p>
      </div>
    </div>
  );
}