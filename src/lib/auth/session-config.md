# Supabase Session & JWT Configuration

## How It Works (Automatic)

Supabase handles JWT issuance, refresh token rotation, and session persistence automatically via `@supabase/ssr`. No manual configuration is needed for:

- **Access token lifetime**: 1 hour (default, configurable in Supabase dashboard → Auth → Settings)
- **Refresh token rotation**: Enabled by default — each refresh token is single-use
- **Session persistence**: Managed via HTTP-only cookies through our middleware

## Middleware Integration

Our `src/middleware.ts` uses `createServerClient` from `@supabase/ssr` which:
1. Reads session cookies on every request
2. Refreshes the access token if expired (using the refresh token)
3. Sets updated cookies on the response
4. Validates the user with `supabase.auth.getUser()` (verifies JWT with Supabase server)

## Security Notes

- **`getUser()` is used, not `getSession()`** — `getUser()` validates the JWT server-side, making it safe from token tampering
- Refresh tokens are rotated on each use (prevents replay attacks)
- Old refresh tokens are invalidated immediately
- Sessions expire after the configured inactivity period

## Dashboard Settings (Supabase → Auth → Settings)

| Setting | Recommended Value |
|---|---|
| JWT expiry | 3600 (1 hour) |
| Refresh token rotation | Enabled (default) |
| Refresh token reuse interval | 10 seconds |
| Session timebox | 604800 (7 days) |

## Custom JWT Claims (if needed)

To include the user's role in the JWT for edge-function use:

```sql
-- In Supabase SQL Editor:
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = (event->>'user_id');
  IF user_role IS NOT NULL THEN
    event := jsonb_set(event, '{claims,user_role}', to_jsonb(user_role));
  END IF;
  RETURN event;
END;
$$;
```
