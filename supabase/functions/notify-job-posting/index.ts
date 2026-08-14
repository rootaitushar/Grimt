import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const emailFrom = Deno.env.get("PLACEMENT_EMAIL_FROM");
    const authorization = request.headers.get("Authorization");
    if (!supabaseUrl || !serviceRoleKey || !authorization) throw new Error("Server authentication is not configured");
    if (!resendApiKey || !emailFrom) {
      return Response.json({ error: "Email sender is not configured" }, { status: 503, headers: corsHeaders });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const token = authorization.replace("Bearer ", "");
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData.user) return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });

    const { data: admin } = await adminClient
      .from("placement_admins")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (!admin) return Response.json({ error: "Admin access required" }, { status: 403, headers: corsHeaders });

    const { job_id } = await request.json();
    const { data: job, error: jobError } = await adminClient
      .from("placement_jobs")
      .select("*")
      .eq("id", job_id)
      .eq("is_published", true)
      .single();
    if (jobError || !job) return Response.json({ error: "Published job not found" }, { status: 404, headers: corsHeaders });

    const { data: students, error: studentsError } = await adminClient
      .from("placement_students")
      .select("student_name,email")
      .eq("wants_campus_placement", true);
    if (studentsError) throw studentsError;

    const deadline = job.application_deadline
      ? new Date(job.application_deadline).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : "Not specified";
    const siteUrl = Deno.env.get("PLACEMENT_SITE_URL") ?? "https://placement-form-buddy.lovable.app";
    const emails = (students ?? []).map((student) => ({
      from: emailFrom,
      to: [student.email],
      subject: `Placement opportunity: ${job.title} at ${job.company_name}`,
      html: `<p>Dear ${escapeHtml(student.student_name)},</p>
        <p>A new placement opportunity has been published.</p>
        <h2>${escapeHtml(job.title)}</h2>
        <p><strong>Company:</strong> ${escapeHtml(job.company_name)}</p>
        <p><strong>Location:</strong> ${escapeHtml(job.location ?? "Not specified")}</p>
        <p><strong>Package:</strong> ${escapeHtml(job.salary_package ?? "Not specified")}</p>
        <p><strong>Application deadline:</strong> ${escapeHtml(deadline)}</p>
        <p>${escapeHtml(job.description).replaceAll("\n", "<br>")}</p>
        <p><a href="${escapeHtml(`${siteUrl}/student`)}">Open your student placement dashboard</a></p>
        <p>Training &amp; Placement Department, GRIMT Radaur</p>`,
    }));

    let sent = 0;
    for (let index = 0; index < emails.length; index += 100) {
      const response = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(emails.slice(index, index + 100)),
      });
      if (!response.ok) throw new Error(`Email provider rejected a batch: ${await response.text()}`);
      sent += Math.min(100, emails.length - index);
    }

    return Response.json({ sent }, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Could not send job notifications" }, { status: 500, headers: corsHeaders });
  }
});
