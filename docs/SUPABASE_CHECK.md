**Manual steps (dashboard):**

1. Auth → Providers → Phone → Enable.

2. SMS provider = Test (dev) or Twilio (prod). If Test, add: `15551234567=123456` (digits only). Save.

3. Run SQL: open Supabase SQL editor and run contents of `supabase/sql/2025-10-16-age-gate.sql`.

4. Verify: Auth → Users shows new user after OTP; Table Editor → profiles has row.
