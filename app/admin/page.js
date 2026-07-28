"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { parseAttendanceFile } from "@/lib/parseAttendance";

export default function AdminPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);

  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [studentLink, setStudentLink] = useState("");

  async function loadWorkshops() {
    const { data } = await supabase
      .from("workshops")
      .select("id, name, date, organizer, created_at")
      .order("created_at", { ascending: false });
    setWorkshops(data || []);
  }

  useEffect(() => {
    loadWorkshops();
  }, []);

  async function handleCreateWorkshop(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !date || !password || !file) {
      setError("Please fill workshop name, date, admin password, and choose a file.");
      return;
    }

    setLoading(true);
    try {
      const rows = await parseAttendanceFile(file);
      if (rows.length === 0) {
        throw new Error("No valid rows found in the file.");
      }

      const { data: workshop, error: wsError } = await supabase
        .from("workshops")
        .insert({ name, date, organizer, admin_password: password })
        .select()
        .single();

      if (wsError) throw wsError;

      const attendanceRows = rows.map((r) => ({
        workshop_id: workshop.id,
        roll_no: r.roll_no,
        name: r.name,
      }));

      const { error: attError } = await supabase
        .from("attendance")
        .insert(attendanceRows);

      if (attError) throw attError;

      setSuccess(
        `Workshop "${name}" created with ${attendanceRows.length} present students. Student link: ${window.location.origin}/?workshop=${workshop.id}`
      );
      setName("");
      setDate("");
      setOrganizer("");
      setPassword("");
      setFile(null);
      loadWorkshops();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlock(workshop) {
    const input = prompt(
      `Enter the admin password for "${workshop.name}" to view its student link:`
    );
    if (input === null) return;

    const { data, error } = await supabase
      .from("workshops")
      .select("admin_password")
      .eq("id", workshop.id)
      .single();

    if (error || !data) {
      alert("Could not verify workshop.");
      return;
    }

    if (data.admin_password !== input) {
      alert("Incorrect password.");
      return;
    }

    setSelectedWorkshop(workshop.id);
    setStudentLink(`${window.location.origin}/?workshop=${workshop.id}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Workshop Admin</h1>
        <p className="text-slate-400 mb-8">
          Create a workshop and upload the attendance file (columns:
          roll_no, name). Only students in this list will be able to
          generate a certificate.
        </p>

        <form
          onSubmit={handleCreateWorkshop}
          className="bg-slate-900 rounded-xl p-6 space-y-4 border border-slate-800"
        >
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Workshop Name
            </label>
            <input
              className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Introduction to GMI Sensing"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Date</label>
              <input
                type="date"
                className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Organizer (optional)
              </label>
              <input
                className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="e.g. UIET CSJMU Physics Dept."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Admin Password (to view this workshop's link later)
            </label>
            <input
              type="password"
              className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a simple password"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Attendance File (.csv, .xlsx)
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-300"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-950/40 border border-red-900 rounded-lg p-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-400 text-sm bg-emerald-950/40 border border-emerald-900 rounded-lg p-3 break-all">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Workshop"}
          </button>
        </form>

        <h2 className="text-xl font-semibold mt-10 mb-4">Existing Workshops</h2>
        <div className="space-y-3">
          {workshops.map((w) => (
            <div
              key={w.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-sm text-slate-400">
                  {w.date} {w.organizer ? `· ${w.organizer}` : ""}
                </p>
              </div>
              <button
                onClick={() => handleUnlock(w)}
                className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg"
              >
                Get student link
              </button>
            </div>
          ))}
        </div>

        {selectedWorkshop && (
          <p className="mt-4 text-sm text-emerald-400 break-all">
            Student link: {studentLink}
          </p>
        )}
      </div>
    </main>
  );
}
