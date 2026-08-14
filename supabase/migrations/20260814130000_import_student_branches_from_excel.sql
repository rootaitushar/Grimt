CREATE TEMP TABLE branch_import_map (
  roll_number TEXT PRIMARY KEY,
  branch TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO branch_import_map (roll_number, branch) VALUES
  ('242191925005', 'DMLT'),
  ('46242046', 'BCA'),
  ('242191925006', 'DMLT'),
  ('242191900505', 'DMLT'),
  ('46242031', 'BCA'),
  ('2023310404', 'B.Tech CSE'),
  ('46242020', 'BCA'),
  ('46242021', 'BCA'),
  ('7323119', 'B.Tech CSE'),
  ('46242011', 'BCA'),
  ('46242013', 'BCA'),
  ('24219125001', 'DMLT'),
  ('242191925008', 'DMLT'),
  ('2023056201', 'B.Tech'),
  ('242191900516', 'DMLT'),
  ('242191900503', 'DMLT'),
  ('2024255614', 'BCA'),
  ('2024255605', 'BCA'),
  ('46242018', 'BCA'),
  ('46242022', 'BCA'),
  ('2024255606', 'DMLT'),
  ('4623014', 'B.Tech'),
  ('242191925002', 'DMLT'),
  ('2024255622', 'BCA'),
  ('4623010', 'B.Tech'),
  ('46241019', 'BBA'),
  ('46241014', 'BBA'),
  ('4623016', 'B.Tech'),
  ('46241006', 'BBA'),
  ('2024255627', 'BCA'),
  ('46242016', 'BCA'),
  ('46242012', 'BCA'),
  ('46242039', 'BCA'),
  ('46242024', 'BCA'),
  ('46241010', 'BBA'),
  ('46241012', 'BBA'),
  ('2024255626', 'BCA'),
  ('46242036', 'BCA'),
  ('46242010', 'BCA');

DO $$
DECLARE
  missing_rolls TEXT;
BEGIN
  SELECT STRING_AGG(branch_map.roll_number, ', ' ORDER BY branch_map.roll_number)
  INTO missing_rolls
  FROM branch_import_map branch_map
  LEFT JOIN public.placement_students student
    ON BTRIM(student.roll_number) = branch_map.roll_number
  WHERE student.id IS NULL;

  IF missing_rolls IS NOT NULL THEN
    RAISE EXCEPTION 'Branch import stopped. Missing student roll numbers: %', missing_rolls;
  END IF;
END;
$$;

UPDATE public.placement_students student
SET branch = branch_map.branch
FROM branch_import_map branch_map
WHERE BTRIM(student.roll_number) = branch_map.roll_number;
