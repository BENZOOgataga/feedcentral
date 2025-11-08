-- Disable 2FA for a specific user by email
UPDATE users 
SET 
  "twoFactorEnabled" = false,
  "twoFactorSecret" = NULL
WHERE email = 'user@example.com';

-- OR disable 2FA for a user by ID
UPDATE users 
SET 
  "twoFactorEnabled" = false,
  "twoFactorSecret" = NULL
WHERE id = 'user_id_here';

-- Verify the change
SELECT id, email, "twoFactorEnabled", "twoFactorSecret" 
FROM users 
WHERE email = 'user@example.com';
