import { getSupabase } from '@/lib/db';

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars
  checks.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING';
  checks.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'MISSING';
  checks.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'set' : 'MISSING';
  checks.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ? 'set' : 'MISSING';

  // Check Supabase connection
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('audits').select('id', { count: 'exact', head: true });
    checks.supabase_connection = error ? `ERROR: ${error.message}` : 'OK';
  } catch (err) {
    checks.supabase_connection = `ERROR: ${err instanceof Error ? err.message : 'unknown'}`;
  }

  return Response.json(checks);
}
