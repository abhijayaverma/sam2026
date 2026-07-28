"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Certificate from "@/components/Certificate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { makeWorkshopSlug } from "@/lib/slug";

function StudentPortal() {
  const searchParams = useSearchParams();
  const workshopRef = searchParams.get("workshop");

  const [workshop, setWorkshop] = useState(null);
  const [rollNo, setRollNo] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | eligible | not_eligible | error
  const [record, setRecord] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloading, setDownloading] = useState(false);

  const certRef = useRef(null);

  useEffect(() => {
    async function loadWorkshop() {
      if (!workshopRef) return;
      const { data } = await supabase
        .from("workshops")
        .select("id, name, date, organizer");
      const matchedWorkshop = (data || []).find(
        (item) => makeWorkshopSlug(item.name, item.date) === workshopRef
      );
      setWorkshop(matchedWorkshop || null);
    }
    loadWorkshop();
  }, [workshopRef]);

  async function handleCheck(e) {
    e.preventDefault();
    if (!rollNo.trim()) return;
    if (!workshopRef || !workshop) {
      setStatus("error");
      setErrorMsg("No workshop selected. Please use the link shared by your organizer.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { data, error } = await supabase
      .from("attendance")
      .select("roll_no, name")
      .eq("workshop_id", workshop.id)
      .ilike("roll_no", rollNo.trim())
      .maybeSingle();

    if (error) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
      return;
    }

    if (data) {
      setRecord(data);
      setStatus("eligible");
    } else {
      setStatus("not_eligible");
    }
  }

  async function handleDownload() {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate_${record.roll_no}.pdf`);
    } finally {
      setDownloading(false);
    }
  }



  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-6 py-12">
      <div className="max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-1">
          Certificate Portal
        </h1>
        {workshop ? (
          <p className="text-slate-400 text-center mb-8">
            {workshop.name} · {workshop.date}
          </p>
        ) : (
          <p className="text-slate-500 text-center mb-8 text-sm">
            {workshopRef
              ? "Loading workshop details..."
              : "No workshop link detected. Ask your organizer for the correct link."}
          </p>
        )}

        <form
          onSubmit={handleCheck}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4"
        >
          <label className="text-sm text-slate-400">
            Enter your Roll Number
          </label>
          <input
            className="bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="e.g. 2201234"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {status === "loading" ? "Checking..." : "Check & Generate"}
          </button>
        </form>

        {status === "not_eligible" && (
          <div className="mt-6 bg-red-950/40 border border-red-900 rounded-lg p-4 text-red-300 text-sm">
            No attendance record found for roll number &quot;{rollNo}&quot; in this
            workshop. Certificates are only issued to students marked
            present. If you believe this is an error, contact the
            workshop organizer.
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 bg-red-950/40 border border-red-900 rounded-lg p-4 text-red-300 text-sm">
            {errorMsg}
          </div>
        )}

        {status === "eligible" && record && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-emerald-400 text-sm">
              Attendance verified. Your certificate is ready.
            </p>
            <div className="overflow-x-auto max-w-full border border-slate-800 rounded-lg">
              <div style={{ transform: "scale(0.45)", transformOrigin: "top left", width: "1882px", height: "1364px" }}>
                <Certificate
                  ref={certRef}
                  studentName={record.name || `Roll No ${record.roll_no}`}
                />
              </div>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
            >
              {downloading ? "Preparing PDF..." : "Download Certificate (PDF)"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <StudentPortal />
    </Suspense>
  );
}
