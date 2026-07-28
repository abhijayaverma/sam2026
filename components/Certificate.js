"use client";

import { forwardRef } from "react";

const Certificate = forwardRef(function Certificate(
  { studentName, workshopName, workshopDate, organizer },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        width: "1000px",
        height: "700px",
        background: "#ffffff",
        border: "4px solid #0b77bd",
        position: "relative",
        fontFamily: "'Times New Roman', Georgia, serif",
        color: "#111827",
        boxSizing: "border-box",
        padding: "64px",
      }}
    >
      <div
        style={{
          border: "3px solid #f4c842",
          height: "100%",
          width: "100%",
          padding: "36px 34px 28px",
          boxSizing: "border-box",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "64px" }}>
          <div style={{ width: 86, height: 86, borderRadius: "50%", border: "4px solid #ef4444", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>CSJMU</div>
          <div style={{ width: 86, height: 86, borderRadius: "50%", background: "#fbbf24", color: "#7c2d12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: "bold" }}>A++</div>
          <div style={{ fontSize: 56, fontFamily: "Arial, sans-serif", color: "#111", letterSpacing: -2 }}>kan-2026</div>
          <div style={{ fontSize: 44, fontFamily: "Arial, sans-serif", color: "#ea580c", fontWeight: 800 }}>IIM</div>
          <div style={{ width: 86, height: 86, borderRadius: "50%", border: "4px solid #4338ca", color: "#4338ca", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>IITK</div>
        </div>

        <div style={{ position: "absolute", right: 100, top: 250, width: 68, height: 78, background: "#f2b233", clipPath: "polygon(50% 0%, 61% 18%, 82% 12%, 88% 34%, 100% 50%, 88% 66%, 82% 88%, 61% 82%, 50% 100%, 39% 82%, 18% 88%, 12% 66%, 0% 50%, 12% 34%, 18% 12%, 39% 18%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#7c2d12" }}>23rd<br />March<br />2k26</div>

        <h1 style={{ margin: 0, fontSize: 70, letterSpacing: 6, color: "#1f7fc1", fontWeight: 400 }}>CERTIFICATE</h1>
        <h2 style={{ margin: "16px 0 34px", fontSize: 32, fontWeight: 800 }}>OF APPRECIATION</h2>

        <div style={{ display: "flex", alignItems: "flex-end", margin: "0 auto 18px", width: "72%" }}>
          <span style={{ fontSize: 26, fontWeight: 700, marginRight: 16 }}>Mr/Ms</span>
          <span style={{ flex: 1, borderBottom: "2px solid #111", fontSize: 30, fontWeight: 700, lineHeight: 1.2 }}>{studentName}</span>
        </div>

        <p style={{ fontSize: 20, lineHeight: 1.45, margin: "0 auto", maxWidth: 860 }}>
          “for <strong>active participation</strong> in the <strong>{workshopName || "Poster Competition"}</strong> at <strong>kan - 2026</strong>, held at the <strong>UIET, CSJMU, Kanpur</strong>, in association with the <strong>{organizer || "IIM CSJMU Kanpur Student Chapter and the IIM Kanpur Chapter"}</strong>, on <span>{workshopDate || "23rd March 2026"}</span>.”
        </p>

        <div style={{ position: "absolute", left: 34, right: 34, bottom: 38, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 34 }}>
          {["HEAD\nMSE DEPARTMENT , IIT KANPUR", "HEAD\nMSME DEPARTMENT, UIET, CSJMU KANPUR", "CHAIRMAN\nIIM KANPUR CHAPTER", "FACULTY INCHARGE\nIIM CSJMU KANPUR STUDENT CHAPTER"].map((label) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ borderTop: "2px solid #111", marginBottom: 10 }} />
              <p style={{ whiteSpace: "pre-line", margin: 0, color: "#dc2626", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Certificate;
