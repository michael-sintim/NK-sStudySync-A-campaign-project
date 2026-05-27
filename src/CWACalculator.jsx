import { useState, useCallback } from "react";

/* ─── Constants ─── */
const CLASSES = [
  { name: "First Class", min: 70, color: "#F5A300", bg: "rgba(245,163,0,0.12)", border: "rgba(245,163,0,0.4)" },
  { name: "Second Class Upper", min: 60, color: "#63B3ED", bg: "rgba(99,179,237,0.12)", border: "rgba(99,179,237,0.4)" },
  { name: "Second Class Lower", min: 50, color: "#68D391", bg: "rgba(104,211,145,0.12)", border: "rgba(104,211,145,0.4)" },
  { name: "Pass", min: 45, color: "#A0AEC0", bg: "rgba(160,174,192,0.12)", border: "rgba(160,174,192,0.4)" },
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
    background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 100%)",
    fontFamily: "'Poppins', sans-serif",
    color: "#fff",
    paddingBottom: "6rem",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem 5%",
    borderBottom: "2px solid #F5A300",
    background: "#0f0f0f",
    position: "sticky",
    top: 0,
    zIndex: 100,
    marginBottom: "2rem",
  },
  navLogo: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "1.35rem",
    fontWeight: 700,
    color: "#F5A300",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textDecoration: "none",
  },
  backBtn: {
    background: "transparent",
    border: "1.5px solid rgba(245,163,0,0.35)",
    color: "#F5A300",
    borderRadius: "8px",
    padding: "0.5rem 1.25rem",
    fontFamily: "'Oswald', sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
  inner: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "2rem 2rem 4rem",
  },
  badge: {
    display: "inline-block",
    background: "#F5A300",
    color: "#111",
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.15em",
    padding: "0.35rem 1.1rem",
    borderRadius: "100px",
    marginBottom: "1.25rem",
  },
  h1: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "clamp(2rem, 5.5vw, 3.5rem)",
    fontWeight: 700,
    color: "#F5A300",
    lineHeight: 1.15,
    marginBottom: "0.75rem",
  },
  sub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.95rem",
    marginBottom: "3rem",
    lineHeight: 1.8,
    maxWidth: "620px",
  },
  card: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "1.5rem",
  },
  sectionLbl: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    marginBottom: "1.25rem",
  },
  input: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    width: "100%",
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    transition: "border-color 0.2s",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.55)",
    display: "block",
    marginBottom: "0.4rem",
  },
  hint: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.25)",
    marginTop: "0.35rem",
    display: "block",
  },
  calcBtn: {
    background: "#F5A300",
    color: "#111",
    border: "none",
    borderRadius: "12px",
    padding: "1rem 2.5rem",
    fontSize: "1.05rem",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    boxShadow: "4px 4px 0 #C62828",
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: "0.06em",
    transition: "all 0.2s",
    marginTop: "0.5rem",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.4)",
    borderRadius: "10px",
    padding: "0.65rem 2rem",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
};

/* ─── Sub-components ─── */

function FormField({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
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
    labelText = `average this semester to reach a ${targetCWA}% CWA`;
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
        padding: "2.5rem 2rem",
        marginBottom: "2rem",
      }}
    >
      <p style={S.sectionLbl}>You need to average</p>
      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "clamp(3rem, 8vw, 5rem)",
          fontWeight: 700,
          color: isImpossible ? "#FC8181" : "#F5A300",
          lineHeight: 1,
          marginBottom: "0.75rem",
        }}
      >
        {bigText}
      </div>
      <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
        {labelText}
      </p>
      <span
        style={{
          display: "inline-block",
          background: badgeColor.bg,
          color: badgeColor.color,
          border: `1px solid ${badgeColor.color}40`,
          borderRadius: "100px",
          padding: "0.4rem 1.5rem",
          fontSize: "0.82rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
        }}
      >
        {badgeText}
      </span>
      <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto" }}>
        {verdictText}
      </p>
    </div>
  );
}

function TargetsCard({ result }) {
  const { cumCreds, curCWA, semCreds, totalCreds, currentWeighted } = result;

  const rows = CLASSES.map((cls) => {
    const needed = (cls.min * totalCreds - currentWeighted) / semCreds;
    return { cls, needed };
  });

  return (
    <div style={S.card}>
      <p style={S.sectionLbl}>Required semester average for each class</p>
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
        Based on your current standing — what you'd need to average across all courses this semester.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {rows.map(({ cls, needed }) => {
          const alreadyThere = curCWA >= cls.min;
          const impossible = needed > 100;
          return (
            <div
              key={cls.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.1rem 1.35rem",
                background: alreadyThere ? cls.bg : impossible ? "rgba(255,255,255,0.02)" : cls.bg,
                border: `1px solid ${alreadyThere ? cls.border : impossible ? "rgba(255,255,255,0.06)" : cls.border}`,
                borderRadius: "12px",
                opacity: impossible ? 0.5 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: cls.color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.92rem", color: cls.color, marginBottom: "0.15rem" }}>{cls.name}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{cls.min}%+ overall</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {alreadyThere ? (
                  <span style={{ background: "rgba(104,211,145,0.15)", color: "#68D391", padding: "0.4rem 1rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                    Already achieved ✓
                  </span>
                ) : impossible ? (
                  <span style={{ background: "rgba(252,129,129,0.1)", color: "#FC8181", padding: "0.4rem 1rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                    Needs {needed.toFixed(0)}% — not possible
                  </span>
                ) : (
                  <div>
                    <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: cls.color, lineHeight: 1.1, marginBottom: "0.15rem" }}>
                      {needed.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>needed this semester</p>
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
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
        Your resulting CWA and class standing at different semester averages. Highlighted column is closest to your required average.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: "0.6rem",
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
                padding: "0.85rem 0.5rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.35rem" }}>Avg {avg}%</p>
              <p
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: isHighlight ? "#F5A300" : "#fff",
                  marginBottom: "0.35rem",
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
                  padding: "0.15rem 0.5rem",
                  fontSize: "0.62rem",
                  fontWeight: 700,
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
      <div style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.45)", lineHeight: 2.2 }}>
        <p style={{ marginBottom: "0.5rem" }}>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Current weighted marks</span> ={" "}
          {curCWA.toFixed(2)}% × {cumCreds} credits ={" "}
          <strong style={{ color: "#fff" }}>{currentWeighted.toFixed(1)}</strong>
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Marks needed in total</span> ={" "}
          {targetCWA.toFixed(2)}% × {totalCreds} credits ={" "}
          <strong style={{ color: "#fff" }}>{(targetCWA * totalCreds).toFixed(1)}</strong>
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Marks needed from this semester</span> ={" "}
          {(targetCWA * totalCreds).toFixed(1)} − {currentWeighted.toFixed(1)} ={" "}
          <strong style={{ color: "#fff" }}>{neededFromSem.toFixed(1)}</strong>
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
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

    const cumCreds = parseFloat(form.cumCreds);
    const curCWA = parseFloat(form.curCWA);
    const semCreds = parseFloat(form.semCreds);
    const targetCWA = parseFloat(form.targetCWA);

    if (isNaN(cumCreds) || cumCreds <= 0) return setError("Enter valid credits completed (must be > 0).");
    if (isNaN(curCWA) || curCWA < 0 || curCWA > 100) return setError("Enter a valid current CWA (0 – 100).");
    if (isNaN(semCreds) || semCreds <= 0) return setError("Enter valid credits for this semester (must be > 0).");
    if (isNaN(targetCWA) || targetCWA < 0 || targetCWA > 100) return setError("Enter a valid target CWA (0 – 100).");

    const totalCreds = cumCreds + semCreds;
    const currentWeighted = curCWA * cumCreds;
    const neededFromSem = targetCWA * totalCreds - currentWeighted;
    const requiredAvg = neededFromSem / semCreds;
    const targetCls = getCls(targetCWA);
    const currentCls = getCls(curCWA);

    setResult({ cumCreds, curCWA, semCreds, targetCWA, totalCreds, currentWeighted, neededFromSem, requiredAvg, targetCls, currentCls });
  }, [form]);

  const reset = () => {
    setForm({ cumCreds: "", curCWA: "", semCreds: "", targetCWA: "" });
    setResult(null);
    setError("");
  };

  const inputFocus = (e) => { e.currentTarget.style.borderColor = "#F5A300"; };
  const inputBlur = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; };

  return (
    <div style={S.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", cursor: "pointer" }}>
          <img
            src="/IMG_8586.JPG.jpeg"
            alt="NK's StudySync"
            style={{ height: "44px", width: "44px", objectFit: "contain", borderRadius: "8px" }}
          />
          <span style={S.navLogo}>
            <span style={{ color: "#D32F2F" }}>Nk's</span> StudySync
          </span>
        </div>
        <button style={S.backBtn}>← Back to Home</button>
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
        <div style={{ ...S.card, background: "rgba(245,163,0,0.03)", border: "1px solid rgba(245,163,0,0.12)", marginBottom: "2rem", padding: "1.75rem 2rem" }}>
          <p style={S.sectionLbl}>KNUST Grading Standards</p>
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            {[...CLASSES].reverse().map((c) => (
              <span
                key={c.name}
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.color,
                  borderRadius: "8px",
                  padding: "0.35rem 0.9rem",
                  fontSize: "0.78rem",
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
        <div style={{ ...S.card, marginBottom: "1.75rem", padding: "2rem 2rem" }}>
          <p style={S.sectionLbl}>Your current standing</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
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
            <p style={{ color: "#FC8181", fontSize: "0.88rem", marginTop: "0.75rem", padding: "0.65rem 1rem", background: "rgba(252,129,129,0.07)", borderRadius: "8px", border: "1px solid rgba(252,129,129,0.2)" }}>
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
          <div style={{ marginTop: "2rem" }}>
            <HeroCard result={result} />
            <TargetsCard result={result} />
            <ScenariosCard result={result} />
            <MathCard result={result} />

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
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
              marginTop: "1.5rem",
              padding: "2.5rem 2rem",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.92rem" }}>
              Fill in your numbers above and hit calculate to see your targets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}