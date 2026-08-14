CREATE OR REPLACE FUNCTION public.canonicalize_placement_branch(branch_name TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
RETURNS NULL ON NULL INPUT
SET search_path = public
AS $$
  SELECT CASE
    WHEN REGEXP_REPLACE(LOWER(BTRIM(branch_name)), '[^a-z0-9]', '', 'g') = 'dmlt' THEN 'DMLT'
    WHEN REGEXP_REPLACE(LOWER(BTRIM(branch_name)), '[^a-z0-9]', '', 'g') = 'bca' THEN 'BCA'
    WHEN REGEXP_REPLACE(LOWER(BTRIM(branch_name)), '[^a-z0-9]', '', 'g') = 'bba' THEN 'BBA'
    WHEN REGEXP_REPLACE(LOWER(BTRIM(branch_name)), '[^a-z0-9]', '', 'g') LIKE 'btech%' THEN 'B.Tech'
    ELSE UPPER(BTRIM(branch_name))
  END;
$$;

UPDATE public.placement_students
SET branch = public.canonicalize_placement_branch(branch)
WHERE branch IS NOT NULL;

CREATE OR REPLACE FUNCTION public.normalize_placement_student_branch()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.branch := public.canonicalize_placement_branch(NEW.branch);
  RETURN NEW;
END;
$$;

CREATE TRIGGER normalize_placement_student_branch_before_write
BEFORE INSERT OR UPDATE OF branch ON public.placement_students
FOR EACH ROW EXECUTE FUNCTION public.normalize_placement_student_branch();
