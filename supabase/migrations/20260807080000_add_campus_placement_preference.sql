ALTER TABLE public.placement_students
  ADD COLUMN wants_campus_placement BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN placement_opt_out_reason TEXT;

ALTER TABLE public.placement_students
  ADD CONSTRAINT placement_opt_out_reason_required
  CHECK (
    wants_campus_placement
    OR NULLIF(BTRIM(placement_opt_out_reason), '') IS NOT NULL
  );

