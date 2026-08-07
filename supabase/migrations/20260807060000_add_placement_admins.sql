-- Admin accounts are regular Supabase Auth users whose IDs are added to this table.
CREATE TABLE public.placement_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.placement_admins ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.placement_admins TO authenticated;
GRANT ALL ON public.placement_admins TO service_role;

-- A signed-in user may only check whether their own account is an admin.
CREATE POLICY "Users can check their own admin status"
  ON public.placement_admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_placement_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.placement_admins
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_placement_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_placement_admin() TO authenticated;

GRANT SELECT ON public.placement_students TO authenticated;

CREATE POLICY "Placement admins can view submissions"
  ON public.placement_students FOR SELECT
  TO authenticated
  USING (public.is_placement_admin());

