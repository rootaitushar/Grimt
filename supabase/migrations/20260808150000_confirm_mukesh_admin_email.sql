-- The account was created through public Auth signup and requires confirmation
-- before password login is permitted.
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE id = 'd72d37e0-4a63-4461-ad3f-7a3c3f58a2a1';
