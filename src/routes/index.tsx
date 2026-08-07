import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Placement Student Information Form | GRIMT Radaur" },
      {
        name: "description",
        content:
          "Submit your details to the Training & Placement Department, Global Research Institute of Management & Technology, Radaur (Yamunanagar).",
      },
      { property: "og:title", content: "Placement Student Information Form | GRIMT Radaur" },
      {
        property: "og:description",
        content:
          "Submit your details to the Training & Placement Department, Global Research Institute of Management & Technology, Radaur (Yamunanagar).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type FormState = {
  student_name: string;
  father_name: string;
  roll_number: string;
  branch: string;
  semester: string;
  result_status: string;
  backlogs: string;
  contact_number: string;
  email: string;
  address: string;
  remarks: string;
};

const emptyForm: FormState = {
  student_name: "",
  father_name: "",
  roll_number: "",
  branch: "",
  semester: "",
  result_status: "",
  backlogs: "0",
  contact_number: "",
  email: "",
  address: "",
  remarks: "",
};

type Errors = { [K in keyof FormState]?: string | undefined };

const fieldClass =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-base text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

function Field({
  id,
  label,
  required,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean | undefined;
  error?: string | undefined;
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Index() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isClear = form.result_status === "Clear";

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSuccess(false);
    setFormError(null);
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.student_name.trim()) e.student_name = "Please enter your name.";
    if (!form.father_name.trim()) e.father_name = "Please enter your father's name.";
    if (!form.roll_number.trim()) e.roll_number = "Please enter your roll number.";
    if (!form.branch.trim()) e.branch = "Please enter your branch.";
    if (!form.semester.trim()) e.semester = "Please enter your semester.";
    if (!form.result_status) e.result_status = "Please select your result status.";

    const backlogs = Number(form.backlogs);
    if (!isClear && (form.backlogs.trim() === "" || !Number.isInteger(backlogs) || backlogs < 0))
      e.backlogs = "Please enter a valid number of backlogs.";

    if (!/^[6-9]\d{9}$/.test(form.contact_number.replace(/\D/g, "")))
      e.contact_number = "Please enter a valid 10-digit mobile number.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      e.email = "Please enter a valid email address.";

    if (!form.address.trim()) e.address = "Please enter your address.";
    return e;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("placement_students").insert({
        student_name: form.student_name.trim(),
        father_name: form.father_name.trim(),
        roll_number: form.roll_number.trim(),
        branch: form.branch.trim(),
        semester: form.semester.trim(),
        result_status: form.result_status,
        backlogs: isClear ? 0 : Number(form.backlogs),
        contact_number: form.contact_number.replace(/\D/g, ""),
        email: form.email.trim(),
        address: form.address.trim(),
        remarks: form.remarks.trim() || null,
      });

      if (error) {
        if (error.code === "23505") {
          setFormError("Details for this Roll Number have already been submitted.");
        } else {
          setFormError("Unable to submit your details right now. Please try again.");
        }
        return;
      }

      setForm(emptyForm);
      setErrors({});
      setSuccess(true);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("Unable to submit your details right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-[900px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border bg-secondary/60 px-5 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <img
                src="/GRIMT-Logo.png"
                alt="Global Research Institute of Management & Technology, Radaur logo"
                className="size-16 shrink-0 rounded-full bg-card object-contain p-1 ring-1 ring-border sm:size-20"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-brand-red uppercase sm:text-sm">
                  Training &amp; Placement Department
                </p>
                <h1 className="mt-1 text-xl leading-tight font-bold text-primary sm:text-2xl">
                  Placement Student Information Form
                </h1>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Global Research Institute of Management &amp; Technology, Radaur–Jathlana
                  Road, Radaur, Yamunanagar, Haryana 135133
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Please fill in your details carefully. The information provided will be used for
              placement-related activities.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            {success && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4"
              >
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-hidden />
                <div className="min-w-0">
                  <p className="font-semibold text-success">Details Submitted Successfully!</p>
                  <p className="text-sm text-foreground/80">
                    Your information has been recorded for placement purposes.
                  </p>
                </div>
              </div>
            )}

            {formError && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="student_name" label="Name" required error={errors.student_name}>
                <input
                  id="student_name"
                  type="text"
                  className={fieldClass}
                  placeholder="Enter your full name"
                  value={form.student_name}
                  onChange={(e) => set("student_name", e.target.value)}
                  aria-invalid={!!errors.student_name}
                  aria-describedby={errors.student_name ? "student_name-error" : undefined}
                />
              </Field>

              <Field id="father_name" label="Father's Name" required error={errors.father_name}>
                <input
                  id="father_name"
                  type="text"
                  className={fieldClass}
                  placeholder="Enter father's name"
                  value={form.father_name}
                  onChange={(e) => set("father_name", e.target.value)}
                  aria-invalid={!!errors.father_name}
                  aria-describedby={errors.father_name ? "father_name-error" : undefined}
                />
              </Field>

              <Field id="roll_number" label="Roll No." required error={errors.roll_number}>
                <input
                  id="roll_number"
                  type="text"
                  className={fieldClass}
                  placeholder="Enter your roll number"
                  value={form.roll_number}
                  onChange={(e) => set("roll_number", e.target.value)}
                  aria-invalid={!!errors.roll_number}
                  aria-describedby={errors.roll_number ? "roll_number-error" : undefined}
                />
              </Field>

              <Field id="branch" label="Branch" required error={errors.branch}>
                <input
                  id="branch"
                  type="text"
                  className={fieldClass}
                  placeholder="Enter your branch, e.g. CSE"
                  value={form.branch}
                  onChange={(e) => set("branch", e.target.value)}
                  aria-invalid={!!errors.branch}
                  aria-describedby={errors.branch ? "branch-error" : undefined}
                />
              </Field>

              <Field id="semester" label="Semester" required error={errors.semester}>
                <input
                  id="semester"
                  type="text"
                  className={fieldClass}
                  placeholder="Enter your semester, e.g. 6th Semester"
                  value={form.semester}
                  onChange={(e) => set("semester", e.target.value)}
                  aria-invalid={!!errors.semester}
                  aria-describedby={errors.semester ? "semester-error" : undefined}
                />
              </Field>

              <Field id="result_status" label="Result" required error={errors.result_status}>
                <select
                  id="result_status"
                  className={fieldClass}
                  value={form.result_status}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((f) => ({
                      ...f,
                      result_status: value,
                      backlogs: value === "Clear" ? "0" : f.backlogs,
                    }));
                    setErrors((er) => ({ ...er, result_status: undefined, backlogs: undefined }));
                    setSuccess(false);
                  }}
                  aria-invalid={!!errors.result_status}
                  aria-describedby={errors.result_status ? "result_status-error" : undefined}
                >
                  <option value="">Select Result Status</option>
                  <option value="Clear">Clear</option>
                  <option value="Awaiting Result">Awaiting Result</option>
                  <option value="Backlog / Reappear">Backlog / Reappear</option>
                </select>
              </Field>

              <Field id="backlogs" label="No. of Backlogs" required error={errors.backlogs}>
                <input
                  id="backlogs"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className={fieldClass}
                  value={isClear ? "0" : form.backlogs}
                  disabled={isClear}
                  onChange={(e) => set("backlogs", e.target.value)}
                  aria-invalid={!!errors.backlogs}
                  aria-describedby={errors.backlogs ? "backlogs-error" : undefined}
                />
              </Field>

              <Field id="contact_number" label="Contact No." required error={errors.contact_number}>
                <input
                  id="contact_number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className={fieldClass}
                  placeholder="Enter 10-digit mobile number"
                  value={form.contact_number}
                  onChange={(e) => set("contact_number", e.target.value.replace(/\D/g, ""))}
                  aria-invalid={!!errors.contact_number}
                  aria-describedby={errors.contact_number ? "contact_number-error" : undefined}
                />
              </Field>

              <Field
                id="email"
                label="Email"
                required
                error={errors.email}
                className="sm:col-span-2"
              >
                <input
                  id="email"
                  type="email"
                  className={fieldClass}
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </Field>

              <Field
                id="address"
                label="Address"
                required
                error={errors.address}
                className="sm:col-span-2"
              >
                <textarea
                  id="address"
                  rows={3}
                  className={`${fieldClass} min-h-24 resize-y`}
                  placeholder="Enter your complete address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "address-error" : undefined}
                />
              </Field>

              <Field id="remarks" label="Remarks" error={errors.remarks} className="sm:col-span-2">
                <textarea
                  id="remarks"
                  rows={3}
                  className={`${fieldClass} min-h-24 resize-y`}
                  placeholder="Enter any additional information, if applicable"
                  value={form.remarks}
                  onChange={(e) => set("remarks", e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-5" aria-hidden />
                      Submit Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <footer className="mt-6 text-center">
          <p className="text-sm font-semibold text-foreground">Training &amp; Placement Department</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Student information will be used only for placement-related activities.
          </p>
        </footer>
      </div>
    </main>
  );
}
