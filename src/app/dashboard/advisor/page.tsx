import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/db';
import AdvisorChat from './AdvisorChat';

export default async function AdvisorPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = getSupabase();

  const { data: site } = await supabase
    .from('sites')
    .select('id, business_name, website_url')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) redirect('/dashboard');

  const { data: messages } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('site_id', site.id)
    .order('created_at', { ascending: true })
    .limit(100);

  return <AdvisorChat initialMessages={messages ?? []} businessName={site.business_name} />;
}
