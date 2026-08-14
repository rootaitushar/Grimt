-- The Lovable production URL is currently serving an older frontend bundle
-- that does not send these newer fields. Keep core NOT NULL, unique roll-number,
-- branch, phone and email protections, but temporarily remove constraints that
-- the stale deployed form cannot satisfy. Restore them after republishing the
-- current frontend from GitHub main.
ALTER TABLE public.placement_students
  DROP CONSTRAINT IF EXISTS placement_students_aadhaar_number_valid,
  DROP CONSTRAINT IF EXISTS placement_students_excel_details_required,
  DROP CONSTRAINT IF EXISTS placement_students_semester_statuses_valid;
