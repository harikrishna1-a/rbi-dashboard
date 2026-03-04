// Simple state for filters and selection
const state = {
  // Global navigation
  activeView: 'landing', // 'landing' | 'entity' | 'signalDetail'
  activeDetailPage: 'risk', // for entity view: 'risk' | 'financials'

  // Entity / feed filters
  selectedInstitutionId: INSTITUTIONS[0]?.id ?? null,
  activeSignalTypes: new Set(SIGNAL_TYPES),
  activeImportance: new Set(IMPORTANCE_LEVELS),
  sortMode: 'severity', // 'severity' | 'latest'
  institutionSortMode: 'risk', // 'risk' | 'name' | 'marketCap'
  // Per-bank time window (hours); falls back to defaultTimeWindowHours
  bankTimeWindows: {},
  defaultTimeWindowHours: 24,
  // Global time window (hours) used for landing / cross-entity views
  globalTimeWindowHours: 24,
  // Backwards-compatible default (used when no bank-specific override)
  timeWindowHours: 24,

  // Data freshness + selection
  lastUpdated: mockNow(),
  updating: false,
  selectedSignalId: null,
};

function formatTimeAgo(offsetHours) {
  const minutes = Math.round(offsetHours * 60);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(offsetHours);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

function formatTimestampLabel(date) {
  return date.toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
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

function sourceAccent(type) {
  if (type === 'news') return 'badge-risk-medium';
  if (type === 'social') return 'badge-risk-low';
  if (type === 'legal') return 'badge-risk-high';
  if (type === 'filing') return 'badge-light';
  return 'badge-light';
}

function renderInstitutionList() {
  const container = document.getElementById('institutionList');
  const sortContainer = document.getElementById('institutionSortControls');
  container.innerHTML = '';

  if (sortContainer) {
    sortContainer.innerHTML = '';
    const makeBtn = (mode, label) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'institution-sort-btn';
      if (state.institutionSortMode === mode) btn.classList.add('active');
      btn.textContent = label;
      btn.onclick = () => {
        state.institutionSortMode = mode;
        renderAll();
      };
      return btn;
    };
    sortContainer.appendChild(makeBtn('risk', 'Risk'));
    sortContainer.appendChild(makeBtn('marketCap', 'Market cap'));
    sortContainer.appendChild(makeBtn('name', 'Name'));
  }

  const list = INSTITUTIONS.slice().sort((a, b) => {
    if (state.institutionSortMode === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (state.institutionSortMode === 'marketCap') {
      return (b.marketCapCr || 0) - (a.marketCapCr || 0);
    }
    // default: risk descending
    return b.riskScore - a.riskScore;
  });

  list.forEach((inst) => {
    const el = document.createElement('div');
    el.className = 'institution-item';
    if (inst.id === state.selectedInstitutionId) {
      el.classList.add('active');
    }
    el.onclick = () => {
      state.selectedInstitutionId = inst.id;
      state.activeView = 'entity';
      state.activeDetailPage = 'risk';
      renderAll();
    };

    const left = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'institution-name';
    name.textContent = inst.name;
    const sub = document.createElement('div');
    sub.style.fontSize = '10px';
    sub.style.color = '#6b7280';
    sub.textContent = inst.type;
    left.appendChild(name);
    left.appendChild(sub);

    const meta = document.createElement('div');
    meta.className = 'institution-meta';

    const risk = document.createElement('span');
    risk.className = `badge ${institutionRiskBadge(inst.riskLevel)}`;
    risk.textContent = `Risk ${inst.riskScore}`;

    const delta = document.createElement('span');
    delta.className = 'badge badge-light';
    delta.textContent = inst.riskChange >= 0 ? `↑ ${inst.riskChange}` : `↓ ${-inst.riskChange}`;

    meta.appendChild(risk);
    meta.appendChild(delta);

    el.appendChild(left);
    el.appendChild(meta);
    container.appendChild(el);
  });
}

function renderFilters() {
  const typeContainer = document.getElementById('signalTypeFilters');
  const importanceContainer = document.getElementById('importanceFilters');
  const twSelect = document.getElementById('timeWindowSelect');

  if (!typeContainer || !importanceContainer || !twSelect) {
    return;
  }

  typeContainer.innerHTML = '';
  SIGNAL_TYPES.forEach((t) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'pill';
    if (state.activeSignalTypes.has(t)) pill.classList.add('active');
    pill.textContent = sourceLabel(t);
    pill.onclick = () => {
      if (state.activeSignalTypes.has(t)) state.activeSignalTypes.delete(t);
      else state.activeSignalTypes.add(t);
      if (state.activeSignalTypes.size === 0) {
        SIGNAL_TYPES.forEach((x) => state.activeSignalTypes.add(x));
      }
      renderAll();
    };
    typeContainer.appendChild(pill);
  });

  importanceContainer.innerHTML = '';
  IMPORTANCE_LEVELS.forEach((lvl) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'pill';
    if (state.activeImportance.has(lvl)) pill.classList.add('active');
    pill.textContent = lvl.charAt(0).toUpperCase() + lvl.slice(1);
    pill.onclick = () => {
      if (state.activeImportance.has(lvl)) state.activeImportance.delete(lvl);
      else state.activeImportance.add(lvl);
      if (state.activeImportance.size === 0) {
        IMPORTANCE_LEVELS.forEach((x) => state.activeImportance.add(x));
      }
      renderAll();
    };
    importanceContainer.appendChild(pill);
  });

  // Per-bank time window: fall back to default if not set
  const currentInstId = state.selectedInstitutionId;
  const bankWindow =
    (currentInstId && state.bankTimeWindows[currentInstId]) || state.defaultTimeWindowHours;
  twSelect.value = String(bankWindow);
  twSelect.onchange = (e) => {
    const v = Number(e.target.value);
    const hours = Number.isNaN(v) ? state.defaultTimeWindowHours : v;
    if (currentInstId) {
      state.bankTimeWindows[currentInstId] = hours;
    }
    state.timeWindowHours = hours;
    renderAll();
  };
}

function computeFilteredSignals() {
  if (!state.selectedInstitutionId) return [];
  const list = SIGNALS.filter((s) => {
    if (s.institutionId !== state.selectedInstitutionId) return false;
    if (!state.activeSignalTypes.has(s.sourceType)) return false;
    if (!state.activeImportance.has(s.importance)) return false;
    // Per-bank time window (in hours)
    const bankWin =
      (state.selectedInstitutionId &&
        state.bankTimeWindows[state.selectedInstitutionId]) ||
      state.defaultTimeWindowHours;
    if (s.timestampOffsetHours > bankWin) return false;
    return true;
  }).sort((a, b) => b.score - a.score);

  if (!list.length) {
    state.selectedSignalId = null;
  } else if (!state.selectedSignalId || !list.some((s) => s.id === state.selectedSignalId)) {
    state.selectedSignalId = list[0].id;
  }

  // Sort according to current mode
  if (state.sortMode === 'latest') {
    // Smaller offsetHours = more recent
    return list.slice().sort((a, b) => a.timestampOffsetHours - b.timestampOffsetHours);
  }

  // Default: severity/score
  const importanceRank = {
    critical: 3,
    high: 2,
    medium: 1,
    low: 0,
  };
  return list
    .slice()
    .sort(
      (a, b) =>
        (importanceRank[b.importance] ?? 0) - (importanceRank[a.importance] ?? 0) ||
        b.score - a.score,
    );
}

function computeSignalAcceleration(inst) {
  if (!inst || typeof inst.signalAccelerationPct !== 'number') return 0;
  return inst.signalAccelerationPct;
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

  // Sort descending by score for consistent ordering
  entries.sort((a, b) => b.score - a.score);
  return entries;
}

function renderSummaryRow() {
  const container = document.getElementById('summaryRow');
  container.innerHTML = '';

  const inst = INSTITUTIONS.find((i) => i.id === state.selectedInstitutionId);
  const signals = computeFilteredSignals();

  if (!inst) return;

  const activeCritical = signals.filter((s) => s.importance === 'critical').length;
  const activeHigh = signals.filter((s) => s.importance === 'high').length;

  const sourceEntries = computeSourceSplit(signals);
  const sourceTotal = sourceEntries.reduce((acc, s) => acc + (s.score || 0), 0) || 1;
  const accelPct = computeSignalAcceleration(inst);

  const card1 = document.createElement('div');
  card1.className = 'summary-card summary-card-wide summary-card-clickable';
  if (state.activeDetailPage === 'risk') {
    card1.classList.add('summary-card-active');
  }

  const label1 = document.createElement('div');
  label1.className = 'summary-label';
  label1.textContent = 'Risk score by source';

  const main1 = document.createElement('div');
  main1.className = 'summary-main';

  const valueWrap = document.createElement('div');
  valueWrap.className = 'summary-value';
  valueWrap.textContent = inst.riskScore;

  const trendWrap = document.createElement('div');
  trendWrap.className = 'summary-trend';
  const trendBadge = document.createElement('span');
  trendBadge.className = `trend-badge ${inst.riskChange >= 0 ? 'trend-up' : 'trend-down'}`;
  trendBadge.textContent = `${inst.riskChange >= 0 ? '▲' : '▼'} ${Math.abs(
    inst.riskChange,
  )} pts vs 7d`;
  trendWrap.appendChild(trendBadge);

  main1.appendChild(valueWrap);
  main1.appendChild(trendWrap);

  const bar = document.createElement('div');
  bar.className = 'source-split-bar';
  sourceEntries.forEach((entry) => {
    if (!entry.score) return;
    const seg = document.createElement('div');
    seg.className = `source-split-segment source-segment-${entry.type}`;
    const flexValue = Math.max(1, entry.score);
    seg.style.flex = String(flexValue);
    seg.title = `${sourceLabel(entry.type)} · score ${entry.score}`;
    bar.appendChild(seg);
  });

  const legend = document.createElement('div');
  legend.className = 'source-split-legend';
  sourceEntries.forEach((entry) => {
    const pct = Math.round(((entry.score || 0) / sourceTotal) * 100);
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip chip-clickable';
    chip.textContent = `${sourceLabel(entry.type)}: ${entry.score} (${pct}%)`;
    chip.title = `Filter feed by ${sourceLabel(entry.type)} only`;
    chip.onclick = (e) => {
      e.stopPropagation();
      state.activeDetailPage = 'risk';
      state.activeSignalTypes = new Set([entry.type]);
      renderAll();
    };
    legend.appendChild(chip);
  });

  card1.appendChild(label1);
  card1.appendChild(main1);
  card1.appendChild(bar);
  card1.appendChild(legend);

  const card2 = document.createElement('div');
  card2.className = 'summary-card summary-card-clickable';
  card2.innerHTML = `
    <div class="summary-label">High priority items</div>
    <div class="summary-main">
      <div class="summary-value">${activeCritical + activeHigh}</div>
      <div class="summary-trend">
        <span class="badge ${activeCritical > 0 ? 'badge-risk-high' : 'badge-risk-low'}">
          ${activeCritical} critical
        </span>
      </div>
    </div>
    <div style="font-size:11px;color:#6b7280;">
      Signal acceleration: <strong>${accelPct >= 0 ? '+' : '-'}${Math.abs(
    accelPct,
  ).toFixed(1)}%</strong> vs 24h avg
    </div>
  `;

  const card3 = document.createElement('div');
  card3.className = 'summary-card summary-card-clickable';
  if (state.activeDetailPage === 'financials') {
    card3.classList.add('summary-card-active');
  }
  if (inst.stock) {
    const direction = inst.stock.changePct >= 0 ? 'trend-up' : 'trend-down';
    const arrow = inst.stock.changePct >= 0 ? '▲' : '▼';
    card3.innerHTML = `
      <div class="summary-label">Market view</div>
      <div class="summary-main">
        <div>
          <div style="font-size:13px;font-weight:600;">${inst.stock.ticker}</div>
          <div style="font-size:11px;color:#9ca3af;">₹${inst.stock.price.toFixed(1)}</div>
        </div>
        <div class="summary-trend">
          <span class="trend-badge ${direction}">
            ${arrow} ${Math.abs(inst.stock.changePct).toFixed(1)}%
          </span>
        </div>
      </div>
      <div style="font-size:11px;color:#9ca3af;">Mock spot price (NSE/BSE)</div>
    `;
  } else {
    card3.innerHTML = `
      <div class="summary-label">Market view</div>
      <div class="summary-main">
        <div style="font-size:13px;font-weight:600;">Unlisted / no market data</div>
      </div>
      <div style="font-size:11px;color:#9ca3af;">No stock price available for this entity.</div>
    `;
  }

  container.appendChild(card1);
  container.appendChild(card2);
  container.appendChild(card3);

  // Clicking tiles navigates to more detailed "pages"
  card1.onclick = () => {
    state.activeDetailPage = 'risk';
    // Reset importance filter to show full picture
    state.activeImportance = new Set(IMPORTANCE_LEVELS);
    renderAll();
  };

  card2.onclick = () => {
    state.activeDetailPage = 'risk';
    // Focus the feed on high-priority items
    state.activeImportance = new Set(['critical', 'high']);
    renderAll();
  };

  card3.onclick = () => {
    state.activeDetailPage = 'financials';
    renderAll();
  };
}

function renderSignalFeed() {
  const container = document.getElementById('signalFeed');
  container.innerHTML = '';

  const sortContainer = document.getElementById('signalSortControls');
  if (sortContainer) {
    sortContainer.innerHTML = '';
    const bySeverity = document.createElement('button');
    bySeverity.type = 'button';
    bySeverity.className = 'signal-sort-btn';
    if (state.sortMode === 'severity') bySeverity.classList.add('active');
    bySeverity.textContent = 'Sort: Severity';
    bySeverity.onclick = (e) => {
      e.stopPropagation();
      state.sortMode = 'severity';
      renderAll();
    };

    const byLatest = document.createElement('button');
    byLatest.type = 'button';
    byLatest.className = 'signal-sort-btn';
    if (state.sortMode === 'latest') byLatest.classList.add('active');
    byLatest.textContent = 'Sort: Latest first';
    byLatest.onclick = (e) => {
      e.stopPropagation();
      state.sortMode = 'latest';
      renderAll();
    };

    sortContainer.appendChild(bySeverity);
    sortContainer.appendChild(byLatest);
  }

  const signals = computeFilteredSignals();
  if (signals.length === 0) {
    const empty = document.createElement('div');
    empty.style.fontSize = '11px';
    empty.style.color = '#6b7280';
    empty.textContent = 'No items match the current filters and time window.';
    container.appendChild(empty);
    return;
  }

  signals.forEach((s) => {
    const item = document.createElement('article');
    item.className = 'signal-item';
    item.onclick = () => {
      state.selectedSignalId = s.id;
      state.activeView = 'signalDetail';
      state.activeDetailPage = 'risk';
      renderAll();
    };

    const left = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'signal-header';
    const title = document.createElement('div');
    title.className = 'signal-title';
    title.textContent = s.title;
    const sourceChip = document.createElement('span');
    sourceChip.className = `chip chip-source ${sourceAccent(s.sourceType)}`;
    sourceChip.textContent = sourceLabel(s.sourceType);
    header.appendChild(title);
    header.appendChild(sourceChip);

    const body = document.createElement('div');
    body.className = 'signal-body';
    body.textContent = s.body;

    const metaRow = document.createElement('div');
    metaRow.className = 'signal-meta-row';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'signal-meta-left';

    const impChip = document.createElement('span');
    impChip.className = `chip ${importanceChipClass(s.importance)}`;
    impChip.textContent = s.importance.toUpperCase();

    const sentChip = document.createElement('span');
    sentChip.className = `chip ${sentimentChipClass(s.sentiment)}`;
    sentChip.textContent =
      s.sentiment === 'positive'
        ? 'Constructive'
        : s.sentiment === 'negative'
        ? 'Adverse'
        : 'Neutral';

    const tagsChip = document.createElement('span');
    tagsChip.className = 'chip';
    tagsChip.textContent = s.tags.join(' • ');

    const cacheChip = document.createElement('span');
    cacheChip.className = 'chip';
    const cacheStatus = s.cacheStatus || 'cached';
    cacheChip.textContent =
      cacheStatus === 'streaming' ? 'Live stream' : cacheStatus === 'cached' ? 'Cached' : cacheStatus;

    metaLeft.appendChild(impChip);
    metaLeft.appendChild(sentChip);
    metaLeft.appendChild(tagsChip);
    metaLeft.appendChild(cacheChip);

    const metaRight = document.createElement('div');
    metaRight.className = 'signal-meta-right';
    metaRight.textContent = `${s.sourceName} · ${formatTimeAgo(s.timestampOffsetHours)}`;

    metaRow.appendChild(metaLeft);
    metaRow.appendChild(metaRight);

    left.appendChild(header);
    left.appendChild(body);
    left.appendChild(metaRow);

    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.flexDirection = 'column';
    right.style.justifyContent = 'space-between';
    right.style.alignItems = 'flex-end';
    right.style.gap = '4px';

    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'badge badge-light';
    scoreBadge.textContent = `Signal score: ${s.score}`;

    const horizon = document.createElement('div');
    horizon.style.fontSize = '10px';
    horizon.style.color = '#6b7280';
    const parts = [];
    if (s.shortTerm) parts.push('short-term');
    if (s.structural) parts.push('structural');
    horizon.textContent = parts.length ? parts.join(' • ') : '—';

    right.appendChild(scoreBadge);
    right.appendChild(horizon);

    item.appendChild(left);
    item.appendChild(right);
    container.appendChild(item);
  });
}

function renderSideBreakdowns() {
  const signals = computeFilteredSignals();

  const srcContainer = document.getElementById('sourceBreakdown');
  const horContainer = document.getElementById('horizonBreakdown');
  srcContainer.innerHTML = '';
  horContainer.innerHTML = '';

  const total = signals.length || 1;
  const byType = {};
  SIGNAL_TYPES.forEach((t) => (byType[t] = 0));
  signals.forEach((s) => {
    if (!byType[s.sourceType]) byType[s.sourceType] = 0;
    byType[s.sourceType] += 1;
  });

  SIGNAL_TYPES.forEach((t) => {
    const count = byType[t] || 0;
    const pct = Math.round((count / total) * 100);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'side-card side-card-clickable';
    card.title = `Filter feed by ${sourceLabel(t)} only`;
    card.innerHTML = `
      <div class="side-card-label">${sourceLabel(t)}</div>
      <div class="side-card-value">${count}</div>
      <div class="side-card-footnote">${pct}% of feed</div>
    `;
    card.onclick = () => {
      state.activeDetailPage = 'risk';
      state.activeSignalTypes = new Set([t]);
      renderAll();
    };
    srcContainer.appendChild(card);
  });

  const shortCount = signals.filter((s) => s.shortTerm).length;
  const structCount = signals.filter((s) => s.structural).length;
  const shortPct = Math.round((shortCount / total) * 100);
  const structPct = Math.round((structCount / total) * 100);

  const shortCard = document.createElement('div');
  shortCard.className = 'side-card';
  shortCard.innerHTML = `
    <div class="side-card-label">Short-term (news, social)</div>
    <div class="side-card-value">${shortCount}</div>
    <div class="side-card-footnote">${shortPct}% of items</div>
  `;

  const structCard = document.createElement('div');
  structCard.className = 'side-card';
  structCard.innerHTML = `
    <div class="side-card-label">Structural (legal, filings)</div>
    <div class="side-card-value">${structCount}</div>
    <div class="side-card-footnote">${structPct}% of items</div>
  `;

  horContainer.appendChild(shortCard);
  horContainer.appendChild(structCard);
}

function renderLanding() {
  const grid = document.getElementById('landingEntityGrid');
  const watch = document.getElementById('landingWatchlist');
  const freshness = document.getElementById('landingFreshness');
  const topNews = document.getElementById('landingTopNews');
  const freshnessLabel = document.getElementById('landingFreshnessLabel');
  const globalWindowSelect = document.getElementById('globalTimeWindowSelect');

  if (!grid || !watch || !freshness || !topNews) return;

  // Entity summary grid
  grid.innerHTML = '';
  INSTITUTIONS.forEach((inst) => {
    const accel = computeSignalAcceleration(inst);
    const critical = computeEntityCriticalCount(inst.id);
    const card = document.createElement('div');
    card.className = 'landing-entity-card';
    card.onclick = () => {
      state.selectedInstitutionId = inst.id;
      state.activeView = 'entity';
      state.activeDetailPage = 'risk';
      renderAll();
    };

    const header = document.createElement('div');
    header.className = 'landing-entity-header';
    header.innerHTML = `
      <div>
        <div class="landing-entity-name">${inst.name}</div>
        <div class="landing-entity-subtitle">${inst.type}</div>
      </div>
      <span class="badge ${institutionRiskBadge(inst.riskLevel)}">Risk ${inst.riskScore}</span>
    `;

    const badges = document.createElement('div');
    badges.className = 'landing-entity-badges';
    const accelBadge = document.createElement('span');
    accelBadge.className = 'badge badge-light';
    accelBadge.textContent = `Signal accel: ${accel >= 0 ? '+' : '-'}${Math.abs(
      accel,
    ).toFixed(1)}%`;
    const critBadge = document.createElement('span');
    critBadge.className = `badge ${critical > 0 ? 'badge-risk-high' : 'badge-risk-low'}`;
    critBadge.textContent = `${critical} critical`;

    const pcaBadge = document.createElement('span');
    pcaBadge.className = 'badge badge-light';
    pcaBadge.textContent = `PCA: ${inst.pcaStatus ?? 'n/a'}`;

    badges.appendChild(accelBadge);
    badges.appendChild(critBadge);
    badges.appendChild(pcaBadge);

    card.appendChild(header);
    card.appendChild(badges);
    grid.appendChild(card);
  });

  // Watchlist: top 5 entities needing attention
  const ranked = INSTITUTIONS.map((inst) => {
    const crit = computeEntityCriticalCount(inst.id, state.globalTimeWindowHours);
    const highPlus = computeEntityHighPlusCritical(inst.id, state.globalTimeWindowHours);
    const accel = computeSignalAcceleration(inst);
    const composite = inst.riskScore + crit * 10 + highPlus * 5 + accel * 0.5;
    return { inst, crit, highPlus, accel, score: composite };
  }).sort((a, b) => b.score - a.score);

  watch.innerHTML = '';
  ranked.slice(0, 5).forEach((row) => {
    const el = document.createElement('div');
    el.className = 'landing-watch-row';
    el.onclick = () => {
      state.selectedInstitutionId = row.inst.id;
      state.activeView = 'entity';
      state.activeDetailPage = 'risk';
      renderAll();
    };
    el.innerHTML = `
      <div class="landing-watch-main">
        <div><strong>${row.inst.name}</strong></div>
        <div class="landing-watch-metrics">
          <span>Risk ${row.inst.riskScore}</span>
          <span>${row.crit} critical</span>
          <span>Accel ${row.accel >= 0 ? '+' : '-'}${Math.abs(row.accel).toFixed(1)}%</span>
        </div>
      </div>
      <span class="badge ${institutionRiskBadge(row.inst.pcaStatus === 'elevated' ? 'high' : 'medium')}">
        PCA: ${row.inst.pcaStatus}
      </span>
    `;
    watch.appendChild(el);
  });

  // Data freshness
  const now = mockNow();
  const marketTime = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const newsTime = marketTime;
  const legalHoursAgo = 6;

  freshness.innerHTML = `
    <div>Market data updated: <strong>${marketTime}</strong></div>
    <div>News scan: <strong>${newsTime}</strong></div>
    <div>Legal database: <strong>${legalHoursAgo} hrs ago</strong></div>
  `;
  if (freshnessLabel) {
    freshnessLabel.textContent = `${marketTime} · news ${newsTime} · legal ${legalHoursAgo}h`;
  }

  if (globalWindowSelect) {
    globalWindowSelect.value = String(state.globalTimeWindowHours);
    globalWindowSelect.onchange = (e) => {
      const v = Number(e.target.value);
      state.globalTimeWindowHours = Number.isNaN(v)
        ? state.globalTimeWindowHours
        : v;
      renderAll();
    };
  }

  // Top 5 news headlines (global, within global time window)
  const newsSignals = getAllNewsSignals()
    .filter((s) => s.timestampOffsetHours <= state.globalTimeWindowHours)
    .sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timestampOffsetHours - b.timestampOffsetHours;
  });

  topNews.innerHTML = '';
  newsSignals.slice(0, 5).forEach((s) => {
    const inst = INSTITUTIONS.find((i) => i.id === s.institutionId);
    const el = document.createElement('div');
    el.className = 'landing-news-item';
    el.onclick = () => {
      state.selectedInstitutionId = s.institutionId;
      state.activeView = 'entity';
      state.activeDetailPage = 'risk';
      state.selectedSignalId = s.id;
      renderAll();
    };
    el.innerHTML = `
      <div style="font-size:11px;font-weight:500;">${s.title}</div>
      <div style="font-size:10px;color:#6b7280;">
        ${inst ? inst.name : ''} · ${s.sourceName} · ${formatTimeAgo(s.timestampOffsetHours)}
      </div>
    `;
    topNews.appendChild(el);
  });
}

function renderFinancialPanels() {
  const perfPanel = document.getElementById('financialPerformancePanel');
  const auditPanel = document.getElementById('financialAuditPanel');
  const inst = INSTITUTIONS.find((i) => i.id === state.selectedInstitutionId);

  if (!perfPanel || !auditPanel) return;

  if (!inst) {
    perfPanel.innerHTML =
      '<div style="color:#6b7280;font-size:11px;">Select an institution to see financial performance.</div>';
    auditPanel.innerHTML = '';
    return;
  }

  const f = inst.financials;
  if (!f) {
    perfPanel.innerHTML =
      '<div style="color:#6b7280;font-size:11px;">No financial mock data configured for this institution yet.</div>';
    auditPanel.innerHTML = '';
    return;
  }

  const changeClass = (v) =>
    v >= 0 ? 'metric-change-positive' : 'metric-change-negative';

  perfPanel.innerHTML = `
    <div class="financial-header">
      <div>
        <div class="financial-header-title">Financial Performance</div>
        <div class="financial-header-subtitle">Key financial metrics overview</div>
      </div>
      <div class="financial-badge-period">${f.periodLabel}</div>
    </div>
    <div class="financial-metric-grid">
      <div class="financial-metric-card">
        <div class="metric-label">Total Revenue</div>
        <div class="metric-value">₹${f.totalRevenueCr.toLocaleString('en-IN')} Cr</div>
        <div class="metric-sub ${changeClass(f.totalRevenueChangePct)}">
          ${f.totalRevenueChangePct >= 0 ? '▲' : '▼'} ${Math.abs(
    f.totalRevenueChangePct,
  ).toFixed(1)}% vs prior year
        </div>
      </div>
      <div class="financial-metric-card">
        <div class="metric-label">Operating Margin</div>
        <div class="metric-value">${f.operatingMarginPct.toFixed(1)}%</div>
        <div class="metric-sub ${changeClass(f.operatingMarginChangePct)}">
          ${f.operatingMarginChangePct >= 0 ? '▲' : '▼'} ${Math.abs(
    f.operatingMarginChangePct,
  ).toFixed(1)} pts vs prior year
        </div>
      </div>
      <div class="financial-metric-card">
        <div class="metric-label">Free Cash Flow</div>
        <div class="metric-value">₹${f.freeCashFlowCr.toLocaleString('en-IN')} Cr</div>
        <div class="metric-sub ${changeClass(f.freeCashFlowChangePct)}">
          ${f.freeCashFlowChangePct >= 0 ? '▲' : '▼'} ${Math.abs(
    f.freeCashFlowChangePct,
  ).toFixed(1)}% vs prior year
        </div>
      </div>
    </div>
  `;

  auditPanel.innerHTML = `
    <div class="financial-header">
      <div>
        <div class="financial-header-title">Audit & Contingent Liabilities</div>
        <div class="financial-header-subtitle">Financial assurance overview</div>
      </div>
      <div class="financial-badge-period">${f.periodLabel}</div>
    </div>
    <div class="audit-columns">
      <div class="audit-card">
        <div class="metric-label">Contingent Liabilities Overview</div>
        <div style="margin-top:4px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:12px;color:#9ca3af;">2024</div>
              <div class="metric-value">₹${f.contingentLiabilities2024Cr.toFixed(2)} Cr</div>
            </div>
            <div class="metric-sub ${changeClass(
              f.contingentLiabilitiesChangePct,
            )}">${f.contingentLiabilitiesChangePct >= 0 ? '▲' : '▼'} ${Math.abs(
    f.contingentLiabilitiesChangePct,
  ).toFixed(1)}%</div>
          </div>
          <div style="margin-top:6px;">
            <div style="font-size:12px;color:#9ca3af;">2023</div>
            <div style="font-size:13px;font-weight:500;">₹${f.contingentLiabilities2023Cr.toFixed(
              2,
            )} Cr</div>
          </div>
          <div style="margin-top:8px;font-size:10px;color:#facc15;padding:6px 8px;border-radius:8px;background:rgba(250, 204, 21, 0.06);border:1px solid rgba(250, 204, 21, 0.25);">
            Contingent liabilities represent possible obligations arising from past events that will be
            confirmed by uncertain future events not wholly within Group control.
          </div>
        </div>
      </div>
      <div class="audit-card">
        <div class="metric-label">Audit Report Status</div>
        <div style="margin-top:6px;">
          <span class="pill-opinion-ok">
            <span style="width:8px;height:8px;border-radius:999px;background:#4ade80;"></span>
            ${f.auditOpinion}
          </span>
        </div>
        <div style="font-size:11px;color:#9ca3af;margin-top:6px;">
          ${f.auditOpinionSummary}
        </div>
        <div style="margin-top:8px;">
          <div class="signal-detail-section-label">Key audit matters</div>
          <ul class="key-matters-list">
            ${f.keyAuditMatters.map((m) => `<li>${m}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderSignalDetail() {
  const main = document.getElementById('signalDetailMain');
  const raw = document.getElementById('signalDetailRaw');
  const titleEl = document.getElementById('signalDetailTitle');
  const subtitleEl = document.getElementById('signalDetailSubtitle');
  if (!main || !raw) return;

  const inst = INSTITUTIONS.find((i) => i.id === state.selectedInstitutionId);
  if (!inst) {
    main.innerHTML =
      '<div style="color:#6b7280;font-size:11px;">Select an institution and a signal to see details.</div>';
    raw.innerHTML = '';
    return;
  }

  const signal =
    SIGNALS.find(
      (s) => s.id === state.selectedSignalId && s.institutionId === state.selectedInstitutionId,
    ) || null;

  if (!signal) {
    main.innerHTML =
      '<div style="color:#6b7280;font-size:11px;">Click on a signal in the feed to see raw sources and supervisory summary.</div>';
    raw.innerHTML = '';
    return;
  }

  const rawSources = signal.rawSources || [];
  const hasRaw = rawSources.length > 0;

  const sentimentLabel =
    signal.sentiment === 'positive'
      ? 'Constructive'
      : signal.sentiment === 'negative'
      ? 'Adverse'
      : 'Neutral';

  if (titleEl) {
    titleEl.textContent = signal.title;
  }
  if (subtitleEl) {
    subtitleEl.textContent = `${inst.name} · ${sourceLabel(
      signal.sourceType,
    )} · ${formatTimeAgo(signal.timestampOffsetHours)}`;
  }

  main.innerHTML = `
    <div class="signal-detail-title">${signal.title}</div>
    <div style="font-size:11px;color:#9ca3af;margin-top:2px;">
      ${signal.body}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
      <span class="chip ${importanceChipClass(signal.importance)}">${signal.importance.toUpperCase()}</span>
      <span class="chip ${sentimentChipClass(signal.sentiment)}">${sentimentLabel}</span>
      <span class="chip">${signal.tags.join(' • ')}</span>
    </div>
    <div style="font-size:10px;color:#6b7280;margin-top:3px;">
      ${signal.sourceName} · ${formatTimeAgo(signal.timestampOffsetHours)} · ${
    signal.shortTerm ? 'short-term' : 'structural'
  }
    </div>
    <div style="font-size:10px;color:#6b7280;margin-top:4px;">
      <span class="signal-detail-section-label">Supervisory angle</span><br />
      ${
        signal.supervisorySummary ||
        'This item would contribute to the real-time early warning picture for this institution.'
      }
    </div>`;

  let rawListHtml = '';
  if (hasRaw) {
    rawListHtml =
      '<ul class="signal-detail-raw-list">' +
      rawSources
        .map((r) => {
          const kind = r.type ? r.type.toUpperCase() : 'SOURCE';
          const safeLabel = r.label || r.url || '';
          const href = r.url ? ` href="${r.url}" target="_blank" rel="noopener noreferrer"` : '';
          return `<li><span style="color:#6b7280;font-size:10px;">[${kind}]</span> ${
            r.url ? `<a${href}>${safeLabel}</a>` : safeLabel
          }</li>`;
        })
        .join('') +
      '</ul>';
  } else {
    rawListHtml =
      '<div style="color:#6b7280;font-size:11px;">No raw source links attached in this mock item.</div>';
  }

  raw.innerHTML = `
    <div class="signal-detail-section-label">Raw sources</div>
    ${rawListHtml}
  `;
}

function renderHeader() {
  const inst = INSTITUTIONS.find((i) => i.id === state.selectedInstitutionId);
  const titleEl = document.getElementById('currentInstitutionName');
  const subtitleEl = document.getElementById('currentInstitutionSubtitle');
  const lastUpdatedEl = document.getElementById('lastUpdatedLabel');
  const summaryEl = document.getElementById('institutionOverallSummary');

  if (!inst) {
    titleEl.textContent = 'Select an institution';
    subtitleEl.textContent =
      'Click on a bank or NBFC from the left to see its live signals.';
    if (summaryEl) {
      summaryEl.textContent =
        'Pick an institution on the left to view its consolidated early warning view across news, social, legal and filings.';
    }
  } else {
    titleEl.textContent = inst.name;
    subtitleEl.textContent = `${inst.type} · ${inst.region}`;

    if (summaryEl) {
      const allSignals = SIGNALS.filter((s) => s.institutionId === inst.id);
      if (!allSignals.length) {
        summaryEl.textContent =
          'No recent external signals have been ingested for this institution in this mock dataset.';
      } else {
        const srcSplit = computeSourceSplit(allSignals);
        const totalSignals = allSignals.length;
        const pos = allSignals.filter((s) => s.sentiment === 'positive').length;
        const neg = allSignals.filter((s) => s.sentiment === 'negative').length;
        const neu = totalSignals - pos - neg;
        const avgRiskFromSignals =
          srcSplit.length > 0
            ? Math.round(
                srcSplit.reduce((acc, entry) => acc + (entry.score || 0), 0) / srcSplit.length,
              )
            : inst.riskScore;
        const topSource = srcSplit[0];
        const topSourceLabel = topSource ? sourceLabel(topSource.type) : 'mixed sources';

        summaryEl.textContent = `${inst.name} currently shows an aggregate risk signal around ${avgRiskFromSignals}, driven mainly by ${topSourceLabel} across ${totalSignals} recent items (${neg} adverse, ${neu} neutral, ${pos} constructive).`;
      }
    }
  }

  if (state.updating) {
    lastUpdatedEl.innerHTML = `<span class="updating-tag">Updating…</span>`;
  } else {
    lastUpdatedEl.textContent = formatTimestampLabel(state.lastUpdated);
  }
}

function triggerMockRefresh() {
  if (state.updating) return;
  state.updating = true;
  renderHeader();

  setTimeout(() => {
    state.lastUpdated = mockNow();
    INSTITUTIONS.forEach((inst) => {
      const delta = Math.round((Math.random() - 0.5) * 4);
      inst.riskScore = Math.max(10, Math.min(90, inst.riskScore + delta));
      inst.riskChange += delta;
      if (inst.riskScore < 40) inst.riskLevel = 'low';
      else if (inst.riskScore < 60) inst.riskLevel = 'medium';
      else inst.riskLevel = 'high';
    });

    state.updating = false;
    renderAll();
  }, 900);
}

function initInteractions() {
  const refreshBtn = document.getElementById('refreshAllBtn');
  refreshBtn.onclick = () => triggerMockRefresh();

  const backBtn = document.getElementById('backToLandingBtn');
  if (backBtn) {
    backBtn.onclick = () => {
      state.activeView = 'landing';
      renderAll();
    };
  }

  const backSignalBtn = document.getElementById('backFromSignalBtn');
  if (backSignalBtn) {
    backSignalBtn.onclick = () => {
      state.activeView = 'entity';
      renderAll();
    };
  }

  const sidebarDashboardBtn = document.getElementById('sidebarDashboardBtn');
  if (sidebarDashboardBtn) {
    sidebarDashboardBtn.onclick = () => {
      state.activeView = 'landing';
      renderAll();
    };
  }
}

function renderAll() {
  const riskPanels = document.getElementById('riskPanels');
  const financialPanels = document.getElementById('financialPanels');
  const landingView = document.getElementById('landingView');
  const entityView = document.getElementById('entityView');
  const signalDetailView = document.getElementById('signalDetailView');

  renderInstitutionList();
  renderFilters();

  if (state.activeView === 'landing') {
    if (landingView) landingView.classList.remove('hidden');
    if (entityView) entityView.classList.add('hidden');
    if (signalDetailView) signalDetailView.classList.add('hidden');
    renderLanding();
  } else if (state.activeView === 'entity') {
    if (landingView) landingView.classList.add('hidden');
    if (entityView) entityView.classList.remove('hidden');
    if (signalDetailView) signalDetailView.classList.add('hidden');
    renderHeader();
    renderSummaryRow();

    if (state.activeDetailPage === 'risk') {
      if (riskPanels) riskPanels.classList.remove('hidden');
      if (financialPanels) financialPanels.classList.add('hidden');
      renderSignalFeed();
      renderSideBreakdowns();
    } else {
      if (riskPanels) riskPanels.classList.add('hidden');
      if (financialPanels) financialPanels.classList.remove('hidden');
      renderFinancialPanels();
    }
  } else if (state.activeView === 'signalDetail') {
    if (landingView) landingView.classList.add('hidden');
    if (entityView) entityView.classList.add('hidden');
    if (signalDetailView) signalDetailView.classList.remove('hidden');
    renderSignalDetail();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initInteractions();
  renderAll();
});

