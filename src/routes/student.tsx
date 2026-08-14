import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Placement Dashboard | GRIMT Radaur" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StudentDashboard,
});

type Student = Tables<"placement_students">;
type Job = Tables<"placement_jobs">;
type Notification = Tables<"student_notifications">;
type Application = Tables<"placement_applications">;

function StudentDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<Student | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (activeSession: Session) => {
    setLoading(true);
    setError(null);
    const { error: linkError } = await supabase.rpc("link_student_profile");
    if (linkError) {
      setProfile(null);
      setError("No placement form record matches this verified email. Please contact the placement department.");
      setLoading(false);
      return;
    }

    const [profileResult, jobsResult, notificationsResult, applicationsResult] = await Promise.all([
      supabase.from("placement_students").select("*").eq("user_id", activeSession.user.id).maybeSingle(),
      supabase.from("placement_jobs").select("*").eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("student_notifications").select("*").order("created_at", { ascending: false }),
      supabase.from("placement_applications").select("*").order("applied_at", { ascending: false }),
    ]);
    if (profileResult.error || jobsResult.error || notificationsResult.error || applicationsResult.error) {
      setError("Could not load your placement dashboard. Please try again.");
    } else {
      setProfile(profileResult.data);
      setJobs(jobsResult.data ?? []);
      setNotifications(notificationsResult.data ?? []);
      setApplications(applicationsResult.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
      if (data.session) void loadDashboard(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      setSession(activeSession);
      if (activeSession) void loadDashboard(activeSession);
      else {
        setProfile(null);
        setJobs([]);
        setNotifications([]);
        setApplications([]);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [loadDashboard]);

  const sendLoginLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setSendingLink(true);
    setLoginMessage(null);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/student`,
      },
    });
    setLoginMessage(signInError ? "Could not send the login link. Please try again." : "Login link sent. Check your email inbox.");
    setSendingLink(false);
  };

  const applyToJob = async (jobId: string) => {
    if (!session || !profile) return;
    const { error: applyError } = await supabase.from("placement_applications").insert({
      job_id: jobId,
      student_id: profile.id,
      user_id: session.user.id,
    });
    if (applyError) {
      setError(applyError.code === "23505" ? "You have already applied to this job." : "Could not submit your application.");
      return;
    }
    const { data } = await supabase.from("placement_applications").select("*").order("applied_at", { ascending: false });
    setApplications(data ?? []);
  };

  const markNotificationsRead = async () => {
    if (!session) return;
    const unreadIds = notifications.filter((item) => !item.read_at).map((item) => item.id);
    if (unreadIds.length === 0) return;
    const readAt = new Date().toISOString();
    await supabase.from("student_notifications").update({ read_at: readAt }).in("id", unreadIds);
    setNotifications((current) => current.map((item) => ({ ...item, read_at: item.read_at ?? readAt })));
  };

  const applicationByJob = useMemo(
    () => new Map(applications.map((application) => [application.job_id, application])),
    [applications],
  );
  const unreadCount = notifications.filter((notification) => !notification.read_at).length;

  if (checking) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <img src="/GRIMT-Logo.png" alt="GRIMT logo" className="mx-auto h-28 w-24 object-contain" />
          <UserRound className="mx-auto mt-4 size-8 text-primary" />
          <h1 className="mt-2 text-center text-2xl font-bold">Student Placement Portal</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Use the same email address submitted in your placement form.</p>
          {loginMessage && <div role="status" className="mt-5 rounded-lg border border-border bg-secondary/50 p-3 text-sm">{loginMessage}</div>}
          <form onSubmit={sendLoginLink} className="mt-5">
            <label htmlFor="student-email" className="text-sm font-medium">Email address</label>
            <input id="student-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5" placeholder="Your placement form email" />
            <button disabled={sendingLink} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60">{sendingLink ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />} Email me a login link</button>
          </form>
          <Link to="/" className="mt-5 block text-center text-sm font-medium text-primary hover:underline">Back to placement form</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><img src="/GRIMT-Logo.png" alt="GRIMT logo" className="h-16 w-14 object-contain" /><div><p className="text-xs font-semibold uppercase tracking-wide text-brand-red">Training &amp; Placement</p><h1 className="text-xl font-bold">Student Dashboard</h1><p className="text-sm text-muted-foreground">{profile?.student_name ?? session.user.email}</p></div></div>
          <button onClick={() => void supabase.auth.signOut()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium"><LogOut className="size-4" /> Sign out</button>
        </header>

        {error && <div role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
        {loading ? <div className="py-20 text-center"><Loader2 className="mx-auto size-7 animate-spin text-primary" /></div> : profile && (
          <>
            <section className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5"><BriefcaseBusiness className="size-5 text-primary" /><p className="mt-3 text-3xl font-bold">{jobs.length}</p><p className="text-sm text-muted-foreground">Open opportunities</p></div>
              <div className="rounded-xl border border-border bg-card p-5"><Bell className="size-5 text-primary" /><p className="mt-3 text-3xl font-bold">{unreadCount}</p><p className="text-sm text-muted-foreground">Unread notifications</p></div>
              <div className="rounded-xl border border-border bg-card p-5"><CheckCircle2 className="size-5 text-primary" /><p className="mt-3 text-3xl font-bold">{applications.length}</p><p className="text-sm text-muted-foreground">Applications</p></div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-card p-5"><h2 className="font-bold">My Profile</h2><dl className="mt-4 grid gap-3 text-sm"><div><dt className="text-muted-foreground">Roll number</dt><dd className="font-medium">{profile.roll_number}</dd></div><div><dt className="text-muted-foreground">Branch</dt><dd className="font-medium">{profile.branch ?? "—"}</dd></div><div><dt className="text-muted-foreground">Lateral entry</dt><dd className="font-medium">{profile.is_lateral_entry ? "Yes" : "No"}</dd></div><div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{profile.email}</dd></div><div><dt className="text-muted-foreground">Phone</dt><dd className="font-medium">{profile.contact_number}</dd></div><div><dt className="text-muted-foreground">Average</dt><dd className="font-medium">{profile.average_percentage ?? "—"}%</dd></div><div><dt className="text-muted-foreground">Total backlogs</dt><dd className="font-medium">{profile.total_reappears}</dd></div><div><dt className="text-muted-foreground">Aadhaar</dt><dd className="font-medium">XXXX-XXXX-{profile.aadhaar_number?.slice(-4) ?? "XXXX"}</dd></div></dl></div>
                <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Notifications</h2>{unreadCount > 0 && <button onClick={() => void markNotificationsRead()} className="text-xs font-medium text-primary hover:underline">Mark all read</button>}</div><div className="mt-4 space-y-3">{notifications.length === 0 ? <p className="text-sm text-muted-foreground">No notifications yet.</p> : notifications.slice(0, 8).map((notification) => <div key={notification.id} className={`rounded-lg border p-3 ${notification.read_at ? "border-border" : "border-primary/30 bg-primary/5"}`}><p className="text-sm font-semibold">{notification.title}</p><p className="mt-1 text-xs text-muted-foreground">{notification.message}</p></div>)}</div></div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5"><h2 className="text-lg font-bold">Placement Opportunities</h2><div className="mt-4 space-y-4">{jobs.length === 0 ? <p className="text-sm text-muted-foreground">No jobs are currently published.</p> : jobs.map((job) => { const application = applicationByJob.get(job.id); const deadlinePassed = !!job.application_deadline && new Date(job.application_deadline) < new Date(); return <article key={job.id} className="rounded-xl border border-border p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-lg font-bold">{job.title}</p><p className="font-medium text-primary">{job.company_name}</p></div>{application && <span className="h-fit rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">{application.status}</span>}</div><div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">{job.location && <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{job.location}</span>}{job.employment_type && <span>{job.employment_type}</span>}{job.salary_package && <span>{job.salary_package}</span>}</div><p className="mt-4 whitespace-pre-line text-sm leading-6">{job.description}</p>{job.application_deadline && <p className="mt-4 text-xs text-muted-foreground">Application deadline: {new Date(job.application_deadline).toLocaleString("en-IN")}</p>}<button onClick={() => void applyToJob(job.id)} disabled={!!application || deadlinePassed || !profile.wants_campus_placement} className="mt-4 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{application ? `Application: ${application.status}` : deadlinePassed ? "Applications closed" : !profile.wants_campus_placement ? "Placement not requested" : "Apply now"}</button></article>; })}</div></div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
