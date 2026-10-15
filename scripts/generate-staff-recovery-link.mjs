/** Operator-only recovery fallback. Never import into website or dashboard routes. */
import { createClient } from '@supabase/supabase-js';
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node --env-file=.env.recovery.local scripts/generate-staff-recovery-link.mjs <staff-user-uuid> --identity-verified\nRequired environment: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, DASHBOARD_ORIGIN.\nThis generates a sensitive one-use link without sending email or changing the password. Verify the staff identity and share the link through an approved private channel.');
  process.exit(0);
}
const [userId, confirmation] = args;
if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(userId || '') || confirmation !== '--identity-verified') throw new Error('Run --help and verify the staff identity before generating recovery access.');
const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SECRET_KEY: key, DASHBOARD_ORIGIN: origin } = process.env;
if (!url || !key || !origin) throw new Error('Missing operator-only recovery environment. Never expose the secret key to the browser.');
const target = new URL('/reset-password', origin);
if (target.protocol !== 'https:' || new URL(origin).pathname !== '/' || new URL(origin).search || new URL(origin).hash) throw new Error('DASHBOARD_ORIGIN must be the exact HTTPS dashboard origin.');
const client = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const {data:{user},error:userError} = await client.auth.admin.getUserById(userId);
if (userError || !user?.email || user.is_anonymous) throw new Error('Cannot verify the selected staff account.');
const {data:profile,error:profileError} = await client.from('profiles').select('role').eq('id',userId).single();
if (profileError || !['admin','editor','viewer'].includes(profile?.role)) throw new Error('The selected account is not authorised staff.');
const {data,error} = await client.auth.admin.generateLink({type:'recovery',email:user.email,options:{redirectTo:target.href}});
if (error || !data.properties?.hashed_token) throw new Error('The recovery link could not be generated. Check Supabase Auth logs.');
target.searchParams.set('token_hash',data.properties.hashed_token);
target.searchParams.set('type','recovery');
console.log('Sensitive one-use recovery link. Share privately with the verified staff member; never paste into issues, logs or chat history.');
console.log(target.href);
