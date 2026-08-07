CREATE TABLE public.placement_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  branch TEXT NOT NULL,
  semester TEXT NOT NULL,
  result_status TEXT NOT NULL,
  backlogs INTEGER NOT NULL DEFAULT 0,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.placement_students TO anon;
GRANT INSERT ON public.placement_students TO authenticated;
GRANT ALL ON public.placement_students TO service_role;

ALTER TABLE public.placement_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit placement details"
  ON public.placement_students FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_placement_students_updated_at
BEFORE UPDATE ON public.placement_students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();