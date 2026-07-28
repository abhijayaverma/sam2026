"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export default function AdminPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [password, setPassword] = useState("");

  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [studentLink, setStudentLink] = useState("");
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentMessage, setStudentMessage] = useState("");

  async function loadWorkshops() {
    const { data } = await supabase
      .from("workshops")
      .select("id, name, date, organizer, created_at")
      .order("created_at", { ascending: false });
    setWorkshops(data || []);
  }

  async function loadStudents(workshopId) {
    const { data } = await supabase
      .from("attendance")
      .select("id, roll_no, name")
      .eq("workshop_id", workshopId)
      .order("roll_no", { ascending: true });
    setStudents(data || []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWorkshops();
  }, []);

  function buildStudentLink(workshop) {
    return `${window.location.origin}/?workshop=${makeSlug(`${workshop.name}-${workshop.date}`)}`;
  }

  async function handleCreateWorkshop(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !date || !password) {
      setError("Please fill workshop name, date, and admin password.");
      return;
    }

    setLoading(true);
    try {
      const { data: workshop, error: wsError } = await supabase
        .from("workshops")
        .insert({ name, date, organizer, admin_password: password })
        .select()
        .single();

      if (wsError) throw wsError;

      const link = `${window.location.origin}/?workshop=${makeSlug(`${workshop.name}-${workshop.date}`)}`;
      setSuccess(`Workshop "${name}" created. Student link: ${link}`);
      setName("");
      setDate("");
      setOrganizer("");
      setPassword("");
      loadWorkshops();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlock(workshop) {
    const input = prompt(
      `Enter the admin password for "${workshop.name}" to manage students and view its student link:`
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

    setSelectedWorkshop(workshop);
    setStudentLink(buildStudentLink(workshop));
    setStudentMessage("");
    loadStudents(workshop.id);
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    if (!selectedWorkshop || !rollNo.trim() || !studentName.trim()) return;

    setStudentMessage("");
    const { error: insertError } = await supabase.from("attendance").insert({
      workshop_id: selectedWorkshop.id,
      roll_no: rollNo.trim(),
      name: studentName.trim(),
    });

    if (insertError) {
      setStudentMessage(insertError.message || "Could not add student.");
      return;
    }

    setRollNo("");
    setStudentName("");
    setStudentMessage("Student added. They can now generate a certificate with their roll number.");
    loadStudents(selectedWorkshop.id);
  }

  async function handleUpdateStudent(student) {
    const nextName = prompt("Edit student name:", student.name || "");
    if (nextName === null) return;

    const { error: updateError } = await supabase
      .from("attendance")
      .update({ name: nextName.trim() })
      .eq("id", student.id);

    if (updateError) {
      alert(updateError.message || "Could not update student.");
      return;
    }

    loadStudents(selectedWorkshop.id);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Workshop Admin</h1>
        <p className="text-slate-400 mb-8">
          Create a workshop, then manually add or edit each student&apos;s roll number and name. Students enter only their roll number to generate a certificate.
        </p>

        <form onSubmit={handleCreateWorkshop} className="bg-slate-900 rounded-xl p-6 space-y-4 border border-slate-800">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Workshop Name</label>
            <input className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Poster Competition KAN 2026" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Date</label>
              <input type="date" className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Organizer (optional)</label>
              <input className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="e.g. IIM CSJMU Kanpur Student Chapter" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Admin Password (to manage this workshop later)</label>
            <input type="password" className="w-full bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set a simple password" />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-950/40 border border-red-900 rounded-lg p-3">{error}</p>}
          {success && <p className="text-emerald-400 text-sm bg-emerald-950/40 border border-emerald-900 rounded-lg p-3 break-all">{success}</p>}

          <button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50">
            {loading ? "Creating..." : "Create Workshop"}
          </button>
        </form>

        <h2 className="text-xl font-semibold mt-10 mb-4">Existing Workshops</h2>
        <div className="space-y-3">
          {workshops.map((w) => (
            <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-sm text-slate-400">{w.date} {w.organizer ? `· ${w.organizer}` : ""}</p>
                <p className="text-xs text-slate-500">Link text: {makeSlug(`${w.name}-${w.date}`)}</p>
              </div>
              <button onClick={() => handleUnlock(w)} className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg">Manage students & link</button>
            </div>
          ))}
        </div>

        {selectedWorkshop && (
          <section className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Manage students for {selectedWorkshop.name}</h2>
              <p className="mt-2 text-sm text-emerald-400 break-all">Student link: {studentLink}</p>
            </div>

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
              <input className="bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="Roll number" />
              <input className="bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name for certificate" />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2 rounded-lg">Add student</button>
            </form>

            {studentMessage && <p className="text-sm text-slate-300">{studentMessage}</p>}

            <div className="divide-y divide-slate-800">
              {students.map((student) => (
                <div key={student.id} className="py-3 flex items-center justify-between gap-3">
                  <p className="text-sm"><span className="text-slate-400">{student.roll_no}</span> · {student.name}</p>
                  <button onClick={() => handleUpdateStudent(student)} className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg">Edit name</button>
                </div>
              ))}
              {students.length === 0 && <p className="text-sm text-slate-500 py-3">No students added yet.</p>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
