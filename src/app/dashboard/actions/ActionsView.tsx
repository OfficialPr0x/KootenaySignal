'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckSquare, Square, Lock, ArrowRight, ChevronDown, ChevronUp,
  Search, MapPin, Shield, MousePointerClick, Gauge, Eye,
  Filter, Zap, Clock, TrendingUp, MessageCircle, ArrowUpDown, PartyPopper,
  Check,
} from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  difficulty: string;
  is_completed: boolean;
  is_locked: boolean;
  impact_score: number;
  estimated_minutes: number;
  how_to_fix: string[];
  completed_at: string | null;
  created_at: string;
}

type SortMode = 'default' | 'quick-wins' | 'impact';

function categoryIcon(cat: string) {
  switch (cat) {
    case 'seo': return <Search size={16} />;
    case 'local': return <MapPin size={16} />;
    case 'trust': return <Shield size={16} />;
    case 'conversion': return <MousePointerClick size={16} />;
    case 'speed': return <Gauge size={16} />;
    case 'content': return <Eye size={16} />;
    default: return <CheckSquare size={16} />;
  }
}

function categoryLabel(cat: string) {
  const labels: Record<string, string> = {
    seo: 'SEO', local: 'Local', trust: 'Trust',
    conversion: 'Conversion', speed: 'Speed', content: 'Content',
  };
  return labels[cat] || cat;
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
}

function difficultyScore(d: string): number {
  return d === 'easy' ? 1 : d === 'medium' ? 2 : 3;
}

// Simple confetti burst using CSS animations
function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const particles = Array.from({ length: 24 }, (_, i) => i);
  const colors = ['#e67e22', '#27ae60', '#f39c12', '#3498db', '#e74c3c', '#9b59b6'];
  return (
    <div className="confetti-container" aria-hidden>
      {particles.map(i => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            '--x': `${(Math.random() - 0.5) * 300}px`,
            '--y': `${-Math.random() * 200 - 50}px`,
            '--r': `${Math.random() * 720 - 360}deg`,
            '--delay': `${Math.random() * 0.2}s`,
            backgroundColor: colors[i % colors.length],
            left: `${40 + Math.random() * 20}%`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function MilestoneToast({ milestone, onDismiss }: { milestone: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="milestone-toast">
      <PartyPopper size={20} />
      <span>{milestone}</span>
    </div>
  );
}

function ImpactBar({ score }: { score: number }) {
  return (
    <div className="impact-bar" title={`Impact: ${score}/10`}>
      <div className="impact-bar-fill" style={{ width: `${score * 10}%` }} />
      <span className="impact-bar-label">{score}/10</span>
    </div>
  );
}

export default function ActionsView({ items: initialItems }: { items: ActionItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('quick-wins');
  const [showConfetti, setShowConfetti] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const router = useRouter();
  const prevCompleted = useRef(items.filter(i => i.is_completed).length);

  const checkMilestone = useCallback((newCount: number, total: number) => {
    const pct = Math.round((newCount / total) * 100);
    const prev = Math.round((prevCompleted.current / total) * 100);

    if (pct >= 100 && prev < 100) {
      setMilestone('All done! You\'re a Signal superstar!');
    } else if (pct >= 75 && prev < 75) {
      setMilestone('75% complete — almost there!');
    } else if (pct >= 50 && prev < 50) {
      setMilestone('Halfway there! Keep the momentum going.');
    } else if (pct >= 25 && prev < 25) {
      setMilestone('25% done — great start!');
    }
    prevCompleted.current = newCount;
  }, []);

  async function toggleComplete(id: string, current: boolean) {
    const newCompleted = !current;

    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? {
      ...i,
      is_completed: newCompleted,
      completed_at: newCompleted ? new Date().toISOString() : null,
    } : i));

    if (newCompleted) {
      setJustCompleted(id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
      setTimeout(() => setJustCompleted(null), 600);

      const newCount = items.filter(i => i.is_completed).length + 1;
      checkMilestone(newCount, items.length);
    }

    try {
      await fetch('/api/sites/actions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_completed: newCompleted }),
      });
    } catch {
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_completed: current } : i));
    }
  }

  function sortItems(list: ActionItem[]): ActionItem[] {
    return [...list].sort((a, b) => {
      if (sortMode === 'quick-wins') {
        // High impact + low difficulty = best quick win
        const scoreA = (a.impact_score || 5) / difficultyScore(a.difficulty);
        const scoreB = (b.impact_score || 5) / difficultyScore(b.difficulty);
        return scoreB - scoreA;
      }
      if (sortMode === 'impact') {
        return (b.impact_score || 5) - (a.impact_score || 5);
      }
      return 0; // default: keep DB order
    });
  }

  const categories = ['all', ...new Set(items.map(i => i.category))];
  const filtered = items.filter(i => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (!showCompleted && i.is_completed) return false;
    return true;
  });

  const unlocked = sortItems(filtered.filter(i => !i.is_locked));
  const locked = sortItems(filtered.filter(i => i.is_locked));
  const completedCount = items.filter(i => i.is_completed).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Compute total potential impact
  const totalImpact = unlocked
    .filter(i => !i.is_completed)
    .reduce((sum, i) => sum + (i.impact_score || 0), 0);
  const totalTime = unlocked
    .filter(i => !i.is_completed)
    .reduce((sum, i) => sum + (i.estimated_minutes || 0), 0);

  return (
    <div className="dash-actions">
      <Confetti show={showConfetti} />
      {milestone && <MilestoneToast milestone={milestone} onDismiss={() => setMilestone(null)} />}

      <div className="dash-topbar">
        <div>
          <h1 className="dash-page-title">Action Items</h1>
          <p className="dash-page-sub">
            {completedCount} of {totalCount} completed
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="actions-progress">
        <div className="actions-progress-bar">
          <div className="actions-progress-fill" style={{ width: `${pct}%` }} />
          {/* Milestone markers */}
          <div className="actions-milestone-markers">
            {[25, 50, 75].map(m => (
              <div
                key={m}
                className={`actions-milestone-dot ${pct >= m ? 'actions-milestone-dot--reached' : ''}`}
                style={{ left: `${m}%` }}
                title={`${m}%`}
              />
            ))}
          </div>
        </div>
        <span className="actions-progress-label">{pct}%</span>
      </div>

      {/* Stats summary */}
      {totalImpact > 0 && (
        <div className="actions-stats-row">
          <div className="actions-stat">
            <TrendingUp size={14} />
            <span><strong>+{totalImpact} pts</strong> potential impact remaining</span>
          </div>
          <div className="actions-stat">
            <Clock size={14} />
            <span><strong>{formatTime(totalTime)}</strong> estimated to complete all</span>
          </div>
        </div>
      )}

      {/* Filters + Sort */}
      <div className="actions-filters">
        <div className="actions-filter-cats">
          <Filter size={14} />
          {categories.map(cat => (
            <button
              key={cat}
              className={`actions-filter-btn ${filter === cat ? 'actions-filter-btn--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : categoryLabel(cat)}
            </button>
          ))}
        </div>
        <div className="actions-filter-right">
          <div className="actions-sort">
            <ArrowUpDown size={13} />
            <select
              className="actions-sort-select"
              value={sortMode}
              onChange={e => setSortMode(e.target.value as SortMode)}
            >
              <option value="quick-wins">Quick Wins First</option>
              <option value="impact">Highest Impact</option>
              <option value="default">Newest First</option>
            </select>
          </div>
          <button
            className="actions-toggle-completed"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Hide completed' : 'Show completed'}
          </button>
        </div>
      </div>

      {/* Action Items List */}
      <div className="actions-list">
        {unlocked.map(item => {
          const isExpanded = expandedId === item.id;
          const hasHowTo = item.how_to_fix && item.how_to_fix.length > 0;

          return (
            <div
              key={item.id}
              className={`action-item ${item.is_completed ? 'action-item--done' : ''} ${justCompleted === item.id ? 'action-item--just-completed' : ''} ${isExpanded ? 'action-item--expanded' : ''}`}
            >
              <button
                className="action-checkbox"
                onClick={() => toggleComplete(item.id, item.is_completed)}
              >
                {item.is_completed
                  ? <CheckSquare size={20} color="#27ae60" />
                  : <Square size={20} />
                }
              </button>
              <div className="action-body">
                <div className="action-header">
                  <span className={`action-priority ${item.priority === 'high' ? 'action-priority--high' : item.priority === 'low' ? 'action-priority--low' : 'action-priority--medium'}`}>
                    {item.priority}
                  </span>
                  <span className="action-category">
                    {categoryIcon(item.category)}
                    {categoryLabel(item.category)}
                  </span>
                  <span className="action-difficulty">
                    {item.difficulty === 'easy' ? '⚡ Quick fix' : item.difficulty === 'medium' ? '🔧 Moderate' : '🏗️ Major'}
                  </span>
                  <span className="action-time">
                    <Clock size={12} />
                    {formatTime(item.estimated_minutes || 15)}
                  </span>
                </div>
                <h4 className="action-title">{item.title}</h4>
                <p className="action-desc">{item.description}</p>

                {/* Impact + expand controls */}
                <div className="action-footer">
                  <div className="action-impact">
                    <Zap size={13} />
                    <span className="action-impact-label">Impact</span>
                    <ImpactBar score={item.impact_score || 5} />
                  </div>
                  <div className="action-footer-btns">
                    {hasHowTo && (
                      <button
                        className="action-expand-btn"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      >
                        {isExpanded ? 'Hide steps' : 'How to fix'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                    <button
                      className="action-ask-ai-btn"
                      onClick={() => router.push(`/dashboard/advisor?q=${encodeURIComponent(`Help me with this action item: "${item.title}"`)}`)}
                    >
                      <MessageCircle size={13} />
                      Ask AI
                    </button>
                  </div>
                </div>

                {/* Expandable how-to-fix steps */}
                {isExpanded && hasHowTo && (
                  <div className="action-howto">
                    <ol className="action-howto-steps">
                      {item.how_to_fix.map((step, idx) => (
                        <li key={idx} className="action-howto-step">
                          <span className="action-howto-num">{idx + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {locked.length > 0 && (
          <>
            <div className="actions-locked-divider">
              <Lock size={14} />
              <span>Expert-Level Items</span>
              <div className="actions-locked-line" />
            </div>
            {locked.map(item => {
              const isExpanded = expandedId === item.id;
              const hasHowTo = item.how_to_fix && item.how_to_fix.length > 0;

              return (
                <div key={item.id} className="action-item action-item--locked">
                  <div className="action-lock-icon">
                    <Lock size={18} />
                  </div>
                  <div className="action-body">
                    <div className="action-header">
                      <span className={`action-priority ${item.priority === 'high' ? 'action-priority--high' : 'action-priority--medium'}`}>
                        {item.priority}
                      </span>
                      <span className="action-category">
                        {categoryIcon(item.category)}
                        {categoryLabel(item.category)}
                      </span>
                      <span className="action-difficulty">🏗️ Requires expert</span>
                      <span className="action-time">
                        <Clock size={12} />
                        {formatTime(item.estimated_minutes || 60)}
                      </span>
                    </div>
                    <h4 className="action-title">{item.title}</h4>
                    <p className="action-desc">{item.description}</p>

                    <div className="action-footer">
                      <div className="action-impact">
                        <Zap size={13} />
                        <span className="action-impact-label">Impact</span>
                        <ImpactBar score={item.impact_score || 5} />
                      </div>
                      <div className="action-footer-btns">
                        {hasHowTo && (
                          <button
                            className="action-expand-btn"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          >
                            {isExpanded ? 'Hide preview' : 'What\'s involved'}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && hasHowTo && (
                      <div className="action-howto action-howto--locked">
                        <ol className="action-howto-steps">
                          {item.how_to_fix.map((step, idx) => (
                            <li key={idx} className="action-howto-step">
                              <span className="action-howto-num">{idx + 1}</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <button
                      className="action-unlock-btn"
                      data-cal-link="kootenay-signal/30min"
                      data-cal-namespace="30min"
                      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                    >
                      Let&apos;s tackle this <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {filtered.length === 0 && (
          <div className="actions-empty">
            {completedCount === totalCount && totalCount > 0 ? (
              <div className="actions-all-done">
                <Check size={40} />
                <h3>All caught up!</h3>
                <p>You&apos;ve completed every action item. Run a new scan to check for more.</p>
              </div>
            ) : (
              <p>No action items match this filter.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
