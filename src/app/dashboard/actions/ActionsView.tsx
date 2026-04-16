'use client';

import { useState } from 'react';
import {
  CheckSquare, Square, Lock, ArrowRight,
  Search, MapPin, Shield, MousePointerClick, Gauge, Eye,
  Filter,
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
  created_at: string;
}

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

export default function ActionsView({ items: initialItems }: { items: ActionItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  async function toggleComplete(id: string, current: boolean) {
    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_completed: !current } : i));
    try {
      await fetch('/api/sites/actions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_completed: !current }),
      });
    } catch {
      // Revert on error
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_completed: current } : i));
    }
  }

  const categories = ['all', ...new Set(items.map(i => i.category))];
  const filtered = items.filter(i => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (!showCompleted && i.is_completed) return false;
    return true;
  });

  const unlocked = filtered.filter(i => !i.is_locked);
  const locked = filtered.filter(i => i.is_locked);
  const completedCount = items.filter(i => i.is_completed).length;
  const totalCount = items.length;

  return (
    <div className="dash-actions">
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
          <div
            className="actions-progress-fill"
            style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
          />
        </div>
        <span className="actions-progress-label">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</span>
      </div>

      {/* Filters */}
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
        <button
          className="actions-toggle-completed"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? 'Hide completed' : 'Show completed'}
        </button>
      </div>

      {/* Action Items List */}
      <div className="actions-list">
        {unlocked.map(item => (
          <div key={item.id} className={`action-item ${item.is_completed ? 'action-item--done' : ''}`}>
            <button
              className="action-checkbox"
              onClick={() => toggleComplete(item.id, item.is_completed)}
            >
              {item.is_completed ? <CheckSquare size={20} color="#27ae60" /> : <Square size={20} />}
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
              </div>
              <h4 className="action-title">{item.title}</h4>
              <p className="action-desc">{item.description}</p>
            </div>
          </div>
        ))}

        {locked.length > 0 && (
          <>
            <div className="actions-locked-divider">
              <Lock size={14} />
              <span>Expert-Level Items</span>
              <div className="actions-locked-line" />
            </div>
            {locked.map(item => (
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
                  </div>
                  <h4 className="action-title">{item.title}</h4>
                  <p className="action-desc">{item.description}</p>
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
            ))}
          </>
        )}

        {filtered.length === 0 && (
          <div className="actions-empty">
            <p>No action items match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
