-- Grant placement dashboard access to the first Supabase Auth admin account.
INSERT INTO public.placement_admins (user_id)
VALUES ('f4e382eb-5aa4-4af1-93e3-bcc2e5552683')
ON CONFLICT (user_id) DO NOTHING;
