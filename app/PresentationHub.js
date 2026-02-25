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
      {["rebuttal", "fdose", "intent"].map((id) => {
        const isActive = active === id;
        const label = id === "rebuttal" ? "REBUTTAL" : id === "fdose" ? "FDOSE" : "INTENT";
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
  const deficits = [
    { text: "No SOPs", warn: false }, { text: "No LSWs", warn: false }, { text: "No EOS Reporting", warn: false },
    { text: "No Knowledge Base", warn: false }, { text: "No Onboarding", warn: false }, { text: "Minimal Technical Guidance", warn: true },
  ];
  return (
    <Slide>
      <SectionLabel>The Starting Point</SectionLabel>
      <SlideTitle>October 21, 2024 — Day One.</SlideTitle>
      <AmberLine />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
        {deficits.map((item, i) => {
          const isWarn = item.warn;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.25 }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: isWarn ? T.amberDim : T.redDim, border: `1px solid ${isWarn ? T.amber + "33" : T.red + "33"}`, borderRadius: 6 }}>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 + i * 0.25, type: "spring" }}
                style={{ color: isWarn ? T.amber : T.red, fontSize: 18, fontWeight: 700 }}>{isWarn ? "⚠" : "✕"}</motion.span>
              <span style={{ fontFamily: T.font, fontSize: 15, color: T.white, textDecoration: isWarn ? "none" : "line-through", textDecorationColor: T.red + "88" }}>{item.text}</span>
            </motion.div>
          );
        })}
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
      <SectionLabel>Taking Initiative</SectionLabel>
      <SlideTitle>14 Months of Ownership.</SlideTitle>
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
        <span style={{ fontFamily: T.font, fontSize: 16, color: T.white, fontWeight: 500 }}>instances of taking initiative to solve problems</span>
      </motion.div>
    </Slide>
  );
}

function PR4() {
  const deliverables = [
    { label: "Putaway Logic", result: "Owned & Delivered" }, { label: "PA Code Validation", result: "Owned & Delivered" },
    { label: "GS1 Parsing", result: "Owned & Delivered" }, { label: "ERP Phase 2", result: "Owned & Delivered" },
    { label: "Layerpick Thresholds", result: "Owned & Delivered" }, { label: "RCH Logic", result: "Owned & Delivered" },
    { label: "MDF Cleanup", result: "Owned & Resolved" },
  ];
  return (
    <Slide>
      <SectionLabel>2025 Technical Deliverables</SectionLabel>
      <SlideTitle>Identified. Owned. Delivered.</SlideTitle>
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
        <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.green }}>Full Ownership From Identification Through Deployment</span>
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
  const steps = [
    { text: "Critical SQL", type: "neutral" },
    { text: "Limited Peer Review", type: "gap" },
    { text: "No Staging Environment", type: "gap" },
    { text: "Bandwidth Constraints", type: "gap" },
    { text: "Production", type: "neutral" },
  ];
  return (
    <Slide>
      <SectionLabel>Process Validation Gaps</SectionLabel>
      <SlideTitle>Delivering Through Bandwidth Constraints.</SlideTitle>
      <AmberLine />
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36, flexWrap: "wrap", justifyContent: "center" }}>
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.3 }} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ padding: "10px 16px", background: step.type === "gap" ? T.amberDim : T.card, border: `1px solid ${step.type === "gap" ? T.amber + "44" : T.border}`, borderRadius: 6, position: "relative" }}>
              <span style={{ fontFamily: T.mono, fontSize: 13, color: step.type === "gap" ? T.amber : T.white, fontWeight: 600 }}>{step.text}</span>
              {step.type === "gap" && (
                <motion.div animate={{ boxShadow: [`0 0 4px ${T.amber}22`, `0 0 10px ${T.amber}44`, `0 0 4px ${T.amber}22`] }}
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
        style={{ padding: "16px 28px", background: T.amberDim, border: `1px solid ${T.amber}55`, borderRadius: 8, textAlign: "center" }}>
        <span style={{ fontFamily: T.font, fontSize: 15, color: T.amber, fontWeight: 600 }}>
          Code & document review processes limited by team bandwidth — an opportunity for structured improvement, not a reflection of individual effort.
        </span>
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
            <span style={{ color: T.amber, fontWeight: 700 }}>14 months.</span> Challenging baseline. Always building, always improving.<br />
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

// ═══════════════════════════════════════════════════════════════
// DECK 3: INTENT ENGINEERING (18 SLIDES)
// ═══════════════════════════════════════════════════════════════

function CSlide({ children }) {
  return <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "50px 60px 70px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>{children}</div>;
}

function QuoteBlock({ text, author, d = 0 }) {
  return <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d, duration: 0.8 }}
    style={{ padding: "22px 32px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, position: "relative", marginBottom: 20 }}>
    <div style={{ position: "absolute", top: -6, left: 28, fontSize: 30, color: T.amber, fontFamily: "Georgia, serif" }}>"</div>
    <p style={{ fontFamily: T.font, fontSize: 15, color: T.white, lineHeight: 1.6, fontStyle: "italic" }}>{text}</p>
    {author && <p style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, marginTop: 10 }}>— {author}</p>}
  </motion.div>;
}

function IE01() {
  return <CSlide>
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
      style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <PillTag color={T.muted} delay={0.3}>PROMPT</PillTag>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: T.gray, fontSize: 20 }}>→</motion.span>
      <PillTag color={T.cyan} delay={0.6}>CONTEXT</PillTag>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ color: T.gray, fontSize: 20 }}>→</motion.span>
      <PillTag color={T.amber} delay={1.0}>INTENT</PillTag>
    </motion.div>
    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
      style={{ fontFamily: T.font, fontSize: 42, fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 12 }}>
      Intent Engineering
    </motion.h1>
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.8, duration: 0.8 }}
      style={{ height: 3, width: 280, background: T.amber, transformOrigin: "center", margin: "0 auto 18px", boxShadow: `0 0 20px ${T.amberGlow}` }} />
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}
      style={{ fontFamily: T.font, fontSize: 17, color: T.muted, maxWidth: 560, lineHeight: 1.6 }}>
      The discipline of making organizational purpose — goals, values, tradeoffs, decision boundaries — machine-readable and machine-actionable.
    </motion.p>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}
      style={{ fontFamily: T.mono, fontSize: 11, color: T.gray, marginTop: 20 }}>
      Based on Nate B. Jones &nbsp;|&nbsp; AI News & Strategy Daily
    </motion.p>
  </CSlide>;
}

function IE02() {
  return <CSlide>
    <SectionLabel>The Klarna Story</SectionLabel>
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
      style={{ fontFamily: T.font, fontSize: 38, fontWeight: 700, color: T.white, lineHeight: 1.2, marginTop: 10, marginBottom: 20 }}>
      The AI Didn't Fail.<br /><span style={{ color: T.red }}>It Succeeded at the Wrong Thing.</span>
    </motion.h1>
    <AmberLine delay={0.6} width={300} />
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
      style={{ fontFamily: T.font, fontSize: 16, color: T.muted, maxWidth: 600, lineHeight: 1.7 }}>
      In January 2026, Klarna reported its AI agent now does the work of 853 full-time employees and saved $60 million. In the same earnings cycle, its CEO admitted the AI strategy had cost something far more valuable — and he's still trying to buy it back.
    </motion.p>
  </CSlide>;
}

function IE03() {
  return <Slide>
    <SectionLabel>Klarna — The Numbers</SectionLabel>
    <SlideTitle>Everything Looked Perfect on Paper</SlideTitle>
    <AmberLine />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
      <MetricCard value="2.3M" label="Conversations handled in first month" color={T.green} delay={0.4} />
      <MetricCard value="23" label="Markets deployed across" color={T.green} delay={0.5} />
      <MetricCard value="35" label="Languages supported" color={T.green} delay={0.6} />
      <MetricCard value="11→2 min" label="Resolution time drop" color={T.green} delay={0.7} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
      <MetricCard value="853" label="FTE-equivalent work replaced" color={T.amber} delay={0.8} />
      <MetricCard value="$60M" label="Projected savings" color={T.amber} delay={0.9} />
      <MetricCard value="700" label="Human agents laid off" color={T.red} delay={1.0} />
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
      style={{ padding: "12px 20px", background: T.redDim, border: `1px solid ${T.red}33`, borderRadius: 8, textAlign: "center" }}>
      <span style={{ fontFamily: T.font, fontSize: 14, color: T.red, fontWeight: 600 }}>Then customers started complaining. Generic answers. Robotic tone. No judgment.</span>
    </motion.div>
  </Slide>;
}

function IE04() {
  return <Slide>
    <SectionLabel>The Real Failure</SectionLabel>
    <SlideTitle>Two Profoundly Different Goals</SlideTitle>
    <AmberLine />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        style={{ background: T.redDim, border: `1px solid ${T.red}33`, borderRadius: 10, padding: "22px 20px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.red }} /> What the Agent Optimized For
        </div>
        <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.white, marginBottom: 8 }}>Resolve tickets fast.</div>
        <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.5 }}>Measurable. Optimizable. And completely wrong.</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
        style={{ background: T.greenDim, border: `1px solid ${T.green}33`, borderRadius: 10, padding: "22px 20px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }} /> What the Organization Actually Needed
        </div>
        <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.white, marginBottom: 8 }}>Build lasting customer relationships.</div>
        <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.5 }}>Drive lifetime value in a competitive fintech market.</div>
      </motion.div>
    </div>
    <QuoteBlock d={0.9} text="While cost was a predominant evaluation factor, the result was lower quality." author="Sebastian Siemiatkowski, CEO, Klarna — Bloomberg" />
  </Slide>;
}

function IE05() {
  return <Slide>
    <SectionLabel>The Missing Layer</SectionLabel>
    <SlideTitle>The Agent Had Context. It Did Not Have Intent.</SlideTitle>
    <AmberLine />
    <Subtitle>A human agent with 5 years at the company knows intuitively when to bend a policy, when to spend three extra minutes because a customer's tone says they're about to churn, when efficiency is the right move versus when generosity is.</Subtitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {["She absorbed Klarna's real values — not the ones on the website", "The ones encoded in decisions managers make every day", "The stories veterans tell new hires", "The unwritten rules about which metrics leadership actually cares about", "The 700 agents who were laid off took this knowledge with them — undocumented"].map((s, i) => (
        <BulletItem key={i} delay={0.5 + i * 0.15} icon="◆">{s}</BulletItem>
      ))}
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
      style={{ padding: "14px 22px", background: T.amberDim, border: `1px solid ${T.amber}44`, borderRadius: 8, marginTop: 16 }}>
      <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.amber }}>The age of "humans just know" is ending. Intent engineering makes what humans know explicit, structured, and machine-actionable.</span>
    </motion.div>
  </Slide>;
}

function IE06() {
  return <Slide>
    <SectionLabel>The Evolution</SectionLabel>
    <SlideTitle>Three Disciplines. Three Eras.</SlideTitle>
    <AmberLine />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {[
        { era: "01", title: "Prompt Engineering", sub: "2022–2024", desc: "Individual, synchronous, session-based. You sit in front of the chat window, craft an instruction, iterate. Personal skill, personal value.", status: "WARM-UP ACT", color: T.muted, q: "How do I talk to AI?" },
        { era: "02", title: "Context Engineering", sub: "2024–2025", desc: "Building RAG pipelines, wiring MCP servers, structuring organizational knowledge. Tells agents what to know. Necessary — but not sufficient.", status: "CURRENT ERA", color: T.cyan, q: "What does AI need to know?" },
        { era: "03", title: "Intent Engineering", sub: "2026+", desc: "Encoding organizational purpose into infrastructure. Not prose in a system prompt — structured, actionable parameters that shape autonomous decisions.", status: "WHAT'S NEXT", color: T.amber, q: "What does the organization need AI to want?" },
      ].map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.25 }}
          style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "22px 18px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.color }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 700, color: c.color }}>{c.era}</span>
            <PillTag color={c.color} delay={0.6 + i * 0.25}>{c.status}</PillTag>
          </div>
          <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700, color: T.white, marginBottom: 4 }}>{c.title}</div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: c.color, marginBottom: 12 }}>{c.sub}</div>
          <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, lineHeight: 1.55, marginBottom: 14 }}>{c.desc}</div>
          <div style={{ padding: "8px 12px", background: `${c.color}12`, border: `1px solid ${c.color}33`, borderRadius: 6 }}>
            <span style={{ fontFamily: T.font, fontSize: 12, color: c.color, fontWeight: 600, fontStyle: "italic" }}>"{c.q}"</span>
          </div>
        </motion.div>
      ))}
    </div>
  </Slide>;
}

function IE07() {
  return <Slide>
    <SectionLabel>The Intent Gap — Data</SectionLabel>
    <SlideTitle>Massive Investment. Mixed Results.</SlideTitle>
    <AmberLine />
    <TwoCol ratio="1fr 1fr"
      left={<div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontFamily: T.mono, fontSize: 11, color: T.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>The Investment (Real)</motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { val: "57%", desc: "Putting 21–50% of digital transformation budgets into AI" },
            { val: "$700M", desc: "Average AI spend for a $13B-revenue company" },
            { val: "85%", desc: "Fortune 500 companies adopted Microsoft Copilot" },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }}
              style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", background: T.greenDim, border: `1px solid ${T.green}22`, borderRadius: 6 }}>
              <span style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 700, color: T.green, minWidth: 70, textAlign: "right" }}>{m.val}</span>
              <span style={{ fontFamily: T.font, fontSize: 12, color: T.white }}>{m.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>}
      right={<div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: T.mono, fontSize: 11, color: T.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>The Results (Painful)</motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { val: "74%", desc: "Have yet to see tangible value from AI" },
            { val: "30%", desc: "Of AI pilots failed to achieve scaled impact (McKinsey)" },
            { val: "84%", desc: "Have not redesigned jobs around AI capabilities" },
            { val: "21%", desc: "Have a mature model for agent governance (Deloitte)" },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.15 }}
              style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", background: T.redDim, border: `1px solid ${T.red}22`, borderRadius: 6 }}>
              <span style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 700, color: T.red, minWidth: 70, textAlign: "right" }}>{m.val}</span>
              <span style={{ fontFamily: T.font, fontSize: 12, color: T.muted }}>{m.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>}
    />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      style={{ padding: "12px 20px", background: T.amberDim, border: `1px solid ${T.amber}44`, borderRadius: 8, textAlign: "center", marginTop: 20 }}>
      <span style={{ fontFamily: T.font, fontSize: 13, color: T.amber, fontWeight: 600 }}>These numbers coexist. There is no contradiction — just an unsolved intent gap.</span>
    </motion.div>
  </Slide>;
}

function IE08() {
  return <Slide>
    <SectionLabel>Case Study #2</SectionLabel>
    <SlideTitle>Microsoft Copilot — The $40B Intent Failure</SlideTitle>
    <AmberLine />
    <Subtitle>One of the most heavily invested enterprise AI products in history. Billions in infrastructure. AI in every Office app. Aggressive enterprise sales.</Subtitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
      <MetricCard value="85%" label="Fortune 500 adopted" color={T.green} delay={0.5} />
      <MetricCard value="5%" label="Moved beyond pilot (Gartner)" color={T.red} delay={0.6} />
      <MetricCard value="~3%" label="M365 users actually using Copilot" color={T.red} delay={0.7} />
      <MetricCard value="Slashed" label="Internal sales targets (Bloomberg)" color={T.red} delay={0.8} />
    </div>
    <QuoteBlock d={1.0} text="Deploying an AI tool across an organization without organizational intent alignment is like hiring 40,000 new employees and never telling them what the company does, what it values, or how to make decisions." author="Nate B. Jones" />
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.5, textAlign: "center" }}>
      You get lots of activity and not much productivity. AI usage metrics on a dashboard and almost no measurable impact. <span style={{ color: T.amber, fontWeight: 600 }}>That's not a tools problem. That's an intent gap.</span>
    </motion.p>
  </Slide>;
}

function IE09() {
  return <CSlide>
    <SectionLabel delay={0}>The Core Problem</SectionLabel>
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
      style={{ fontFamily: T.font, fontSize: 28, fontWeight: 700, color: T.white, lineHeight: 1.3, marginTop: 10, marginBottom: 24, maxWidth: 700 }}>
      Organizations have solved <span style={{ color: T.green }}>"Can AI do this task?"</span><br />
      They have completely failed to solve <span style={{ color: T.red }}>"Can AI do this task in a way that serves our organizational goals at scale with appropriate judgment?"</span>
    </motion.h1>
    <AmberLine delay={0.8} width={300} />
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
      style={{ fontFamily: T.font, fontSize: 18, color: T.amber, fontWeight: 700 }}>
      That second question is an intent engineering question.
    </motion.p>
  </CSlide>;
}

function IE10() {
  return <Slide>
    <SectionLabel>The Three Layers</SectionLabel>
    <SlideTitle>Closing the Intent Gap</SlideTitle>
    <AmberLine />
    <Subtitle>Getting any one right is helpful. Getting all three right is the difference between having AI tools and having an AI-native organization.</Subtitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { num: "01", title: "Unified Context Infrastructure", desc: "The connective tissue between data and agents. MCP, RAG pipelines, data governance, semantic consistency. The layer the industry is most aware of — and still hasn't built.", color: T.cyan, status: "BUILDING" },
        { num: "02", title: "Coherent AI Worker Toolkit", desc: "Shared workflows, sanctioned tools, organizational capability maps. The difference between individual AI use and organizational AI leverage. 30% gains vs 300% gains.", color: T.blue, status: "NASCENT" },
        { num: "03", title: "Intent Engineering Proper", desc: "Machine-readable organizational purpose. Goal translation, decision boundaries, value hierarchies, delegation frameworks, feedback loops. The layer that almost certainly doesn't exist in your business.", color: T.amber, status: "WHITESPACE" },
      ].map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.2 }}
          style={{ display: "flex", gap: 18, padding: "16px 20px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, alignItems: "center" }}>
          <div style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 700, color: l.color, minWidth: 50, textAlign: "center" }}>{l.num}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.white }}>{l.title}</span>
              <PillTag color={l.color} delay={0.6 + i * 0.2}>{l.status}</PillTag>
            </div>
            <span style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>{l.desc}</span>
          </div>
          <div style={{ width: 4, height: 50, borderRadius: 2, background: l.color, opacity: 0.6 }} />
        </motion.div>
      ))}
    </div>
  </Slide>;
}

function IE11() {
  return <Slide>
    <SectionLabel>Layer 1 Deep Dive</SectionLabel>
    <SlideTitle>Unified Context Infrastructure</SlideTitle>
    <AmberLine />
    <TwoCol ratio="1.3fr 1fr"
      left={<div>
        <Subtitle delay={0.3}>Right now, every team building agents rolls their own context stack. This mirrors the shadow IT crisis of the early cloud era — except agents don't just access data, they act on it.</Subtitle>
        <BulletItem delay={0.5} icon="⚠" color={T.red}>One team pipes Slack through a custom RAG pipeline</BulletItem>
        <BulletItem delay={0.6} icon="⚠" color={T.red}>Another manually exports Google Docs into a vector store</BulletItem>
        <BulletItem delay={0.7} icon="⚠" color={T.red}>A third built MCP for Salesforce but not Jira</BulletItem>
        <BulletItem delay={0.8} icon="⚠" color={T.red}>A fourth team doesn't know the other three exist</BulletItem>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, marginTop: 14 }}>
          ≈50% of orgs cite data searchability as top AI blocker (Deloitte 2025)
        </motion.div>
      </div>}
      right={<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Questions That Must Be Answered</motion.div>
        {["Which systems become agent-accessible?", "Who decides what context an agent can see across departments?", "How do you version organizational knowledge?", "How do you handle conflicting institutional assumptions across teams?"].map((q, i) => (
          <BulletItem key={i} delay={0.8 + i * 0.12} icon="?" color={T.cyan}>{q}</BulletItem>
        ))}
      </div>}
    />
  </Slide>;
}

function IE12() {
  return <Slide>
    <SectionLabel>Layer 2 Deep Dive</SectionLabel>
    <SlideTitle>Coherent AI Worker Toolkit</SlideTitle>
    <AmberLine />
    <Subtitle>The difference between individual AI use and organizational AI leverage is enormous. One good hire vs. a system that makes everybody better.</Subtitle>
    <TwoCol
      left={<div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontFamily: T.mono, fontSize: 11, color: T.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Today's Reality</motion.div>
        {["Person A uses Claude for research + ChatGPT for drafting", "Person B uses Cursor for code + Perplexity for facts", "Person C built a custom LangGraph agent chain", "Person D is copy-pasting into a chat window", "None can articulate their workflow transferably"].map((s, i) => (
          <BulletItem key={i} delay={0.5 + i * 0.1} icon="✕" color={T.red}>{s}</BulletItem>
        ))}
      </div>}
      right={<div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: T.mono, fontSize: 11, color: T.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>What's Needed</motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MetricCard value="30%" label="Gains from bolting AI onto existing workflows" color={T.muted} delay={0.7} />
          <MetricCard value="300%" label="Gains from rethinking workflows around AI" color={T.green} delay={0.8} />
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          style={{ fontFamily: T.font, fontSize: 13, color: T.muted, marginTop: 14, lineHeight: 1.5 }}>
          Fluency doesn't scale through training alone. It scales through <span style={{ color: T.green, fontWeight: 600 }}>shared infrastructure</span> — sanctioned tools, capability maps, and organizational context.
        </motion.p>
      </div>}
    />
  </Slide>;
}

function IE13() {
  return <Slide>
    <SectionLabel>Layer 3 Deep Dive</SectionLabel>
    <SlideTitle>Intent Engineering Proper</SlideTitle>
    <AmberLine />
    <Subtitle>OKRs were designed for people. They assume human judgment. Agents don't absorb culture through osmosis, all-hands meetings, or hallway conversations. They need explicit alignment before they start working.</Subtitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {[
        { title: "Goal Translation", desc: "Not 'increase customer satisfaction.' Agent needs: What signals indicate satisfaction? What data sources? What actions am I authorized to take? What trade-offs can I make?", color: T.amber, icon: "🎯" },
        { title: "Delegation Frameworks", desc: "Tenants translated into decision boundaries. When request X conflicts with policy Y — here's the resolution hierarchy. Encoded judgment, not rules.", color: T.cyan, icon: "⚖️" },
        { title: "Feedback Loops", desc: "When an agent makes a decision, was it aligned with intent? How do we know? How do we measure and correct alignment drift over time?", color: T.green, icon: "🔄" },
      ].map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.2 }}
          style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.color }} />
          <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
          <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 8 }}>{c.title}</div>
          <div style={{ fontFamily: T.font, fontSize: 12.5, color: T.muted, lineHeight: 1.55 }}>{c.desc}</div>
        </motion.div>
      ))}
    </div>
  </Slide>;
}

function IE14() {
  return <Slide>
    <SectionLabel>The Human Agent vs. The AI Agent</SectionLabel>
    <SlideTitle>What 5 Years of Osmosis Encodes</SlideTitle>
    <AmberLine />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        style={{ background: T.greenDim, border: `1px solid ${T.green}33`, borderRadius: 10, padding: "20px 18px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Human Agent — 5 Years</div>
        {["When to bend a policy", "When to spend 3 extra minutes on a frustrated customer", "When efficiency is right vs. when generosity is right", "Which metrics leadership actually cares about", "Stories veterans tell new hires", "Decisions managers make in ambiguous situations"].map((s, i) => (
          <BulletItem key={i} delay={0.5 + i * 0.1} icon="✓" color={T.green}>{s}</BulletItem>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
        style={{ background: T.redDim, border: `1px solid ${T.red}33`, borderRadius: 10, padding: "20px 18px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>AI Agent — Day One</div>
        {["Has a prompt", "Has context", "Does NOT have intent", "Does NOT absorb culture through osmosis", "Does NOT learn from hallway conversations", "Will optimize for whatever it can measure"].map((s, i) => (
          <BulletItem key={i} delay={0.7 + i * 0.1} icon="✕" color={T.red}>{s}</BulletItem>
        ))}
      </motion.div>
    </div>
  </Slide>;
}

function IE15() {
  return <Slide>
    <SectionLabel>Why This Hasn't Been Built</SectionLabel>
    <SlideTitle>Three Structural Blockers</SlideTitle>
    <AmberLine />
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { num: "1", title: "It's Genuinely New", desc: "Before agents ran autonomously over weeks and months, we didn't need this. The human was the intent layer. Long-running agents break that model entirely.", color: T.amber },
        { num: "2", title: "The Two Cultures Problem", desc: "People who understand organizational strategy (executives) aren't building agents. People building agents (engineers) don't understand organizational strategy. MIT found AI investment is still viewed as a tech challenge for the CIO.", color: T.cyan },
        { num: "3", title: "It's Extremely Hard", desc: "Goals live in slide decks, half-read OKR documents, leadership principles cited in performance reviews but never operationalized, and the tacit knowledge of experienced employees. Nobody has strong muscles here.", color: T.red },
      ].map((b, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.2 }}
          style={{ display: "flex", gap: 18, padding: "16px 20px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${b.color}18`, border: `2px solid ${b.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono, fontSize: 18, fontWeight: 700, color: b.color, flexShrink: 0 }}>{b.num}</div>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 4 }}>{b.title}</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.55 }}>{b.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </Slide>;
}

function IE16() {
  return <Slide>
    <SectionLabel>The Solution Architecture</SectionLabel>
    <SlideTitle>What Must Be Built</SlideTitle>
    <AmberLine />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {[
        { title: "Infrastructure Level", items: ["Composable, vendor-agnostic architecture", "MCP as protocol layer + organizational decisions", "Data governance, access controls, freshness guarantees", "Treat like data warehouse strategy in 2010s — core strategic investment"], color: T.cyan, role: "AI Infrastructure Architect" },
        { title: "Workflow Level", items: ["Organizational capability map for AI", "Which workflows are agent-ready vs. agent-augmented vs. human-only", "Living operating system, not a static Confluence doc", "Evolves as agent capabilities improve"], color: T.blue, role: "AI Workflow Architect" },
        { title: "Alignment Level", items: ["Goal translation infrastructure", "Decision boundaries + escalation logic", "Value hierarchies for resolving trade-offs", "Feedback loops measuring alignment drift"], color: T.amber, role: "Intent Engineering Lead" },
      ].map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.2 }}
          style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "18px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.color }} />
          <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.white, marginBottom: 10 }}>{c.title}</div>
          {c.items.map((item, j) => <BulletItem key={j} delay={0.6 + i * 0.2 + j * 0.08} icon="▸" color={c.color}>{item}</BulletItem>)}
          <div style={{ marginTop: 10, padding: "6px 10px", background: `${c.color}12`, border: `1px solid ${c.color}33`, borderRadius: 6 }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: c.color, fontWeight: 600 }}>NEW ROLE: {c.role}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </Slide>;
}

function IE17() {
  return <CSlide>
    <SectionLabel delay={0}>The Race Has Changed</SectionLabel>
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
      style={{ fontFamily: T.font, fontSize: 30, fontWeight: 700, color: T.white, lineHeight: 1.3, marginTop: 10, marginBottom: 20, maxWidth: 700 }}>
      It's No Longer an <span style={{ color: T.muted, textDecoration: "line-through", textDecorationColor: `${T.muted}66` }}>Intelligence Race</span>.<br />
      It's an <span style={{ color: T.amber }}>Intent Race</span>.
    </motion.h1>
    <AmberLine delay={0.8} width={300} />
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
      style={{ fontFamily: T.font, fontSize: 15, color: T.muted, maxWidth: 600, lineHeight: 1.65, marginBottom: 20 }}>
      The frontier models — Opus 4.6, Gemini 3, GPT 5.2 — are all extraordinarily capable. The differences between them matter far less than the differences between organizations that give them clear, structured, goal-aligned intent and organizations that don't.
    </motion.p>
    <QuoteBlock d={1.4} text="A company with a mediocre model and extraordinary organizational intent infrastructure will outperform a company with a frontier model and fragmented, unaligned organizational knowledge. Every single time." author="Nate B. Jones" />
  </CSlide>;
}

function IE18() {
  return <CSlide>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
      style={{ padding: "28px 44px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, position: "relative", marginBottom: 28 }}>
      <div style={{ position: "absolute", top: -6, left: 40, fontSize: 36, color: T.amber, fontFamily: "Georgia, serif" }}>"</div>
      <p style={{ fontFamily: T.font, fontSize: 18, color: T.white, lineHeight: 1.7, fontStyle: "italic", fontWeight: 500, maxWidth: 600 }}>
        Context without intent is a loaded weapon with no target. We've spent years building AI systems. 2026 is the year we learn to aim them.
      </p>
      <p style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, marginTop: 12 }}>— Nate B. Jones</p>
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      <PillTag color={T.muted} delay={1.6}>PROMPT → Talk to AI</PillTag>
      <PillTag color={T.cyan} delay={1.8}>CONTEXT → What AI knows</PillTag>
      <PillTag color={T.amber} delay={2.0}>INTENT → What AI wants</PillTag>
    </motion.div>
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.3, duration: 0.8 }}
      style={{ height: 3, width: 200, background: T.amber, transformOrigin: "center", marginBottom: 18, boxShadow: `0 0 20px ${T.amberGlow}` }} />
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}
      style={{ fontFamily: T.font, fontSize: 15, color: T.muted, fontWeight: 500 }}>
      Build for long-term intent. <span style={{ color: T.amber, fontWeight: 700 }}>The clock is running.</span>
    </motion.p>
  </CSlide>;
}

const IE_SLIDES = [IE01, IE02, IE03, IE04, IE05, IE06, IE07, IE08, IE09, IE10, IE11, IE12, IE13, IE14, IE15, IE16, IE17, IE18];

// ─── SPEAKER SCRIPTS FOR INTENT ENGINEERING DECK ───
const IE_SCRIPTS = [
  // IE01 — Title
  `Welcome. Today we're going to talk about something that I believe is the most important — and most overlooked — challenge in enterprise AI right now. It's called Intent Engineering. Not prompt engineering. Not context engineering. Intent engineering — the discipline of making organizational purpose, your goals, your values, your tradeoffs, your decision boundaries, machine-readable and machine-actionable. This concept comes from Nate B. Jones and his work on AI News and Strategy Daily, and I think it perfectly frames where we are and where we need to go.`,

  // IE02 — Klarna Story
  `Let me start with a story. In January 2026, Klarna — the buy-now-pay-later fintech company — reported that its AI customer service agent now does the work of 853 full-time employees. It saved them 60 million dollars. Sounds like a massive success, right? But in the same earnings cycle, Klarna's CEO admitted something remarkable. The AI strategy had cost them something far more valuable than those savings — and he's still trying to buy it back. The AI didn't fail. It succeeded. It just succeeded at the wrong thing.`,

  // IE03 — Klarna Numbers
  `Let's look at the numbers, because on paper, everything looked perfect. 2.3 million conversations handled in the first month. Deployed across 23 markets, supporting 35 languages. Resolution time dropped from 11 minutes to 2 minutes. The AI was doing the work of 853 full-time equivalents and projecting 60 million dollars in savings. But here's the number that matters most — 700 human agents were laid off. And then customers started complaining. Generic answers. Robotic tone. No judgment. The metrics were green, but the experience was broken.`,

  // IE04 — Two Goals
  `Here's what actually happened. The AI agent was optimizing for one thing: resolve tickets fast. That's measurable. That's optimizable. And it was completely wrong. What the organization actually needed was to build lasting customer relationships — to drive lifetime value in a competitive fintech market. As Klarna's CEO Sebastian Siemiatkowski told Bloomberg: "While cost was a predominant evaluation factor, the result was lower quality." The agent was given a goal, and it achieved that goal perfectly. It was just the wrong goal.`,

  // IE05 — Missing Layer
  `Here's the deeper insight. The agent had context — it had access to knowledge bases, customer data, policies. What it did not have was intent. A human agent with 5 years at the company knows intuitively when to bend a policy, when to spend three extra minutes because a customer's tone says they're about to churn, when efficiency is the right move versus when generosity is. She absorbed Klarna's real values — not the ones on the website, but the ones encoded in decisions managers make every day. The stories veterans tell new hires. The unwritten rules about which metrics leadership actually cares about. Those 700 agents who were laid off took all of this knowledge with them — completely undocumented. The age of "humans just know" is ending. Intent engineering makes what humans know explicit, structured, and machine-actionable.`,

  // IE06 — Three Eras
  `Let's zoom out and look at the evolution. We've gone through three distinct disciplines. First, prompt engineering — 2022 to 2024 — which was individual, synchronous, session-based. You sit in front of a chat window, craft an instruction, iterate. The question was simply: how do I talk to AI? Then context engineering — 2024 to 2025 — building RAG pipelines, wiring MCP servers, structuring organizational knowledge. This tells agents what to know. It's necessary, but not sufficient. The question was: what does AI need to know? Now we're entering the era of intent engineering — 2026 and beyond. This is about encoding organizational purpose into infrastructure. Not prose in a system prompt — structured, actionable parameters that shape autonomous decisions. The question now is: what does the organization need AI to want?`,

  // IE07 — Intent Gap Data
  `Let me show you just how wide this intent gap is with real data. On the investment side, the numbers are staggering. 57 percent of organizations are putting 21 to 50 percent of their digital transformation budgets into AI. The average AI spend for a 13-billion-dollar revenue company is 700 million dollars. 85 percent of Fortune 500 companies have adopted Microsoft Copilot. But look at the results. 74 percent have yet to see tangible value from AI. 30 percent of AI pilots failed to achieve scaled impact according to McKinsey. 84 percent have not redesigned jobs around AI capabilities. And only 21 percent have a mature model for agent governance according to Deloitte. These numbers coexist. There is no contradiction — just an unsolved intent gap.`,

  // IE08 — Microsoft Copilot
  `Let's look at a second case study — Microsoft Copilot, arguably the most heavily invested enterprise AI product in history. Billions in infrastructure. AI embedded in every Office app. Aggressive enterprise sales. 85 percent of Fortune 500 companies adopted it. But only 5 percent have moved beyond pilot according to Gartner. Roughly 3 percent of Microsoft 365 users are actually using Copilot regularly. And Bloomberg reported that Microsoft slashed its internal sales targets. As Nate Jones puts it: deploying an AI tool across an organization without organizational intent alignment is like hiring 40,000 new employees and never telling them what the company does, what it values, or how to make decisions. You get lots of activity and not much productivity. That's not a tools problem. That's an intent gap.`,

  // IE09 — Core Problem
  `So here's the core problem, stated as clearly as I can. Organizations have solved the first question: "Can AI do this task?" Yes, it can. Extraordinarily well. What they have completely failed to solve is the second question: "Can AI do this task in a way that serves our organizational goals at scale with appropriate judgment?" That second question is an intent engineering question. And almost nobody is working on it systematically.`,

  // IE10 — Three Layers
  `Closing the intent gap requires work at three distinct layers. First, unified context infrastructure — the connective tissue between your data and your agents. MCP, RAG pipelines, data governance, semantic consistency. The industry is most aware of this layer but still hasn't built it properly. Second, a coherent AI worker toolkit — shared workflows, sanctioned tools, organizational capability maps. This is the difference between individual AI use and organizational AI leverage. The difference between 30 percent gains and 300 percent gains. Third, intent engineering proper — machine-readable organizational purpose. Goal translation, decision boundaries, value hierarchies, delegation frameworks, feedback loops. This is the layer that almost certainly doesn't exist in your organization. Getting any one right is helpful. Getting all three right is the difference between having AI tools and having an AI-native organization.`,

  // IE11 — Layer 1 Deep Dive
  `Let's go deeper on layer one — unified context infrastructure. Right now, every team building agents rolls their own context stack. One team pipes Slack through a custom RAG pipeline. Another manually exports Google Docs into a vector store. A third built MCP for Salesforce but not Jira. A fourth team doesn't even know the other three exist. This mirrors the shadow IT crisis of the early cloud era — except agents don't just access data, they act on it. About 50 percent of organizations cite data searchability as their top AI blocker according to Deloitte. The questions that must be answered: Which systems become agent-accessible? Who decides what context an agent can see across departments? How do you version organizational knowledge? How do you handle conflicting institutional assumptions across teams?`,

  // IE12 — Layer 2 Deep Dive
  `Layer two — the coherent AI worker toolkit. Today's reality is fragmented. Person A uses Claude for research and ChatGPT for drafting. Person B uses Cursor for code and Perplexity for facts. Person C built a custom LangGraph agent chain. Person D is copy-pasting into a chat window. None of them can articulate their workflow in a way that's transferable to anyone else. The difference matters enormously. Bolting AI onto existing workflows gets you maybe 30 percent gains. Rethinking workflows around AI capabilities gets you 300 percent gains. Fluency doesn't scale through training alone. It scales through shared infrastructure — sanctioned tools, capability maps, and organizational context.`,

  // IE13 — Layer 3 Deep Dive
  `Layer three is intent engineering proper — and this is where it gets really interesting. OKRs were designed for people. They assume human judgment. Agents don't absorb culture through osmosis, all-hands meetings, or hallway conversations. They need explicit alignment before they start working. This breaks down into three components. Goal translation — not just "increase customer satisfaction" but specifically: what signals indicate satisfaction? What data sources? What actions am I authorized to take? What trade-offs can I make? Delegation frameworks — tenants translated into decision boundaries. When request X conflicts with policy Y, here's the resolution hierarchy. This is encoded judgment, not rigid rules. And feedback loops — when an agent makes a decision, was it aligned with intent? How do we know? How do we measure and correct alignment drift over time?`,

  // IE14 — Human vs AI Agent
  `Think about what 5 years of working at a company actually encodes in a human agent. She knows when to bend a policy. When to spend 3 extra minutes on a frustrated customer. When efficiency is the right move versus when generosity is. Which metrics leadership actually cares about — not the ones on the dashboard, the ones they mention in private. The stories veterans tell new hires. The decisions managers make in ambiguous situations. Now compare that to an AI agent on day one. It has a prompt. It has context. It does not have intent. It does not absorb culture through osmosis. It does not learn from hallway conversations. And it will optimize for whatever it can measure — whether that's what you actually want or not.`,

  // IE15 — Why Not Built
  `So why hasn't this been built? Three structural blockers. First, it's genuinely new. Before agents ran autonomously over weeks and months, we didn't need this. The human was the intent layer. Every decision passed through human judgment. Long-running agents break that model entirely. Second, the two cultures problem. People who understand organizational strategy — your executives — aren't building agents. People building agents — your engineers — don't understand organizational strategy. MIT found that AI investment is still viewed primarily as a technology challenge for the CIO. Third, it's extremely hard. Goals live in slide decks, half-read OKR documents, leadership principles cited in performance reviews but never operationalized, and the tacit knowledge of experienced employees. Nobody has strong muscles here.`,

  // IE16 — Solution Architecture
  `So what must be built? At the infrastructure level, you need composable, vendor-agnostic architecture. MCP as a protocol layer combined with organizational decisions about data governance, access controls, and freshness guarantees. Treat this like data warehouse strategy in the 2010s — it's a core strategic investment. At the workflow level, you need an organizational capability map for AI. Which workflows are agent-ready versus agent-augmented versus human-only? This needs to be a living operating system, not a static Confluence doc. It evolves as agent capabilities improve. At the alignment level, you need goal translation infrastructure, decision boundaries and escalation logic, value hierarchies for resolving trade-offs, and feedback loops measuring alignment drift. Each of these levels needs a new role: AI Infrastructure Architect, AI Workflow Architect, and Intent Engineering Lead.`,

  // IE17 — Race Changed
  `Here's the punchline. It's no longer an intelligence race. It's an intent race. The frontier models — Opus 4.6, Gemini 3, GPT 5.2 — are all extraordinarily capable. The differences between them matter far less than the differences between organizations that give them clear, structured, goal-aligned intent and organizations that don't. As Nate Jones puts it: a company with a mediocre model and extraordinary organizational intent infrastructure will outperform a company with a frontier model and fragmented, unaligned organizational knowledge. Every single time.`,

  // IE18 — Closing
  `I'll leave you with this quote: "Context without intent is a loaded weapon with no target. We've spent years building AI systems. 2026 is the year we learn to aim them." We've moved from prompt — how you talk to AI — to context — what AI knows — to intent — what AI wants. The organizations that figure out intent engineering first won't just have better AI tools. They'll have a fundamentally different kind of organization. Build for long-term intent. The clock is running.`,
];

// ─── SCRIPT MODAL COMPONENT ───
function ScriptModal({ script, slideIndex, total, open, onClose, onPrev, onNext }) {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);

  // Stop speech when modal closes or slide changes
  useEffect(() => {
    return () => {
      if (utterRef.current) {
        window.speechSynthesis.cancel();
        utterRef.current = null;
        setSpeaking(false);
      }
    };
  }, [slideIndex, open]);

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      utterRef.current = null;
      setSpeaking(false);
      return;
    }
    if (!script) return;
    const utter = new SpeechSynthesisUtterance(script);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.onend = () => { setSpeaking(false); utterRef.current = null; };
    utter.onerror = () => { setSpeaking(false); utterRef.current = null; };
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="script-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%", maxWidth: 660, maxHeight: "80vh",
              background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
              boxShadow: `0 0 60px rgba(0,0,0,0.5), 0 0 30px ${T.amberGlow}`,
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 24px", borderBottom: `1px solid ${T.border}`,
              background: T.card, flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.amber }}>
                  Speaker Script
                </span>
                <span style={{
                  fontFamily: T.mono, fontSize: 10, color: T.gray,
                  background: `${T.amber}18`, border: `1px solid ${T.amber}33`,
                  borderRadius: 12, padding: "2px 10px",
                }}>
                  {String(slideIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Read Aloud button */}
                <button
                  onClick={toggleSpeech}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: speaking ? T.amberDim : T.card,
                    border: `1px solid ${speaking ? T.amber + "66" : T.border}`,
                    borderRadius: 8, padding: "6px 14px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{speaking ? "⏹" : "🔊"}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, color: speaking ? T.amber : T.muted }}>
                    {speaking ? "STOP" : "READ ALOUD"}
                  </span>
                </button>
                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    background: "transparent", border: `1px solid ${T.border}`,
                    borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                    color: T.muted, fontFamily: T.mono, fontSize: 14, lineHeight: 1,
                    transition: "all 0.2s",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Script body */}
            <div style={{
              padding: "24px 28px", overflowY: "auto", flex: 1,
              scrollbarWidth: "thin", scrollbarColor: `${T.border} transparent`,
            }}>
              <p style={{
                fontFamily: T.font, fontSize: 15, color: T.white,
                lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap",
              }}>
                {script || "No script available for this slide."}
              </p>
            </div>

            {/* Footer nav */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 24px", borderTop: `1px solid ${T.border}`,
              background: T.card, flexShrink: 0,
            }}>
              <button
                onClick={onPrev}
                disabled={slideIndex === 0}
                style={{
                  background: "transparent", border: `1px solid ${T.border}`,
                  borderRadius: 6, padding: "5px 16px", cursor: slideIndex === 0 ? "default" : "pointer",
                  fontFamily: T.mono, fontSize: 12, color: slideIndex === 0 ? T.border : T.muted,
                  opacity: slideIndex === 0 ? 0.4 : 1, transition: "all 0.2s",
                }}
              >
                ‹ Prev
              </button>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} style={{
                    width: i === slideIndex ? 14 : 4, height: 4, borderRadius: 2,
                    background: i === slideIndex ? T.amber : i < slideIndex ? T.muted : T.border,
                    transition: "all 0.3s",
                  }} />
                ))}
              </div>
              <button
                onClick={onNext}
                disabled={slideIndex === total - 1}
                style={{
                  background: "transparent", border: `1px solid ${T.border}`,
                  borderRadius: 6, padding: "5px 16px", cursor: slideIndex === total - 1 ? "default" : "pointer",
                  fontFamily: T.mono, fontSize: 12, color: slideIndex === total - 1 ? T.border : T.muted,
                  opacity: slideIndex === total - 1 ? 0.4 : 1, transition: "all 0.2s",
                }}
              >
                Next ›
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
function PinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === "11601") {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
      setPin("");
    }
  };

  return (
    <div style={{
      width: "100vw", height: "100vh", background: T.bg, fontFamily: T.font,
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
    }}>
      <GridBg />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
          padding: "48px 56px", backdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.amber, marginBottom: 12 }}
        >
          Restricted Access
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ height: 2, width: 120, background: `linear-gradient(90deg, transparent, ${T.amber}, transparent)`, transformOrigin: "center", marginBottom: 24 }}
        />
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontFamily: T.font, fontSize: 14, color: T.muted, marginBottom: 28, textAlign: "center" }}
        >
          Enter PIN to continue
        </motion.p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <motion.div
            animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              maxLength={5}
              style={{
                width: 200, padding: "12px 20px", textAlign: "center",
                fontFamily: T.mono, fontSize: 28, fontWeight: 700, letterSpacing: "0.3em",
                color: error ? T.red : T.white,
                background: "rgba(255,255,255,0.04)",
                border: `2px solid ${error ? T.red + "88" : T.border}`,
                borderRadius: 10, outline: "none",
                transition: "border-color 0.3s, color 0.3s",
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = T.amber + "88"; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = T.border; }}
            />
          </motion.div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              fontFamily: T.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
              color: T.bg, background: T.amber, border: "none", borderRadius: 8,
              padding: "10px 36px", cursor: "pointer",
              boxShadow: `0 0 20px ${T.amberGlow}`,
            }}
          >
            UNLOCK
          </motion.button>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontFamily: T.mono, fontSize: 11, color: T.red, margin: 0 }}
              >
                Invalid PIN
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}

export default function PresentationHub() {
  const [unlocked, setUnlocked] = useState(false);
  const [deck, setDeck] = useState("rebuttal");
  const [slide, setSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [scriptOpen, setScriptOpen] = useState(false);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  const isRebuttal = deck === "rebuttal";
  const scenes = deck === "rebuttal" ? PR_SCENES : deck === "fdose" ? FD_SLIDES : IE_SLIDES;
  const total = scenes.length;

  const switchDeck = useCallback((d) => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    clearInterval(elapsedRef.current);
    setDeck(d);
    setSlide(0);
    setElapsed(0);
  }, []);

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
    if (!unlocked) return;
    if (isPlaying && isRebuttal) {
      timerRef.current = setTimeout(next, PR_DURATIONS[slide]);
      elapsedRef.current = setInterval(() => setElapsed((e) => e + 100), 100);
    }
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(elapsedRef.current);
    };
  }, [unlocked, isPlaying, slide, next, isRebuttal]);

  const togglePlay = useCallback(() => {
    setSlide((s) => {
      if (s === total - 1) {
        setElapsed(0);
        setIsPlaying(true);
        return 0;
      }
      setIsPlaying((p) => !p);
      return s;
    });
  }, [total]);

  // Keyboard nav
  useEffect(() => {
    if (!unlocked) return;
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [unlocked, next, prev]);

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

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

      {/* Script button — only visible on intent deck */}
      {deck === "intent" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          onClick={() => setScriptOpen(true)}
          style={{
            position: "fixed", bottom: 16, right: 24, zIndex: 200,
            display: "flex", alignItems: "center", gap: 7,
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "7px 16px", cursor: "pointer",
            backdropFilter: "blur(8px)", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.amber + "66"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
        >
          <span style={{ fontSize: 14 }}>📜</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: T.muted }}>SCRIPT</span>
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={`${deck}-${slide}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>

      {/* Script modal for intent deck */}
      {deck === "intent" && (
        <ScriptModal
          script={IE_SCRIPTS[slide]}
          slideIndex={slide}
          total={IE_SLIDES.length}
          open={scriptOpen}
          onClose={() => setScriptOpen(false)}
          onPrev={() => { setSlide((s) => Math.max(0, s - 1)); }}
          onNext={() => { setSlide((s) => Math.min(IE_SLIDES.length - 1, s + 1)); }}
        />
      )}
    </div>
  );
}
