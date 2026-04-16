import { auth } from '@clerk/nextjs/server';
import { getSupabase } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();

  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) return Response.json({ error: 'No site found' }, { status: 404 });

  const { data: items } = await supabase
    .from('action_items')
    .select('*')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return Response.json({ items: items ?? [] });
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();

  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) return Response.json({ error: 'No site found' }, { status: 404 });

  let body: { id: string; is_completed: boolean };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { error } = await supabase
    .from('action_items')
    .update({ is_completed: body.is_completed })
    .eq('id', body.id)
    .eq('site_id', site.id);

  if (error) return Response.json({ error: 'Update failed' }, { status: 500 });
  return Response.json({ success: true });
}
