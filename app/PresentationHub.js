"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════
// UNIFIED DESIGN TOKENS
// ═══════════════════════════════════════════
const T = {
  bg: "#0A0E18",
  card: "rgba(255,255,255,0.03)",
  amber: "#D4920B",
  amberGlow: "rgba(212,146,11,0.25)",
  amberDim: "rgba(212,146,11,0.10)",
  green: "#2ECC71",
  greenDim: "rgba(46,204,113,0.12)",
  blue: "#3B82F6",
  blueDim: "rgba(59,130,246,0.12)",
  cyan: "#22D3EE",
  cyanDim: "rgba(34,211,238,0.10)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.10)",
  white: "#F0EDE6",
  muted: "#9CA3AF",
  gray: "#6B7280",
  border: "#1E2536",
  grayDark: "#3A3D47",
  font: "'IBM Plex Sans', -apple-system, sans-serif",
  mono: "'IBM Plex Mono', 'SF Mono', monospace",
};

// ═══════════════════════════════════════════
// SHARED CHROME: Background, Progress, Nav, Toggle
// ═══════════════════════════════════════════
function GridBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`,
        backgroundSize: "80px 80px", opacity: 0.3,
      }} />
      <motion.div
        animate={{ opacity: [0.04, 0.09, 0.04], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "15%", right: "20%", width: 700, height: 700,
          borderRadius: "50%", background: `radial-gradient(circle, ${T.amberGlow}, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: "absolute", bottom: "10%", left: "10%", width: 500, height: 500,
          borderRadius: "50%", background: `radial-gradient(circle, ${T.blueDim}, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, transparent 30%, ${T.bg} 100%)` }} />
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 3, background: T.border, zIndex: 200 }}>
      <motion.div
        animate={{ width: `${((current + 1) / total) * 100}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ height: "100%", background: `linear-gradient(90deg, ${T.amber}, ${T.amber}bb)`, boxShadow: `0 0 14px ${T.amberGlow}` }}
      />
    </div>
  );
}

function NavBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 6,
      color: disabled ? T.border : T.muted, padding: "5px 12px", cursor: disabled ? "default" : "pointer",
      fontFamily: T.mono, fontSize: 14, opacity: disabled ? 0.4 : 1, transition: "all 0.2s",
    }}>{children}</button>
  );
}

function NavControls({ current, total, onPrev, onNext, isPlaying, onTogglePlay, hasAutoplay }) {
  return (
    <div style={{
      position: "fixed", bottom: 16, left: 24, display: "flex", gap: 6, zIndex: 200, alignItems: "center",
    }}>
      <NavBtn onClick={onPrev} disabled={current === 0}>‹</NavBtn>
      {hasAutoplay && (
        <button onClick={onTogglePlay} style={{
          background: isPlaying ? T.amberDim : T.amber, border: "none", borderRadius: 6,
          color: isPlaying ? T.amber : T.bg, padding: "5px 16px", cursor: "pointer",
          fontFamily: T.mono, fontSize: 12, fontWeight: 700, transition: "all 0.2s",
        }}>
          {isPlaying ? "PAUSE" : current === total - 1 ? "REPLAY" : "PLAY"}
        </button>
      )}
      <NavBtn onClick={onNext} disabled={current === total - 1}>›</NavBtn>
      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.gray, margin: "0 8px" }}>
        {String(current + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i === current ? 18 : 5, height: 5, borderRadius: 3,
            background: i === current ? T.amber : i < current ? T.muted : T.border,
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

function DeckToggle({ active, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        position: "fixed", top: 16, right: 24, zIndex: 300,
        display: "flex", alignItems: "center", gap: 0,
        background: `${T.bg}ee`, border: `1px solid ${T.border}`,
        borderRadius: 8, padding: 3, backdropFilter: "blur(12px)",
      }}
    >
      {["rebuttal", "fdose"].map((id) => {
        const isActive = active === id;
        const label = id === "rebuttal" ? "REBUTTAL" : "FDOSE";
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            style={{
              position: "relative",
              fontFamily: T.mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: isActive ? T.bg : T.muted,
              background: "transparent",
              border: "none",
              padding: "7px 18px",
              cursor: "pointer",
              borderRadius: 6,
              transition: "color 0.3s",
              zIndex: 1,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="deckToggleBg"
                style={{
                  position: "absolute", inset: 0, borderRadius: 6,
                  background: T.amber,
                  boxShadow: `0 0 16px ${T.amberGlow}`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 2 }}>{label}</span>
          </button>
        );
      })}
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// SHARED SLIDE PRIMITIVES
// ═══════════════════════════════════════════
function Slide({ children, align = "start" }) {
  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center",
      padding: "60px 64px 80px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1,
    }}>{children}</div>
  );
}

function SectionLabel({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.amber }}>{children}</span>
    </motion.div>
  );
}

function SlideTitle({ children, delay = 0.1 }) {
  return (
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }}
      style={{ fontFamily: T.font, fontSize: 34, fontWeight: 700, color: T.white, lineHeight: 1.2, marginTop: 8, marginBottom: 6 }}>{children}</motion.h1>
  );
}

function AmberLine({ delay = 0.3, width = 260 }) {
  return (
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay }}
      style={{ height: 2, width, background: `linear-gradient(90deg, ${T.amber}, transparent)`, transformOrigin: "left", marginBottom: 28 }} />
  );
}

function Subtitle({ children, delay = 0.4 }) {
  return (
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
      style={{ fontFamily: T.font, fontSize: 16, color: T.muted, lineHeight: 1.6, maxWidth: 640, marginBottom: 24 }}>{children}</motion.p>
  );
}

function BulletItem({ children, icon = "▸", delay = 0, color = T.amber }) {
  return (
    <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay }}
      style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
      <span style={{ color, fontFamily: T.mono, fontSize: 14, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <span style={{ fontFamily: T.font, fontSize: 14, color: T.white, lineHeight: 1.55 }}>{children}</span>
    </motion.div>
  );
}

function MetricCard({ value, label, color = T.amber, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "22px 20px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 700, color, marginBottom: 6 }}>{value}</div>
      <div style={{ fontFamily: T.font, fontSize: 12, color: T.muted, lineHeight: 1.4 }}>{label}</div>
    </motion.div>
  );
}

function PillTag({ children, color = T.amber, delay = 0 }) {
  return (
    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.4 }}
      style={{
        display: "inline-block", fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
        color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 20, padding: "4px 14px",
      }}>{children}</motion.span>
  );
}

function TwoCol({ left, right, ratio = "1fr 1fr" }) {
  return <div style={{ display: "grid", gridTemplateColumns: ratio, gap: 32, alignItems: "start" }}>{left}{right}</div>;
}

function Card({ children, delay = 0, style = {} }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 18px", backdropFilter: "blur(8px)", ...style }}>
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, delay = 0, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = Math.ceil(target / (duration / 50));
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(interval); }
        else { setCount(start); }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay, duration]);
  return <span>{count}</span>;
}

// ═══════════════════════════════════════════════════════════════
// DECK 1: PERFORMANCE REBUTTAL (9 SCENES)
// ═══════════════════════════════════════════════════════════════
const PR_DURATIONS = [3500, 9000, 13000, 11000, 16000, 11000, 11000, 13000, 9000];
const PR_TOTAL = PR_DURATIONS.reduce((a, b) => a + b, 0);

function PR1() {
  return (
    <Slide>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
        <motion.h1 initial={{ opacity: 0, y: 30, letterSpacing: "0.3em" }} animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ fontFamily: T.font, fontSize: 36, fontWeight: 700, color: T.white, marginBottom: 12 }}>
          Performance Rebuttal &<br />Development Case
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          style={{ height: 3, width: 320, background: T.amber, transformOrigin: "center", marginBottom: 20, boxShadow: `0 0 20px ${T.amberGlow}` }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.0 }}
          style={{ fontFamily: T.mono, fontSize: 14, color: T.gray, letterSpacing: "0.05em" }}>
          Stephen Talley &nbsp;|&nbsp; Sr. Operations Systems Analyst &nbsp;|&nbsp; DHL Supply Chain — PLCB
        </motion.p>
      </div>
    </Slide>
  );
}

function PR2() {
  const deficits = ["No SOPs", "No LSWs", "No EOS Reporting", "No Knowledge Base", "No Onboarding", "No Technical Guidance"];
  return (
    <Slide>
      <SectionLabel>The Starting Point</SectionLabel>
      <SlideTitle>October 21, 2024 — Day One.</SlideTitle>
      <AmberLine />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
        {deficits.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.25 }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: T.redDim, border: `1px solid ${T.red}33`, borderRadius: 6 }}>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 + i * 0.25, type: "spring" }}
              style={{ color: T.red, fontSize: 18, fontWeight: 700 }}>✕</motion.span>
            <span style={{ fontFamily: T.font, fontSize: 15, color: T.white, textDecoration: "line-through", textDecorationColor: T.red + "88" }}>{item}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.0, duration: 0.8 }} style={{ textAlign: "center" }}>
        <span style={{ fontFamily: T.font, fontSize: 22, color: T.white, fontWeight: 500 }}>
          The baseline was not neutral — it was{" "}
          <motion.span animate={{ textShadow: [`0 0 8px ${T.amberGlow}`, `0 0 20px ${T.amberGlow}`, `0 0 8px ${T.amberGlow}`] }}
            transition={{ duration: 2, repeat: Infinity }} style={{ color: T.amber, fontWeight: 700 }}>degraded.</motion.span>
        </span>
      </motion.div>
    </Slide>
  );
}

function PR3() {
  const items = [
    { icon: "📋", label: "LSW Program" }, { icon: "📊", label: "EOS Reporting" },
    { icon: "📓", label: "Team OneNote" }, { icon: "🔗", label: "SharePoint Tracker" },
    { icon: "📁", label: "K: Drive Restructure" }, { icon: "📝", label: "Onboarding SOPs" },
    { icon: "🖥️", label: "Server Room Cleanup" }, { icon: "📍", label: "GPS Routing Fix" },
    { icon: "🌐", label: "Google My Business" }, { icon: "🏷️", label: "Asset Mgmt Template" },
  ];
  return (
    <Slide>
      <SectionLabel>What I Built</SectionLabel>
      <SlideTitle>14 Months. From Scratch.</SlideTitle>
      <AmberLine />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 28 }}>
        {items.map((item, i) => (
          <Card key={i} delay={0.5 + i * 0.16}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.white, lineHeight: 1.3 }}>{item.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
        style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: "14px 28px", background: T.amberDim, border: `1px solid ${T.amber}44`, borderRadius: 8, width: "fit-content", margin: "0 auto" }}>
        <span style={{ fontFamily: T.mono, fontSize: 36, fontWeight: 700, color: T.amber }}><AnimatedCounter target={10} delay={3000} duration={1500} /></span>
        <span style={{ fontFamily: T.font, fontSize: 16, color: T.white, fontWeight: 500 }}>systems built from nothing</span>
      </motion.div>
    </Slide>
  );
}

function PR4() {
  const deliverables = [
    { label: "Putaway Logic", result: "Zero Defects" }, { label: "PA Code Validation", result: "Seamless" },
    { label: "GS1 Parsing", result: "Zero Issues" }, { label: "ERP Phase 2", result: "Delivered" },
    { label: "Layerpick Thresholds", result: "Complete" }, { label: "RCH Logic", result: "Deployed" },
    { label: "MDF Cleanup", result: "Resolved" },
  ];
  return (
    <Slide>
      <SectionLabel>2025 Technical Deliverables</SectionLabel>
      <SlideTitle>Shipped. Verified. Zero Defect.</SlideTitle>
      <AmberLine />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {deliverables.map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 6 }}>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.2, type: "spring" }}
              style={{ width: 26, height: 26, borderRadius: "50%", background: T.greenDim, border: `2px solid ${T.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: T.green, flexShrink: 0 }}>✓</motion.span>
            <span style={{ fontFamily: T.font, fontSize: 14, color: T.white, fontWeight: 500, flex: 1 }}>{d.label}</span>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.result}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.0, duration: 0.6 }}
        style={{ padding: "12px 24px", background: T.greenDim, border: `1px solid ${T.green}66`, borderRadius: 8, textAlign: "center" }}>
        <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.green }}>Zero Post-Launch Defects on Major Releases</span>
      </motion.div>
    </Slide>
  );
}

function PR5() {
  const osmFunctions = ["Set team operational rhythm (LSW/EOS)", "Developing & mentoring 2 analysts", "Built SOP & training infrastructure", "CI project leadership with Engineering", "Resource coordination & daily team support", "Cross-functional stakeholder management"];
  const growth = ["WMS subsystem depth — need dedicated floor time & mentorship", "Formal project management discipline", "Sustained delivery consistency under competing priorities"];
  return (
    <Slide>
      <SectionLabel>Already Operating at the Next Level</SectionLabel>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ fontFamily: T.font, fontSize: 20, fontWeight: 600, color: T.white, marginTop: 8, marginBottom: 4 }}>
        Sr. OSA Title. <span style={{ color: T.amber }}>OSM-Level Work.</span>
      </motion.p>
      <AmberLine delay={0.4} />
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>What I'm Doing (OSM Functions)</motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {osmFunctions.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.28 }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: T.amberDim, border: `1px solid ${T.amber}33`, borderRadius: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber, flexShrink: 0 }} />
                <span style={{ fontFamily: T.font, fontSize: 13, color: T.white }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.gray, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Where I'm Still Growing</motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {growth.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 + i * 0.4 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid ${T.gray}`, flexShrink: 0, marginTop: 4 }} />
                <span style={{ fontFamily: T.font, fontSize: 13, color: T.gray }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

function PR6() {
  const roles = [
    { label: "Daily Triage & Support", color: T.amber },
    { label: "Infrastructure & Department Building", color: T.green },
    { label: "Developing 2 Analysts", color: T.cyan },
  ];
  return (
    <Slide>
      <SectionLabel>The Three-Role Problem</SectionLabel>
      <SlideTitle>Three Roles. One Person.</SlideTitle>
      <AmberLine />
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        {roles.map((role, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: [20, 0, -4, 0] }}
            transition={{ delay: 0.6 + i * 0.35, duration: 0.8 }}
            style={{ padding: "18px 24px", background: `${role.color}15`, border: `2px solid ${role.color}55`, borderRadius: 12, minWidth: 200, textAlign: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: role.color, margin: "0 auto 10px", boxShadow: `0 0 12px ${role.color}66` }} />
            <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.white }}>{role.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} style={{ textAlign: "center" }}>
        <div style={{ padding: "14px 28px", background: T.amberDim, border: `1px solid ${T.amber}44`, borderRadius: 8, display: "inline-block" }}>
          <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 600, color: T.amber }}>One Person — No Formal Acknowledgment</span>
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}
          style={{ fontFamily: T.font, fontSize: 13, color: T.gray, marginTop: 16, fontStyle: "italic" }}>
          Evaluated on individual delivery. Functioning as a team leader.
        </motion.p>
      </motion.div>
    </Slide>
  );
}

function PR7() {
  const steps = ["Critical SQL", "No Code Review", "No QA Environment", "No Technical Peer", "Production"];
  return (
    <Slide>
      <SectionLabel>The Gap</SectionLabel>
      <SlideTitle>Right First Time — Without the Safety Net.</SlideTitle>
      <AmberLine />
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36, flexWrap: "wrap", justifyContent: "center" }}>
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.3 }} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ padding: "10px 16px", background: i === 0 || i === 4 ? T.card : T.redDim, border: `1px solid ${i === 0 || i === 4 ? T.border : T.red + "44"}`, borderRadius: 6, position: "relative" }}>
              <span style={{ fontFamily: T.mono, fontSize: 13, color: i === 0 || i === 4 ? T.white : T.red, fontWeight: 600 }}>{step}</span>
              {i > 0 && i < 4 && (
                <motion.div animate={{ boxShadow: [`0 0 4px ${T.red}33`, `0 0 12px ${T.red}66`, `0 0 4px ${T.red}33`] }}
                  transition={{ duration: 1.5, repeat: Infinity }} style={{ position: "absolute", inset: -1, borderRadius: 6, pointerEvents: "none" }} />
              )}
            </div>
            {i < steps.length - 1 && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.3 }}
                style={{ color: T.grayDark, fontSize: 20, margin: "0 6px" }}>→</motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.0, duration: 0.8 }}
        style={{ padding: "16px 28px", background: T.greenDim, border: `1px solid ${T.green}55`, borderRadius: 8, textAlign: "center" }}>
        <motion.span animate={{ textShadow: [`0 0 4px ${T.green}33`, `0 0 14px ${T.green}55`, `0 0 4px ${T.green}33`] }}
          transition={{ duration: 2, repeat: Infinity }} style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.green }}>
          My Record: Zero-Defect Deployments on Major Releases
        </motion.span>
      </motion.div>
    </Slide>
  );
}

function PR8() {
  const goals = ["Zero-Miss Delivery System", "Proactive Communication", "WMS SME Development", "Ops & Engineering Collaboration", "Professional Conduct", "Right First Time Review Process"];
  return (
    <Slide>
      <SectionLabel>The Ask</SectionLabel>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.white, marginTop: 8, marginBottom: 4 }}>
        Not a PIP. <span style={{ color: T.amber }}>A Sprint.</span>
      </motion.p>
      <AmberLine delay={0.4} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
        {goals.map((goal, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5 + i * 0.28 }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 6 }}>
            <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 700, color: T.amber, width: 28, textAlign: "center" }}>{i + 1}</span>
            <span style={{ fontFamily: T.font, fontSize: 14, color: T.white, fontWeight: 500 }}>{goal}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8, duration: 0.6 }}
        style={{ padding: "16px 32px", background: T.amberDim, border: `2px solid ${T.amber}55`, borderRadius: 10, textAlign: "center" }}>
        <span style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.amber }}>90 Days. 6 SMART Goals. Full Transparency.</span>
      </motion.div>
    </Slide>
  );
}

function PR9() {
  return (
    <Slide>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          style={{ padding: "24px 36px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 32, position: "relative" }}>
          <div style={{ position: "absolute", top: -8, left: 36, fontSize: 32, color: T.amber, fontFamily: "Georgia, serif" }}>"</div>
          <p style={{ fontFamily: T.font, fontSize: 17, color: T.white, lineHeight: 1.6, fontStyle: "italic", marginBottom: 12 }}>
            This period reflects capability and willingness to improve, which is a positive indicator for the future.
          </p>
          <p style={{ fontFamily: T.mono, fontSize: 12, color: T.amber }}>— Reggie Eckley, Manager</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 1 }}>
          <p style={{ fontFamily: T.font, fontSize: 18, color: T.white, lineHeight: 1.7, fontWeight: 500 }}>
            <span style={{ color: T.amber, fontWeight: 700 }}>14 months.</span> Degraded baseline. Built everything.<br />
            Ready for the next level — <span style={{ color: T.amber }}>with the right support to get there.</span>
          </p>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 3.5, duration: 1 }}
          style={{ height: 3, width: 200, background: T.amber, transformOrigin: "center", marginTop: 28, boxShadow: `0 0 20px ${T.amberGlow}` }} />
      </div>
    </Slide>
  );
}

const PR_SCENES = [PR1, PR2, PR3, PR4, PR5, PR6, PR7, PR8, PR9];

// ═══════════════════════════════════════════════════════════════
// DECK 2: FDOSE PITCH (12 SLIDES)
// ═══════════════════════════════════════════════════════════════

function FD1() {
  return (
    <Slide>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          style={{ display: "inline-flex", gap: 3, marginBottom: 20 }}>
          {["F", "D", "O", "S", "E"].map((c, i) => (
            <motion.span key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
              style={{ fontFamily: T.mono, fontSize: 52, fontWeight: 700, color: T.amber, textShadow: `0 0 30px ${T.amberGlow}`, letterSpacing: "0.04em" }}>{c}</motion.span>
          ))}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ fontFamily: T.font, fontSize: 36, fontWeight: 700, color: T.white, marginBottom: 8 }}>
          Forward-Deployed<br />Operations Systems Engineering
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.3, duration: 0.8 }}
          style={{ height: 3, width: 300, background: T.amber, margin: "16px auto", transformOrigin: "center", boxShadow: `0 0 20px ${T.amberGlow}` }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          style={{ fontFamily: T.font, fontSize: 16, color: T.muted, marginBottom: 8 }}>Embedding Technical Operators Where It Matters Most</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}
          style={{ fontFamily: T.mono, fontSize: 12, color: T.gray }}>DHL Supply Chain &nbsp;|&nbsp; Internal Strategy Proposal</motion.p>
      </div>
    </Slide>
  );
}

function FD2() {
  return (
    <Slide>
      <SectionLabel>The Problem</SectionLabel>
      <SlideTitle>Operations Outpaces the Systems That Support It</SlideTitle>
      <AmberLine />
      <TwoCol ratio="1.2fr 1fr"
        left={<div>
          <Subtitle>Distribution centers run complex, interdependent systems — but technical support is centralized, reactive, and far from the floor.</Subtitle>
          <BulletItem delay={0.5}>Issues enter ticket queues — hours or days before triage</BulletItem>
          <BulletItem delay={0.6}>Handoffs between Ops, IT, and vendors add friction</BulletItem>
          <BulletItem delay={0.7}>Long escalation chains lose operational context</BulletItem>
          <BulletItem delay={0.8}>Analysts are reactive, over-escalated, and under-empowered</BulletItem>
          <BulletItem delay={0.9}>No technical career path keeps talent close to operations</BulletItem>
        </div>}
        right={<div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <MetricCard value="Hours" label="Average time-to-triage for system issues" color={T.red} delay={0.7} />
          <MetricCard value="3–5x" label="Handoffs before resolution" color={T.red} delay={0.9} />
          <MetricCard value="Lost" label="Operational context in escalation" color={T.red} delay={1.1} />
        </div>}
      />
    </Slide>
  );
}

function FD3() {
  return (
    <Slide>
      <SectionLabel>The Model</SectionLabel>
      <SlideTitle>Forward-Deployed Operations Systems Engineering</SlideTitle>
      <AmberLine />
      <Subtitle>Inspired by Palantir's FDE model — embed technically capable engineers directly at distribution centers.</Subtitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { title: "Embedded", sub: "Not Centralized", desc: "Engineers assigned to specific sites, sitting with ops leadership. Success = operational KPIs, not ticket volume.", color: T.amber },
          { title: "Continuous", sub: "Not Project-Based", desc: "Ongoing improvement loops, rapid adaptation, persistent ownership. No hand-off, no knowledge loss.", color: T.green },
          { title: "Hybrid", sub: "Not Siloed", desc: "Combines Ops Systems Analyst, Solutions Engineer, Reliability Engineer, and Automation Engineer.", color: T.cyan },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.2 }}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "24px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.color }} />
            <div style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.white, marginBottom: 2 }}>{c.title}</div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: c.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{c.sub}</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.55 }}>{c.desc}</div>
          </motion.div>
        ))}
      </div>
    </Slide>
  );
}

function FD4() {
  return (
    <Slide>
      <SectionLabel>Role Definition</SectionLabel>
      <SlideTitle>The Forward-Deployed Operations Systems Engineer</SlideTitle>
      <AmberLine />
      <TwoCol
        left={<div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Core Competencies</motion.div>
          {["Deep WMS / WCS knowledge", "SQL and data debugging", "Integration awareness (APIs, message queues)", "Operational process fluency", "Change control & incident response discipline", "Automation & tooling development"].map((s, i) => (
            <BulletItem key={i} delay={0.5 + i * 0.12} icon="◆">{s}</BulletItem>
          ))}
        </div>}
        right={<div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Role DNA</motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ role: "Ops Systems Analyst", pct: 30 }, { role: "Solutions Engineer", pct: 25 }, { role: "Reliability Engineer", pct: 25 }, { role: "Automation Engineer", pct: 20 }].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.15 }}
                style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: T.font, fontSize: 13, color: T.white, fontWeight: 500 }}>{r.role}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.amber }}>{r.pct}%</span>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ delay: 1.0 + i * 0.15, duration: 0.8 }}
                    style={{ height: "100%", background: `linear-gradient(90deg, ${T.amber}, ${T.amber}99)`, borderRadius: 2 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>}
      />
    </Slide>
  );
}

function FD5() {
  return (
    <Slide>
      <SectionLabel>Value Proposition</SectionLabel>
      <SlideTitle>Why This Model Wins</SlideTitle>
      <AmberLine />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {[
          { icon: "⚡", title: "Faster Time-to-Fix", desc: "Eliminate ticket queues and handoff chains. Identify → implement → validate in the same shift.", color: T.amber },
          { icon: "🛡", title: "Reduced Operational Risk", desc: "On-site ownership improves MTTR, system stability during peak, and change safety.", color: T.green },
          { icon: "🏆", title: "Competitive Differentiation", desc: "Most 3PLs compete on cost. Embedded engineering differentiates on execution velocity and reliability.", color: T.cyan },
          { icon: "📈", title: "Talent Retention", desc: "Create a real technical career path. Keep strong talent close to operations.", color: T.blue },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.18 }}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "22px 22px", position: "relative" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700, color: T.white, marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.55 }}>{c.desc}</div>
            <div style={{ position: "absolute", bottom: 0, left: 20, right: 20, height: 2, background: `linear-gradient(90deg, ${c.color}66, transparent)` }} />
          </motion.div>
        ))}
      </div>
    </Slide>
  );
}

function FD6() {
  return (
    <Slide>
      <SectionLabel>Current State vs. FDOSE</SectionLabel>
      <SlideTitle>Before & After</SlideTitle>
      <AmberLine />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.red, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.red }} /> Current Model
          </div>
          {["Centralized IT — remote from operations", "Ticket-based triage — hours to days", "3–5 handoffs between ops, IT, vendors", "Knowledge lost in every escalation", "Analysts reactive, not empowered", "No technical career path on-site", "Peak = firefighting mode"].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
              style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, padding: "8px 12px", background: T.redDim, border: `1px solid ${T.red}22`, borderRadius: 6 }}>
              <span style={{ color: T.red, fontSize: 13, fontWeight: 700 }}>✕</span>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.muted }}>{s}</span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.green, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }} /> FDOSE Model
          </div>
          {["Embedded on-site — with ops leadership", "Real-time triage — same-shift resolution", "Single owner from problem to production", "Persistent context, no knowledge loss", "Engineers empowered to ship solutions", "Clear technical career progression", "Peak = pre-positioned, ready"].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
              style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, padding: "8px 12px", background: T.greenDim, border: `1px solid ${T.green}22`, borderRadius: 6 }}>
              <span style={{ color: T.green, fontSize: 13, fontWeight: 700 }}>✓</span>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.white }}>{s}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Slide>
  );
}

function FD7() {
  return (
    <Slide>
      <SectionLabel>Stakeholder Alignment</SectionLabel>
      <SlideTitle>Who Cares — and Why</SlideTitle>
      <AmberLine />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { who: "Site GM / Ops Director", focus: "Throughput, service, peak readiness", msg: "Fewer surprises. Faster recovery. Less firefighting.", color: T.amber },
          { who: "Regional Ops Leadership", focus: "Repeatability, scalability", msg: "Reusable playbooks across sites.", color: T.amber },
          { who: "IT / DTS / Ops Technology", focus: "Risk, governance, stability", msg: "Fewer escalations. Better change quality.", color: T.cyan },
          { who: "CI / Engineering", focus: "Measurable improvement", msg: "CI that ships software — not just process maps.", color: T.green },
          { who: "Solutions Design", focus: "Go-live success", msg: "Faster stabilization. Protected margins.", color: T.blue },
          { who: "HR / Talent", focus: "Retention, career paths", msg: "Technical growth without leaving ops.", color: T.muted },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 16px" }}>
            <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.white, marginBottom: 4 }}>{s.who}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: s.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{s.focus}</div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: T.muted, lineHeight: 1.5, fontStyle: "italic" }}>"{s.msg}"</div>
          </motion.div>
        ))}
      </div>
    </Slide>
  );
}

function FD8() {
  return (
    <Slide>
      <SectionLabel>Entry Points</SectionLabel>
      <SlideTitle>Where to Insert This Conversation</SlideTitle>
      <AmberLine />
      <Subtitle>Look for moments where everyone agrees something keeps breaking.</Subtitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {[
          { event: "Post-Peak Retrospectives", desc: "Same pain points surface after every peak. Leadership is most receptive to structural solutions.", icon: "📊" },
          { event: "Incident Postmortems", desc: "When root cause is 'no one owned this system' — that's the FDOSE argument.", icon: "🔍" },
          { event: "Go-Live Readiness Calls", desc: "New implementations expose the gap between Solutions Design and reality. FDOSE bridges it.", icon: "🚀" },
          { event: "CI Governance Reviews", desc: "When CI projects stall because they need technical execution — not just process mapping.", icon: "⚙️" },
        ].map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.15 }}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{e.icon}</div>
            <div>
              <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.white, marginBottom: 6 }}>{e.event}</div>
              <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{e.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Slide>
  );
}

function FD9() {
  return (
    <Slide>
      <SectionLabel>Pilot Program</SectionLabel>
      <SlideTitle>8–12 Week Proof of Concept</SlideTitle>
      <AmberLine />
      <TwoCol ratio="1.3fr 1fr"
        left={<div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Pilot Parameters</motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[{ val: "1", label: "Site" }, { val: "1", label: "Pod Lead" }, { val: "1–2", label: "Technical Resources" }, { val: "8–12", label: "Weeks" }].map((m, i) => (
              <MetricCard key={i} value={m.val} label={m.label} delay={0.5 + i * 0.12} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.green, textTransform: "uppercase", letterSpacing: "0.1em" }}>Focus: Top 3 Recurring Pain Points</motion.div>
        </div>}
        right={<div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Success Metrics</motion.div>
          {["MTTR for high-severity incidents", "Repeat incident reduction", "Manual reconciliations eliminated", "Order fallout reduction", "Peak change stability", "Ops workaround reduction"].map((m, i) => (
            <BulletItem key={i} delay={0.7 + i * 0.1} icon="◇" color={T.cyan}>{m}</BulletItem>
          ))}
        </div>}
      />
    </Slide>
  );
}

function FD10() {
  return (
    <Slide>
      <SectionLabel>Political Safety</SectionLabel>
      <SlideTitle>What This Is — and Isn't</SlideTitle>
      <AmberLine />
      <Subtitle>Framing matters. This model works within existing governance, not around it.</Subtitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
        {[
          { no: "Replacing IT", yes: "Augmenting IT with on-site technical depth" },
          { no: "Bypassing Governance", yes: "Improving change quality at the source" },
          { no: "Creating Snowflakes", yes: "Building repeatable playbooks for scale" },
        ].map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.15 }}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ color: T.red, fontFamily: T.mono, fontSize: 14, fontWeight: 700 }}>✕</span>
              <span style={{ fontFamily: T.font, fontSize: 14, color: T.red, fontWeight: 600, textDecoration: "line-through", textDecorationColor: `${T.red}66` }}>{r.no}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: T.green, fontFamily: T.mono, fontSize: 14, fontWeight: 700 }}>✓</span>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.white, fontWeight: 500 }}>{r.yes}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
        style={{ padding: "14px 24px", background: T.amberDim, border: `1px solid ${T.amber}44`, borderRadius: 8 }}>
        <span style={{ fontFamily: T.font, fontSize: 14, color: T.amber, fontWeight: 600 }}>All deliverables include documentation, playbooks, and handoff plans.</span>
      </motion.div>
    </Slide>
  );
}

function FD11() {
  return (
    <Slide>
      <SectionLabel>Roadmap</SectionLabel>
      <SlideTitle>Next Steps</SlideTitle>
      <AmberLine />
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          { step: "01", title: "Identify High-Pain Site", desc: "Select one site with recurring system pain or an upcoming major change", status: "READY" },
          { step: "02", title: "Draft Pilot Charter", desc: "One-page scope: pain points, resources, success criteria, timeline", status: "DRAFT" },
          { step: "03", title: "Secure Ops Sponsor", desc: "Site GM or Ops Director who will champion the pilot internally", status: "TARGET" },
          { step: "04", title: "Align IT Early", desc: "Pre-emptive conversation to establish collaboration, not competition", status: "TARGET" },
          { step: "05", title: "Execute, Measure, Document", desc: "Run the 8–12 week pilot. Prove ROI. Package the playbook.", status: "EXECUTE" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.18 }}
            style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.amberDim, border: `2px solid ${T.amber}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.amber, flexShrink: 0 }}>{s.step}</div>
              {i < 4 && <div style={{ width: 2, flex: 1, background: T.border, minHeight: 20 }} />}
            </div>
            <div style={{ paddingBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.white }}>{s.title}</span>
                <PillTag color={s.status === "READY" ? T.green : s.status === "EXECUTE" ? T.amber : T.muted} delay={0.5 + i * 0.18}>{s.status}</PillTag>
              </div>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.muted }}>{s.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Slide>
  );
}

function FD12() {
  return (
    <Slide>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          style={{ padding: "28px 48px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, display: "inline-block", position: "relative", marginBottom: 32 }}>
          <div style={{ position: "absolute", top: -6, left: 48, fontSize: 36, color: T.amber, fontFamily: "Georgia, serif" }}>"</div>
          <p style={{ fontFamily: T.font, fontSize: 22, color: T.white, lineHeight: 1.6, fontStyle: "italic", fontWeight: 500, maxWidth: 600 }}>
            Logistics is already bespoke. Embedding technical operators acknowledges reality and turns it into a competitive advantage.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
            {["Faster", "Safer", "Smarter", "Repeatable"].map((w, i) => (
              <PillTag key={i} color={T.amber} delay={1.4 + i * 0.1}>{w}</PillTag>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.0, duration: 0.8 }}
          style={{ height: 3, width: 200, background: T.amber, margin: "0 auto 20px", transformOrigin: "center", boxShadow: `0 0 20px ${T.amberGlow}` }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
          style={{ fontFamily: T.mono, fontSize: 13, color: T.gray }}>Stephen Talley &nbsp;|&nbsp; Sr. Operations Systems Analyst &nbsp;|&nbsp; DHL Supply Chain</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}
          style={{ fontFamily: T.mono, fontSize: 11, color: T.border, marginTop: 8 }}>FDOSE — Forward-Deployed Operations Systems Engineering</motion.p>
      </div>
    </Slide>
  );
}

const FD_SLIDES = [FD1, FD2, FD3, FD4, FD5, FD6, FD7, FD8, FD9, FD10, FD11, FD12];

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function PresentationHub() {
  const [deck, setDeck] = useState("rebuttal");
  const [slide, setSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  const isRebuttal = deck === "rebuttal";
  const scenes = isRebuttal ? PR_SCENES : FD_SLIDES;
  const total = scenes.length;

  // Reset slide when switching decks
  const switchDeck = (d) => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    clearInterval(elapsedRef.current);
    setDeck(d);
    setSlide(0);
    setElapsed(0);
  };

  const prev = useCallback(() => setSlide((s) => Math.max(0, s - 1)), []);
  const next = useCallback(() => {
    setSlide((s) => {
      if (s < total - 1) return s + 1;
      setIsPlaying(false);
      return s;
    });
    setElapsed(0);
  }, [total]);

  // Autoplay for rebuttal deck
  useEffect(() => {
    if (isPlaying && isRebuttal) {
      timerRef.current = setTimeout(next, PR_DURATIONS[slide]);
      elapsedRef.current = setInterval(() => setElapsed((e) => e + 100), 100);
    }
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(elapsedRef.current);
    };
  }, [isPlaying, slide, next, isRebuttal]);

  const togglePlay = () => {
    if (slide === total - 1 && !isPlaying) {
      setSlide(0);
      setElapsed(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const CurrentSlide = scenes[slide];

  return (
    <div style={{
      width: "100vw", height: "100vh", background: T.bg, fontFamily: T.font,
      overflow: "hidden", position: "relative", color: T.white,
    }}>
      <GridBg />
      <DeckToggle active={deck} onToggle={switchDeck} />
      <ProgressBar current={slide} total={total} />
      <NavControls current={slide} total={total} onPrev={prev} onNext={next}
        isPlaying={isPlaying} onTogglePlay={togglePlay} hasAutoplay={isRebuttal} />

      <AnimatePresence mode="wait">
        <motion.div key={`${deck}-${slide}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
