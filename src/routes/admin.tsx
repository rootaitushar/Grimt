import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  GraduationCap,
  Loader2,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Placement Admin | GRIMT Radaur" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Student = Tables<"placement_students">;

const columns: Array<{ key: keyof Student; label: string }> = [
  { key: "roll_number", label: "Roll Number" },
  { key: "student_name", label: "Name of Student" },
  { key: "aadhaar_number", label: "Aadhaar Number" },
  { key: "contact_number", label: "Student Phone" },
  { key: "email", label: "Student Email" },
  { key: "father_name", label: "Father's Name" },
  { key: "father_phone", label: "Father's Phone" },
  { key: "mother_name", label: "Mother's Name" },
  { key: "address", label: "Permanent / Home Town" },
  { key: "local_address", label: "Local Address" },
  { key: "tenth_percentage", label: "10th Marks %" },
  { key: "twelfth_percentage", label: "12th Marks %" },
  { key: "semester_1_status", label: "1st Sem Status" },
  { key: "semester_1_marks", label: "1st Sem Marks %" },
  { key: "semester_1_reappears", label: "1st Sem Reappears" },
  { key: "semester_2_status", label: "2nd Sem Status" },
  { key: "semester_2_marks", label: "2nd Sem Marks %" },
  { key: "semester_2_reappears", label: "2nd Sem Reappears" },
  { key: "semester_3_status", label: "3rd Sem Status" },
  { key: "semester_3_marks", label: "3rd Sem Marks %" },
  { key: "semester_3_reappears", label: "3rd Sem Reappears" },
  { key: "semester_4_status", label: "4th Sem Status" },
  { key: "semester_4_marks", label: "4th Sem Marks %" },
  { key: "semester_4_reappears", label: "4th Sem Reappears" },
  { key: "semester_5_status", label: "5th Sem Status" },
  { key: "semester_5_marks", label: "5th Sem Marks %" },
  { key: "semester_5_reappears", label: "5th Sem Reappears" },
  { key: "semester_6_status", label: "6th Sem Status" },
  { key: "semester_6_marks", label: "6th Sem Marks %" },
  { key: "semester_6_reappears", label: "6th Sem Reappears" },
  { key: "semester_7_status", label: "7th Sem Status" },
  { key: "semester_7_marks", label: "7th Sem Marks %" },
  { key: "semester_7_reappears", label: "7th Sem Reappears" },
  { key: "average_percentage", label: "Average %" },
  { key: "total_reappears", label: "Total Reappears" },
  { key: "wants_campus_placement", label: "Placement Required" },
  { key: "placement_opt_out_reason", label: "Placement Not Required Reason" },
  { key: "created_at", label: "Submitted At" },
];

function escapeXml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function exportToExcel(rows: Student[]) {
  const header = ["S.No", ...columns.map(({ label }) => label)]
    .map((label) => `<Cell><Data ss:Type="String">${escapeXml(label)}</Data></Cell>`)
    .join("");
  const body = rows
    .map(
      (student, index) =>
        `<Row><Cell><Data ss:Type="Number">${index + 1}</Data></Cell>${columns
          .map(({ key }) => {
            const raw = key === "created_at"
              ? new Date(student[key]).toLocaleString("en-IN")
              : key === "wants_campus_placement"
                ? student[key] ? "Yes" : "No"
                : student[key];
            const type = typeof raw === "number" ? "Number" : "String";
            return `<Cell><Data ss:Type="${type}">${escapeXml(raw)}</Data></Cell>`;
          })
          .join("")}</Row>`,
    )
    .join("");
  const workbook = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Placement Students"><Table><Row>${header}</Row>${body}</Table></Worksheet>
</Workbook>`;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `placement-students-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allRows: Student[] = [];
      const pageSize = 1000;
      for (let from = 0; ; from += pageSize) {
        const { data, error: queryError } = await supabase
          .from("placement_students")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, from + pageSize - 1);
        if (queryError) throw queryError;
        allRows.push(...(data ?? []));
        if (!data || data.length < pageSize) break;
      }
      setStudents(allRows);
    } catch {
      setError("Could not load student records. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAdmin = useCallback(async (activeSession: Session | null) => {
    setSession(activeSession);
    if (!activeSession) {
      setIsAdmin(false);
      setStudents([]);
      setCheckingSession(false);
      return;
    }
    const { data, error: adminError } = await supabase
      .from("placement_admins")
      .select("user_id")
      .eq("user_id", activeSession.user.id)
      .maybeSingle();
    if (adminError) {
      setError(
        adminError.code === "PGRST205"
          ? "Admin database setup is incomplete. Run the placement admin migration in Supabase."
          : "Could not verify admin access. Please try again.",
      );
    }
    const allowed = !adminError && !!data;
    setIsAdmin(allowed);
    setCheckingSession(false);
    if (allowed) await loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => checkAdmin(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      void checkAdmin(activeSession);
    });
    return () => data.subscription.unsubscribe();
  }, [checkAdmin]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return students;
    return students.filter((student) =>
      [student.student_name, student.roll_number, student.email, student.contact_number]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [search, students]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError("Invalid email or password.");
      setAuthLoading(false);
      return;
    }
    await checkAdmin(data.session);
    setAuthLoading(false);
  };

  if (checkingSession) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!session || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="text-center">
            <img src="/GRIMT-Logo.png" alt="GRIMT logo" className="mx-auto h-32 w-28 object-contain" />
            <ShieldCheck className="mx-auto mt-5 size-8 text-primary" />
            <h1 className="mt-2 text-2xl font-bold text-foreground">Placement Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to view and export student submissions.</p>
          </div>
          {session && !isAdmin ? (
            <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              This account does not have admin access.
            </div>
          ) : null}
          {error && <div role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          {!session ? (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div><label htmlFor="admin-email" className="text-sm font-medium">Email</label><input id="admin-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-ring/40" /></div>
              <div><label htmlFor="admin-password" className="text-sm font-medium">Password</label><input id="admin-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-ring/40" /></div>
              <button type="submit" disabled={authLoading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-70">{authLoading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />} Sign in</button>
            </form>
          ) : (
            <button onClick={() => void supabase.auth.signOut()} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-input px-4 font-semibold"><LogOut className="size-4" /> Sign out</button>
          )}
          <Link to="/" className="mt-5 block text-center text-sm font-medium text-primary hover:underline">Back to student form</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><img src="/GRIMT-Logo.png" alt="GRIMT logo" className="h-20 w-16 object-contain" /><div><p className="text-xs font-semibold uppercase tracking-wide text-brand-red">Training &amp; Placement</p><h1 className="text-xl font-bold">Student Submissions</h1></div></div>
          <div className="flex flex-wrap gap-2"><Link to="/" className="inline-flex min-h-10 items-center rounded-lg border border-input px-4 text-sm font-medium">Open form</Link><button onClick={() => void supabase.auth.signOut()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium"><LogOut className="size-4" /> Sign out</button></div>
        </header>

        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5"><Users className="size-5 text-primary" /><p className="mt-3 text-3xl font-bold">{students.length}</p><p className="text-sm text-muted-foreground">Total submissions</p></div>
          <div className="rounded-xl border border-border bg-card p-5"><GraduationCap className="size-5 text-primary" /><p className="mt-3 text-3xl font-bold">{students.filter((s) => s.wants_campus_placement).length}</p><p className="text-sm text-muted-foreground">Placement required</p></div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, roll no., email or phone..." className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-ring/40" /></div>
            <div className="flex gap-2"><button onClick={() => void loadStudents()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium disabled:opacity-60"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button><button onClick={() => exportToExcel(filtered)} disabled={filtered.length === 0} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Download className="size-4" /> Download Excel</button></div>
          </div>
          {error && <div role="alert" className="m-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="bg-secondary/70 text-xs uppercase text-muted-foreground"><tr><th className="whitespace-nowrap px-4 py-3 font-semibold">S.No</th>{columns.map((column) => <th key={column.key} className="whitespace-nowrap px-4 py-3 font-semibold">{column.label}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">{loading && students.length === 0 ? <tr><td colSpan={columns.length + 1} className="px-4 py-16 text-center text-muted-foreground"><Loader2 className="mx-auto mb-2 size-6 animate-spin" />Loading submissions...</td></tr> : filtered.length === 0 ? <tr><td colSpan={columns.length + 1} className="px-4 py-16 text-center text-muted-foreground">No student submissions found.</td></tr> : filtered.map((student, index) => <tr key={student.id} className="hover:bg-secondary/30"><td className="px-4 py-3 align-top">{index + 1}</td>{columns.map(({ key }) => <td key={key} className="max-w-64 px-4 py-3 align-top"><span className="line-clamp-3">{key === "created_at" ? new Date(student[key]).toLocaleString("en-IN") : key === "wants_campus_placement" ? student[key] ? "Yes" : "No" : String(student[key] ?? "—")}</span></td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">Showing {filtered.length} of {students.length} records</div>
        </section>
      </div>
    </main>
  );
}
