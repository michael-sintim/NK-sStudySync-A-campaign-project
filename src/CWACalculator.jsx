import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Grade / Class constants ─── */
const CLASSES = [
  { name: "First Class",        min: 70,   color: "#F5A300", bg: "rgba(245,163,0,0.15)",    border: "#F5A300" },
  { name: "Second Class Upper", min: 60,   color: "#68D391", bg: "rgba(56,161,105,0.15)",   border: "#68D391" },
  { name: "Second Class Lower", min: 50,   color: "#63B3ED", bg: "rgba(66,153,225,0.15)",   border: "#63B3ED" },
  { name: "Pass",               min: 45,   color: "#A0AEC0", bg: "rgba(160,174,192,0.15)",  border: "#A0AEC0" },
];

function getClass(cwa) {
  return CLASSES.find((c) => cwa >= c.min) ?? { name: "Fail", min: 0, color: "#FC8181", bg: "rgba(245,101,101,0.15)", border: "#FC8181" };
}

/* ─── Inline styles ─── */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#111111 0%,#1a1a1a 100%)",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    paddingBottom: "5rem",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 5%",
    borderBottom: "3px solid #F5A300",
    background: "#111",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#F5A300",
    cursor: "pointer",
  },
  backBtn: {
    background: "transparent",
    border: "2px solid rgba(245,163,0,0.4)",
    color: "#F5A300",
    borderRadius: "8px",
    padding: "0.45rem 1rem",
    fontFamily: "'Oswald', sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
  },
  inner: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "3rem 1.5rem",
  },
  badge: {
    display: "inline-block",
    background: "#F5A300",
    color: "#111",
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    padding: "0.3rem 1rem",
    borderRadius: "100px",
    marginBottom: "1rem",
  },
  h1: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "clamp(2rem,6vw,3.5rem)",
    fontWeight: 700,
    color: "#F5A300",
    lineHeight: 1.1,
    marginBottom: "0.5rem",
  },
  sub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.95rem",
    marginBottom: "2.5rem",
    lineHeight: 1.7,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1.5px solid rgba(245,163,0,0.2)",
    borderRadius: "18px",
    padding: "1.8rem",
    marginBottom: "1.2rem",
  },
  input: {
    background: "rgba(255,255,255,0.07)",
    border: "1.5px solid rgba(255,255,255,0.14)",
    borderRadius: "10px",
    color: "#fff",
    padding: "0.7rem 0.8rem",
    fontSize: "0.95rem",
    width: "100%",
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    transition: "border-color 0.2s",
  },
  label: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.6)",
    display: "block",
    marginBottom: "0.35rem",
    letterSpacing: "0.02em",
  },
  sectionLbl: {
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
  },
  calcBtn: {
    background: "#F5A300",
    color: "#111",
    border: "none",
    borderRadius: "12px",
    padding: "1rem 2rem",
    fontSize: "1.05rem",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    boxShadow: "5px 5px 0 #D32F2F",
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: "0.05em",
    marginBottom: "1.5rem",
    transition: "all 0.25s",
  },
  errMsg: {
    color: "#FC8181",
    fontSize: "0.88rem",
    textAlign: "center",
    padding: "0.5rem",
    marginBottom: "1rem",
  },
  successMsg: {
    color: "#68D391",
    fontSize: "0.88rem",
    textAlign: "center",
    padding: "0.5rem",
    marginBottom: "1rem",
    fontWeight: 600,
  },
};

export default function CWACalculator() {
  const navigate = useNavigate();

  // ─── State ───
  const [cumulativeCredits, setCumulativeCredits] = useState("");
  const [currentCWA, setCurrentCWA] = useState("");
  const [semesterCredits, setSemesterCredits] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ─── Calculate ───
  const calculate = useCallback(() => {
    setError("");
    setSuccess("");
    setResult(null);

    // Parse inputs
    const cumCreds = parseFloat(cumulativeCredits);
    const cwa = parseFloat(currentCWA);
    const semCreds = parseFloat(semesterCredits);

    // Validation
    if (isNaN(cumCreds) || cumCreds <= 0) {
      setError("Please enter a valid number of cumulative credits (must be > 0).");
      return;
    }
    if (isNaN(cwa) || cwa < 0 || cwa > 100) {
      setError("Please enter a valid current CWA (0 – 100).");
      return;
    }
    if (isNaN(semCreds) || semCreds <= 0) {
      setError("Please enter valid credit hours for this semester (must be > 0).");
      return;
    }

    const currentClass = getClass(cwa);
    const totalCreditsAfter = cumCreds + semCreds;
    const cumulativeWeightedMarks = cwa * cumCreds;

    // Calculate required average for each class standing
    const targets = CLASSES.map((cls) => {
      const requiredWeighted = cls.min * totalCreditsAfter;
      const neededFromSem = requiredWeighted - cumulativeWeightedMarks;
      const requiredAvg = neededFromSem / semCreds;
      const achievable = requiredAvg <= 100;
      const alreadyThere = cwa >= cls.min;
      return {
        cls,
        requiredAvg,
        achievable,
        alreadyThere,
        displayAvg: alreadyThere ? 0 : requiredAvg,
      };
    });

    // Scenario projections: what happens at different semester averages
    const scenarios = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map((avg) => {
      const semWeighted = avg * semCreds;
      const newCumWeighted = cumulativeWeightedMarks + semWeighted;
      const newCWA = newCumWeighted / totalCreditsAfter;
      const newClass = getClass(newCWA);
      return { avg, newCWA: newCWA.toFixed(2), newClass };
    });

    // Check if already at First Class
    if (cwa >= 70) {
      setSuccess("🎓 You're already on a First Class trajectory! Keep your average at 70%+ to maintain it.");
    }

    setResult({
      cumCreds,
      cwa,
      semCreds,
      totalCreditsAfter,
      currentClass,
      targets,
      scenarios,
    });
  }, [cumulativeCredits, currentCWA, semesterCredits]);

  // ─── Helpers ───
  const tierLabel = (name) => {
    if (name === "Second Class Upper") return "2nd Upper";
    if (name === "Second Class Lower") return "2nd Lower";
    return name;
  };

  const formatAvg = (val, alreadyThere) => {
    if (alreadyThere) return "Already achieved ✓";
    if (val > 100) return `Not possible (needs ${val.toFixed(1)}%)`;
    return `${val.toFixed(2)}%`;
  };

  const handleReset = () => {
    setCumulativeCredits("");
    setCurrentCWA("");
    setSemesterCredits("");
    setResult(null);
    setError("");
    setSuccess("");
  };

  // ─── Render ───
  return (
    <div style={S.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav style={S.nav}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src="/IMG_8586.JPG.jpeg"
            alt="NK's StudySync"
            style={{ height: "42px", width: "42px", objectFit: "contain", borderRadius: "8px" }}
          />
          <span style={S.navLogo}>
            <span style={{ color: "#D32F2F" }}>Nk's</span> StudySync
          </span>
        </div>
        <button style={S.backBtn} onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </nav>

      <div style={S.inner}>
        {/* Header */}
        <div style={{ marginBottom: "0.5rem" }}>
          <span style={S.badge}>TARGET CWA PLANNER</span>
        </div>
        <h1 style={S.h1}>
          What You <span style={{ color: "#fff" }}>Need</span>
        </h1>
        <p style={S.sub}>
          Already know your current CWA from the portal or AIM app? Enter it below along with
          your total credits so far and this semester's credit load. We'll show you exactly
          what average you need this semester to reach each class standing — and whether it's
          realistically achievable.
        </p>

        {/* Grading reference */}
        <div style={{ ...S.card, marginBottom: "2rem", background: "rgba(245,163,0,0.04)" }}>
          <p style={S.sectionLbl}>KNUST Grading Standards</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[...CLASSES].reverse().map((c) => (
              <span
                key={c.name}
                style={{
                  background: c.bg,
                  border: `1.5px solid ${c.border}`,
                  color: c.color,
                  borderRadius: "8px",
                  padding: "0.3rem 0.8rem",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                }}
              >
                {c.name}: {c.min === 45 ? "45 – 49.99%" : c.min === 50 ? "50 – 59.99%" : c.min === 60 ? "60 – 69.99%" : "70%+"}
              </span>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div style={S.card}>
          <p style={S.sectionLbl}>📋 Your Current Standing</p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Find your <strong style={{ color: "#F5A300" }}>cumulative credits</strong> and{" "}
            <strong style={{ color: "#F5A300" }}>current CWA</strong> on your student portal
            or the AIM app. These are your totals from all semesters completed so far.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={S.label}>Cumulative Credits So Far</label>
              <input
                style={S.input}
                type="number"
                placeholder="e.g. 45"
                min="1"
                max="300"
                value={cumulativeCredits}
                onChange={(e) => {
                  setCumulativeCredits(e.target.value);
                  setResult(null);
                  setError("");
                  setSuccess("");
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#F5A300"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"}
              />
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem", display: "block" }}>
                Total credits from all past semesters
              </span>
            </div>
            <div>
              <label style={S.label}>Current Cumulative CWA (%)</label>
              <input
                style={S.input}
                type="number"
                placeholder="e.g. 62.50"
                min="0"
                max="100"
                step="0.01"
                value={currentCWA}
                onChange={(e) => {
                  setCurrentCWA(e.target.value);
                  setResult(null);
                  setError("");
                  setSuccess("");
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#F5A300"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"}
              />
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem", display: "block" }}>
                Your overall weighted average
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={S.label}>Credit Hours This Semester</label>
            <input
              style={{ ...S.input, maxWidth: "300px" }}
              type="number"
              placeholder="e.g. 18"
              min="1"
              max="30"
              value={semesterCredits}
              onChange={(e) => {
                setSemesterCredits(e.target.value);
                setResult(null);
                setError("");
                setSuccess("");
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#F5A300"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"}
            />
            <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem", display: "block" }}>
              Total credits you're registered for this semester
            </span>
          </div>
        </div>

        {error && (
          <div style={{ ...S.card, border: "1.5px solid rgba(252,129,129,0.3)", background: "rgba(252,129,129,0.05)", marginBottom: "1rem" }}>
            <p style={{ ...S.errMsg, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {success && (
          <div style={{ ...S.card, border: "1.5px solid rgba(104,211,145,0.3)", background: "rgba(104,211,145,0.05)", marginBottom: "1rem" }}>
            <p style={{ ...S.successMsg, margin: 0 }}>{success}</p>
          </div>
        )}

        <button
          style={S.calcBtn}
          onClick={calculate}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(2px,2px)";
            e.currentTarget.style.boxShadow = "3px 3px 0 #D32F2F";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0,0)";
            e.currentTarget.style.boxShadow = "5px 5px 0 #D32F2F";
          }}
        >
          Calculate Required Averages →
        </button>

        {/* ─── RESULTS ─── */}
        {result && (
          <div>
            {/* Summary Card */}
            <div
              style={{
                ...S.card,
                background: "rgba(245,163,0,0.06)",
                border: "2px solid rgba(245,163,0,0.35)",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <p style={{ ...S.sectionLbl, marginBottom: "0.3rem" }}>Your Current Standing</p>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "clamp(2.5rem,6vw,3.5rem)",
                  fontWeight: 700,
                  color: "#F5A300",
                  lineHeight: 1,
                }}>
                  {result.cwa.toFixed(2)}
                </span>
                <span style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.4)" }}>%</span>
              </div>
              <span
                style={{
                  display: "inline-block",
                  background: result.currentClass.bg,
                  border: `2px solid ${result.currentClass.border}`,
                  color: result.currentClass.color,
                  borderRadius: "100px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  letterSpacing: "0.05em",
                  marginBottom: "1rem",
                }}
              >
                {result.currentClass.name}
              </span>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.5)",
              }}>
                <span>{result.cumCreds} credits completed</span>
                <span>{result.semCreds} credits this sem</span>
                <span>{result.totalCreditsAfter} total after</span>
              </div>
            </div>

            {/* Required Averages per Class */}
            <div style={S.card}>
              <p style={S.sectionLbl}>🎯 Required Semester Average for Each Class</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                Here's the average score you need across all your courses this semester to reach each standing.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {result.targets.map((t) => {
                  const isCurrent = t.cls.name === result.currentClass.name && result.cwa >= t.cls.min;
                  const isImpossible = !t.achievable && !t.alreadyThere;
                  const isAchievable = t.achievable && !t.alreadyThere;

                  return (
                    <div
                      key={t.cls.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 1.3rem",
                        background: isCurrent
                          ? "rgba(245,163,0,0.12)"
                          : isImpossible
                          ? "rgba(255,255,255,0.02)"
                          : t.cls.bg,
                        border: `1.5px solid ${
                          isCurrent ? "#F5A300" : isImpossible ? "rgba(255,255,255,0.08)" : t.cls.border
                        }`,
                        borderRadius: "12px",
                        opacity: isImpossible ? 0.5 : 1,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: t.cls.color,
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: t.cls.color }}>
                            {t.cls.name}
                          </p>
                          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                            {t.cls.min}%+ required overall
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {t.alreadyThere ? (
                          <span style={{
                            background: "rgba(104,211,145,0.15)",
                            color: "#68D391",
                            padding: "0.35rem 0.9rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}>
                            Already achieved ✓
                          </span>
                        ) : t.achievable ? (
                          <>
                            <p style={{
                              fontFamily: "'Oswald', sans-serif",
                              fontSize: "1.4rem",
                              fontWeight: 700,
                              color: t.cls.color,
                              lineHeight: 1.1,
                            }}>
                              {t.requiredAvg.toFixed(1)}%
                            </p>
                            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>
                              needed this semester
                            </p>
                          </>
                        ) : (
                          <span style={{
                            background: "rgba(252,129,129,0.15)",
                            color: "#FC8181",
                            padding: "0.35rem 0.9rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}>
                            Needs &gt;100% — not possible
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What-If Scenarios */}
            <div style={S.card}>
              <p style={S.sectionLbl}>📈 What-If Scenarios</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                See how different semester averages would affect your cumulative CWA after this semester.
                Each cell shows your new CWA and class standing.
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(95px, 1fr))",
                gap: "0.5rem",
              }}>
                {result.scenarios.map((s) => {
                  const improved = parseFloat(s.newCWA) > result.cwa;
                  const sameClass = s.newClass.name === result.currentClass.name;
                  return (
                    <div
                      key={s.avg}
                      style={{
                        background: improved
                          ? s.newClass.bg
                          : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${improved ? s.newClass.border : "rgba(255,255,255,0.08)"}`,
                        borderRadius: "10px",
                        padding: "0.7rem 0.5rem",
                        textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.2rem" }}>
                        Avg {s.avg}%
                      </p>
                      <p style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: improved ? "#F5A300" : "#fff",
                      }}>
                        {s.newCWA}%
                      </p>
                      <span style={{
                        display: "inline-block",
                        background: s.newClass.bg,
                        color: s.newClass.color,
                        borderRadius: "4px",
                        padding: "0.1rem 0.4rem",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        marginTop: "0.25rem",
                        letterSpacing: "0.03em",
                      }}>
                        {tierLabel(s.newClass.name)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* The Math Explained */}
            <div style={{ ...S.card, background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.06)" }}>
              <p style={S.sectionLbl}>🔍 How This Works</p>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                <p>
                  Your <strong style={{ color: "#F5A300" }}>cumulative weighted marks</strong> ={" "}
                  {result.cwa.toFixed(2)}% × {result.cumCreds} credits ={" "}
                  <strong style={{ color: "#fff" }}>{(result.cwa * result.cumCreds).toFixed(1)}</strong>
                </p>
                <p>
                  After this semester, you'll have{" "}
                  <strong style={{ color: "#fff" }}>{result.totalCreditsAfter} total credits</strong>.
                </p>
                <p>
                  To reach a target CWA, we work backwards: how many weighted marks do you need from this
                  semester to push your cumulative total to the target?
                </p>
                <p style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                  Formula: Required semester avg = (Target CWA × Total credits) - (Current CWA × Past credits) ÷ Semester credits
                </p>
              </div>
            </div>

            {/* Reset */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button
                style={{
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.5)",
                  borderRadius: "10px",
                  padding: "0.6rem 1.6rem",
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
                onClick={handleReset}
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* No results yet — placeholder */}
        {!result && !error && (
          <div style={{ ...S.card, textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1.5px dashed rgba(255,255,255,0.08)" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              👆 Enter your numbers above and click calculate to see what you need.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}