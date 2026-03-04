import React, { useMemo, useState, useEffect } from 'react';
import {
  INSTITUTIONS,
  SIGNALS,
  SIGNAL_TYPES,
  IMPORTANCE_LEVELS,
  SIGNAL_CATEGORIES,
  INSTITUTION_TYPES,
} from '../mock-data.js';

const ACTIVE_VIEWS = {
  LANDING: 'landing',
  ENTITY: 'entity',
  SIGNAL_DETAIL: 'signalDetail',
};

function mockNow() {
  return new Date();
}

function formatTimeAgo(offsetHours) {
  const minutes = Math.round(offsetHours * 60);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(offsetHours);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

function institutionRiskBadge(level) {
  if (level === 'low') return 'badge-risk-low';
  if (level === 'medium') return 'badge-risk-medium';
  return 'badge-risk-high';
}

function importanceChipClass(importance) {
  return `chip-important-${importance}`;
}

function sentimentChipClass(sentiment) {
  if (sentiment === 'positive') return 'chip-sentiment-pos';
  if (sentiment === 'negative') return 'chip-sentiment-neg';
  return 'chip-sentiment-neutral';
}

function sourceLabel(type) {
  if (type === 'news') return 'News';
  if (type === 'social') return 'Social';
  if (type === 'legal') return 'Court / legal';
  if (type === 'filing') return 'Filings & results';
  if (type === 'internal') return 'Internal metric';
  return type;
}

function normaliseImportance(imp) {
  return imp === 'high' ? 'medium' : imp;
}

function computeSourceSplit(signals) {
  const bySource = {};
  signals.forEach((s) => {
    const key = s.sourceType;
    if (!bySource[key]) {
      bySource[key] = { totalScore: 0, count: 0 };
    }
    bySource[key].totalScore += s.score;
    bySource[key].count += 1;
  });

  const entries = Object.entries(bySource).map(([type, value]) => {
    const avg = value.count > 0 ? value.totalScore / value.count : 0;
    return {
      type,
      score: Math.round(avg),
    };
  });

  entries.sort((a, b) => b.score - a.score);
  return entries;
}

function computeSourceImportanceCounts(signals) {
  const counts = {};
  SIGNAL_TYPES.forEach((t) => {
    counts[t] = { critical: 0, medium: 0, low: 0 };
  });
  signals.forEach((s) => {
    const t = s.sourceType;
    const imp = normaliseImportance(s.importance);
    if (!counts[t]) {
      counts[t] = { critical: 0, medium: 0, low: 0 };
    }
    if (imp === 'critical' || imp === 'medium' || imp === 'low') {
      counts[t][imp] += 1;
    }
  });
  return counts;
}

function computeImportanceTotals(signals) {
  const totals = { critical: 0, medium: 0, low: 0 };
  signals.forEach((s) => {
    const imp = normaliseImportance(s.importance);
    if (imp === 'critical' || imp === 'medium' || imp === 'low') {
      totals[imp] += 1;
    }
  });
  return totals;
}

function formatWindowLabel(hours) {
  if (!hours) return 'current window';
  const days = hours / 24;
  if (days <= 1) return '1-day window';
  if (days <= 7) return '7-day window';
  if (days <= 31) return '1-month window';
  if (days <= 92) return '3-month window';
  if (days <= 185) return '6-month window';
  if (days <= 365) return '1-year window';
  return 'full-history window';
}

function formatWindowComparisonSuffix(hours) {
  const label = formatWindowLabel(hours);
  return `vs previous ${label}`;
}

function computeEntityCriticalCount(instId, windowHours) {
  return SIGNALS.filter((s) => {
    if (s.institutionId !== instId) return false;
    if (s.importance !== 'critical') return false;
    if (typeof windowHours === 'number' && s.timestampOffsetHours > windowHours) return false;
    return true;
  }).length;
}

function computeEntityHighPlusCritical(instId, windowHours) {
  return SIGNALS.filter((s) => {
    if (s.institutionId !== instId) return false;
    if (!(s.importance === 'critical' || s.importance === 'high')) return false;
    if (typeof windowHours === 'number' && s.timestampOffsetHours > windowHours) return false;
    return true;
  }).length;
}

function getAllNewsSignals() {
  return SIGNALS.filter((s) => s.sourceType === 'news').slice();
}

function App() {
  if (!Array.isArray(INSTITUTIONS) || !Array.isArray(SIGNALS)) {
    throw new Error(
      'Missing mock data: INSTITUTIONS and SIGNALS must be arrays. Check mock-data.js import.',
    );
  }
  const [activeView, setActiveView] = useState(ACTIVE_VIEWS.LANDING);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(
    INSTITUTIONS[0]?.id ?? null,
  );
  const [institutionSortMode, setInstitutionSortMode] = useState('risk'); // 'risk' | 'name' | 'marketCap'
  const [activeSignalTypes, setActiveSignalTypes] = useState(new Set(SIGNAL_TYPES));
  const [activeImportance, setActiveImportance] = useState(new Set(IMPORTANCE_LEVELS));
  const [activeCategories, setActiveCategories] = useState(
    () => new Set(SIGNAL_CATEGORIES.map((c) => c.id)),
  );
  const [activeInstitutionTypes, setActiveInstitutionTypes] = useState(new Set());
  const [sortMode, setSortMode] = useState('severity'); // 'severity' | 'latest'
  const [timeWindowsByBank, setTimeWindowsByBank] = useState({});
  const [defaultTimeWindowHours] = useState(24);
  const [overviewWindowsByBank, setOverviewWindowsByBank] = useState({});
  const [defaultOverviewWindowHours] = useState(24 * 30);
  const [landingOverviewWindowHours, setLandingOverviewWindowHours] = useState(24 * 30);
  const [landingAiWindowHours, setLandingAiWindowHours] = useState(24 * 30);
  const [landingAiSummaryGeneratedAt, setLandingAiSummaryGeneratedAt] = useState(
    () => new Date(),
  );
  const [aiWindowsByBank, setAiWindowsByBank] = useState({});
  const [defaultAiWindowHours] = useState(24 * 30);
  const [aiSummaryGeneratedByBank, setAiSummaryGeneratedByBank] = useState({});
  const [globalTimeWindowHours, setGlobalTimeWindowHours] = useState(24);
  const [lastUpdated, setLastUpdated] = useState(mockNow());
  const [selectedSignalId, setSelectedSignalId] = useState(null);
  const [previousViewBeforeDetail, setPreviousViewBeforeDetail] = useState(ACTIVE_VIEWS.LANDING);

  const selectedInstitution = useMemo(
    () => INSTITUTIONS.find((i) => i.id === selectedInstitutionId) || null,
    [selectedInstitutionId],
  );

  const bankWindow = useMemo(() => {
    if (!selectedInstitutionId) return defaultTimeWindowHours;
    return timeWindowsByBank[selectedInstitutionId] ?? defaultTimeWindowHours;
  }, [selectedInstitutionId, timeWindowsByBank, defaultTimeWindowHours]);

  const overviewWindowHours = useMemo(() => {
    if (!selectedInstitutionId) return defaultOverviewWindowHours;
    return overviewWindowsByBank[selectedInstitutionId] ?? defaultOverviewWindowHours;
  }, [selectedInstitutionId, overviewWindowsByBank, defaultOverviewWindowHours]);

  const aiWindowHours = useMemo(() => {
    if (!selectedInstitutionId) return defaultAiWindowHours;
    return aiWindowsByBank[selectedInstitutionId] ?? defaultAiWindowHours;
  }, [selectedInstitutionId, aiWindowsByBank, defaultAiWindowHours]);

  const aiSummaryGeneratedAt = useMemo(() => {
    if (!selectedInstitutionId) return lastUpdated;
    return aiSummaryGeneratedByBank[selectedInstitutionId] ?? lastUpdated;
  }, [selectedInstitutionId, aiSummaryGeneratedByBank, lastUpdated]);

  const filteredSignals = useMemo(() => {
    if (!selectedInstitutionId) return [];
    const importanceRank = {
      critical: 2,
      medium: 1,
      low: 0,
    };

    let list = SIGNALS.filter((s) => {
      if (s.institutionId !== selectedInstitutionId) return false;
      if (!activeSignalTypes.has(s.sourceType)) return false;
      const normImportance = normaliseImportance(s.importance);
      if (!activeImportance.has(normImportance)) return false;
      if (activeCategories.size > 0) {
        const ids = s.categoryIds ?? [];
        if (!ids.some((id) => activeCategories.has(id))) return false;
      }
      if (s.timestampOffsetHours > bankWindow) return false;
      return true;
    });

    if (sortMode === 'latest') {
      list = list.slice().sort((a, b) => a.timestampOffsetHours - b.timestampOffsetHours);
    } else {
      list = list
        .slice()
        .sort(
          (a, b) =>
            (importanceRank[normaliseImportance(b.importance)] ?? 0) -
              (importanceRank[normaliseImportance(a.importance)] ?? 0) ||
            b.score - a.score,
        );
    }

    return list;
  }, [
    selectedInstitutionId,
    activeSignalTypes,
    activeImportance,
    activeCategories,
    bankWindow,
    sortMode,
  ]);

  const sortedInstitutions = useMemo(() => {
    const list = INSTITUTIONS.slice();
    if (institutionSortMode === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (institutionSortMode === 'marketCap') {
      list.sort((a, b) => (b.marketCapCr || 0) - (a.marketCapCr || 0));
    } else {
      list.sort((a, b) => b.riskScore - a.riskScore);
    }
    return list;
  }, [institutionSortMode]);

  const dashboardInstitutions = useMemo(() => {
    if (activeInstitutionTypes.size === 0) return INSTITUTIONS;
    return INSTITUTIONS.filter((i) => activeInstitutionTypes.has(i.type));
  }, [activeInstitutionTypes]);

  const dashboardOverviewSignals = useMemo(() => {
    const ids = new Set(dashboardInstitutions.map((i) => i.id));
    return SIGNALS.filter(
      (s) => ids.has(s.institutionId) && s.timestampOffsetHours <= landingOverviewWindowHours,
    );
  }, [dashboardInstitutions, landingOverviewWindowHours]);

  const dashboardAiSignals = useMemo(() => {
    const ids = new Set(dashboardInstitutions.map((i) => i.id));
    return SIGNALS.filter(
      (s) => ids.has(s.institutionId) && s.timestampOffsetHours <= landingAiWindowHours,
    );
  }, [dashboardInstitutions, landingAiWindowHours]);

  const landingSignals = useMemo(() => {
    const importanceRank = {
      critical: 2,
      medium: 1,
      low: 0,
    };
    const institutionIds = new Set(dashboardInstitutions.map((i) => i.id));

    let list = SIGNALS.filter((s) => {
      if (!institutionIds.has(s.institutionId)) return false;
      if (!activeSignalTypes.has(s.sourceType)) return false;
      const normImportance = normaliseImportance(s.importance);
      if (!activeImportance.has(normImportance)) return false;
      if (activeCategories.size > 0) {
        const ids = s.categoryIds ?? [];
        if (!ids.some((id) => activeCategories.has(id))) return false;
      }
      if (s.timestampOffsetHours > globalTimeWindowHours) return false;
      return true;
    });

    if (sortMode === 'latest') {
      list = list.slice().sort((a, b) => a.timestampOffsetHours - b.timestampOffsetHours);
    } else {
      list = list
        .slice()
        .sort(
          (a, b) =>
            (importanceRank[normaliseImportance(b.importance)] ?? 0) -
              (importanceRank[normaliseImportance(a.importance)] ?? 0) ||
            b.score - a.score,
        );
    }

    return list;
  }, [
    dashboardInstitutions,
    activeSignalTypes,
    activeImportance,
    activeCategories,
    globalTimeWindowHours,
    sortMode,
  ]);

  useEffect(() => {
    if (!filteredSignals || filteredSignals.length === 0) {
      if (selectedSignalId !== null) setSelectedSignalId(null);
      return;
    }
    const firstId = filteredSignals[0]?.id;
    if (!firstId) return;
    if (!selectedSignalId || !filteredSignals.some((s) => s.id === selectedSignalId)) {
      setSelectedSignalId(firstId);
    }
  }, [filteredSignals, selectedSignalId]);

  const selectedSignal = useMemo(() => {
    const fromEntity = filteredSignals.find((s) => s.id === selectedSignalId);
    if (fromEntity) return fromEntity;
    return landingSignals.find((s) => s.id === selectedSignalId) || null;
  }, [filteredSignals, landingSignals, selectedSignalId]);

  const handleToggleSignalType = (type) => {
    setActiveSignalTypes((prev) => {
      const prevSize = prev.size;
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }

      // If we are going from "no sources selected" and importance is also empty,
      // infer which importance buckets actually exist for this source and turn those on.
      if (prevSize === 0 && next.size > 0 && activeImportance.size === 0) {
        let relevantSignals;
        if (activeView === ACTIVE_VIEWS.ENTITY && selectedInstitutionId) {
          const bankWin =
            (selectedInstitutionId && timeWindowsByBank[selectedInstitutionId]) ||
            defaultTimeWindowHours;
          relevantSignals = SIGNALS.filter(
            (s) =>
              s.institutionId === selectedInstitutionId &&
              s.sourceType === type &&
              s.timestampOffsetHours <= bankWin,
          );
        } else {
          relevantSignals = SIGNALS.filter(
            (s) =>
              s.sourceType === type && s.timestampOffsetHours <= globalTimeWindowHours,
          );
        }

        const inferred = new Set();
        relevantSignals.forEach((s) => {
          const imp = normaliseImportance(s.importance);
          if (imp === 'critical' || imp === 'medium' || imp === 'low') {
            inferred.add(imp);
          }
        });

        // Fallback: if nothing inferred (no signals), just turn everything on
        setActiveImportance(
          inferred.size > 0 ? inferred : new Set(IMPORTANCE_LEVELS),
        );
      }

      return next;
    });
  };

  const handleToggleImportance = (lvl) => {
    setActiveImportance((prev) => {
      const next = new Set(prev);
      if (next.has(lvl)) {
        next.delete(lvl);
      } else {
        next.add(lvl);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    const allSourcesOn = SIGNAL_TYPES.every((t) => activeSignalTypes.has(t));
    const allImpOn = IMPORTANCE_LEVELS.every((lvl) => activeImportance.has(lvl));
    const turnAllOff = allSourcesOn && allImpOn;

    if (turnAllOff) {
      setActiveSignalTypes(new Set());
      setActiveImportance(new Set());
      setActiveCategories(new Set());
      setActiveInstitutionTypes(new Set());
    } else {
      setActiveSignalTypes(new Set(SIGNAL_TYPES));
      setActiveImportance(new Set(IMPORTANCE_LEVELS));
      setActiveCategories(new Set(SIGNAL_CATEGORIES.map((c) => c.id)));
      setActiveInstitutionTypes(new Set());
    }
  };

  const handleToggleCategory = (categoryId) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const handleClearCategoryFilter = () => {
    setActiveCategories(new Set());
  };

  const handleToggleInstitutionType = (type) => {
    setActiveInstitutionTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleClearInstitutionTypeFilter = () => {
    setActiveInstitutionTypes(new Set());
  };

  const handleRegenerateLandingAiSummary = () => {
    setLandingAiSummaryGeneratedAt(new Date());
  };

  const handleChangeBankWindow = (hours) => {
    if (!selectedInstitutionId) return;
    setTimeWindowsByBank((prev) => ({
      ...prev,
      [selectedInstitutionId]: hours,
    }));
  };

  const handleChangeOverviewWindow = (hours) => {
    if (!selectedInstitutionId) return;
    setOverviewWindowsByBank((prev) => ({
      ...prev,
      [selectedInstitutionId]: hours,
    }));
  };

  const handleChangeAiWindow = (hours) => {
    if (!selectedInstitutionId) return;
    setAiWindowsByBank((prev) => ({
      ...prev,
      [selectedInstitutionId]: hours,
    }));
  };

  const handleRegenerateAiSummary = () => {
    if (!selectedInstitutionId) return;
    setAiSummaryGeneratedByBank((prev) => ({
      ...prev,
      [selectedInstitutionId]: new Date(),
    }));
  };

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand">
          <div className="brand-logo">RBI</div>
          <div>
            <div className="brand-title">RBI Entity Dashboard</div>
            <div className="brand-subtitle">Mock supervisory early warning view</div>
          </div>
        </div>
        <div className="top-actions">
          <div className="env-badge">Mock environment</div>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <section className="sidebar-section">
            <button
              type="button"
              className={
                'sidebar-nav-btn' +
                (activeView === ACTIVE_VIEWS.LANDING ? ' sidebar-nav-btn-active' : '')
              }
              onClick={() => setActiveView(ACTIVE_VIEWS.LANDING)}
            >
              <span className="sidebar-nav-icon" aria-hidden="true">
                <svg
                  className="sidebar-nav-icon-svg"
                  viewBox="0 0 24 24"
                  focusable="false"
                >
                  <path d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4.5h-3V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
                </svg>
              </span>
              <span>Dashboard</span>
            </button>
          </section>

          <section className="sidebar-section">
            <div className="sidebar-title">Institutions</div>
            <div className="sidebar-sort-row">
              <span className="sidebar-sort-label">Sort by</span>
              <div className="institution-sort-controls">
                <button
                  type="button"
                  className={
                    'institution-sort-btn' + (institutionSortMode === 'risk' ? ' active' : '')
                  }
                  onClick={() => setInstitutionSortMode('risk')}
                >
                  Risk
                </button>
                <button
                  type="button"
                  className={
                    'institution-sort-btn' +
                    (institutionSortMode === 'marketCap' ? ' active' : '')
                  }
                  onClick={() => setInstitutionSortMode('marketCap')}
                >
                  Market cap
                </button>
                <button
                  type="button"
                  className={
                    'institution-sort-btn' + (institutionSortMode === 'name' ? ' active' : '')
                  }
                  onClick={() => setInstitutionSortMode('name')}
                >
                  Name
                </button>
              </div>
            </div>
            <div className="institution-list">
              {sortedInstitutions.map((inst) => {
                const riskLabel =
                  inst.riskLevel.charAt(0).toUpperCase() + inst.riskLevel.slice(1);
                const changeLabel =
                  inst.riskChange >= 0 ? `↑ ${inst.riskChange}` : `↓ ${-inst.riskChange}`;

                return (
                  <button
                    type="button"
                    key={inst.id}
                    className={
                      'institution-item' +
                      (activeView !== ACTIVE_VIEWS.LANDING &&
                      inst.id === selectedInstitutionId
                        ? ' active'
                        : '')
                    }
                    onClick={() => {
                      setSelectedInstitutionId(inst.id);
                      setActiveView(ACTIVE_VIEWS.ENTITY);
                    }}
                  >
                    <div>
                      <div className="institution-name">{inst.name}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>{inst.type}</div>
                    </div>
                    <div className="institution-meta institution-meta-bottom">
                      <span className={`badge ${institutionRiskBadge(inst.riskLevel)}`}>
                        {riskLabel} risk · {inst.riskScore}
                      </span>
                      <span className="badge badge-light">{changeLabel} vs 7d</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        {activeView === ACTIVE_VIEWS.LANDING && (
          <LandingView
            signals={landingSignals}
            activeSignalTypes={activeSignalTypes}
            activeImportance={activeImportance}
            activeCategories={activeCategories}
            activeInstitutionTypes={activeInstitutionTypes}
            globalTimeWindowHours={globalTimeWindowHours}
            sortMode={sortMode}
            dashboardInstitutions={dashboardInstitutions}
            dashboardOverviewSignals={dashboardOverviewSignals}
            dashboardAiSignals={dashboardAiSignals}
            landingOverviewWindowHours={landingOverviewWindowHours}
            landingAiWindowHours={landingAiWindowHours}
            landingAiSummaryGeneratedAt={landingAiSummaryGeneratedAt}
            onChangeGlobalWindow={setGlobalTimeWindowHours}
            onToggleSignalType={handleToggleSignalType}
            onToggleImportance={handleToggleImportance}
            onToggleCategory={handleToggleCategory}
            onClearCategoryFilter={handleClearCategoryFilter}
            onToggleInstitutionType={handleToggleInstitutionType}
            onClearInstitutionTypeFilter={handleClearInstitutionTypeFilter}
            onChangeLandingOverviewWindow={setLandingOverviewWindowHours}
            onChangeLandingAiWindow={setLandingAiWindowHours}
            onRegenerateLandingAiSummary={handleRegenerateLandingAiSummary}
            onChangeSortMode={setSortMode}
            onResetFilters={handleResetFilters}
            onOpenSignalDetail={(signal) => {
              setPreviousViewBeforeDetail(ACTIVE_VIEWS.LANDING);
              setSelectedInstitutionId(signal.institutionId);
              setSelectedSignalId(signal.id);
              setActiveView(ACTIVE_VIEWS.SIGNAL_DETAIL);
            }}
            onSelectInstitution={setSelectedInstitutionId}
          />
        )}

        {activeView === ACTIVE_VIEWS.ENTITY && selectedInstitution && (
          <EntityView
            institution={selectedInstitution}
            overviewWindowHours={overviewWindowHours}
            aiWindowHours={aiWindowHours}
            aiSummaryGeneratedAt={aiSummaryGeneratedAt}
            feedWindowHours={bankWindow}
            lastUpdated={lastUpdated}
            filteredSignals={filteredSignals}
            activeSignalTypes={activeSignalTypes}
            activeImportance={activeImportance}
            activeCategories={activeCategories}
            sortMode={sortMode}
            selectedSignalId={selectedSignalId}
            onBackToLanding={() => setActiveView(ACTIVE_VIEWS.LANDING)}
            onChangeOverviewWindow={handleChangeOverviewWindow}
            onChangeAiWindow={handleChangeAiWindow}
            onRegenerateAiSummary={handleRegenerateAiSummary}
            onChangeFeedWindow={handleChangeBankWindow}
            onToggleSignalType={handleToggleSignalType}
            onToggleImportance={handleToggleImportance}
            onToggleCategory={handleToggleCategory}
            onClearCategoryFilter={handleClearCategoryFilter}
            onChangeSortMode={setSortMode}
            onResetFilters={handleResetFilters}
            onOpenSignalDetail={(signalId) => {
              setPreviousViewBeforeDetail(ACTIVE_VIEWS.ENTITY);
              setSelectedSignalId(signalId);
              setActiveView(ACTIVE_VIEWS.SIGNAL_DETAIL);
            }}
          />
        )}

        {activeView === ACTIVE_VIEWS.SIGNAL_DETAIL && selectedSignal && selectedInstitution && (
          <SignalDetailView
            institution={selectedInstitution}
            signal={selectedSignal}
            onBack={() => setActiveView(previousViewBeforeDetail)}
          />
        )}
      </main>
    </div>
  );
}

function LandingView({
  signals,
  activeSignalTypes,
  activeImportance,
  activeCategories,
  activeInstitutionTypes,
  globalTimeWindowHours,
  sortMode,
  dashboardInstitutions,
  dashboardOverviewSignals,
  dashboardAiSignals,
  landingOverviewWindowHours,
  landingAiWindowHours,
  landingAiSummaryGeneratedAt,
  onChangeGlobalWindow,
  onToggleSignalType,
  onToggleImportance,
  onToggleCategory,
  onClearCategoryFilter,
  onToggleInstitutionType,
  onClearInstitutionTypeFilter,
  onChangeLandingOverviewWindow,
  onChangeLandingAiWindow,
  onRegenerateLandingAiSummary,
  onChangeSortMode,
  onResetFilters,
  onOpenSignalDetail,
  onSelectInstitution,
}) {
  const baseSignals = useMemo(() => {
    const ids = new Set(dashboardInstitutions.map((i) => i.id));
    return SIGNALS.filter(
      (s) => ids.has(s.institutionId) && s.timestampOffsetHours <= globalTimeWindowHours,
    );
  }, [dashboardInstitutions, globalTimeWindowHours]);

  const importanceTotals = useMemo(
    () => computeImportanceTotals(baseSignals),
    [baseSignals],
  );
  const categoryCounts = useMemo(() => {
    const out = {};
    SIGNAL_CATEGORIES.forEach((c) => {
      out[c.id] = baseSignals.filter(
        (s) => (s.categoryIds ?? []).indexOf(c.id) !== -1,
      ).length;
    });
    return out;
  }, [baseSignals]);
  const institutionTypeCounts = useMemo(() => {
    const out = {};
    INSTITUTION_TYPES.forEach((t) => {
      out[t] = INSTITUTIONS.filter((i) => i.type === t).length;
    });
    return out;
  }, []);

  const allSourcesOnLocal = SIGNAL_TYPES.every((t) => activeSignalTypes.has(t));
  const allImpOnLocal = IMPORTANCE_LEVELS.every((lvl) => activeImportance.has(lvl));
  const sourcePanelToggleLabel = allSourcesOnLocal && allImpOnLocal ? 'Show none' : 'Show all';

  const aggCritical = useMemo(() => {
    return dashboardOverviewSignals.filter(
      (s) => s.importance === 'critical' || s.importance === 'high',
    ).length;
  }, [dashboardOverviewSignals]);
  const aggRiskAvg = useMemo(() => {
    if (!dashboardInstitutions.length) return 0;
    const sum = dashboardInstitutions.reduce((a, i) => a + i.riskScore, 0);
    return Math.round(sum / dashboardInstitutions.length);
  }, [dashboardInstitutions]);
  const aggRiskChangeAvg = useMemo(() => {
    if (!dashboardInstitutions.length) return 0;
    const sum = dashboardInstitutions.reduce((a, i) => a + (i.riskChange ?? 0), 0);
    return Math.round(sum / dashboardInstitutions.length);
  }, [dashboardInstitutions]);
  const statusCounts = useMemo(() => {
    const out = {};
    dashboardInstitutions.forEach((i) => {
      const st = i.pcaStatus || 'normal';
      out[st] = (out[st] || 0) + 1;
    });
    return out;
  }, [dashboardInstitutions]);

  const statusCountsPrev = useMemo(() => {
    const n = dashboardInstitutions.length;
    const w = statusCounts.watch ?? 0;
    const e = statusCounts.elevated ?? 0;
    const no = statusCounts.normal ?? 0;
    const prevWatch = Math.max(0, w - 1);
    const prevElevated = Math.max(0, e - 1);
    const prevNormal = n - prevWatch - prevElevated;
    return {
      watch: prevWatch,
      elevated: prevElevated,
      normal: Math.max(0, prevNormal),
    };
  }, [dashboardInstitutions.length, statusCounts]);

  const aiTotals = useMemo(
    () => computeImportanceTotals(dashboardAiSignals),
    [dashboardAiSignals],
  );
  const aiSourceEntries = useMemo(
    () => computeSourceSplit(dashboardAiSignals),
    [dashboardAiSignals],
  );

  return (
    <section className="content">
      <div className="content-header">
        <div>
          <h1 className="content-title">Dashboard — all institutions</h1>
          <p className="content-subtitle">
            Risk &amp; supervisory overview and signal feed across selected bank types.
          </p>
        </div>
      </div>

      <div className="summary-row">
        <div className="summary-card summary-card-wide">
          <div className="summary-label">Risk &amp; supervisory overview</div>
          <div className="summary-main summary-main-multi">
            <div className="summary-block">
              <div className="summary-block-label">Overall risk (avg)</div>
              <div className="summary-block-value">
                <span className="summary-value">{aggRiskAvg}</span>
                <span
                  className={
                    aggRiskChangeAvg >= 0 ? 'trend-badge trend-up' : 'trend-badge trend-down'
                  }
                >
                  {aggRiskChangeAvg >= 0 ? '▲' : '▼'} {Math.abs(aggRiskChangeAvg)} pts{' '}
                  {formatWindowComparisonSuffix(landingOverviewWindowHours)}
                </span>
              </div>
            </div>
            <div className="summary-block">
              <div className="summary-block-label">Critical signals</div>
              <div className="summary-block-value">
                <span className="summary-value">{aggCritical}</span>
                <span className="trend-badge trend-up">
                  across {dashboardInstitutions.length} institution
                  {dashboardInstitutions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="summary-block">
              <div className="summary-block-label">Status</div>
              <div className="summary-block-value" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                {['watch', 'normal', 'elevated'].map((st) => {
                  const count = statusCounts[st] ?? 0;
                  const prev = statusCountsPrev[st] ?? 0;
                  const diff = count - prev;
                  const windowSuffix = formatWindowComparisonSuffix(landingOverviewWindowHours);
                  return (
                    <span key={st} className="trend-badge trend-up" style={{ marginRight: 6, display: 'inline-block' }}>
                      {st}: {count}
                      {diff !== 0 ? (
                        <span style={{ marginLeft: 2, fontWeight: 600 }}>
                          ({diff >= 0 ? '+' : ''}{diff} {windowSuffix})
                        </span>
                      ) : (
                        <span style={{ marginLeft: 2, opacity: 0.85 }}>{windowSuffix}</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="summary-meta-row">
            <div className="summary-meta-box">
              <div className="summary-meta-label">Overview window</div>
              <select
                className="select-input select-input-compact"
                value={String(landingOverviewWindowHours)}
                onChange={(e) => onChangeLandingOverviewWindow(Number(e.target.value))}
              >
                <option value={24 * 30}>Last 1 month</option>
                <option value={24 * 90}>Last 3 months</option>
                <option value={24 * 180}>Last 6 months</option>
                <option value={24 * 365}>Last 1 year</option>
                <option value={24 * 365}>Full history</option>
              </select>
            </div>
          </div>
        </div>
        <div className="summary-card summary-card-wide">
          <div className="summary-label">AI summary</div>
          <div className="summary-meta-row">
            <div className="summary-meta-box">
              <div className="summary-meta-label">Summary generated</div>
              <div className="summary-meta-value">
                {landingAiSummaryGeneratedAt.toLocaleString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                })}
              </div>
            </div>
            <div className="summary-meta-box">
              <div className="summary-meta-label">AI summary window</div>
              <select
                className="select-input select-input-compact"
                value={String(landingAiWindowHours)}
                onChange={(e) => onChangeLandingAiWindow(Number(e.target.value))}
              >
                <option value={24 * 30}>Last 1 month</option>
                <option value={24 * 90}>Last 3 months</option>
                <option value={24 * 180}>Last 6 months</option>
                <option value={24 * 365}>Last 1 year</option>
                <option value={24 * 365}>Full history</option>
              </select>
            </div>
          </div>
          <div className="summary-regenerate-wrap">
            <button
              type="button"
              className="primary-btn primary-btn-compact"
              onClick={onRegenerateLandingAiSummary}
            >
              Regenerate
            </button>
          </div>
          <div className="summary-ai">
            {dashboardInstitutions.length === 0 ? (
              <p>Select at least one bank type to see an aggregated summary.</p>
            ) : (
              <>
                <p>
                  Across the <strong>{dashboardInstitutions.length} institutions</strong> in
                  scope ({dashboardInstitutions.map((i) => i.name).join(', ')}), the selected AI
                  summary window produced <strong>{dashboardAiSignals.length} signals</strong> in
                  total. By severity: <strong>{aiTotals.critical} Critical</strong>,{' '}
                  <strong>{aiTotals.medium} Medium</strong>, <strong>{aiTotals.low} Low</strong>.
                  Main driving sources are{' '}
                  {aiSourceEntries.length
                    ? aiSourceEntries
                        .slice(0, 2)
                        .map((e) => sourceLabel(e.type))
                        .join(' and ')
                    : 'none'}
                  .
                </p>
                <p>
                  By bank type:{' '}
                  {Array.from(
                    new Set(dashboardInstitutions.map((i) => i.type))).map((type) => {
                    const insts = dashboardInstitutions.filter((i) => i.type === type);
                    const themes = insts.flatMap((i) =>
                      (i.dominantThemes || []).map((t) => `${t.label} ↑${t.changePct}%`),
                    );
                    return (
                      <span key={type}>
                        <strong>{type}</strong> ({insts.map((i) => i.name).join(', ')})
                        {themes.length ? ` — ${[...new Set(themes)].slice(0, 2).join('; ')}` : ''}.{' '}
                      </span>
                    );
                  })}
                  Small finance banks and urban co-operatives show the highest concentration in
                  IT/Payment Outages, Collections, and Viral Rumours; large private and public
                  sector banks contribute most News and Social volume with conduct and AML themes
                  notable where applicable. Supervisory focus is recommended on institutions with
                  elevated or watch status and on the top two risk themes per entity.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="signal-filter-bar">
        <div className="signal-filter-group">
          <span className="signal-filter-label">Signal feed window</span>
          <select
            className="select-input select-input-compact"
            value={String(globalTimeWindowHours)}
            onChange={(e) => onChangeGlobalWindow(Number(e.target.value))}
          >
            <option value="6">6 hours</option>
            <option value="24">24 hours</option>
            <option value="72">3 days</option>
            <option value="168">7 days</option>
            <option value={24 * 30}>Last 1 month</option>
            <option value={24 * 90}>Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="panels">
        <section className="panel panel-main">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Signal feed</h2>
              <p className="panel-subtitle">
                Ranked, de-duplicated items from news, social, legal and filings.
              </p>
            </div>
            <div className="panel-header-actions">
              <span className="legend-dot legend-critical" /> Critical
              <span className="legend-dot legend-medium" /> Medium
              <span className="legend-dot legend-low" /> Low
              <span className="importance-totals">
                C:{importanceTotals.critical} M:{importanceTotals.medium} L:{importanceTotals.low}
              </span>
              <div className="signal-sort-controls">
                <button
                  type="button"
                  className={'signal-sort-btn' + (sortMode === 'severity' ? ' active' : '')}
                  onClick={() => onChangeSortMode('severity')}
                >
                  Severity
                </button>
                <button
                  type="button"
                  className={'signal-sort-btn' + (sortMode === 'latest' ? ' active' : '')}
                  onClick={() => onChangeSortMode('latest')}
                >
                  Latest first
                </button>
              </div>
            </div>
          </header>
          <div className="signal-feed">
            {signals.length === 0 ? (
              <div className="signal-item signal-item-empty">
                <div className="signal-main">
                  <div className="signal-title-row">
                    <span className="signal-title">No signals match the current filters</span>
                  </div>
                  <div className="signal-body">
                    Adjust source, importance, category or bank type filters to see items.
                  </div>
                </div>
              </div>
            ) : (
              signals.map((s) => {
                const normImportance = normaliseImportance(s.importance);
                const severityLabel =
                  normImportance === 'critical'
                    ? 'Critical'
                    : normImportance === 'medium'
                    ? 'Medium'
                    : 'Low';
                const sentimentLabel =
                  s.sentiment === 'positive'
                    ? '+ Positive'
                    : s.sentiment === 'negative'
                    ? '− Negative'
                    : 'Neutral';

                const institution = INSTITUTIONS.find((i) => i.id === s.institutionId);
                const institutionName = institution ? institution.name : s.institutionId;

                return (
                  <button
                    type="button"
                    key={s.id}
                    className={`signal-item signal-severity-${normImportance}`}
                    onClick={() => onOpenSignalDetail(s)}
                  >
                    <div className="signal-main">
                      <div className="signal-title-row">
                        <span className="signal-title">{s.title}</span>
                      </div>
                      <div className="signal-meta-inline">
                        <span className={`chip ${importanceChipClass(normImportance)}`}>
                          {severityLabel} · {s.score}
                        </span>
                        <span className={`chip ${sentimentChipClass(s.sentiment)}`}>
                          {sentimentLabel}
                        </span>
                        <span className="signal-source">
                          {institutionName} · {s.sourceName} · {sourceLabel(s.sourceType)}
                        </span>
                        <span className="signal-timestamp">
                          {formatTimeAgo(s.timestampOffsetHours)}
                        </span>
                      </div>
                      <div className="signal-body">{s.body}</div>
                      {(s.categoryIds ?? []).length > 0 && (
                        <div className="pill-group signal-category-tags">
                          {(s.categoryIds ?? []).map((cid) => (
                            <span key={cid} className="chip chip-category">
                              {categoryLabel(cid)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="panel panel-side">
          <div className="side-group side-group-top">
            <header className="panel-header">
              <h2 className="panel-title">Bank type</h2>
              <button
                type="button"
                className="panel-reset-link"
                onClick={onClearInstitutionTypeFilter}
              >
                {activeInstitutionTypes.size > 0 ? 'Clear filter' : 'All'}
              </button>
            </header>
            <div className="side-card-grid side-card-grid-dense">
              {INSTITUTION_TYPES.map((t) => {
                const count = institutionTypeCounts[t] ?? 0;
                const isActive =
                  activeInstitutionTypes.size === 0 || activeInstitutionTypes.has(t);
                return (
                  <button
                    type="button"
                    key={t}
                    className={
                      'side-card side-card-clickable side-card-filter' +
                      (isActive ? ' side-card-source-active' : '')
                    }
                    onClick={() => onToggleInstitutionType(t)}
                    title={isActive ? 'Click to filter to only this type' : 'Click to include this type'}
                  >
                    <div className="side-card-label">{t}</div>
                    <div className="side-card-value">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="side-group side-group-top">
            <header className="panel-header">
              <h2 className="panel-title">Source breakdown</h2>
              <button type="button" className="panel-reset-link" onClick={onResetFilters}>
                {sourcePanelToggleLabel}
              </button>
            </header>
            <div className="side-card-grid">
              {SIGNAL_TYPES.map((t) => {
                const count = baseSignals.filter((s) => s.sourceType === t).length;
                const isActive = activeSignalTypes.has(t);
                return (
                  <button
                    type="button"
                    key={t}
                    className={
                      'side-card side-card-clickable side-card-filter' +
                      (isActive ? ' side-card-source-active' : '')
                    }
                    onClick={() => onToggleSignalType(t)}
                  >
                    <div className="side-card-label">{sourceLabel(t)}</div>
                    <div className="side-card-value">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="side-group side-group-bottom">
            <header className="panel-header">
              <h2 className="panel-title">Importance</h2>
            </header>
            <div className="side-card-grid">
              {['critical', 'medium', 'low'].map((lvl) => {
                const label = lvl.charAt(0).toUpperCase() + lvl.slice(1);
                const count = importanceTotals[lvl] ?? 0;
                const isActive = activeImportance.has(lvl);
                return (
                  <button
                    type="button"
                    key={lvl}
                    className={
                      'side-card side-card-clickable side-card-filter' +
                      (isActive ? ' side-card-source-active' : '')
                    }
                    onClick={() => onToggleImportance(lvl)}
                  >
                    <div className="side-card-label">{label}</div>
                    <div className="side-card-value">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="side-group side-group-bottom">
            <header className="panel-header">
              <h2 className="panel-title">Categories</h2>
              <button
                type="button"
                className="panel-reset-link"
                onClick={onClearCategoryFilter}
              >
                {activeCategories.size > 0 ? 'Clear filter' : 'All'}
              </button>
            </header>
            <div className="side-card-grid side-card-grid-dense">
              {SIGNAL_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] ?? 0;
                const isActive = activeCategories.has(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    className={
                      'side-card side-card-clickable side-card-filter side-card-category' +
                      (isActive ? ' side-card-source-active' : '')
                    }
                    onClick={() => onToggleCategory(cat.id)}
                  >
                    <div className="side-card-label">{cat.label}</div>
                    <div className="side-card-value">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function categoryLabel(id) {
  return SIGNAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function EntityView({
  institution,
  overviewWindowHours,
  aiWindowHours,
  aiSummaryGeneratedAt,
  feedWindowHours,
  lastUpdated,
  filteredSignals,
  activeSignalTypes,
  activeImportance,
  activeCategories,
  sortMode,
  selectedSignalId,
  onBackToLanding,
  onChangeOverviewWindow,
  onChangeAiWindow,
  onRegenerateAiSummary,
  onChangeFeedWindow,
  onToggleSignalType,
  onToggleImportance,
  onToggleCategory,
  onClearCategoryFilter,
  onChangeSortMode,
  onResetFilters,
  onOpenSignalDetail,
}) {
  const baseSignals = useMemo(() => {
    if (!institution) return [];
    return SIGNALS.filter(
      (s) =>
        s.institutionId === institution.id &&
        s.timestampOffsetHours <= overviewWindowHours,
    );
  }, [institution, overviewWindowHours]);

  const aiSignals = useMemo(() => {
    if (!institution) return [];
    return SIGNALS.filter(
      (s) =>
        s.institutionId === institution.id &&
        s.timestampOffsetHours <= aiWindowHours,
    );
  }, [institution, aiWindowHours]);

  const sourceEntries = useMemo(() => computeSourceSplit(filteredSignals), [filteredSignals]);
  const sourceTotal = useMemo(
    () => sourceEntries.reduce((acc, s) => acc + (s.score || 0), 0) || 1,
    [sourceEntries],
  );
  const activeCritical = filteredSignals.filter((s) => s.importance === 'critical').length;
  const activeHigh = filteredSignals.filter((s) => s.importance === 'high').length;
  const helperSignals = useMemo(() => {
    if (!activeSignalTypes.size) return [];
    return baseSignals.filter((s) => activeSignalTypes.has(s.sourceType));
  }, [baseSignals, activeSignalTypes]);
  const importanceTotals = useMemo(
    () => computeImportanceTotals(helperSignals),
    [helperSignals],
  );
  const allSourcesOnLocal = SIGNAL_TYPES.every((t) => activeSignalTypes.has(t));
  const allImpOnLocal = IMPORTANCE_LEVELS.every((lvl) => activeImportance.has(lvl));
  const sourcePanelToggleLabel = allSourcesOnLocal && allImpOnLocal ? 'Show none' : 'Show all';

  const categoryCounts = useMemo(() => {
    const out = {};
    SIGNAL_CATEGORIES.forEach((c) => {
      out[c.id] = baseSignals.filter(
        (s) => (s.categoryIds ?? []).indexOf(c.id) !== -1,
      ).length;
    });
    return out;
  }, [baseSignals]);

  return (
    <section className="content">
      <div className="content-header">
        <div>
          <h1 className="content-title">{institution.name}</h1>
          <p className="content-subtitle">
            {institution.type} · {institution.region}
          </p>
        </div>
        <div className="content-meta" />
      </div>

      <p className="overall-summary">
        Overall situation based on mock social, news, legal and filing signals. Stock:{' '}
        {institution.stock
          ? `${institution.stock.ticker} ₹${institution.stock.price} (${institution.stock.changePct}%)`
          : 'not listed'}
        .
      </p>

      <div className="summary-row">
        <div className="summary-card summary-card-wide">
          <div className="summary-label">Risk &amp; supervisory overview</div>
          <div className="summary-main summary-main-multi">
            <div className="summary-block">
              <div className="summary-block-label">Overall risk</div>
              <div className="summary-block-value">
                <span className="summary-value">{institution.riskScore}</span>
                <span
                  className={`trend-badge ${
                    institution.riskChange >= 0 ? 'trend-up' : 'trend-down'
                  }`}
                >
                  {institution.riskChange >= 0 ? '▲' : '▼'} {Math.abs(institution.riskChange)} pts{' '}
                  {formatWindowComparisonSuffix(overviewWindowHours)}
                </span>
              </div>
            </div>
            <div className="summary-block">
              <div className="summary-block-label">Critical signals</div>
              <div className="summary-block-value">
                <span className="summary-value">{activeCritical + activeHigh}</span>
                <span className="trend-badge trend-up">
                  +{institution.signalAccelerationPct}% {formatWindowComparisonSuffix(
                    overviewWindowHours,
                  )}
                </span>
              </div>
            </div>
            <div className="summary-block">
              <div className="summary-block-label">Status</div>
              <div className="summary-block-value">
                <span className="summary-value">{institution.pcaStatus}</span>
              </div>
              <div className="summary-block-themes">
                {institution.dominantThemes?.map((t) => (
                  <span key={t.id} className="trend-badge trend-up">
                    {t.label} ↑ {t.changePct}%
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="source-split-bar">
            <div
              className="source-split-overall"
              style={{ width: `${Math.min(100, Math.max(0, institution.riskScore))}%` }}
              title={`Overall risk score ${institution.riskScore}`}
            />
          </div>
          <div className="summary-meta-row">
            <div className="summary-meta-box">
              <div className="summary-meta-label">Overview window</div>
              <select
                className="select-input select-input-compact"
                value={String(overviewWindowHours)}
                onChange={(e) => onChangeOverviewWindow(Number(e.target.value))}
              >
                <option value={24 * 30}>Last 1 month</option>
                <option value={24 * 90}>Last 3 months</option>
                <option value={24 * 180}>Last 6 months</option>
                <option value={24 * 365}>Last 1 year</option>
                <option value={24 * 365}>Full history</option>
              </select>
            </div>
          </div>
        </div>
        <div className="summary-card summary-card-wide">
          <div className="summary-label">AI summary</div>
          <div className="summary-meta-row">
            <div className="summary-meta-box">
              <div className="summary-meta-label">Summary generated</div>
              <div className="summary-meta-value">
                {aiSummaryGeneratedAt.toLocaleString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                })}
              </div>
            </div>
            <div className="summary-meta-box">
              <div className="summary-meta-label">AI summary window</div>
              <select
                className="select-input select-input-compact"
                value={String(aiWindowHours)}
                onChange={(e) => onChangeAiWindow(Number(e.target.value))}
              >
                <option value={24 * 30}>Last 1 month</option>
                <option value={24 * 90}>Last 3 months</option>
                <option value={24 * 180}>Last 6 months</option>
                <option value={24 * 365}>Last 1 year</option>
                <option value={24 * 365}>Full history</option>
              </select>
            </div>
          </div>
          <div className="summary-regenerate-wrap">
            <button
              type="button"
              className="primary-btn primary-btn-compact"
              onClick={onRegenerateAiSummary}
            >
              Regenerate
            </button>
          </div>
          <div className="summary-ai">
            {(() => {
              const aiEntries = computeSourceSplit(aiSignals);
              const totals = computeImportanceTotals(aiSignals);
              const total = aiSignals.length;
              const top = aiEntries[0];
              const second = aiEntries[1];
              const topLabel = top ? sourceLabel(top.type) : null;
              const secondLabel = second ? sourceLabel(second.type) : null;
              const themeLine =
                institution.dominantThemes?.length > 0
                  ? institution.dominantThemes
                      .map((t) => `${t.label} ↑ ${t.changePct}%`)
                      .join(', ')
                  : null;
              return (
                <>
                  <p>
                    Over the selected AI summary window this entity generated{' '}
                    <strong>{total} signals</strong> in total. By severity:{' '}
                    <strong>{totals.critical} Critical</strong>,{' '}
                    <strong>{totals.medium} Medium</strong>,{' '}
                    <strong>{totals.low} Low</strong>. The main driving sources are{' '}
                    {topLabel && secondLabel
                      ? `${topLabel} and ${secondLabel}`
                      : topLabel || 'no sources'}
                    , with news and social accounting for most of the volume in the
                    window.
                  </p>
                  <p>
                    Peak risk themes for this institution in the period include:{' '}
                    {themeLine || '—'}.
                    Concentration in digital and operational themes is consistent with
                    the source mix; liquidity and conduct-related signals appear in
                    smaller but non-trivial proportions. Supervisory focus is
                    recommended on the top two categories when critical count exceeds
                    the entity baseline.
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>
      <div className="signal-filter-bar" />

      <div className="panels">
        <section className="panel panel-main">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Signal feed</h2>
              <p className="panel-subtitle">
                Ranked, de-duplicated items from news, social, legal and filings.
              </p>
            </div>
            <div className="panel-header-actions">
              <span className="legend-dot legend-critical" /> Critical
              <span className="legend-dot legend-medium" /> Medium
              <span className="legend-dot legend-low" /> Low
              <div className="signal-window">
                <span className="signal-window-label">Signal feed window</span>
                <select
                  className="select-input select-input-compact"
                  value={String(feedWindowHours)}
                  onChange={(e) => onChangeFeedWindow(Number(e.target.value))}
                >
                  <option value="1">Last 1 hour</option>
                  <option value="6">Last 6 hours</option>
                  <option value="24">Last 24 hours</option>
                  <option value="72">Last 3 days</option>
                  <option value="168">Last 7 days</option>
                  <option value={24 * 30}>Last 1 month</option>
                  <option value={24 * 90}>Last 3 months</option>
                  <option value={24 * 180}>Last 6 months</option>
                  <option value={24 * 365}>Last 1 year</option>
                </select>
              </div>
              <div className="signal-sort-controls">
                <button
                  type="button"
                  className={
                    'signal-sort-btn' + (sortMode === 'severity' ? ' active' : '')
                  }
                  onClick={() => onChangeSortMode('severity')}
                >
                  Severity
                </button>
                <button
                  type="button"
                  className={
                    'signal-sort-btn' + (sortMode === 'latest' ? ' active' : '')
                  }
                  onClick={() => onChangeSortMode('latest')}
                >
                  Latest first
                </button>
              </div>
            </div>
          </header>
          <div className="signal-feed">
            {filteredSignals.length === 0 ? (
              <div className="signal-item signal-item-empty">
                <div className="signal-main">
                  <div className="signal-title-row">
                    <span className="signal-title">No signals match the current filters</span>
                  </div>
                  <div className="signal-body">
                    Adjust source or importance filters to see items in this feed.
                  </div>
                </div>
              </div>
            ) : (
              filteredSignals.map((s) => {
                const normImportance = normaliseImportance(s.importance);
                const severityLabel =
                  normImportance === 'critical'
                    ? 'Critical'
                    : normImportance === 'medium'
                    ? 'Medium'
                    : 'Low';
                const sentimentLabel =
                  s.sentiment === 'positive'
                    ? '+ Positive'
                    : s.sentiment === 'negative'
                    ? '− Negative'
                    : 'Neutral';

                return (
                  <button
                    type="button"
                    key={s.id}
                    className={
                      `signal-item signal-severity-${normImportance}` +
                      (s.id === selectedSignalId ? ' signal-item-active' : '')
                    }
                    onClick={() => onOpenSignalDetail(s.id)}
                  >
                    <div className="signal-main">
                      <div className="signal-title-row">
                        <span className="signal-title">{s.title}</span>
                      </div>
                      <div className="signal-meta-inline">
                        <span className={`chip ${importanceChipClass(normImportance)}`}>
                          {severityLabel} · {s.score}
                        </span>
                        <span className={`chip ${sentimentChipClass(s.sentiment)}`}>
                          {sentimentLabel}
                        </span>
                        <span className="signal-source">
                          {s.sourceName} · {sourceLabel(s.sourceType)}
                        </span>
                        <span className="signal-timestamp">
                          {formatTimeAgo(s.timestampOffsetHours)}
                        </span>
                      </div>
                      <div className="signal-body">{s.body}</div>
                      {(s.categoryIds ?? []).length > 0 && (
                        <div className="pill-group signal-category-tags">
                          {(s.categoryIds ?? []).map((cid) => (
                            <span key={cid} className="chip chip-category">
                              {categoryLabel(cid)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="panel panel-side">
          <div className="side-group side-group-top">
            <header className="panel-header">
              <h2 className="panel-title">Source breakdown</h2>
              <button type="button" className="panel-reset-link" onClick={onResetFilters}>
                {sourcePanelToggleLabel}
              </button>
            </header>
            <div className="side-card-grid">
              {SIGNAL_TYPES.map((t) => {
                const count = baseSignals.filter((s) => s.sourceType === t).length;
                const isActive = activeSignalTypes.has(t);
                return (
                  <button
                    type="button"
                    key={t}
                    className={
                      'side-card side-card-clickable side-card-filter' +
                      (isActive ? ' side-card-source-active' : '')
                    }
                    onClick={() => onToggleSignalType(t)}
                  >
                    <div className="side-card-label">{sourceLabel(t)}</div>
                    <div className="side-card-value">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="side-group side-group-bottom">
            <header className="panel-header">
              <h2 className="panel-title">Importance</h2>
            </header>
            <div className="side-card-grid">
              {['critical', 'medium', 'low'].map((lvl) => {
                const label = lvl.charAt(0).toUpperCase() + lvl.slice(1);
                const count = importanceTotals[lvl] ?? 0;
                const isActive = activeImportance.has(lvl);
                return (
                  <button
                    type="button"
                    key={lvl}
                    className={
                      'side-card side-card-clickable side-card-filter' +
                      (isActive ? ' side-card-source-active' : '')
                    }
                    onClick={() => onToggleImportance(lvl)}
                  >
                    <div className="side-card-label">{label}</div>
                    <div className="side-card-value">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="side-group side-group-bottom">
            <header className="panel-header">
              <h2 className="panel-title">Categories</h2>
              <button
                type="button"
                className="panel-reset-link"
                onClick={onClearCategoryFilter}
              >
                {activeCategories.size > 0 ? 'Clear filter' : 'All'}
              </button>
            </header>
            <div className="side-card-grid side-card-grid-dense">
              {SIGNAL_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] ?? 0;
                const theme = institution.dominantThemes?.find((t) => t.id === cat.id);
                const trend = theme ? ` ↑ ${theme.changePct}%` : '';
                const isActive = activeCategories.has(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    className={
                      'side-card side-card-clickable side-card-filter side-card-category' +
                      (isActive ? ' side-card-source-active' : '')
                    }
                    onClick={() => onToggleCategory(cat.id)}
                  >
                    <div className="side-card-label">
                      {cat.label}
                      {trend ? <span className="side-card-trend">{trend}</span> : null}
                    </div>
                    <div className="side-card-value">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function SignalDetailView({ institution, signal, onBack }) {
  return (
    <section className="content">
      <button type="button" className="back-pill-btn" onClick={onBack}>
        ← Back to signal feed
      </button>
      <div className="content-header">
        <div>
          <h1 className="content-title">Signal detail</h1>
          <p className="content-subtitle">
            Full context for a single signal, including supervisory view and raw sources.
          </p>
        </div>
      </div>

      <div className="panels">
        <section className="panel panel-main">
          <div className="signal-detail-page-main">
            <h2 className="panel-title">{signal.title}</h2>
            <p className="panel-subtitle">
              {institution.name} · {sourceLabel(signal.sourceType)} ·{' '}
              {formatTimeAgo(signal.timestampOffsetHours)}
            </p>
            <p className="signal-body">{signal.body}</p>
            <div className="pill-group" style={{ marginTop: 8 }}>
              <span className={`chip ${importanceChipClass(signal.importance)}`}>
                {signal.importance}
              </span>
              <span className={`chip ${sentimentChipClass(signal.sentiment)}`}>
                {signal.sentiment}
              </span>
              {(signal.categoryIds ?? []).map((cid) => (
                <span key={cid} className="chip chip-category">
                  {categoryLabel(cid)}
                </span>
              ))}
            </div>
            {signal.supervisorySummary && (
              <div style={{ marginTop: 12 }}>
                <div className="panel-title">Supervisory summary</div>
                <p className="signal-body">{signal.supervisorySummary}</p>
              </div>
            )}
          </div>
        </section>
        <section className="panel panel-side">
          <div className="signal-detail-page-raw">
            <h3 className="panel-title">Raw sources</h3>
            <div className="side-card-grid">
              {signal.rawSources?.map((src, idx) => (
                <a
                  key={`${src.label}-${idx}`}
                  className="side-card side-card-clickable"
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="side-card-label">
                    {src.type} · {src.label}
                  </div>
                  <div className="side-card-value">Open source</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default App;

