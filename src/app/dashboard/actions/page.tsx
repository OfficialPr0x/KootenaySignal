import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/db';
import ActionsView from './ActionsView';

export default async function ActionsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = getSupabase();

  const { data: site } = await supabase
    .from('sites')
    .select('id, business_name')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) redirect('/dashboard');

  const { data: items } = await supabase
    .from('action_items')
    .select('*')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return <ActionsView items={items ?? []} />;
}
