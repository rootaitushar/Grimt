-- Grant placement dashboard access to Mukesh's Supabase Auth account.
INSERT INTO public.placement_admins (user_id)
VALUES ('d72d37e0-4a63-4461-ad3f-7a3c3f58a2a1')
ON CONFLICT (user_id) DO NOTHING;
