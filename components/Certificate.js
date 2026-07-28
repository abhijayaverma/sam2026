"use client";

import { forwardRef } from "react";

const TEMPLATE_WIDTH = 1882;
const TEMPLATE_HEIGHT = 1364;

const Certificate = forwardRef(function Certificate({ studentName }, ref) {
  const displayName = studentName || "";
  const nameFontSize = displayName.length > 28 ? "42px" : "52px";

  return (
    <div
      ref={ref}
      style={{
        width: `${TEMPLATE_WIDTH}px`,
        height: `${TEMPLATE_HEIGHT}px`,
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
        fontFamily: "'Times New Roman', Georgia, serif",
      }}
    >
      {/* html2canvas captures a normal img reliably for PDF export. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/certificate-template.svg"
        alt="Certificate template"
        width={TEMPLATE_WIDTH}
        height={TEMPLATE_HEIGHT}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "500px",
          top: "720px",
          width: "950px",
          textAlign: "center",
          fontSize: nameFontSize,
          lineHeight: 1,
          fontWeight: 700,
          color: "#111827",
          whiteSpace: "nowrap",
        }}
      >
        {displayName}
      </div>
    </div>
  );
});

export default Certificate;
