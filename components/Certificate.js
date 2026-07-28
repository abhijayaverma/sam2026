"use client";

import { forwardRef } from "react";

const Certificate = forwardRef(function Certificate({ studentName }, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: "1882px",
        height: "1364px",
        backgroundImage: 'url("/certificate-template.svg")',
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        position: "relative",
        fontFamily: "'Times New Roman', Georgia, serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "500px",
          top: "720px",
          width: "950px",
          textAlign: "center",
          fontSize: "52px",
          lineHeight: 1,
          fontWeight: 700,
          color: "#111827",
          whiteSpace: "nowrap",
        }}
      >
        {studentName}
      </div>
    </div>
  );
});

export default Certificate;
