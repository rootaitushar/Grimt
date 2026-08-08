ALTER TABLE public.placement_students
  ALTER COLUMN branch DROP NOT NULL,
  ALTER COLUMN semester DROP NOT NULL,
  ALTER COLUMN result_status DROP NOT NULL,
  ADD COLUMN father_phone TEXT,
  ADD COLUMN mother_name TEXT,
  ADD COLUMN mother_phone TEXT,
  ADD COLUMN local_address TEXT,
  ADD COLUMN tenth_percentage NUMERIC(5,2),
  ADD COLUMN twelfth_percentage NUMERIC(5,2),
  ADD COLUMN semester_1_marks NUMERIC(5,2),
  ADD COLUMN semester_1_reappears INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN semester_2_marks NUMERIC(5,2),
  ADD COLUMN semester_2_reappears INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN semester_3_marks NUMERIC(5,2),
  ADD COLUMN semester_3_reappears INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN semester_4_marks NUMERIC(5,2),
  ADD COLUMN semester_4_reappears INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN semester_5_marks NUMERIC(5,2),
  ADD COLUMN semester_5_reappears INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN semester_6_marks NUMERIC(5,2),
  ADD COLUMN semester_6_reappears INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN semester_7_marks NUMERIC(5,2),
  ADD COLUMN semester_7_reappears INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN average_percentage NUMERIC(5,2),
  ADD COLUMN total_reappears INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.placement_students
  DROP CONSTRAINT IF EXISTS placement_opt_out_reason_required,
  ADD CONSTRAINT placement_students_excel_details_required CHECK (
    father_phone ~ '^[6-9][0-9]{9}$'
    AND NULLIF(BTRIM(mother_name), '') IS NOT NULL
    AND mother_phone ~ '^[6-9][0-9]{9}$'
    AND NULLIF(BTRIM(local_address), '') IS NOT NULL
    AND tenth_percentage IS NOT NULL
    AND twelfth_percentage IS NOT NULL
    AND average_percentage IS NOT NULL
  ) NOT VALID,
  ADD CONSTRAINT placement_students_academic_values_valid CHECK (
    (tenth_percentage IS NULL OR tenth_percentage BETWEEN 0 AND 100)
    AND (twelfth_percentage IS NULL OR twelfth_percentage BETWEEN 0 AND 100)
    AND (semester_1_marks IS NULL OR semester_1_marks BETWEEN 0 AND 100)
    AND (semester_2_marks IS NULL OR semester_2_marks BETWEEN 0 AND 100)
    AND (semester_3_marks IS NULL OR semester_3_marks BETWEEN 0 AND 100)
    AND (semester_4_marks IS NULL OR semester_4_marks BETWEEN 0 AND 100)
    AND (semester_5_marks IS NULL OR semester_5_marks BETWEEN 0 AND 100)
    AND (semester_6_marks IS NULL OR semester_6_marks BETWEEN 0 AND 100)
    AND (semester_7_marks IS NULL OR semester_7_marks BETWEEN 0 AND 100)
    AND (average_percentage IS NULL OR average_percentage BETWEEN 0 AND 100)
    AND semester_1_reappears >= 0
    AND semester_2_reappears >= 0
    AND semester_3_reappears >= 0
    AND semester_4_reappears >= 0
    AND semester_5_reappears >= 0
    AND semester_6_reappears >= 0
    AND semester_7_reappears >= 0
    AND total_reappears >= 0
  );
