import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/db';
import RankingsView from './RankingsView';

export default async function RankingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = getSupabase();

  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) redirect('/dashboard');

  const { data: snapshots } = await supabase
    .from('snapshots')
    .select('signal_score, visibility_score, seo_score, performance_score, brand_position, industry_position, in_local_pack, competitor_count, review_count, avg_rating, lcp, fcp, cls, mobile_friendly, created_at')
    .eq('site_id', site.id)
    .order('created_at', { ascending: true })
    .limit(90);

  return <RankingsView site={site} snapshots={snapshots ?? []} />;
}
