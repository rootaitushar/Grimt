ALTER TABLE public.placement_students
  ADD COLUMN aadhaar_number TEXT;

-- NOT VALID preserves historical submissions that predate this field while
-- still enforcing a mandatory, correctly formatted Aadhaar number on new rows.
ALTER TABLE public.placement_students
  ADD CONSTRAINT placement_students_aadhaar_number_valid
  CHECK (aadhaar_number IS NOT NULL AND aadhaar_number ~ '^[2-9][0-9]{11}$')
  NOT VALID;

COMMENT ON COLUMN public.placement_students.aadhaar_number IS
  'Required 12-digit Aadhaar number for submissions created after this migration.';
