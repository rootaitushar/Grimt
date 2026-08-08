ALTER TABLE public.placement_students
  ADD CONSTRAINT placement_opt_out_reason_required CHECK (
    wants_campus_placement
    OR NULLIF(BTRIM(placement_opt_out_reason), '') IS NOT NULL
  ) NOT VALID;
