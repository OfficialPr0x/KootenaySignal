import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/db';
import DashboardOverview from './DashboardOverview';
import SiteOnboarding from './SiteOnboarding';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = getSupabase();

  // Check if user has a monitored site
  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) {
    return <SiteOnboarding />;
  }

  // Get latest snapshot
  const { data: latestSnapshot } = await supabase
    .from('snapshots')
    .select('*')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Get previous snapshot for comparison
  const { data: previousSnapshot } = await supabase
    .from('snapshots')
    .select('signal_score, visibility_score, trust_score, conversion_score, seo_score, performance_score, brand_position, industry_position, created_at')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .range(1, 1)
    .single();

  // Get recent action items
  const { data: actionItems } = await supabase
    .from('action_items')
    .select('id, title, category, priority, difficulty, is_completed, is_locked')
    .eq('site_id', site.id)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get snapshot history for sparkline
  const { data: history } = await supabase
    .from('snapshots')
    .select('signal_score, created_at')
    .eq('site_id', site.id)
    .order('created_at', { ascending: true })
    .limit(30);

  return (
    <DashboardOverview
      site={site}
      snapshot={latestSnapshot}
      previousSnapshot={previousSnapshot}
      actionItems={actionItems ?? []}
      history={history ?? []}
    />
  );
}
