"use client";

import { forwardRef } from "react";

const Certificate = forwardRef(function Certificate(
  { studentName, rollNo, workshopName, workshopDate, organizer, certId },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        width: "1000px",
        height: "700px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        position: "relative",
        fontFamily: "'Georgia', serif",
        color: "#f1f5f9",
        boxSizing: "border-box",
        padding: "40px",
      }}
    >
      <div
        style={{
          border: "3px solid #d4af37",
          height: "100%",
          width: "100%",
          padding: "50px 60px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "18px",
            left: "18px",
            right: "18px",
            bottom: "18px",
            border: "1px solid #d4af37",
            pointerEvents: "none",
          }}
        />

        <p
          style={{
            letterSpacing: "6px",
            fontSize: "14px",
            color: "#d4af37",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          Certificate of Participation
        </p>

        <h1
          style={{
            fontSize: "42px",
            margin: "10px 0 25px 0",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          {workshopName || "Workshop Title"}
        </h1>

        <p style={{ fontSize: "16px", color: "#cbd5e1", marginBottom: "4px" }}>
          This certificate is proudly presented to
        </p>

        <h2
          style={{
            fontSize: "34px",
            margin: "12px 0",
            color: "#d4af37",
            fontStyle: "italic",
            borderBottom: "1px solid #d4af37",
            paddingBottom: "8px",
            minWidth: "400px",
          }}
        >
          {studentName}
        </h2>

        <p style={{ fontSize: "15px", color: "#cbd5e1", marginTop: "6px" }}>
          Roll No: <strong>{rollNo}</strong>
        </p>

        <p
          style={{
            fontSize: "15px",
            color: "#cbd5e1",
            maxWidth: "650px",
            marginTop: "18px",
            lineHeight: "1.6",
          }}
        >
          for successfully attending and actively participating in the
          workshop held on <strong>{workshopDate}</strong>
          {organizer ? (
            <>
              , organized by <strong>{organizer}</strong>
            </>
          ) : null}
          .
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "60px",
            padding: "0 40px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #94a3b8",
                width: "180px",
                marginBottom: "6px",
              }}
            />
            <p style={{ fontSize: "13px", color: "#94a3b8" }}>Date</p>
            <p style={{ fontSize: "14px" }}>{workshopDate}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #94a3b8",
                width: "180px",
                marginBottom: "6px",
              }}
            />
            <p style={{ fontSize: "13px", color: "#94a3b8" }}>Authorized Signature</p>
          </div>
        </div>

        <p
          style={{
            position: "absolute",
            bottom: "14px",
            right: "20px",
            fontSize: "10px",
            color: "#64748b",
          }}
        >
          Certificate ID: {certId}
        </p>
      </div>
    </div>
  );
});

export default Certificate;
