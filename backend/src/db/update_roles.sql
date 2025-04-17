-- Update users table to remove organizer role
ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE users ADD CONSTRAINT valid_role CHECK (role IN ('admin', 'participant', 'user', 'judge'));

-- Update existing organizer users to be judges
UPDATE users SET role = 'judge' WHERE role = 'organizer';

-- Update judges table to link with users
ALTER TABLE judges ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Link existing judges with user accounts
UPDATE judges j
SET user_id = u.id
FROM users u
WHERE u.role = 'judge' AND u.email LIKE 'judge%@techfest.com';

-- Remove organizer-specific data
DELETE FROM users WHERE email LIKE 'organizer%@techfest.com';

-- Update event_judges to ensure all judges have proper roles
UPDATE event_judges SET role = 'Judge' WHERE role IS NULL OR role = 'organizer'; 