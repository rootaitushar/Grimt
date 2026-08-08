ALTER TABLE public.placement_students
  DROP CONSTRAINT IF EXISTS placement_students_semester_statuses_valid;

ALTER TABLE public.placement_students
  ADD CONSTRAINT placement_students_semester_statuses_valid CHECK (
    semester_1_status IS NOT NULL AND semester_1_status IN ('Clear', 'Backlog', 'Result Awaited')
    AND semester_2_status IS NOT NULL AND semester_2_status IN ('Clear', 'Backlog', 'Result Awaited')
    AND semester_3_status IS NOT NULL AND semester_3_status IN ('Clear', 'Backlog', 'Result Awaited')
    AND semester_4_status IS NOT NULL AND semester_4_status IN ('Clear', 'Backlog', 'Result Awaited')
    AND semester_5_status IS NOT NULL AND semester_5_status IN ('Clear', 'Backlog', 'Result Awaited')
    AND (semester_1_status = 'Backlog') = (semester_1_reappears > 0)
    AND (semester_2_status = 'Backlog') = (semester_2_reappears > 0)
    AND (semester_3_status = 'Backlog') = (semester_3_reappears > 0)
    AND (semester_4_status = 'Backlog') = (semester_4_reappears > 0)
    AND (semester_5_status = 'Backlog') = (semester_5_reappears > 0)
    AND (semester_1_status = 'Result Awaited') = (semester_1_marks IS NULL)
    AND (semester_2_status = 'Result Awaited') = (semester_2_marks IS NULL)
    AND (semester_3_status = 'Result Awaited') = (semester_3_marks IS NULL)
    AND (semester_4_status = 'Result Awaited') = (semester_4_marks IS NULL)
    AND (semester_5_status = 'Result Awaited') = (semester_5_marks IS NULL)
    AND (
      (semester_6_status IS NULL AND semester_6_marks IS NULL AND semester_6_reappears = 0)
      OR (
        semester_6_status IN ('Clear', 'Backlog', 'Result Awaited')
        AND (semester_6_status = 'Backlog') = (semester_6_reappears > 0)
        AND (semester_6_status = 'Result Awaited') = (semester_6_marks IS NULL)
      )
    )
    AND (
      (semester_7_status IS NULL AND semester_7_marks IS NULL AND semester_7_reappears = 0)
      OR (
        semester_7_status IN ('Clear', 'Backlog', 'Result Awaited')
        AND (semester_7_status = 'Backlog') = (semester_7_reappears > 0)
        AND (semester_7_status = 'Result Awaited') = (semester_7_marks IS NULL)
      )
    )
  ) NOT VALID;
