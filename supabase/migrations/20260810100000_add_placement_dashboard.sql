ALTER TABLE public.placement_students
  ADD COLUMN user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE TABLE public.placement_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  employment_type TEXT,
  salary_package TEXT,
  application_deadline TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.student_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.placement_jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.placement_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.placement_jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.placement_students(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (job_id, student_id),
  CONSTRAINT placement_application_status_valid CHECK (
    status IN ('Applied', 'Shortlisted', 'Test', 'Interview', 'Selected', 'Rejected', 'Joined')
  )
);

ALTER TABLE public.placement_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_jobs TO authenticated;
GRANT SELECT, UPDATE ON public.student_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.placement_applications TO authenticated;
GRANT ALL ON public.placement_jobs, public.student_notifications, public.placement_applications TO service_role;

CREATE POLICY "Admins manage placement jobs"
  ON public.placement_jobs FOR ALL TO authenticated
  USING (public.is_placement_admin())
  WITH CHECK (public.is_placement_admin() AND created_by = auth.uid());

CREATE POLICY "Students view published jobs"
  ON public.placement_jobs FOR SELECT TO authenticated
  USING (is_published);

CREATE POLICY "Students view their notifications"
  ON public.student_notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Students update their notifications"
  ON public.student_notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins view applications"
  ON public.placement_applications FOR SELECT TO authenticated
  USING (public.is_placement_admin());

CREATE POLICY "Students view their applications"
  ON public.placement_applications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Students apply to jobs"
  ON public.placement_applications FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.placement_students student
      WHERE student.id = student_id AND student.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.placement_jobs job
      WHERE job.id = job_id AND job.is_published
    )
  );

CREATE POLICY "Admins update applications"
  ON public.placement_applications FOR UPDATE TO authenticated
  USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());

CREATE POLICY "Students view their profile"
  ON public.placement_students FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.link_student_profile()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_student_id UUID;
  signed_in_email TEXT;
BEGIN
  signed_in_email := LOWER(auth.jwt() ->> 'email');
  IF signed_in_email IS NULL THEN
    RAISE EXCEPTION 'Authenticated email is required';
  END IF;

  SELECT id INTO matched_student_id
  FROM public.placement_students
  WHERE LOWER(email) = signed_in_email
    AND (user_id IS NULL OR user_id = auth.uid())
  ORDER BY created_at DESC
  LIMIT 1;

  IF matched_student_id IS NULL THEN
    RAISE EXCEPTION 'No student record matches this email address';
  END IF;

  UPDATE public.placement_students
  SET user_id = auth.uid()
  WHERE id = matched_student_id;

  INSERT INTO public.student_notifications (user_id, job_id, title, message)
  SELECT auth.uid(), job.id, 'Placement opportunity: ' || job.title,
    job.company_name || ' has published a new placement opportunity.'
  FROM public.placement_jobs job
  WHERE job.is_published
    AND EXISTS (
      SELECT 1 FROM public.placement_students student
      WHERE student.id = matched_student_id AND student.wants_campus_placement
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.student_notifications notification
      WHERE notification.user_id = auth.uid() AND notification.job_id = job.id
    );

  RETURN matched_student_id;
END;
$$;

REVOKE ALL ON FUNCTION public.link_student_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.link_student_profile() TO authenticated;

CREATE OR REPLACE FUNCTION public.create_job_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_published AND (TG_OP = 'INSERT' OR NOT OLD.is_published) THEN
    INSERT INTO public.student_notifications (user_id, job_id, title, message)
    SELECT student.user_id, NEW.id, 'Placement opportunity: ' || NEW.title,
      NEW.company_name || ' has published a new placement opportunity.'
    FROM public.placement_students student
    WHERE student.user_id IS NOT NULL AND student.wants_campus_placement
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_job_notifications_after_publish
AFTER INSERT OR UPDATE OF is_published ON public.placement_jobs
FOR EACH ROW EXECUTE FUNCTION public.create_job_notifications();

CREATE TRIGGER update_placement_jobs_updated_at
BEFORE UPDATE ON public.placement_jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_placement_applications_updated_at
BEFORE UPDATE ON public.placement_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
