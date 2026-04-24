import { useState } from "react";

const COLORS = {
  bg: "#0B1120",
  panel: "#111827",
  border: "#1E3A5F",
  accent: "#3B82F6",
  accentGlow: "#60A5FA",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  teal: "#14B8A6",
  purple: "#8B5CF6",
  gray: "#6B7280",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#475569",
};

const FLOW_STEPS = [
  {
    id: 1,
    icon: "⚡",
    label: "Signal Generation",
    sub: "LC Oscillator",
    desc: "Generates stable ~50 kHz carrier. Search coil inductance shifts when metal is near.",
    color: COLORS.teal,
  },
  {
    id: 2,
    icon: "📡",
    label: "Signal Acquisition",
    sub: "Timer1 · Counter Mode",
    desc: "ATmega32 counts rising edges over a fixed 100 ms window to compute frequency.",
    color: COLORS.accent,
  },
  {
    id: 3,
    icon: "🎯",
    label: "Calibration",
    sub: "baseline_freq",
    desc: "On power-up or button press, ambient frequency is stored as the baseline reference.",
    color: COLORS.amber,
  },
  {
    id: 4,
    icon: "🧠",
    label: "Processing & Decision",
    sub: "Δf = current − baseline",
    desc: "Δf < 0 → Ferrous · Δf > 0 → Non-Ferrous · Δf ≈ 0 → No Detection",
    color: COLORS.purple,
  },
  {
    id: 5,
    icon: "📊",
    label: "Output",
    sub: "LCD · Buzzer · LEDs",
    desc: "Results rendered on LCD; buzzer pulse rate scales with proximity; LED indicators optional.",
    color: COLORS.green,
  },
];

const COMPONENTS = [
  { group: "Core", color: "#3B82F6", items: ["ATmega32", "Crystal 16 MHz", "Capacitors 22pF × 2"] },
  { group: "Power", color: "#10B981", items: ["Regulator 7805", "Filter Capacitors", "9V / Li-ion Battery"] },
  { group: "Oscillator", color: "#14B8A6", items: ["Search Coil (15t, ⌀10cm)", "Tank Capacitor", "Transistor BC547"] },
  { group: "Interface", color: "#F59E0B", items: ["LCD 16×2", "Potentiometer (contrast)", "Push Button (CAL)"] },
  { group: "Output", color: "#8B5CF6", items: ["Buzzer", "Driver Transistor", "Resistor", "LED Indicators"] },
];

const TEAMS = [
  {
    role: "Yomna Mohammed — Software",
    color: COLORS.accent,
    tasks: ["Signal Processing", "Timer1 + frequency calc", "Baseline delta"],
  },
  {
    role: "Youssef Hamed — Software",
    color: COLORS.purple,
    tasks: ["UI / LCD", "Decision Logic", "Buzzer PWM", "Integration"],
  },
  {
    role: "Moamen Ashraf — Hardware",
    color: COLORS.green,
    tasks: ["Power Module", "Regulation", "Circuit protection"],
  },
  {
    role: "Youssef Helal — Hardware",
    color: COLORS.teal,
    tasks: ["LC Oscillator design", "Coil fabrication", "Freq. tuning"],
  },
  {
    role: "Rana Kenawy — Hardware",
    color: COLORS.amber,
    tasks: ["ATmega32 circuit", "Crystal + Reset", "ISP interface"],
  },
  {
    role: "Eslam Emam — Hardware",
    color: COLORS.red,
    tasks: ["LCD wiring", "Buzzer driver", "Assembly"],
  },
];

function FlowArrow({ color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
      <svg width="32" height="20" viewBox="0 0 32 20">
        <defs>
          <marker id={`arr-${color.replace("#","")}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={color} />
          </marker>
        </defs>
        <line x1="0" y1="10" x2="26" y2="10" stroke={color} strokeWidth="2"
          markerEnd={`url(#arr-${color.replace("#","")})`} />
      </svg>
    </div>
  );
}

function Chip({ label, color }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
      padding: "2px 7px", borderRadius: 4,
      background: color + "22", color, border: `1px solid ${color}55`,
      letterSpacing: "0.04em",
    }}>{label}</span>
  );
}

export default function Diagram() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.textPrimary,
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      padding: "40px 24px", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        .step-card { transition: transform 0.18s ease, box-shadow 0.18s ease; cursor: pointer; }
        .step-card:hover { transform: translateY(-3px); }
        .comp-item { transition: background 0.15s; }
        .comp-item:hover { background: #ffffff0f !important; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: COLORS.accent, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10, textTransform: "uppercase" }}>
          Embedded Systems Design · Spring 2026
        </div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: COLORS.textPrimary }}>
          Smart Metal Detector
        </h1>
        <p style={{ margin: "10px 0 0", color: COLORS.textSecondary, fontSize: 15 }}>
          ATmega32 · LC Oscillator · Frequency Deviation Analysis
        </p>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {["LC Oscillator", "Timer1 Counter", "Auto Calibration", "PWM Buzzer", "LCD 16×2"].map(t => (
            <Chip key={t} label={t} color={COLORS.accentGlow} />
          ))}
        </div>
      </div>

      {/* ── Signal Flow ── */}
      <Section title="Signal Flow" subtitle="End-to-end operational pipeline">
        <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: 0, justifyContent: "center" }}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                className="step-card"
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                style={{
                  width: 148, background: COLORS.panel,
                  border: `1.5px solid ${activeStep === step.id ? step.color : COLORS.border}`,
                  borderRadius: 12, padding: "14px 12px", textAlign: "center",
                  boxShadow: activeStep === step.id ? `0 0 18px ${step.color}44` : "none",
                }}
              >
                <div style={{ fontSize: 26 }}>{step.icon}</div>
                <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: step.color, lineHeight: 1.3 }}>{step.label}</div>
                <div style={{ marginTop: 4, fontSize: 10, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono',monospace" }}>{step.sub}</div>
                {activeStep === step.id && (
                  <div style={{ marginTop: 10, fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.5, borderTop: `1px solid ${step.color}44`, paddingTop: 8 }}>
                    {step.desc}
                  </div>
                )}
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={{ marginTop: 36 }}>
                  <FlowArrow color={FLOW_STEPS[i + 1].color} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: COLORS.textMuted }}>
          Click any step to expand details
        </div>
      </Section>

      {/* ── Decision Logic ── */}
      <Section title="Decision Logic" subtitle="Metal type classification via signed frequency delta">
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { cond: "Δf < 0", label: "Ferrous", note: "Iron / Steel", color: COLORS.red, icon: "🔩" },
            { cond: "Δf ≈ 0", label: "No Detection", note: "Within noise threshold", color: COLORS.gray, icon: "⭕" },
            { cond: "Δf > 0", label: "Non-Ferrous", note: "Gold / Copper / Al", color: COLORS.green, icon: "🥇" },
          ].map(d => (
            <div key={d.label} style={{
              flex: "1 1 180px", maxWidth: 220, background: COLORS.panel,
              border: `1.5px solid ${d.color}55`, borderRadius: 12, padding: "18px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: 28 }}>{d.icon}</div>
              <div style={{ marginTop: 8, fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: d.color, fontWeight: 700 }}>{d.cond}</div>
              <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{d.label}</div>
              <div style={{ marginTop: 4, fontSize: 11, color: COLORS.textMuted }}>{d.note}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 20px" }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Formula</div>
          <code style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, color: COLORS.accentGlow }}>
            difference = current_freq − baseline_freq
          </code>
          <div style={{ marginTop: 6, fontSize: 11, color: COLORS.textMuted }}>
            baseline_freq recorded at power-up or on Calibration button press
          </div>
        </div>
      </Section>

      {/* ── Project Components ── */}
      <Section title="Project Components" subtitle="Hardware components grouped by subsystem">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
          {COMPONENTS.map(grp => (
            <div key={grp.group} style={{
              background: COLORS.panel, border: `1.5px solid ${grp.color}44`,
              borderRadius: 12, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: grp.color, marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {grp.group}
              </div>
              {grp.items.map(item => (
                <div key={item} className="comp-item" style={{
                  fontSize: 12, color: COLORS.textSecondary, padding: "5px 8px",
                  borderRadius: 6, marginBottom: 2,
                  background: "#ffffff05",
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: grp.color, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Team Allocation ── */}
      <Section title="Team Allocation" subtitle="6-member team — Software × 2 · Hardware × 4">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {TEAMS.map(t => (
            <div key={t.role} style={{
              background: COLORS.panel, border: `1.5px solid ${t.color}44`,
              borderRadius: 12, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.color, marginBottom: 10 }}>{t.role}</div>
              {t.tasks.map(task => (
                <div key={task} style={{
                  fontSize: 12, color: COLORS.textSecondary, padding: "4px 8px",
                  marginBottom: 3, borderRadius: 5, background: "#ffffff05",
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                  {task}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 48, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono',monospace" }}>
          Smart Metal Detector · Embedded Systems Design ·  Spring 2026
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.textMuted }}>{subtitle}</p>
      </div>
      <div style={{
        background: "#0F172A", border: `1px solid ${COLORS.border}`,
        borderRadius: 14, padding: "24px 20px",
      }}>
        {children}
      </div>
    </div>
  );
}