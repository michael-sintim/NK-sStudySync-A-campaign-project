import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Constants ─── */
const CLASSES = [
  { name: "First Class",        min: 70, color: "#F5A300", bg: "rgba(245,163,0,0.12)",   border: "rgba(245,163,0,0.4)"  },
  { name: "Second Class Upper", min: 60, color: "#63B3ED", bg: "rgba(99,179,237,0.12)",  border: "rgba(99,179,237,0.4)" },
  { name: "Second Class Lower", min: 50, color: "#68D391", bg: "rgba(104,211,145,0.12)", border: "rgba(104,211,145,0.4)"},
  { name: "Pass",               min: 45, color: "#A0AEC0", bg: "rgba(160,174,192,0.12)", border: "rgba(160,174,192,0.4)"},
];

const FAIL = { name: "Fail", min: 0, color: "#FC8181", bg: "rgba(252,129,129,0.12)", border: "rgba(252,129,129,0.4)" };

function getCls(cwa) {
  return CLASSES.find((c) => cwa >= c.min) ?? FAIL;
}

const SCENARIOS = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

/* ─── Styles ─── */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#0f0f0f 0%,#1a1a1a 100%)",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    paddingBottom: "6rem",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 5%",
    borderBottom: "2px solid #F5A300",
    background: "#0f0f0f",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#F5A300",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    textDecoration: "none",
  },
  backBtn: {
    background: "transparent",
    border: "1.5px solid rgba(245,163,0,0.35)",
    color: "#F5A300",
    borderRadius: "8px",
    padding: "0.4rem 1rem",
    fontFamily: "'Oswald', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
  inner: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "3rem 1.5rem",
  },
  badge: {
    display: "inline-block",
    background: "#F5A300",
    color: "#111",
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    padding: "0.25rem 0.9rem",
    borderRadius: "100px",
    marginBottom: "1rem",
  },
  h1: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "clamp(1.9rem,5.5vw,3.2rem)",
    fontWeight: 700,
    color: "#F5A300",
    lineHeight: 1.1,
    marginBottom: "0.5rem",
  },
  sub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.9rem",
    marginBottom: "2.5rem",
    lineHeight: 1.75,
    maxWidth: "560px",
  },
  card: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.6rem",
    marginBottom: "1rem",
  },
  sectionLbl: {
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  input: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    padding: "0.65rem 0.85rem",
    fontSize: "0.92rem",
    width: "100%",
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    transition: "border-color 0.2s",
  },
  label: {
    fontSize: "0.76rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.55)",
    display: "block",
    marginBottom: "0.3rem",
  },
  hint: {
    fontSize: "0.68rem",
    color: "rgba(255,255,255,0.25)",
    marginTop: "0.25rem",
    display: "block",
  },
  calcBtn: {
    background: "#F5A300",
    color: "#111",
    border: "none",
    borderRadius: "12px",
    padding: "0.95rem 2rem",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    boxShadow: "4px 4px 0 #C62828",
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.4)",
    borderRadius: "10px",
    padding: "0.55rem 1.5rem",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
};

/* ─── Sub-components ─── */

function FormField({ label, hint, children }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
      {hint && <span style={S.hint}>{hint}</span>}
    </div>
  );
}

function HeroCard({ result }) {
  const { requiredAvg, curCWA, targetCWA, targetCls } = result;

  let bigText, labelText, badgeText, badgeColor, verdictText;

  if (requiredAvg < 0) {
    bigText = "Secured";
    labelText = "You've already exceeded your target CWA";
    badgeText = "Target surpassed";
    badgeColor = { bg: "rgba(104,211,145,0.15)", color: "#68D391" };
    verdictText = `Even with a 0% this semester, your CWA can't drop below ${targetCWA}%. You're well ahead — keep pushing it higher.`;
  } else if (requiredAvg <= curCWA && curCWA >= targetCWA) {
    bigText = "Already there";
    labelText = `Your current CWA of ${curCWA.toFixed(2)}% already meets your ${targetCWA}% target`;
    badgeText = "Target achieved";
    badgeColor = { bg: "rgba(104,211,145,0.15)", color: "#68D391" };
    verdictText = "Just maintain your performance this semester and you'll lock it in.";
  } else if (requiredAvg > 100) {
    bigText = `${requiredAvg.toFixed(1)}%`;
    labelText = "Not achievable this semester alone";
    badgeText = "Out of reach";
    badgeColor = { bg: "rgba(252,129,129,0.15)", color: "#FC8181" };
    verdictText = `Hitting ${targetCWA}% overall would require a ${requiredAvg.toFixed(1)}% average — mathematically impossible. Consider a lower target or plan across multiple semesters.`;
  } else {
    bigText = `${requiredAvg.toFixed(1)}%`;
    labelText = `this semester to reach a ${targetCWA}% CWA`;
    badgeText = `Target: ${targetCls.name} (${targetCWA}%+)`;
    badgeColor = { bg: "rgba(245,163,0,0.12)", color: "#F5A300" };
    const difficulty =
      requiredAvg >= 80 ? "This is ambitious — you'll need to perform well across every course." :
      requiredAvg >= 70 ? "Achievable with consistent focus and solid exam performance." :
      requiredAvg >= 60 ? "A realistic target. Stay consistent and you'll get there." :
      "Very achievable — your current trajectory is strong.";
    const gap = (targetCWA - curCWA).toFixed(2);
    verdictText = `Your CWA is currently ${curCWA.toFixed(2)}% — ${gap}% below your ${targetCWA}% goal. ${difficulty}`;
  }

  const isImpossible = requiredAvg > 100;

  return (
    <div
      style={{
        ...S.card,
        background: "rgba(245,163,0,0.05)",
        border: "1.5px solid rgba(245,163,0,0.25)",
        textAlign: "center",
        padding: "2.2rem 1.5rem",
      }}
    >
      <p style={S.sectionLbl}>You need to average</p>
      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "clamp(2.8rem,8vw,4.5rem)",
          fontWeight: 700,
          color: isImpossible ? "#FC8181" : "#F5A300",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}
      >
        {bigText}
      </div>
      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.9rem" }}>
        {labelText}
      </p>
      <span
        style={{
          display: "inline-block",
          background: badgeColor.bg,
          color: badgeColor.color,
          border: `1px solid ${badgeColor.color}40`,
          borderRadius: "100px",
          padding: "0.3rem 1.2rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          marginBottom: "1rem",
        }}
      >
        {badgeText}
      </span>
      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
        {verdictText}
      </p>
    </div>
  );
}

function TargetsCard({ result }) {
  const { curCWA, totalCreds, currentWeighted, semCreds } = result;

  const rows = CLASSES.map((cls) => {
    const needed = (cls.min * totalCreds - currentWeighted) / semCreds;
    return { cls, needed };
  });

  return (
    <div style={S.card}>
      <p style={S.sectionLbl}>Required semester average for each class</p>
      <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "1rem", lineHeight: 1.6 }}>
        Based on your current standing — what you'd need to average across all courses this semester.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {rows.map(({ cls, needed }) => {
          const alreadyThere = curCWA >= cls.min;
          const impossible = needed > 100;
          return (
            <div
              key={cls.name}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.1rem",
                gap: "0.75rem",
                background: alreadyThere ? cls.bg : impossible ? "rgba(255,255,255,0.02)" : cls.bg,
                border: `1px solid ${alreadyThere ? cls.border : impossible ? "rgba(255,255,255,0.06)" : cls.border}`,
                borderRadius: "12px",
                opacity: impossible ? 0.5 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flex: "1 1 auto" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cls.color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.88rem", color: cls.color }}>{cls.name}</p>
                  <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>{cls.min}%+ overall</p>
                </div>
              </div>
              <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                {alreadyThere ? (
                  <span style={{ 
                    background: "rgba(104,211,145,0.15)", 
                    color: "#68D391", 
                    padding: "0.3rem 0.8rem", 
                    borderRadius: "6px", 
                    fontSize: "0.78rem", 
                    fontWeight: 700,
                    display: "inline-block",
                    whiteSpace: "normal",
                    wordBreak: "keep-all",
                  }}>
                    Already achieved ✓
                  </span>
                ) : impossible ? (
                  <span style={{ 
                    background: "rgba(252,129,129,0.1)", 
                    color: "#FC8181", 
                    padding: "0.3rem 0.8rem", 
                    borderRadius: "6px", 
                    fontSize: "0.78rem", 
                    fontWeight: 700,
                    display: "inline-block",
                    whiteSpace: "normal",
                    wordBreak: "keep-all",
                  }}>
                    Needs {needed.toFixed(0)}% — not possible
                  </span>
                ) : (
                  <div>
                    <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: cls.color, lineHeight: 1.1 }}>
                      {needed.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.35)" }}>needed this semester</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScenariosCard({ result }) {
  const { currentWeighted, totalCreds, semCreds, requiredAvg } = result;

  return (
    <div style={S.card}>
      <p style={S.sectionLbl}>What-if scenarios</p>
      <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "1rem", lineHeight: 1.6 }}>
        Your resulting CWA and class standing at different semester averages. Highlighted column is closest to your required average.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
          gap: "0.45rem",
        }}
      >
        {SCENARIOS.map((avg) => {
          const newCWA = (currentWeighted + avg * semCreds) / totalCreds;
          const cls = getCls(newCWA);
          const isHighlight = Math.abs(avg - Math.round(requiredAvg)) <= 2.5 && requiredAvg >= 0 && requiredAvg <= 100;
          return (
            <div
              key={avg}
              style={{
                background: isHighlight ? "rgba(245,163,0,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isHighlight ? "rgba(245,163,0,0.4)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "10px",
                padding: "0.65rem 0.4rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.2rem" }}>Avg {avg}%</p>
              <p
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: isHighlight ? "#F5A300" : "#fff",
                }}
              >
                {newCWA.toFixed(1)}%
              </p>
              <span
                style={{
                  display: "inline-block",
                  background: cls.bg,
                  color: cls.color,
                  borderRadius: "4px",
                  padding: "0.08rem 0.35rem",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  marginTop: "0.2rem",
                }}
              >
                {cls.name.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MathCard({ result }) {
  const { curCWA, cumCreds, targetCWA, totalCreds, semCreds, requiredAvg, neededFromSem, currentWeighted } = result;
  return (
    <div style={{ ...S.card, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <p style={S.sectionLbl}>How the math works</p>
      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 2 }}>
        <p>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Current weighted marks</span> ={" "}
          {curCWA.toFixed(2)}% × {cumCreds} credits ={" "}
          <strong style={{ color: "#fff" }}>{currentWeighted.toFixed(1)}</strong>
        </p>
        <p>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Marks needed in total</span> ={" "}
          {targetCWA.toFixed(2)}% × {totalCreds} credits ={" "}
          <strong style={{ color: "#fff" }}>{(targetCWA * totalCreds).toFixed(1)}</strong>
        </p>
        <p>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Marks needed from this semester</span> ={" "}
          {(targetCWA * totalCreds).toFixed(1)} − {currentWeighted.toFixed(1)} ={" "}
          <strong style={{ color: "#fff" }}>{neededFromSem.toFixed(1)}</strong>
        </p>
        <p>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Required semester average</span> ={" "}
          {neededFromSem.toFixed(1)} ÷ {semCreds} ={" "}
          <strong style={{ color: "#F5A300" }}>
            {isFinite(requiredAvg) ? `${requiredAvg.toFixed(2)}%` : "N/A"}
          </strong>
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function CWATargetPlanner() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cumCreds: "", curCWA: "", semCreds: "", targetCWA: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setResult(null);
    setError("");
  };

  const calculate = useCallback(() => {
    setError("");
    setResult(null);

    const cumCreds  = parseFloat(form.cumCreds);
    const curCWA    = parseFloat(form.curCWA);
    const semCreds  = parseFloat(form.semCreds);
    const targetCWA = parseFloat(form.targetCWA);

    if (isNaN(cumCreds)  || cumCreds <= 0)             return setError("Enter valid credits completed (must be > 0).");
    if (isNaN(curCWA)    || curCWA < 0 || curCWA > 100) return setError("Enter a valid current CWA (0 – 100).");
    if (isNaN(semCreds)  || semCreds <= 0)             return setError("Enter valid credits for this semester (must be > 0).");
    if (isNaN(targetCWA) || targetCWA < 0 || targetCWA > 100) return setError("Enter a valid target CWA (0 – 100).");

    const totalCreds      = cumCreds + semCreds;
    const currentWeighted = curCWA * cumCreds;
    const neededFromSem   = targetCWA * totalCreds - currentWeighted;
    const requiredAvg     = neededFromSem / semCreds;
    const targetCls       = getCls(targetCWA);
    const currentCls      = getCls(curCWA);

    setResult({ cumCreds, curCWA, semCreds, targetCWA, totalCreds, currentWeighted, neededFromSem, requiredAvg, targetCls, currentCls });
  }, [form]);

  const reset = () => {
    setForm({ cumCreds: "", curCWA: "", semCreds: "", targetCWA: "" });
    setResult(null);
    setError("");
  };

  const inputFocus = (e) => { e.currentTarget.style.borderColor = "#F5A300"; };
  const inputBlur  = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; };

  return (
    <div style={S.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img
            src="/IMG_8586.JPG.jpeg"
            alt="NK's StudySync"
            style={{ height: "40px", width: "40px", objectFit: "contain", borderRadius: "8px" }}
          />
          <span style={S.navLogo}>
            <span style={{ color: "#D32F2F" }}>Nk's</span> StudySync
          </span>
        </div>
        <button style={S.backBtn} onClick={() => navigate("/")}>← Back to Home</button>
      </nav>

      <div style={S.inner}>
        {/* Header */}
        <span style={S.badge}>TARGET CWA PLANNER</span>
        <h1 style={S.h1}>
          What You <span style={{ color: "#fff" }}>Need</span>
        </h1>
        <p style={S.sub}>
          Enter your current CWA from the student portal or AIM app, your total credits so far,
          this semester's credit load, and the CWA you're aiming for. We'll tell you exactly what
          average you need this semester — and whether it's realistically achievable.
        </p>

        {/* Grading reference */}
        <div style={{ ...S.card, background: "rgba(245,163,0,0.03)", border: "1px solid rgba(245,163,0,0.12)", marginBottom: "1.5rem" }}>
          <p style={S.sectionLbl}>KNUST Grading Standards</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[...CLASSES].reverse().map((c) => (
              <span
                key={c.name}
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.color,
                  borderRadius: "8px",
                  padding: "0.28rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {c.name}:{" "}
                {c.min === 45 ? "45–49.99%" : c.min === 50 ? "50–59.99%" : c.min === 60 ? "60–69.99%" : "70%+"}
              </span>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div style={S.card}>
          <p style={S.sectionLbl}>Your current standing</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <FormField label="Credits completed" hint="Total from all past semesters">
              <input
                style={S.input}
                type="number"
                placeholder="e.g. 45"
                min="1"
                max="400"
                value={form.cumCreds}
                onChange={handleChange("cumCreds")}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </FormField>
            <FormField label="Current CWA (%)" hint="From your portal or AIM app">
              <input
                style={S.input}
                type="number"
                placeholder="e.g. 62.50"
                min="0"
                max="100"
                step="0.01"
                value={form.curCWA}
                onChange={handleChange("curCWA")}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </FormField>
            <FormField label="Credits this semester" hint="Your registered credit load">
              <input
                style={S.input}
                type="number"
                placeholder="e.g. 18"
                min="1"
                max="40"
                value={form.semCreds}
                onChange={handleChange("semCreds")}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </FormField>
            <FormField label="Target CWA (%)" hint="The overall CWA you want to achieve">
              <input
                style={S.input}
                type="number"
                placeholder="e.g. 70"
                min="0"
                max="100"
                step="0.01"
                value={form.targetCWA}
                onChange={handleChange("targetCWA")}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </FormField>
          </div>

          {error && (
            <p style={{ color: "#FC8181", fontSize: "0.84rem", marginBottom: "0.75rem", padding: "0.5rem 0.75rem", background: "rgba(252,129,129,0.07)", borderRadius: "8px", border: "1px solid rgba(252,129,129,0.2)" }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        <button
          style={S.calcBtn}
          onClick={calculate}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0 #C62828"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0 #C62828"; }}
        >
          Calculate what I need →
        </button>

        {/* ─── Results ─── */}
        {result && (
          <div style={{ marginTop: "1.5rem" }}>
            <HeroCard result={result} />
            <TargetsCard result={result} />
            <ScenariosCard result={result} />
            <MathCard result={result} />

            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <button style={S.resetBtn} onClick={reset}>
                Start over
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !error && (
          <div
            style={{
              ...S.card,
              textAlign: "center",
              background: "rgba(255,255,255,0.015)",
              border: "1px dashed rgba(255,255,255,0.07)",
              marginTop: "1rem",
              padding: "2rem",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.88rem" }}>
              Fill in your numbers above and hit calculate to see your targets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}