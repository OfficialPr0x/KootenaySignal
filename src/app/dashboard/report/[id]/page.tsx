import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/db';
import ReportContent from './ReportContent';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;

  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .eq('clerk_user_id', userId)
    .single();

  if (!audit) redirect('/dashboard');

  return <ReportContent audit={audit} />;
}
