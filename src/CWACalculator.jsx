import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Grade / Class constants ─── */
const GRADE_SCALE = [
  { min: 70, letter: "A",  gp: 4.0 },
  { min: 60, letter: "B+", gp: 3.5 },
  { min: 55, letter: "B",  gp: 3.0 },
  { min: 50, letter: "C+", gp: 2.5 },
  { min: 45, letter: "C",  gp: 2.0 },
  { min: 40, letter: "D",  gp: 1.5 },
  { min: 0,  letter: "F",  gp: 0.0 },
];

const CLASSES = [
  { name: "First Class",        min: 70,   color: "#F5A300", bg: "rgba(245,163,0,0.15)",    border: "#F5A300" },
  { name: "Second Class Upper", min: 60,   color: "#68D391", bg: "rgba(56,161,105,0.15)",   border: "#68D391" },
  { name: "Second Class Lower", min: 50,   color: "#63B3ED", bg: "rgba(66,153,225,0.15)",   border: "#63B3ED" },
  { name: "Pass",               min: 45,   color: "#A0AEC0", bg: "rgba(160,174,192,0.15)",  border: "#A0AEC0" },
  { name: "Fail",               min: 0,    color: "#FC8181", bg: "rgba(245,101,101,0.15)",  border: "#FC8181" },
];

function getGrade(score) {
  return GRADE_SCALE.find((g) => score >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

function getClass(cwa) {
  return CLASSES.find((c) => cwa >= c.min) ?? CLASSES[CLASSES.length - 1];
}

let _id = 0;
const newCourse = (name = "", credits = "", score = "") => ({
  id: ++_id,
  name,
  credits,
  score,
});

/* ─── Inline styles ─── */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#111111 0%,#1a1a1a 100%)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    maxWidth: "760px",
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
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.95rem",
    marginBottom: "2.5rem",
    lineHeight: 1.6,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1.5px solid rgba(245,163,0,0.2)",
    borderRadius: "18px",
    padding: "1.5rem",
    marginBottom: "1.2rem",
  },
  colHead: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 44px",
    gap: "8px",
    paddingBottom: "0.5rem",
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 44px",
    gap: "8px",
    marginBottom: "8px",
    alignItems: "center",
  },
  input: {
    background: "rgba(255,255,255,0.07)",
    border: "1.5px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    color: "#fff",
    padding: "0.5rem 0.6rem",
    fontSize: "0.88rem",
    width: "100%",
    outline: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  delBtn: {
    background: "rgba(211,47,47,0.12)",
    border: "1.5px solid rgba(211,47,47,0.3)",
    color: "#f87171",
    borderRadius: "8px",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    background: "transparent",
    border: "1.5px dashed rgba(245,163,0,0.35)",
    color: "#F5A300",
    borderRadius: "8px",
    padding: "0.55rem 1.2rem",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    marginTop: "0.5rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  calcBtn: {
    background: "#F5A300",
    color: "#111",
    border: "none",
    borderRadius: "10px",
    padding: "0.9rem 2rem",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    boxShadow: "5px 5px 0 #D32F2F",
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: "0.05em",
    marginBottom: "2rem",
    transition: "all 0.25s",
  },
  sectionLbl: {
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
  },
  errMsg: {
    color: "#FC8181",
    fontSize: "0.88rem",
    textAlign: "center",
    padding: "0.5rem",
    marginBottom: "1rem",
  },
};

/* ─── Component ─── */
export default function CWACalculator() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    newCourse("Engineering Mathematics", "3", ""),
    newCourse("Introduction to Programming", "3", ""),
    newCourse("Mechanics of Materials", "2", ""),
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateCourse = (id, field, value) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const addCourse = () => setCourses((prev) => [...prev, newCourse()]);
  const delCourse = (id) => setCourses((prev) => prev.filter((c) => c.id !== id));

  const calculate = useCallback(() => {
    setError("");
    const parsed = [];
    for (const c of courses) {
      const credits = parseFloat(c.credits);
      const score = parseFloat(c.score);
      if (isNaN(credits) || credits <= 0) {
        setError("Please enter valid credit hours (must be > 0) for every course.");
        return;
      }
      if (isNaN(score) || score < 0 || score > 100) {
        setError("Please enter valid scores (0 – 100) for every course.");
        return;
      }
      const grade = getGrade(score);
      parsed.push({ name: c.name || `Course ${parsed.length + 1}`, credits, score, ...grade });
    }

    const totalCredits = parsed.reduce((s, c) => s + c.credits, 0);
    const weightedScore = parsed.reduce((s, c) => s + c.score * c.credits, 0);
    const weightedGP = parsed.reduce((s, c) => s + c.gp * c.credits, 0);
    const cwa = weightedScore / totalCredits;
    const gpa = weightedGP / totalCredits;
    const currentClass = getClass(cwa);

    // Upgrade targets — for every class above current
    const upgrades = CLASSES.filter((cls) => cls.min > cwa).map((cls) => {
      const gap = cls.min - cwa;
      const impossible = cls.min > 100; // safety — can never be >100%
      return { cls, gap, target: cls.min, impossible };
    });

    setResult({ parsed, totalCredits, cwa, gpa, currentClass, upgrades });
  }, [courses]);

  const tierLabel = (name) => {
    if (name === "Second Class Upper") return "2nd Upper";
    if (name === "Second Class Lower") return "2nd Lower";
    return name;
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav style={S.nav}>
        <span style={S.navLogo}>
          <span style={{ color: "#D32F2F" }}>Nk's</span> StudySync
        </span>
        <button style={S.backBtn} onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </nav>

      <div style={S.inner}>
        {/* Header */}
        <div style={{ marginBottom: "0.5rem" }}>
          <span style={S.badge}>GPA / CWA CALCULATOR</span>
        </div>
        <h1 style={S.h1}>
          CWA <span style={{ color: "#fff" }}>Calculator</span>
        </h1>
        <p style={S.sub}>
          Enter your courses, credit hours, and percentage scores. We'll calculate your
          Cumulative Weighted Average, show your class standing, and tell you exactly what
          you need to move up.
        </p>

        {/* Class standard reference */}
        <div style={{ ...S.card, marginBottom: "2rem", background: "rgba(245,163,0,0.04)" }}>
          <p style={S.sectionLbl}>Grading standards (KNUST / standard)</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CLASSES.map((c) => (
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
                {c.name}: {c.min === 0 ? "< 45%" : c.min === 45 ? "45 – 49.99%" : c.min === 50 ? "50 – 59.99%" : c.min === 60 ? "60 – 69.99%" : "70%+"}
              </span>
            ))}
          </div>
        </div>

        {/* Course input */}
        <div style={S.card}>
          <div style={S.colHead}>
            <div>Course name</div>
            <div>Credit hrs</div>
            <div>Score (%)</div>
            <div />
          </div>
          {courses.map((c) => (
            <div key={c.id} style={S.row}>
              <input
                style={S.input}
                type="text"
                placeholder="e.g. Engineering Maths"
                value={c.name}
                onChange={(e) => updateCourse(c.id, "name", e.target.value)}
              />
              <input
                style={S.input}
                type="number"
                placeholder="3"
                min="1"
                max="6"
                value={c.credits}
                onChange={(e) => updateCourse(c.id, "credits", e.target.value)}
              />
              <input
                style={S.input}
                type="number"
                placeholder="75"
                min="0"
                max="100"
                step="0.1"
                value={c.score}
                onChange={(e) => updateCourse(c.id, "score", e.target.value)}
              />
              <button style={S.delBtn} onClick={() => delCourse(c.id)} aria-label="Remove">
                ✕
              </button>
            </div>
          ))}
          <button style={S.addBtn} onClick={addCourse}>
            + Add another course
          </button>
        </div>

        {error && <p style={S.errMsg}>⚠️ {error}</p>}

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
          Calculate My CWA →
        </button>

        {/* ─── RESULTS ─── */}
        {result && (
          <div>
            {/* Big CWA display */}
            <div
              style={{
                ...S.card,
                textAlign: "center",
                background: "rgba(245,163,0,0.07)",
                border: `2px solid rgba(245,163,0,0.4)`,
                padding: "2.5rem",
              }}
            >
              <p style={{ ...S.sectionLbl, marginBottom: "0.4rem" }}>Your CWA this semester</p>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "clamp(3.5rem,10vw,5rem)",
                  fontWeight: 700,
                  color: "#F5A300",
                  lineHeight: 1,
                }}
              >
                {result.cwa.toFixed(2)}
                <span style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.35)" }}>%</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", margin: "0.4rem 0 1.2rem" }}>
                GPA equivalent:{" "}
                <strong style={{ color: "#fff" }}>{result.gpa.toFixed(2)}</strong>
                &nbsp;·&nbsp; Total credits:{" "}
                <strong style={{ color: "#fff" }}>{result.totalCredits}</strong>
              </p>
              <span
                style={{
                  display: "inline-block",
                  background: result.currentClass.bg,
                  border: `2px solid ${result.currentClass.border}`,
                  color: result.currentClass.color,
                  borderRadius: "100px",
                  padding: "0.45rem 1.5rem",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                }}
              >
                {result.currentClass.name}
              </span>
            </div>

            {/* Tier bar */}
            <div
              style={{
                display: "flex",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1.5px solid rgba(255,255,255,0.08)",
                marginBottom: "1.2rem",
              }}
            >
              {[...CLASSES].reverse().map((c) => {
                const isActive = c.name === result.currentClass.name;
                return (
                  <div
                    key={c.name}
                    style={{
                      flex: 1,
                      padding: "0.6rem 0.2rem",
                      textAlign: "center",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      background: c.bg,
                      color: c.color,
                      outline: isActive ? "2.5px solid white" : "none",
                      outlineOffset: "-2px",
                    }}
                  >
                    {tierLabel(c.name)}
                  </div>
                );
              })}
            </div>

            {/* Upgrade targets */}
            <div style={S.card}>
              <p style={S.sectionLbl}>
                {result.upgrades.length ? "What you need to move up" : "You're at the top — maintain it!"}
              </p>
              {result.upgrades.length === 0 && (
                <p style={{ color: "#F5A300", fontWeight: 700, fontSize: "0.95rem" }}>
                  🎓 You're on a First Class trajectory. Keep your average at{" "}
                  {result.cwa.toFixed(2)}% or above to secure it.
                </p>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: "1rem",
                }}
              >
                {result.upgrades.map((u) => (
                  <div
                    key={u.cls.name}
                    style={{
                      background: u.impossible ? "rgba(255,255,255,0.03)" : u.cls.bg,
                      border: `1.5px solid ${u.impossible ? "rgba(255,255,255,0.1)" : u.cls.border}`,
                      borderRadius: "14px",
                      padding: "1.2rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        color: "rgba(255,255,255,0.35)",
                        textTransform: "uppercase",
                        marginBottom: "0.3rem",
                      }}
                    >
                      To reach
                    </p>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: u.impossible ? "rgba(255,255,255,0.4)" : u.cls.color,
                        marginBottom: "0.4rem",
                      }}
                    >
                      {u.cls.name}
                    </p>
                    {u.impossible ? (
                      <p style={{ fontSize: "0.8rem", color: "rgba(255,100,100,0.7)", fontWeight: 600 }}>
                        Requires &gt;100% — not achievable this semester
                      </p>
                    ) : (
                      <>
                        <div
                          style={{
                            fontFamily: "'Oswald', sans-serif",
                            fontSize: "2rem",
                            fontWeight: 700,
                            color: u.cls.color,
                            lineHeight: 1,
                          }}
                        >
                          {u.target.toFixed(1)}%+
                        </div>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.5)",
                            marginTop: "0.35rem",
                            lineHeight: 1.5,
                          }}
                        >
                          You need a <strong style={{ color: "#fff" }}>{u.target.toFixed(1)}%</strong>{" "}
                          average across all your units.
                          <br />
                          You're{" "}
                          <strong style={{ color: u.cls.color }}>{u.gap.toFixed(2)}%</strong> away.
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown table */}
            <div style={S.card}>
              <p style={S.sectionLbl}>Course breakdown</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr>
                      {["Course", "Credits", "Score", "Grade", "Weighted"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: h === "Course" ? "left" : "center",
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "0.68rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "0 0.5rem 0.6rem",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.parsed.map((c, i) => (
                      <tr key={i}>
                        <td style={{ padding: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)" }}>
                          {c.name}
                        </td>
                        <td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>
                          {c.credits}
                        </td>
                        <td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)" }}>
                          {c.score.toFixed(1)}%
                        </td>
                        <td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <span
                            style={{
                              background: "rgba(245,163,0,0.15)",
                              color: "#F5A300",
                              borderRadius: "6px",
                              padding: "0.15rem 0.5rem",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                            }}
                          >
                            {c.letter}
                          </span>
                        </td>
                        <td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#F5A300", fontWeight: 700 }}>
                          {(c.score * c.credits).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "2px solid rgba(255,255,255,0.15)" }}>
                      <td style={{ padding: "0.6rem 0.5rem", fontWeight: 700, color: "#fff" }}>
                        Semester Total
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#fff", padding: "0.6rem 0.5rem" }}>
                        {result.totalCredits}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#F5A300", padding: "0.6rem 0.5rem" }}>
                        {result.cwa.toFixed(2)}%
                      </td>
                      <td />
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#F5A300", padding: "0.6rem 0.5rem" }}>
                        {(result.cwa * result.totalCredits).toFixed(1)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Reset */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button
                style={{
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.5)",
                  borderRadius: "8px",
                  padding: "0.5rem 1.4rem",
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
                onClick={() => {
                  setResult(null);
                  setCourses([newCourse(), newCourse(), newCourse()]);
                }}
              >
                Reset Calculator
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}