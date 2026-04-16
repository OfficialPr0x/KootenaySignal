import { auth } from '@clerk/nextjs/server';
import { getSupabase } from '@/lib/db';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();

  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) return Response.json({ error: 'No site found' }, { status: 404 });

  let body: { message: string };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (!body.message || body.message.length > 1000) {
    return Response.json({ error: 'Message required (max 1000 chars)' }, { status: 400 });
  }

  // Rate limit: max 20 messages per day
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', site.id)
    .eq('role', 'user')
    .gte('created_at', todayStart.toISOString());

  if ((count ?? 0) >= 20) {
    return Response.json({ error: 'Daily message limit reached. Come back tomorrow for more insights.' }, { status: 429 });
  }

  // Save user message
  await supabase.from('chat_messages').insert({
    site_id: site.id,
    role: 'user',
    content: body.message,
  });

  // Get latest snapshot for context
  const { data: latestSnapshot } = await supabase
    .from('snapshots')
    .select('*')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Get recent action items for context
  const { data: actions } = await supabase
    .from('action_items')
    .select('title, category, priority, is_completed, is_locked')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get recent chat history for context
  const { data: recentChat } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const chatHistory = (recentChat ?? []).reverse();

  // Build context for AI
  const businessContext = {
    business_name: site.business_name,
    website_url: site.website_url,
    city: site.city || 'Unknown',
    industry: site.industry || 'Unknown',
    latest_scores: latestSnapshot ? {
      signal_score: latestSnapshot.signal_score,
      visibility: latestSnapshot.visibility_score,
      trust: latestSnapshot.trust_score,
      conversion: latestSnapshot.conversion_score,
      local_presence: latestSnapshot.local_presence_score,
      seo: latestSnapshot.seo_score,
      performance: latestSnapshot.performance_score,
      brand_position: latestSnapshot.brand_position,
      industry_position: latestSnapshot.industry_position,
      in_local_pack: latestSnapshot.in_local_pack,
      reviews: latestSnapshot.review_count,
      rating: latestSnapshot.avg_rating,
    } : null,
    pending_actions: (actions ?? []).filter(a => !a.is_completed).map(a => a.title),
    completed_actions: (actions ?? []).filter(a => a.is_completed).map(a => a.title),
  };

  const systemPrompt = `You are the Kootenay Signal AI Advisor — a friendly, straight-talking digital marketing expert for local businesses. You work for Kootenay Signal, a local business growth company based in Sparwood, BC.

CONTEXT ABOUT THIS BUSINESS:
${JSON.stringify(businessContext, null, 2)}

YOUR ROLE:
- Answer questions about their online presence, SEO, marketing, and business growth
- Give specific, actionable advice based on their actual data
- Be encouraging but honest about gaps
- Keep responses concise (2-4 paragraphs max)
- Reference their actual scores and metrics when relevant
- If they ask about something complex (ad campaigns, major SEO overhauls, custom builds), suggest they book a call for implementation help
- You can suggest simple DIY fixes (update Google Business Profile, add photos, respond to reviews)
- For bigger wins (website rebuild, ad management, full SEO), gently note that Kootenay Signal can handle it

TONE: Like a knowledgeable friend who happens to be a marketing expert. Casual, direct, no jargon.

IMPORTANT: Never make up data. If you don't have specific metrics, say so. Focus on what the data shows.`;

  const apiKey = process.env.DEEPSEEK_API_KEY;

  let reply = "I'm having trouble connecting right now. Try again in a moment.";

  if (apiKey) {
    try {
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...chatHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ];

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.5,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        reply = data.choices?.[0]?.message?.content || reply;
      }
    } catch (err) {
      console.error('Chat AI error:', err);
    }
  } else {
    // Fallback without API key
    reply = generateFallbackReply(body.message, businessContext);
  }

  // Save assistant message
  await supabase.from('chat_messages').insert({
    site_id: site.id,
    role: 'assistant',
    content: reply,
  });

  return Response.json({ reply });
}

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

  const { data: messages } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('site_id', site.id)
    .order('created_at', { ascending: true })
    .limit(100);

  return Response.json({ messages: messages ?? [] });
}

function generateFallbackReply(message: string, ctx: Record<string, unknown>): string {
  const scores = ctx.latest_scores as Record<string, unknown> | null;
  const name = ctx.business_name as string;

  if (!scores) {
    return `I don't have any scan data for ${name} yet. Once your first scan completes, I'll be able to give you specific insights about your online presence. Hang tight!`;
  }

  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('score') || lowerMsg.includes('how am i doing')) {
    return `Your current Signal Score is ${scores.signal_score}/100. Here's the breakdown:\n\n- Visibility: ${scores.visibility}/100\n- Trust: ${scores.trust}/100\n- Conversion: ${scores.conversion}/100\n- Local Presence: ${scores.local_presence}/100\n- SEO: ${scores.seo}/100\n\nThe biggest area to focus on is whichever score is lowest — that's where you're losing the most potential customers. Want me to dig into a specific area?`;
  }

  if (lowerMsg.includes('seo') || lowerMsg.includes('google') || lowerMsg.includes('rank')) {
    const pos = scores.brand_position;
    return `Your brand ${pos ? `shows up at position ${pos}` : "isn't showing up strongly"} when people search for "${name}" on Google. ${scores.in_local_pack ? "Good news — you're showing in the local pack." : "You're not in Google's local pack yet, which is a big missed opportunity."}\n\nSome quick things you can do: make sure your Google Business Profile is 100% complete, post weekly updates, and ask happy customers for reviews. For deeper SEO work like link building and content strategy, that's something we can tackle together.`;
  }

  if (lowerMsg.includes('review') || lowerMsg.includes('reputation')) {
    return `Reviews are one of the most powerful trust signals for local businesses. ${scores.review_count ? `You have ${scores.review_count} reviews with a ${scores.rating} rating.` : "I don't have review data yet."}\n\nHere's what I'd suggest: after every good job, send a quick text with your Google review link. Even 1-2 new reviews per month makes a big difference. The best time to ask is right after you've done great work and the customer is happy.`;
  }

  return `Good question! Based on your current data, your Signal Score is ${scores.signal_score}/100. Your strongest area is what's scoring highest, and your biggest opportunity is in the lowest-scoring category.\n\nFeel free to ask me about specific areas like SEO, reviews, website speed, or what you should focus on this week. I'm here to help you figure out what moves the needle.`;
}
