# Supabase setup

The application is configured for project `yybjmedtsaveodupofqh` through `.env` and
`supabase/config.toml`.

## 1. Create the database tables and policies

In the Supabase dashboard, open **SQL Editor**, create a new query, paste the full contents of
these files in order, and run each query:

1. `supabase/migrations/20260807042333_39d0a697-dca3-4c2f-adc5-92ea74dd6d26.sql`
2. `supabase/migrations/20260807060000_add_placement_admins.sql`
3. `supabase/migrations/20260807070000_add_first_placement_admin.sql`

The first migration creates the student table and lets the public form submit records. The second
adds admin-only read access, and the third grants access to the first admin account. The publishable
key is safe to use in the browser because row-level security prevents public users from reading
student records.

## 2. Create the first admin

The first Auth account has already been created. Confirm its verification email, then run migration
3 above to grant it admin access. To add another admin later, create the user in **Authentication >
Users**, copy the user's UUID, and run:

```sql
INSERT INTO public.placement_admins (user_id)
VALUES ('PASTE-AUTH-USER-UUID-HERE');
```

Open `/admin` on the deployed site and sign in with that email and password.

## 3. Existing records

Changing `.env` redirects future submissions; it does not copy records from the previous Supabase
project. To move old records, export `placement_students` from the old project's Table Editor as
CSV, then import that CSV into `placement_students` in the new project. Keep the column names and
do not import duplicate `roll_number` values.
