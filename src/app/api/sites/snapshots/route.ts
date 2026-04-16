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

  const { data: snapshots } = await supabase
    .from('snapshots')
    .select('id, signal_score, visibility_score, trust_score, conversion_score, local_presence_score, seo_score, performance_score, brand_position, industry_position, in_local_pack, competitor_count, review_count, avg_rating, lcp, fcp, cls, mobile_friendly, created_at')
    .eq('site_id', site.id)
    .order('created_at', { ascending: true })
    .limit(90);

  return Response.json({ snapshots: snapshots ?? [] });
}
