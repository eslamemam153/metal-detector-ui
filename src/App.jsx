import { useState } from "react";

/* ── PALETTE: Obsidian Luxury ── */
const P = {
  black:   "#000000",
  ink:     "#080808",
  void:    "#0D0D0D",
  coal:    "#111111",
  iron:    "#1A1A1A",
  steel:   "#222222",
  ash:     "#2E2E2E",
  smoke:   "#3A3A3A",

  gold:    "#C9A84C",
  goldHi:  "#E8C87A",
  goldLo:  "#8B6914",
  goldGlow:"#C9A84C33",

  silver:  "#A8A8B3",
  mist:    "#6B6B7A",
  ghost:   "#3D3D4A",

  snow:    "#F5F5F7",
  white:   "#FFFFFF",

  teal:    "#0FA897",
  tealDim: "#0FA89733",
  violet:  "#7C5CBF",
  violetDim:"#7C5CBF33",
  crimson: "#C0392B",
  crimsonDim:"#C0392B33",
  sage:    "#2E8B57",
  sageDim: "#2E8B5733",
  amber:   "#B8860B",
  amberDim:"#B8860B33",
};

/* ── Google Fonts import via style tag ── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
`;

/* ── Global CSS ── */
const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: ${P.black}; }

  .lux-card {
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease;
  }
  .lux-card:hover {
    border-color: ${P.goldLo} !important;
    box-shadow: 0 0 24px ${P.goldGlow}, inset 0 0 24px rgba(201,168,76,0.03) !important;
    transform: translateY(-2px);
  }
  .flow-card.active {
    border-color: ${P.gold} !important;
    box-shadow: 0 0 32px ${P.goldGlow} !important;
  }

  .tab-btn {
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .tab-btn.active {
    background: ${P.goldGlow} !important;
    border-color: ${P.gold} !important;
    color: ${P.goldHi} !important;
  }
  .tab-btn:not(.active):hover {
    border-color: ${P.smoke} !important;
    color: ${P.silver} !important;
  }

  .req-row {
    transition: background 0.15s;
  }
  .req-row:hover {
    background: rgba(201,168,76,0.04) !important;
  }

  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
  }

  .gold-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, ${P.goldLo}, ${P.gold}, ${P.goldLo}, transparent);
    margin: 0;
  }

  .section-num {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: ${P.goldLo};
    text-transform: uppercase;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.6s ease both; }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shimmer-text {
    background: linear-gradient(90deg, ${P.goldLo} 0%, ${P.goldHi} 40%, ${P.gold} 60%, ${P.goldLo} 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${P.ink}; }
  ::-webkit-scrollbar-thumb { background: ${P.ash}; border-radius: 2px; }
`;

/* ── Helpers ── */
function Dot({ color, size = 5 }) {
  return <span style={{ width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />;
}

function GoldBadge({ label }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 500,
      padding: "2px 8px", borderRadius: 2,
      background: P.goldGlow, color: P.goldHi,
      border: `1px solid ${P.goldLo}`,
      letterSpacing: "0.15em", textTransform: "uppercase",
    }}>{label}</span>
  );
}

function PriorityBadge({ level }) {
  const map = {
    Must:   { bg: "#C0392B18", color: "#E57373", border: "#C0392B44" },
    Should: { bg: "#B8860B18", color: "#F0C040", border: "#B8860B44" },
    Could:  { bg: "#2E8B5718", color: "#66BB6A", border: "#2E8B5744" },
  };
  const s = map[level] || map.Could;
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 500,
      padding: "2px 7px", borderRadius: 2,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: "0.12em", textTransform: "uppercase",
    }}>{level}</span>
  );
}

function TypeBadge({ label, color }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9,
      padding: "2px 7px", borderRadius: 2,
      background: color + "18", color: color + "CC",
      border: `1px solid ${color}33`,
      letterSpacing: "0.12em", textTransform: "uppercase",
    }}>{label}</span>
  );
}

function SectionHeader({ num, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="section-num" style={{ marginBottom: 8 }}>{num}</div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 28, fontWeight: 600, color: P.snow,
        letterSpacing: "-0.01em", lineHeight: 1,
        marginBottom: 6,
      }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: P.mist, fontWeight: 300 }}>{subtitle}</p>}
      <div style={{ marginTop: 14 }}><div className="gold-line" /></div>
    </div>
  );
}

function LuxCard({ children, style = {}, glow = false, onClick, className = "" }) {
  return (
    <div
      className={`lux-card ${className}`}
      onClick={onClick}
      style={{
        background: `linear-gradient(145deg, ${P.iron}, ${P.coal})`,
        border: `1px solid ${glow ? P.gold : P.ash}`,
        borderRadius: 8,
        padding: "18px 20px",
        boxShadow: glow ? `0 0 32px ${P.goldGlow}` : `0 2px 16px rgba(0,0,0,0.6)`,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Data ── */
const FLOW = [
  { id: 1, num: "01", icon: "⚡", label: "Signal Generation", sub: "LC Oscillator",        color: P.teal,   dim: P.tealDim,   desc: "LC tank circuit generates a stable ~50 kHz carrier. Proximity of a conductive object alters coil inductance, producing a measurable frequency shift." },
  { id: 2, num: "02", icon: "📡", label: "Acquisition",       sub: "Timer1 · Counter Mode", color: P.violet, dim: P.violetDim, desc: "ATmega32 Timer1 configured as an external event counter. Rising edges accumulated over a fixed 100 ms window yield a discrete frequency reading." },
  { id: 3, num: "03", icon: "🎯", label: "Calibration",       sub: "baseline_freq",         color: P.amber,  dim: P.amberDim,  desc: "At power-up or on button press, the ambient frequency is captured as baseline_freq. Eliminates ground mineralisation and environmental drift." },
  { id: 4, num: "04", icon: "🧠", label: "Processing",        sub: "Δf = f_cur − f_base",   color: P.violet, dim: P.violetDim, desc: "Firmware computes a signed delta every cycle. Threshold comparison classifies the result into one of three detection states." },
  { id: 5, num: "05", icon: "📊", label: "Output",            sub: "LCD · Buzzer · LED",    color: P.sage,   dim: P.sageDim,   desc: "Metal type and signal magnitude rendered on LCD 16×2. Buzzer PWM rate scales with proximity. LED provides optional visual confirmation." },
];

const REQS = {
  functional: [
    { id: "FR-01", desc: "System shall detect metallic objects within a minimum range of 5 cm.", priority: "Must" },
    { id: "FR-02", desc: "System shall classify detected metal as Ferrous or Non-Ferrous based on the signed frequency delta.", priority: "Must" },
    { id: "FR-03", desc: "System shall perform Auto Calibration on power-up and on each Calibration button press.", priority: "Must" },
    { id: "FR-04", desc: "System shall display metal type, signal strength, and system status on LCD 16×2.", priority: "Must" },
    { id: "FR-05", desc: "System shall drive buzzer via PWM; pulse frequency shall scale proportionally with proximity.", priority: "Must" },
    { id: "FR-06", desc: "System shall apply moving-average filtering over a minimum of 5 consecutive samples.", priority: "Should" },
    { id: "FR-07", desc: "Detection thresholds shall be software-configurable without firmware recompilation.", priority: "Should" },
  ],
  input: [
    { id: "IR-01", desc: "LC Oscillator output connected to Timer1 (T1 pin) as an external clock source.", priority: "Must" },
    { id: "IR-02", desc: "Calibration push button shall be active-low with firmware debouncing on dedicated GPIO.", priority: "Must" },
    { id: "IR-03", desc: "Power supply: 5 V regulated via 7805 from a 9 V battery or Li-ion source.", priority: "Must" },
  ],
  output: [
    { id: "OR-01", desc: "LCD Line 1: metal type label. Line 2: delta value and calibration state.", priority: "Must" },
    { id: "OR-02", desc: "Buzzer: silent on no-detection; PWM variable-frequency on active detection.", priority: "Must" },
    { id: "OR-03", desc: "LED indicator (optional): mirrors detection state as a secondary visual channel.", priority: "Could" },
  ],
  runtime: [
    { id: "RR-01", desc: "Sampling window fixed at 100 ms per measurement cycle.", priority: "Must" },
    { id: "RR-02", desc: "Firmware shall handle Timer1 overflow without measurement discontinuity.", priority: "Must" },
    { id: "RR-03", desc: "System response time — detection to display update — shall not exceed 300 ms.", priority: "Must" },
  ],
};

const TAB_META = {
  functional: { label: "Functional", color: P.violet },
  input:      { label: "Input",      color: P.teal   },
  output:     { label: "Output",     color: P.sage   },
  runtime:    { label: "Runtime",    color: P.amber  },
};

const BOM = [
  { group: "Core",       color: P.violet, items: ["ATmega32 Microcontroller", "Crystal 16 MHz", "Capacitors 22pF × 2"] },
  { group: "Power",      color: P.sage,   items: ["Voltage Regulator 7805", "Filter Capacitors × 2", "9V / Li-ion Battery"] },
  { group: "Oscillator", color: P.teal,   items: ["Search Coil — 15t, ⌀10cm", "Tank Capacitor", "Transistor BC547"] },
  { group: "Interface",  color: P.amber,  items: ["LCD 16×2", "Potentiometer (contrast)", "Push Button (CAL)"] },
  { group: "Output",     color: P.gold,   items: ["Active Buzzer", "Driver Transistor", "Current-Limit Resistor", "LED Indicators"] },
];

const TEAMS = [
  { img:<img src="./assets/Yooooh.png" alt="" />,name: "Yomna Mohammed", sid: "23166", team: "Software", color: P.violet,  tasks: ["Signal Processing", "Timer1 frequency calc", "Baseline delta computation"] },
  { img:<img src="./assets/Ajoo.png" alt="" />,name: "Youssef Hamed",  sid: "23170", team: "Software", color: "#9B59B6", tasks: ["UI & LCD management", "Decision logic", "PWM buzzer control", "Integration"] },
  { img:<img src="./assets/Mooooo.png" alt="" />,name: "Moamen Ashraf",  sid: "23159", team: "Hardware", color: P.sage,   tasks: ["Regulated 5V power supply", "Circuit protection"] },
  { img:<img src="./assets/Helooo.png" alt="" />,name: "Youssef Helal",  sid: "23176", team: "Hardware", color: P.teal,   tasks: ["LC Oscillator design", "Coil fabrication", "Frequency tuning"] },
  { img:<img src="./assets/Roooooo.png" alt="" />,name: "Rana Kenawy",    sid: "23041", team: "Hardware", color: P.amber,  tasks: ["ATmega32 PCB layout", "Crystal + Reset circuit", "ISP interface"] },
  { img:<img src="./assets/Emooooo.png" alt="" />,name: "Eslam Emam",     sid: "23200", team: "Hardware", color: P.crimson,tasks: ["LCD wiring", "Buzzer driver circuit", "Final assembly"] },
];

/* ── Main Component ── */
export default function App() {
  const [activeStep, setActiveStep] = useState(null);
  const [reqTab, setReqTab] = useState("functional");

  const totalReqs = Object.values(REQS).reduce((a, b) => a + b.length, 0);

  return (
    <>
      <style>{FONTS}{GLOBAL_CSS}</style>
      <div className="grain" />

      <div style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse 80% 50% at 50% -10%, #1a1200 0%, ${P.black} 60%)`,
        color: P.snow,
        fontFamily: "'Outfit', sans-serif",
        padding: "60px 32px 80px",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>

        {/* ── HEADER ── */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.4em", color: P.goldLo, textTransform: "uppercase", marginBottom: 20 }}>
            EMBEDDED SYSTEMS DESIGN · SPRING 2026
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 64, fontWeight: 700, lineHeight: 1,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}>
            <span className="shimmer-text">Smart Metal</span>
            <br />
            <span style={{ color: P.snow }}>Detector</span>
          </h1>

          <p style={{ color: P.mist, fontSize: 15, fontWeight: 300, letterSpacing: "0.02em", marginBottom: 28 }}>
            ATmega32 · LC Oscillator · Frequency Deviation Analysis
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {["LC Oscillator", "Timer1 Counter", "Auto Calibration", "PWM Buzzer", "LCD 16×2"].map(t => (
              <GoldBadge key={t} label={t} />
            ))}
          </div>
        </div>

        {/* ── SIGNAL FLOW ── */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.1s" }}>
          <SectionHeader num="01 · Signal Flow" title="Operational Pipeline" subtitle="End-to-end signal path from oscillator to output — select any stage" />
          <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {FLOW.map((step, i) => (
              <div key={step.id} style={{ display: "flex", alignItems: "flex-start" }}>
                <LuxCard
                  glow={activeStep === step.id}
                  className={`flow-card ${activeStep === step.id ? "active" : ""}`}
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                  style={{ width: 152, textAlign: "center", cursor: "pointer", padding: "20px 14px" }}
                >
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.goldLo, letterSpacing: "0.25em", marginBottom: 12 }}>{step.num}</div>
                  <div style={{ fontSize: 22, color: step.color, fontFamily: "'DM Mono', monospace" }}>{step.icon}</div>
                  <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: step.color, lineHeight: 1.3, fontFamily: "'Outfit', sans-serif" }}>{step.label}</div>
                  <div style={{ marginTop: 6, fontSize: 10, color: P.mist, fontFamily: "'DM Mono', monospace", lineHeight: 1.4 }}>{step.sub}</div>
                  {activeStep === step.id && (
                    <div style={{ marginTop: 14, fontSize: 11, color: P.silver, lineHeight: 1.6, borderTop: `1px solid ${P.ash}`, paddingTop: 12, textAlign: "left", fontWeight: 300 }}>
                      {step.desc}
                    </div>
                  )}
                </LuxCard>

                {i < FLOW.length - 1 && (
                  <div style={{ marginTop: 36, padding: "0 2px", display: "flex", alignItems: "center" }}>
                    <svg width="28" height="20" viewBox="0 0 28 20">
                      <defs>
                        <marker id={`arr${i}`} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                          <path d="M0,0 L5,2.5 L0,5 Z" fill={P.goldLo} />
                        </marker>
                      </defs>
                      <line x1="0" y1="10" x2="22" y2="10" stroke={P.goldLo} strokeWidth="1" markerEnd={`url(#arr${i})`} />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── DECISION LOGIC ── */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.2s" }}>
          <SectionHeader num="02 · Decision Logic" title="Metal Classification" subtitle="Signed delta thresholding" />

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { cond: "Δf < 0", label: "Ferrous",      note: "Iron · Steel",       color: P.crimson, icon: "⬇" },
              { cond: "Δf ≈ 0", label: "No Detection", note: "Within noise floor",  color: P.mist,    icon: "—" },
              { cond: "Δf > 0", label: "Non-Ferrous",  note: "Gold · Copper · Al", color: P.sage,    icon: "⬆" },
            ].map(d => (
              <LuxCard key={d.label} style={{ flex: "1 1 180px", textAlign: "center", padding: "24px 18px" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: d.color }}>{d.icon}</div>
                <div style={{ marginTop: 12, fontFamily: "'DM Mono', monospace", fontSize: 14, color: d.color, fontWeight: 500 }}>{d.cond}</div>
                <div style={{ marginTop: 8, fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: P.snow }}>{d.label}</div>
                <div style={{ marginTop: 6, fontSize: 11, color: P.mist, letterSpacing: "0.05em" }}>{d.note}</div>
              </LuxCard>
            ))}
          </div>

          <div style={{
            background: P.coal,
            border: `1px solid ${P.ash}`,
            borderLeft: `3px solid ${P.gold}`,
            borderRadius: 8, padding: "16px 22px",
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.goldLo, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Core Formula</div>
            <code style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: P.goldHi }}>
              difference = current_freq − baseline_freq
            </code>
            <p style={{ marginTop: 8, fontSize: 11, color: P.mist, fontWeight: 300 }}>
              baseline_freq captured at power-up or on each Calibration button press
            </p>
          </div>
        </section>

        {/* ── REQUIREMENTS ── */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.3s" }}>
          <SectionHeader
            num="03 · Requirements"
            title="System Requirements"
            subtitle={`${totalReqs} requirements across Functional · Input · Output · Runtime`}
          />

          {/* Priority Legend */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
            {[["Must", "#E57373", "non-negotiable"], ["Should", "#F0C040", "high priority"], ["Could", "#66BB6A", "nice-to-have"]].map(([p, col, note]) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Dot color={col} size={6} />
                <span style={{ fontSize: 12, color: P.mist, fontWeight: 300 }}>
                  <span style={{ color: col, fontWeight: 500 }}>{p}</span> — {note}
                </span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {Object.entries(TAB_META).map(([key, meta]) => {
              const active = reqTab === key;
              return (
                <button
                  key={key}
                  className={`tab-btn ${active ? "active" : ""}`}
                  onClick={() => setReqTab(key)}
                  style={{
                    padding: "7px 16px", borderRadius: 4,
                    border: `1px solid ${active ? meta.color : P.ash}`,
                    background: active ? meta.color + "18" : "transparent",
                    color: active ? meta.color : P.mist,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12, fontWeight: 500, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {meta.label}
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10,
                    background: active ? meta.color + "33" : P.ash,
                    color: active ? meta.color : P.mist,
                    padding: "0 6px", borderRadius: 2,
                  }}>{REQS[key].length}</span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div style={{ background: P.coal, border: `1px solid ${P.ash}`, borderRadius: 8, overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "80px 1fr 100px 76px",
              gap: 16, padding: "10px 20px",
              background: P.iron, borderBottom: `1px solid ${P.ash}`,
            }}>
              {["ID", "Description", "Type", "Priority"].map(h => (
                <span key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.mist, letterSpacing: "0.2em", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {REQS[reqTab].map((r, idx) => (
              <div
                key={r.id}
                className="req-row"
                style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 100px 76px",
                  gap: 16, alignItems: "center",
                  padding: "12px 20px",
                  background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  borderBottom: `1px solid ${P.steel}`,
                }}
              >
                <code style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: TAB_META[reqTab].color, fontWeight: 500 }}>{r.id}</code>
                <span style={{ fontSize: 12, color: P.silver, lineHeight: 1.6, fontWeight: 300 }}>{r.desc}</span>
                <TypeBadge label={TAB_META[reqTab].label} color={TAB_META[reqTab].color} />
                <PriorityBadge level={r.priority} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Project Components ── */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.4s" }}>
          <SectionHeader num="04 · Project Components" title="Hardware Components" subtitle="Grouped by functional subsystem" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {BOM.map(grp => (
              <LuxCard key={grp.group}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  color: grp.color, letterSpacing: "0.2em",
                  textTransform: "uppercase", marginBottom: 14,
                  paddingBottom: 10, borderBottom: `1px solid ${P.steel}`,
                }}>{grp.group}</div>
                {grp.items.map(item => (
                  <div key={item} style={{
                    fontSize: 12, color: P.silver, fontWeight: 300,
                    padding: "6px 0", borderBottom: `1px solid ${P.steel}`,
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <Dot color={grp.color} size={4} />
                    {item}
                  </div>
                ))}
              </LuxCard>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="fade-up" style={{ marginBottom: 40, animationDelay: "0.5s" }}>
          <SectionHeader num="05 · Team Allocation" title="Work Breakdown" subtitle="2 Software · 4 Hardware" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))", gap: 12 }}>
            {TEAMS.map(t => (
              <LuxCard key={t.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${P.steel}` }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 4, flexShrink: 0,
                    background: t.color + "18", border: `1px solid ${t.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.color, fontWeight: 500,
                  }}>{t.id}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.mist, letterSpacing: "0.15em", textTransform: "uppercase" }}>{t.team}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: P.snow, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.color, marginTop: 1 }}>ID: {t.sid}</div>
                  </div>
                </div>
                {t.tasks.map(task => (
                  <div key={task} style={{ fontSize: 12, color: P.silver, fontWeight: 300, padding: "5px 0", borderBottom: `1px solid ${P.steel}`, display: "flex", alignItems: "center", gap: 10 }}>
                    <Dot color={t.color} size={4} />
                    {task}
                  </div>
                ))}
              </LuxCard>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 60 }}>
          <div className="gold-line" />
          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: P.mist, fontWeight: 500 }}>Smart Metal Detector</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: P.ghost, letterSpacing: "0.2em" }}>EMBEDDED SYSTEMS DESIGN · SPRING 2026</div>
            <GoldBadge label="Final Draft" />
          </div>
        </div>

      </div>
    </>
  );
}
