import * as XLSX from "xlsx";

// Normalizes header names so "Roll No", "roll_no", "Roll Number" etc. all match
function normalizeKey(key) {
  return key.toString().trim().toLowerCase().replace(/[\s_]+/g, "");
}

const ROLL_ALIASES = ["rollno", "rollnumber", "roll"];
const NAME_ALIASES = ["name", "studentname", "fullname"];

export async function parseAttendanceFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

  if (rows.length === 0) {
    throw new Error("The file appears to be empty.");
  }

  const sampleKeys = Object.keys(rows[0]);
  const rollKey = sampleKeys.find((k) => ROLL_ALIASES.includes(normalizeKey(k)));
  const nameKey = sampleKeys.find((k) => NAME_ALIASES.includes(normalizeKey(k)));

  if (!rollKey) {
    throw new Error(
      `Could not find a "roll_no" column. Found columns: ${sampleKeys.join(", ")}`
    );
  }

  const parsed = rows
    .map((row) => ({
      roll_no: String(row[rollKey]).trim(),
      name: nameKey ? String(row[nameKey]).trim() : "",
    }))
    .filter((r) => r.roll_no);

  return parsed;
}
