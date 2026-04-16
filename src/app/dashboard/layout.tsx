import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/db';
import DashboardShell from './DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user has a monitored site
  let hasSite = false;
  let siteName = '';
  try {
    const supabase = getSupabase();
    const { data: site } = await supabase
      .from('sites')
      .select('id, business_name')
      .eq('clerk_user_id', userId)
      .single();
    if (site) {
      hasSite = true;
      siteName = site.business_name;
    }
  } catch {
    // No site yet
  }

  return (
    <DashboardShell hasSite={hasSite} siteName={siteName}>
      {children}
    </DashboardShell>
  );
}
