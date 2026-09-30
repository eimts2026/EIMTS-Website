-- RLS policies execute these helpers as the authenticated caller.
-- Revoking EXECUTE in security_hardening prevented staff from reading even
-- their own profile. These existing helpers only return the caller's role
-- membership, using auth.uid() and the protected profiles table.
-- Keep anonymous/PUBLIC access and trigger-only RPCs revoked.
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
