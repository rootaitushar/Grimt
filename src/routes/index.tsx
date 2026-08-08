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
  roll_number: string;
  aadhaar_number: string;
  contact_number: string;
  email: string;
  father_name: string;
  father_phone: string;
  mother_name: string;
  permanent_address: string;
  local_address: string;
  tenth_percentage: string;
  twelfth_percentage: string;
  semester_1_status: string;
  semester_1_marks: string;
  semester_1_reappears: string;
  semester_2_status: string;
  semester_2_marks: string;
  semester_2_reappears: string;
  semester_3_status: string;
  semester_3_marks: string;
  semester_3_reappears: string;
  semester_4_status: string;
  semester_4_marks: string;
  semester_4_reappears: string;
  semester_5_status: string;
  semester_5_marks: string;
  semester_5_reappears: string;
  semester_6_status: string;
  semester_6_marks: string;
  semester_6_reappears: string;
  semester_7_status: string;
  semester_7_marks: string;
  semester_7_reappears: string;
  campus_placement: string;
  placement_opt_out_reason: string;
};

const emptyForm: FormState = {
  student_name: "",
  roll_number: "",
  aadhaar_number: "",
  contact_number: "",
  email: "",
  father_name: "",
  father_phone: "",
  mother_name: "",
  permanent_address: "",
  local_address: "",
  tenth_percentage: "",
  twelfth_percentage: "",
  semester_1_status: "",
  semester_1_marks: "",
  semester_1_reappears: "0",
  semester_2_status: "",
  semester_2_marks: "",
  semester_2_reappears: "0",
  semester_3_status: "",
  semester_3_marks: "",
  semester_3_reappears: "0",
  semester_4_status: "",
  semester_4_marks: "",
  semester_4_reappears: "0",
  semester_5_status: "",
  semester_5_marks: "",
  semester_5_reappears: "0",
  semester_6_status: "",
  semester_6_marks: "",
  semester_6_reappears: "0",
  semester_7_status: "",
  semester_7_marks: "",
  semester_7_reappears: "0",
  campus_placement: "",
  placement_opt_out_reason: "",
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

  const semesterNumbers = [1, 2, 3, 4, 5, 6, 7] as const;
  const completedSemesterMarks = semesterNumbers
    .map((semester) => {
      const status = form[`semester_${semester}_status`];
      const marks = form[`semester_${semester}_marks`];
      return status !== "Result Awaited" && marks !== "" ? Number(marks) : null;
    })
    .filter((marks): marks is number => marks !== null && Number.isFinite(marks));
  const calculatedAverage = completedSemesterMarks.length
    ? completedSemesterMarks.reduce((total, marks) => total + marks, 0) /
      completedSemesterMarks.length
    : null;
  const calculatedTotalReappears = semesterNumbers.reduce((total, semester) => {
    if (form[`semester_${semester}_status`] !== "Backlog") return total;
    return total + (Number(form[`semester_${semester}_reappears`]) || 0);
  }, 0);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSuccess(false);
    setFormError(null);
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.student_name.trim()) e.student_name = "Please enter your name.";
    if (!form.roll_number.trim()) e.roll_number = "Please enter your roll number.";

    if (!/^[6-9]\d{9}$/.test(form.contact_number.replace(/\D/g, "")))
      e.contact_number = "Please enter a valid 10-digit mobile number.";

    if (!/^[2-9]\d{11}$/.test(form.aadhaar_number.replace(/\D/g, "")))
      e.aadhaar_number = "Please enter a valid 12-digit Aadhaar number.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      e.email = "Please enter a valid email address.";

    if (!form.father_name.trim()) e.father_name = "Please enter your father's name.";
    if (!/^[6-9]\d{9}$/.test(form.father_phone.replace(/\D/g, "")))
      e.father_phone = "Please enter a valid 10-digit mobile number.";
    if (!form.mother_name.trim()) e.mother_name = "Please enter your mother's name.";
    if (!form.permanent_address.trim())
      e.permanent_address = "Please enter your permanent/home-town address.";
    if (!form.local_address.trim()) e.local_address = "Please enter your local address.";

    const validatePercentage = (key: keyof FormState, label: string) => {
      const value = Number(form[key]);
      if (form[key].trim() === "" || !Number.isFinite(value) || value < 0 || value > 100)
        e[key] = `Please enter a valid ${label} between 0 and 100.`;
    };
    validatePercentage("tenth_percentage", "10th percentage");
    validatePercentage("twelfth_percentage", "12th percentage");
    for (const semester of semesterNumbers) {
      const statusKey = `semester_${semester}_status` as keyof FormState;
      const marksKey = `semester_${semester}_marks` as keyof FormState;
      const reappearsKey = `semester_${semester}_reappears` as keyof FormState;
      const status = form[statusKey];
      const marks = Number(form[marksKey]);
      const reappears = Number(form[reappearsKey]);
      if (!status && semester <= 5) e[statusKey] = "Please select the semester result status.";
      if (!status) continue;
      if (status !== "Result Awaited" && (form[marksKey] === "" || marks < 0 || marks > 100))
        e[marksKey] = "Please enter a percentage between 0 and 100.";
      if (status === "Backlog" && (!Number.isInteger(reappears) || reappears < 1))
        e[reappearsKey] = "Enter at least 1 backlog.";
    }

    if (!form.campus_placement)
      e.campus_placement = "Please select whether placement is required.";
    if (form.campus_placement === "No" && !form.placement_opt_out_reason.trim())
      e.placement_opt_out_reason = "Please enter the reason placement is not required.";
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
        roll_number: form.roll_number.trim(),
        aadhaar_number: form.aadhaar_number.replace(/\D/g, ""),
        contact_number: form.contact_number.replace(/\D/g, ""),
        email: form.email.trim(),
        father_name: form.father_name.trim(),
        father_phone: form.father_phone.replace(/\D/g, ""),
        mother_name: form.mother_name.trim(),
        address: form.permanent_address.trim(),
        local_address: form.local_address.trim(),
        tenth_percentage: Number(form.tenth_percentage),
        twelfth_percentage: Number(form.twelfth_percentage),
        semester_1_status: form.semester_1_status,
        semester_1_marks: form.semester_1_marks ? Number(form.semester_1_marks) : null,
        semester_1_reappears: Number(form.semester_1_reappears),
        semester_2_status: form.semester_2_status,
        semester_2_marks: form.semester_2_marks ? Number(form.semester_2_marks) : null,
        semester_2_reappears: Number(form.semester_2_reappears),
        semester_3_status: form.semester_3_status,
        semester_3_marks: form.semester_3_marks ? Number(form.semester_3_marks) : null,
        semester_3_reappears: Number(form.semester_3_reappears),
        semester_4_status: form.semester_4_status,
        semester_4_marks: form.semester_4_marks ? Number(form.semester_4_marks) : null,
        semester_4_reappears: Number(form.semester_4_reappears),
        semester_5_status: form.semester_5_status,
        semester_5_marks: form.semester_5_marks ? Number(form.semester_5_marks) : null,
        semester_5_reappears: Number(form.semester_5_reappears),
        semester_6_status: form.semester_6_status || null,
        semester_6_marks: form.semester_6_marks ? Number(form.semester_6_marks) : null,
        semester_6_reappears: Number(form.semester_6_reappears),
        semester_7_status: form.semester_7_status || null,
        semester_7_marks: form.semester_7_marks ? Number(form.semester_7_marks) : null,
        semester_7_reappears: Number(form.semester_7_reappears),
        average_percentage: calculatedAverage,
        total_reappears: calculatedTotalReappears,
        wants_campus_placement: form.campus_placement === "Yes",
        placement_opt_out_reason:
          form.campus_placement === "No" ? form.placement_opt_out_reason.trim() : null,
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
                className="h-24 w-20 shrink-0 object-contain sm:h-32 sm:w-28"
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

              <Field
                id="aadhaar_number"
                label="Aadhaar No."
                required
                error={errors.aadhaar_number}
              >
                <input
                  id="aadhaar_number"
                  name="aadhaar_number"
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  autoComplete="off"
                  className={fieldClass}
                  placeholder="Enter 12-digit Aadhaar number"
                  value={form.aadhaar_number}
                  onChange={(e) => set("aadhaar_number", e.target.value.replace(/\D/g, ""))}
                  aria-invalid={!!errors.aadhaar_number}
                  aria-describedby={errors.aadhaar_number ? "aadhaar_number-error" : undefined}
                />
              </Field>

              <Field id="contact_number" label="Student Phone No." required error={errors.contact_number}>
                <input id="contact_number" type="tel" inputMode="numeric" maxLength={10} className={fieldClass} placeholder="Enter 10-digit mobile number" value={form.contact_number} onChange={(e) => set("contact_number", e.target.value.replace(/\D/g, ""))} aria-invalid={!!errors.contact_number} aria-describedby={errors.contact_number ? "contact_number-error" : undefined} />
              </Field>

              <Field id="email" label="Student Email" required error={errors.email}>
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

              <div className="border-border sm:col-span-2 border-t pt-2"><h2 className="font-semibold text-primary">Parents' Details</h2></div>
              <Field id="father_name" label="Father's Name" required error={errors.father_name}><input id="father_name" type="text" className={fieldClass} placeholder="Enter father's name" value={form.father_name} onChange={(e) => set("father_name", e.target.value)} aria-invalid={!!errors.father_name} /></Field>
              <Field id="father_phone" label="Father's Phone No." required error={errors.father_phone}><input id="father_phone" type="tel" inputMode="numeric" maxLength={10} className={fieldClass} placeholder="Enter father's phone number" value={form.father_phone} onChange={(e) => set("father_phone", e.target.value.replace(/\D/g, ""))} aria-invalid={!!errors.father_phone} /></Field>
              <Field id="mother_name" label="Mother's Name" required error={errors.mother_name} className="sm:col-span-2"><input id="mother_name" type="text" className={fieldClass} placeholder="Enter mother's name" value={form.mother_name} onChange={(e) => set("mother_name", e.target.value)} aria-invalid={!!errors.mother_name} /></Field>

              <div className="border-border sm:col-span-2 border-t pt-2"><h2 className="font-semibold text-primary">Complete Address</h2></div>
              <Field id="permanent_address" label="Permanent / Home Town" required error={errors.permanent_address}><textarea id="permanent_address" rows={3} className={`${fieldClass} min-h-24 resize-y`} placeholder="Enter permanent/home-town address" value={form.permanent_address} onChange={(e) => set("permanent_address", e.target.value)} aria-invalid={!!errors.permanent_address} /></Field>
              <Field id="local_address" label="Local Address" required error={errors.local_address}><textarea id="local_address" rows={3} className={`${fieldClass} min-h-24 resize-y`} placeholder="Enter local address" value={form.local_address} onChange={(e) => set("local_address", e.target.value)} aria-invalid={!!errors.local_address} /></Field>

              <div className="border-border sm:col-span-2 border-t pt-2"><h2 className="font-semibold text-primary">Academic Details</h2></div>
              <Field id="tenth_percentage" label="10th Marks (%)" required error={errors.tenth_percentage}><input id="tenth_percentage" type="number" min={0} max={100} step="0.01" className={fieldClass} placeholder="Enter 10th percentage" value={form.tenth_percentage} onChange={(e) => set("tenth_percentage", e.target.value)} aria-invalid={!!errors.tenth_percentage} /></Field>
              <Field id="twelfth_percentage" label="12th Marks (%)" required error={errors.twelfth_percentage}><input id="twelfth_percentage" type="number" min={0} max={100} step="0.01" className={fieldClass} placeholder="Enter 12th percentage" value={form.twelfth_percentage} onChange={(e) => set("twelfth_percentage", e.target.value)} aria-invalid={!!errors.twelfth_percentage} /></Field>

              {semesterNumbers.map((semester) => {
                const statusKey = `semester_${semester}_status` as keyof FormState;
                const marksKey = `semester_${semester}_marks` as keyof FormState;
                const reappearsKey = `semester_${semester}_reappears` as keyof FormState;
                const status = form[statusKey];
                return (
                  <div key={semester} className="grid gap-3 rounded-lg border border-border p-3 sm:col-span-2 sm:grid-cols-3">
                    <Field
                      id={statusKey}
                      label={`Semester ${semester} Status${semester >= 6 ? " (Optional)" : ""}`}
                      required={semester <= 5}
                      error={errors[statusKey]}
                    >
                      <select
                        id={statusKey}
                        className={fieldClass}
                        value={status}
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm((current) => ({
                            ...current,
                            [statusKey]: value,
                            [marksKey]:
                              value === "Result Awaited" || value === ""
                                ? ""
                                : current[marksKey],
                            [reappearsKey]: value === "Backlog" ? current[reappearsKey] : "0",
                          }));
                          setErrors((current) => ({ ...current, [statusKey]: undefined, [marksKey]: undefined, [reappearsKey]: undefined }));
                          setSuccess(false);
                          setFormError(null);
                        }}
                      >
                        <option value="">Select status</option>
                        <option value="Clear">Clear</option>
                        <option value="Backlog">Backlog</option>
                        <option value="Result Awaited">Result Awaited</option>
                      </select>
                    </Field>
                    <Field id={marksKey} label="Percentage" required={status !== "Result Awaited"} error={errors[marksKey]}><input id={marksKey} type="number" min={0} max={100} step="0.01" className={fieldClass} placeholder={status === "Result Awaited" ? "Not available" : "Marks %"} value={form[marksKey]} disabled={!status || status === "Result Awaited"} onChange={(e) => set(marksKey, e.target.value)} /></Field>
                    <Field id={reappearsKey} label="No. of Backlogs" required={status === "Backlog"} error={errors[reappearsKey]}><input id={reappearsKey} type="number" min={status === "Backlog" ? 1 : 0} step={1} className={fieldClass} value={form[reappearsKey]} disabled={status !== "Backlog"} onChange={(e) => set(reappearsKey, e.target.value)} /></Field>
                  </div>
                );
              })}

              <Field id="average_percentage" label="Total Percentage (Automatic)"><input id="average_percentage" type="text" className={fieldClass} value={calculatedAverage === null ? "" : calculatedAverage.toFixed(2)} placeholder="Calculated from available semesters" readOnly /></Field>
              <Field id="total_reappears" label="Total Backlogs (Automatic)"><input id="total_reappears" type="text" className={fieldClass} value={String(calculatedTotalReappears)} readOnly /></Field>

              <Field id="campus_placement" label="Placement Required" required error={errors.campus_placement} className="sm:col-span-2">
                <select
                  id="campus_placement"
                  className={fieldClass}
                  value={form.campus_placement}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((current) => ({
                      ...current,
                      campus_placement: value,
                      placement_opt_out_reason:
                        value === "No" ? current.placement_opt_out_reason : "",
                    }));
                    setErrors((current) => ({
                      ...current,
                      campus_placement: undefined,
                      placement_opt_out_reason: undefined,
                    }));
                    setSuccess(false);
                    setFormError(null);
                  }}
                  aria-invalid={!!errors.campus_placement}
                >
                  <option value="">Select Yes or No</option><option value="Yes">Yes</option><option value="No">No</option>
                </select>
              </Field>

              {form.campus_placement === "No" && (
                <Field
                  id="placement_opt_out_reason"
                  label="Reason Placement Is Not Required"
                  required
                  error={errors.placement_opt_out_reason}
                  className="sm:col-span-2"
                >
                  <textarea
                    id="placement_opt_out_reason"
                    rows={3}
                    className={`${fieldClass} min-h-24 resize-y`}
                    placeholder="Enter the reason"
                    value={form.placement_opt_out_reason}
                    onChange={(e) => set("placement_opt_out_reason", e.target.value)}
                    aria-invalid={!!errors.placement_opt_out_reason}
                    aria-describedby={
                      errors.placement_opt_out_reason
                        ? "placement_opt_out_reason-error"
                        : undefined
                    }
                  />
                </Field>
              )}

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
