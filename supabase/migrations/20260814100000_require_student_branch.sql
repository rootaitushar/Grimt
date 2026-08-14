ALTER TABLE public.placement_students
  ADD CONSTRAINT placement_students_branch_required CHECK (
    NULLIF(BTRIM(branch), '') IS NOT NULL
  ) NOT VALID;
