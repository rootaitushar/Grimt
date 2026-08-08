ALTER TABLE public.placement_students
  DROP CONSTRAINT IF EXISTS placement_students_excel_details_required;

ALTER TABLE public.placement_students
  ADD CONSTRAINT placement_students_excel_details_required CHECK (
    father_phone ~ '^[6-9][0-9]{9}$'
    AND NULLIF(BTRIM(mother_name), '') IS NOT NULL
    AND NULLIF(BTRIM(local_address), '') IS NOT NULL
    AND tenth_percentage IS NOT NULL
    AND twelfth_percentage IS NOT NULL
  ) NOT VALID;

CREATE OR REPLACE FUNCTION public.calculate_placement_student_academic_totals()
RETURNS TRIGGER AS $$
BEGIN
  SELECT AVG(mark)
    INTO NEW.average_percentage
    FROM (VALUES
      (NEW.semester_1_marks),
      (NEW.semester_2_marks),
      (NEW.semester_3_marks),
      (NEW.semester_4_marks),
      (NEW.semester_5_marks),
      (NEW.semester_6_marks),
      (NEW.semester_7_marks)
    ) AS semester_marks(mark)
    WHERE mark IS NOT NULL;

  NEW.total_reappears :=
    COALESCE(NEW.semester_1_reappears, 0)
    + COALESCE(NEW.semester_2_reappears, 0)
    + COALESCE(NEW.semester_3_reappears, 0)
    + COALESCE(NEW.semester_4_reappears, 0)
    + COALESCE(NEW.semester_5_reappears, 0)
    + COALESCE(NEW.semester_6_reappears, 0)
    + COALESCE(NEW.semester_7_reappears, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER calculate_placement_student_academic_totals
BEFORE INSERT OR UPDATE OF
  semester_1_marks, semester_1_reappears,
  semester_2_marks, semester_2_reappears,
  semester_3_marks, semester_3_reappears,
  semester_4_marks, semester_4_reappears,
  semester_5_marks, semester_5_reappears,
  semester_6_marks, semester_6_reappears,
  semester_7_marks, semester_7_reappears
ON public.placement_students
FOR EACH ROW EXECUTE FUNCTION public.calculate_placement_student_academic_totals();
