import { useState, useMemo } from 'react';
import {
  TrendingUp, BarChart2, Search, Filter, ExternalLink,
  Code, Copy, Check, CheckCircle2, Eye, Package,
  Warehouse, Calendar, Activity, Sparkles, AlertCircle,
  ArrowRight, ShieldCheck, X
} from 'lucide-react';
import { topSellingDatasets, platformMeta } from './topSellingData';
import { translations } from './translations';
import useModalFocus from './useModalFocus';

const formatNum = (val) => new Intl.NumberFormat('en-US').format(Number(val || 0));
const MARKETPLACE_TIMEZONES = { EGY: 'Africa/Cairo', KSA: 'Asia/Riyadh', UAE: 'Asia/Dubai' };

function localDateKey(value, timeZone) {
  if (!value) return null;
  const timestamp = String(value);
  // Provider timestamps without an offset are already marketplace-local.
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp)) return timestamp.slice(0, 10);

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(timestamp));
  const date = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map(({ type, value: partValue }) => [type, partValue]));
  return `${date.year}-${date.month}-${date.day}`;
}

function getSampleDateRange(data, marketplace) {
  const timeZone = MARKETPLACE_TIMEZONES[marketplace] || 'UTC';
  const interval = data.interval;
  if (interval?.from && interval?.to) {
    return {
      from: localDateKey(interval.from, timeZone),
      to: localDateKey(interval.to, timeZone),
    };
  }

  const sampleDates = Object.values(data.platforms || {})
    .flatMap((platform) => [platform.sample_created_from, platform.sample_created_to])
    .map((value) => localDateKey(value, timeZone))
    .filter(Boolean)
    .sort();

  return sampleDates.length ? { from: sampleDates[0], to: sampleDates[sampleDates.length - 1] } : null;
}

function SampleDateRange({ range, t, lang, platform = false }) {
  if (!range?.from || !range?.to) {
    return (
      <span className={`sample-date-range-empty${platform ? ' platform-sample-date-range-empty' : ''}`}>
        {t.sampleDatesUnavailable}
      </span>
    );
  }

  const formatDate = (dateKey) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateKey}T12:00:00Z`));

  return (
    <span
      className={`sample-date-range${platform ? ' platform-sample-date-range' : ''}`}
      aria-label={`${t.sampleFrom} ${formatDate(range.from)}; ${t.sampleTo} ${formatDate(range.to)}`}
    >
      <span><small>{t.sampleFrom}</small><strong>{formatDate(range.from)}</strong></span>
      {platform && <span className="sample-range-connector" aria-hidden="true"><ArrowRight size={14} /></span>}
      <span><small>{t.sampleTo}</small><strong>{formatDate(range.to)}</strong></span>
    </span>
  );
}

export default function TopSellingTabs({ currentTab = 'test-1', onTabChange, notify, lang = 'en' }) {
  // The sidebar owns the selected view. A second local tab state made it drift out of sync.
  const activeTab = currentTab === 'test-2' ? 'test-2' : 'test-1';
  const [marketplace, setMarketplace] = useState('EGY');
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copied, setCopied] = useState(false);

  const t = translations[lang] || translations.en;

  const handleSelectTab = (tabId) => onTabChange?.(tabId);
  const handleTabKeyDown = (event, tabId) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'test-1' : event.key === 'End' ? 'test-2'
      : tabId === 'test-1' ? 'test-2' : 'test-1';
    handleSelectTab(next);
    event.currentTarget.parentElement.querySelector(`#top-selling-${next}`)?.focus();
  };

  const currentDataset = topSellingDatasets[marketplace] || topSellingDatasets.EGY;
  const { data } = currentDataset;
  const sampleDateRange = getSampleDateRange(data, marketplace);

  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentDataset, null, 2));
      setCopied(true);
      notify?.(lang === 'ar' ? 'تم نسخ كود JSON للحافظة' : 'API response JSON copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify?.(lang === 'ar' ? 'تعذر نسخ JSON. تحقق من أذونات الحافظة.' : 'Could not copy JSON. Check clipboard permissions.');
    }
  };

  return (
    <div className="top-selling-page">
      {/* Main Header & 2-Test Switcher */}
      <div className="top-selling-tabs-header">
        <div className="top-selling-header-top">
          <div className="top-selling-title-block">
            <h1>
              <TrendingUp size={24} className="text-blue" />
              {t.topSellingTitle}
            </h1>
            <p>{t.topSellingSummary}</p>
          </div>

          <div className="top-selling-header-actions">
            <label className="market-select-wrap">
              <span>{t.marketplaceLabel}</span>
              <select
                aria-label={t.marketplaceLabel}
                value={marketplace}
                onChange={(e) => { setMarketplace(e.target.value); setSelectedProduct(null); }}
              >
                <option value="EGY">{t.egyptUser35}</option>
                <option value="KSA">{t.ksaUser55}</option>
                <option value="UAE">{t.uaeDemo}</option>
              </select>
            </label>

            <button
              className="btn-raw-json"
              onClick={() => setJsonModalOpen(true)}
              title={t.inspectJson}
            >
              <Code size={15} />
              <span>{t.inspectJson}</span>
            </button>
          </div>
        </div>

        {/* 2 Tabs: top selling test 1 & 2 */}
        <div className="test-tabs-nav" role="tablist" aria-label={t.topSellingViews}>
          <button
            id="top-selling-test-1"
            role="tab"
            aria-selected={activeTab === 'test-1'}
            aria-controls="top-selling-panel"
            tabIndex={activeTab === 'test-1' ? 0 : -1}
            className={`test-tab-button ${activeTab === 'test-1' ? 'active' : ''}`}
            onClick={() => handleSelectTab('test-1')}
            onKeyDown={(event) => handleTabKeyDown(event, 'test-1')}
          >
            <div className="tab-icon-box">
              <TrendingUp size={18} />
            </div>
            <div className="tab-text">
              <div className="tab-title-line">
                <span className="tab-name">{t.topSellingTest1}</span>
              </div>
              <span className="tab-desc">{t.test1Matrix}</span>
            </div>
          </button>

          <button
            id="top-selling-test-2"
            role="tab"
            aria-selected={activeTab === 'test-2'}
            aria-controls="top-selling-panel"
            tabIndex={activeTab === 'test-2' ? 0 : -1}
            className={`test-tab-button ${activeTab === 'test-2' ? 'active' : ''}`}
            onClick={() => handleSelectTab('test-2')}
            onKeyDown={(event) => handleTabKeyDown(event, 'test-2')}
          >
            <div className="tab-icon-box">
              <BarChart2 size={18} />
            </div>
            <div className="tab-text">
              <div className="tab-title-line">
                <span className="tab-name">{t.topSellingTest2}</span>
              </div>
              <span className="tab-desc">{t.test2Leaderboard}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Keep the comparison window and its scope visible above the channel cards. */}
      <div className="criteria-info-card">
        <div className="criteria-title-badge">
          <span className="criteria-pill">
            {activeTab === 'test-1' ? t.criteria1Title : t.criteria2Title}
          </span>
          <strong>
            {activeTab === 'test-1' ? t.criteria1Desc : t.criteria2Desc}
          </strong>
        </div>
        <div className="criteria-scope-details">
          <div className="criteria-context-item">
            <span>{t.country}</span>
            <strong>{t.topSellingCountries[marketplace]} ({data.marketplace})</strong>
          </div>
          <div className="criteria-context-item criteria-context-period">
            <span>{t.samplePeriod}</span>
            <SampleDateRange range={sampleDateRange} t={t} lang={lang} />
          </div>
          <div className="criteria-context-item">
            <span>{t.scopeLabel}</span>
            <strong>{t.scopeValue}</strong>
          </div>
          <div className="criteria-context-item">
            <span>{t.cachedLabel}</span>
            <strong>{currentDataset.cached ? t.yes : t.no}</strong>
          </div>
        </div>
      </div>

      {/* Render Selected Viewing Criteria */}
      <div id="top-selling-panel" role="tabpanel" aria-labelledby={`top-selling-${activeTab}`} tabIndex={0}>
      {activeTab === 'test-1' ? (
        <Test1PlatformMatrix
          data={data}
          onSelectProduct={setSelectedProduct}
          t={t}
          lang={lang}
        />
      ) : (
        <Test2Leaderboard
          key={marketplace}
          data={data}
          onSelectProduct={setSelectedProduct}
          t={t}
          lang={lang}
        />
      )}
      </div>

      {/* Raw JSON Modal */}
      {jsonModalOpen && (
        <RawJsonModal
          dataset={currentDataset}
          onClose={() => setJsonModalOpen(false)}
          onCopy={copyJsonToClipboard}
          copied={copied}
          t={t}
          lang={lang}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

/* ========================================================================= */
/* CRITERIA 1: top selling test 1 — Platform-by-Platform Matrix             */
/* ========================================================================= */
function Test1PlatformMatrix({ data, onSelectProduct, t, lang }) {
  const { applicable_platforms, platforms } = data;

  return (
    <div className="platforms-matrix-grid">
      {applicable_platforms.map((platformKey) => {
        const platform = platforms[platformKey] || { state: 'not_connected', products: [] };
        const meta = platformMeta[platformKey] || {
          name: platformKey,
          color: '#3b82f6',
          pillBg: '#eff6ff',
          pillText: '#1d4ed8'
        };
        const isConnected = platform.state === 'ok';

        return (
          <div key={platformKey} className="platform-column-card">
            {/* Header */}
            <div className="platform-card-header">
              <div className="platform-card-title">
                <div className="platform-logo-box">
                  {meta.logo ? (
                    <img src={meta.logo} alt={meta.name} />
                  ) : (
                    <span className="platform-text-badge" style={{ color: meta.accent }}>
                      {meta.name.slice(0, 4)}
                    </span>
                  )}
                </div>
                <div>
                  <h3>{meta.name}</h3>
                </div>
              </div>

            </div>
            {/* Platform Stats */}
            {isConnected ? (
              <>
                <div className="platform-card-stats">
                  <div className="stat-metric stat-period-metric">
                    <div className="stat-summary-topline">
                      <div className="stat-metric-heading">
                        <span className="stat-metric-icon" aria-hidden="true"><Calendar size={14} /></span>
                        <span>{t.samplePeriod}</span>
                      </div>
                      <div className="stat-units-inline" title={t.sampleCompletedUnits}>
                        <strong className="stat-metric-value">{formatNum(platform.counted_units)}</strong>
                        <span className="stat-units-copy">
                          <span>{t.countedUnits}</span>
                          <small>{t.sampleUnitsCaption}</small>
                        </span>
                      </div>
                    </div>
                    <SampleDateRange
                      range={platform.sample_created_from && platform.sample_created_to ? {
                        from: localDateKey(platform.sample_created_from, MARKETPLACE_TIMEZONES[data.marketplace] || 'UTC'),
                        to: localDateKey(platform.sample_created_to, MARKETPLACE_TIMEZONES[data.marketplace] || 'UTC'),
                      } : null}
                      t={t}
                      lang={lang}
                      platform
                    />
                    <small className={`stat-coverage-note ${platform.has_more ? 'has-more' : 'all-counted'}`}>
                      <span aria-hidden="true" />
                      {platform.has_more ? (lang === 'ar' ? 'تتوفر صفحات إضافية' : 'More pages available') : (lang === 'ar' ? 'جميع الطلبات محسوبة' : 'All orders counted')}
                    </small>
                  </div>
                </div>

                {/* Products List (Height enlarged for clearer images) */}
                <div className="platform-products-list">
                  {platform.products && platform.products.length > 0 ? (
                    platform.products.map((p) => {
                      const sharePct = platform.counted_units > 0
                        ? Math.round((p.units_sold / platform.counted_units) * 100)
                        : 0;
                      return (
                        <button
                          type="button"
                          key={p.rank}
                          className="product-matrix-row"
                          onClick={() => onSelectProduct({ ...p, platformKey, meta })}
                          aria-label={`${t.inspect}: ${p.name || p.sku || p.barcode}`}
                        >
                          <div className={`rank-badge ${p.rank === 1 ? 'rank-1' : p.rank === 2 ? 'rank-2' : p.rank === 3 ? 'rank-3' : 'rank-other'}`}>
                            #{p.rank}
                          </div>

                          <div className="product-thumb-box">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name || p.sku}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'block';
                                }}
                              />
                            ) : null}
                            <span className="no-img" style={{ display: p.image_url ? 'none' : 'block' }}>
                              {p.sku ? p.sku.slice(0, 5) : <Package size={22} />}
                            </span>
                          </div>

                          <div className="product-info-block">
                            <div className="product-title-text" title={p.name || `SKU: ${p.sku}`}>
                              {p.name || `SKU: ${p.sku}`}
                            </div>
                            <div className="product-meta-row">
                              {p.sku && <span className="meta-chip">SKU: {p.sku}</span>}
                              {p.asin && <span className="meta-chip">ASIN: {p.asin}</span>}
                              {p.barcode && <span className="meta-chip">Barcode: {p.barcode}</span>}
                              {p.warehouses?.length > 0 && (
                                <span className="meta-chip warehouse-chip">
                                  <Warehouse size={10} style={{ display: 'inline', marginInlineEnd: 2 }} />
                                  {p.warehouses.join(', ')}
                                </span>
                              )}
                              {p.brand && <span className="meta-chip brand-chip">{p.brand}</span>}
                            </div>
                          </div>

                          <div className="units-sold-block">
                            <span className="units-number">{p.units_sold} {t.unitsSold}</span>
                            <div className="units-share-bar">
                              <div
                                className="units-share-fill"
                                style={{ width: `${Math.min(sharePct, 100)}%`, backgroundColor: meta.accent || '#2563eb' }}
                              />
                            </div>
                            <div className="units-percent">{sharePct}% {t.ofSample}</div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="platform-empty-column">
                      <Package size={24} />
                      <p>{lang === 'ar' ? 'لا توجد منتجات' : 'No products returned in sample'}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="platform-empty-column">
                <AlertCircle size={28} style={{ color: '#cbd5e1' }} />
                <strong>{t.notConnected}</strong>
                <p>{t.platformNotConnectedDesc} {meta.name}.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ========================================================================= */
/* CRITERIA 2: top selling test 2 — Cross-Platform Unified Leaderboard      */
/* ========================================================================= */
function Test2Leaderboard({ data, onSelectProduct, t, lang }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('units_desc');

  // Aggregate all products across connected platforms
  const allProducts = useMemo(() => {
    const list = [];
    Object.entries(data.platforms).forEach(([platformKey, platform]) => {
      if (platform.state === 'ok' && Array.isArray(platform.products)) {
        const meta = platformMeta[platformKey] || { name: platformKey, color: '#2563eb' };
        platform.products.forEach((p) => {
          list.push({
            ...p,
            platformKey,
            platformName: meta.name,
            platformMeta: meta,
            platformCountedUnits: platform.counted_units,
            platformOrdersSampled: platform.orders_sampled
          });
        });
      }
    });
    // A stable sales rank keeps its meaning when the user changes the visible sort.
    return list.sort((a, b) => b.units_sold - a.units_sold || a.platformName.localeCompare(b.platformName) || a.rank - b.rank)
      .map((product, index) => ({ ...product, salesRank: index + 1 }));
  }, [data]);

  // Total KPIs
  const totalUnits = useMemo(() => {
    return Object.values(data.platforms).reduce((sum, p) => sum + (p.counted_units || 0), 0);
  }, [data]);

  const topPlatform = useMemo(() => {
    let top = null;
    let max = -1;
    Object.entries(data.platforms).forEach(([key, p]) => {
      if (p.state === 'ok' && (p.counted_units || 0) > max) {
        max = p.counted_units;
        top = platformMeta[key]?.name || key;
      }
    });
    return top ? `${top} (${max} ${t.unitsSold})` : '—';
  }, [data, t]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const matchesPlatform = platformFilter === 'ALL' || p.platformKey === platformFilter;
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !query ||
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.asin && p.asin.toLowerCase().includes(query)) ||
          (p.barcode && p.barcode.toLowerCase().includes(query));
        return matchesPlatform && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'units_desc') return b.units_sold - a.units_sold;
        if (sortBy === 'units_asc') return a.units_sold - b.units_sold;
        if (sortBy === 'rank') return a.salesRank - b.salesRank;
        if (sortBy === 'name') return (a.name || a.sku || '').localeCompare(b.name || b.sku || '');
        return 0;
      });
  }, [allProducts, searchTerm, platformFilter, sortBy]);

  const maxUnitsInBatch = useMemo(() => {
    return Math.max(...allProducts.map((p) => p.units_sold), 1);
  }, [allProducts]);

  return (
    <div className="leaderboard-flow">
      {/* KPI Stat Cards */}
      <div className="leaderboard-summary-grid">
        <div className="summary-stat-box">
          <div className="stat-box-icon blue">
            <Package size={20} />
          </div>
          <div className="stat-box-copy">
            <span>{t.totalCountedUnits}</span>
            <strong>{formatNum(totalUnits)}</strong>
            <small>{t.acrossChannels}</small>
          </div>
        </div>

        <div className="summary-stat-box">
          <div className="stat-box-icon green">
            <Calendar size={20} />
          </div>
          <div className="stat-box-copy">
            <span>{t.samplePeriod}</span>
            <SampleDateRange range={getSampleDateRange(data, data.marketplace)} t={t} lang={lang} />
            <small>{lang === 'ar' ? 'نطاق تواريخ الطلبات المعروضة' : 'Date range of sampled orders'}</small>
          </div>
        </div>

        <div className="summary-stat-box">
          <div className="stat-box-icon purple">
            <TrendingUp size={20} />
          </div>
          <div className="stat-box-copy">
            <span>{t.leadingChannel}</span>
            <strong>{topPlatform}</strong>
            <small>{lang === 'ar' ? 'أعلى حجم وحدات' : 'Highest unit volume'}</small>
          </div>
        </div>

        <div className="summary-stat-box">
          <div className="stat-box-icon amber">
            <Activity size={20} />
          </div>
          <div className="stat-box-copy">
            <span>{t.rankedSkus}</span>
            <strong>{allProducts.length}</strong>
            <small>{lang === 'ar' ? 'منتجات مصنفة في الاستجابة' : 'Top products in response'}</small>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="leaderboard-toolbar">
        <div className="leaderboard-search">
          <Search size={16} />
          <input
            type="text"
            aria-label={t.searchTopSelling}
            placeholder={lang === 'ar' ? 'البحث بالاسم أو SKU أو ASIN أو الباركود...' : 'Search by product name, SKU, ASIN, or barcode...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button type="button" className="leaderboard-search-clear" aria-label={t.clearSearch} onClick={(event) => { setSearchTerm(''); event.currentTarget.previousElementSibling.focus(); }}><X size={16} /></button>}
        </div>

        <div className="leaderboard-filters-right">
          <div className="platform-pill-group">
            <button
              type="button"
              aria-pressed={platformFilter === 'ALL'}
              className={`platform-filter-pill ${platformFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('ALL')}
            >
              {t.allPlatforms}
            </button>
            {Object.keys(data.platforms).filter((key) => data.platforms[key].state === 'ok').map((key) => {
              const meta = platformMeta[key] || { name: key };
              return (
                <button
                  type="button"
                  aria-pressed={platformFilter === key}
                  key={key}
                  className={`platform-filter-pill ${platformFilter === key ? 'active' : ''}`}
                  onClick={() => setPlatformFilter(key)}
                >
                  {meta.name}
                </button>
              );
            })}
          </div>

          <label className="market-select-wrap">
            <span>{t.sortBy}:</span>
            <select aria-label={t.sortBy} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="units_desc">{t.sortUnitsDesc}</option>
              <option value="units_asc">{t.sortUnitsAsc}</option>
              <option value="rank">{t.sortRank}</option>
              <option value="name">{t.sortName}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="leaderboard-results" role="status">
        {t.showingProducts.replace('{shown}', formatNum(filteredProducts.length)).replace('{total}', formatNum(allProducts.length))}
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table-card">
        <p className="leaderboard-scroll-hint">{t.scrollTableHint}</p>
        <div className="leaderboard-table-scroll">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>{t.salesRank}</th>
              <th>{t.productDetails}</th>
              <th>{t.channel}</th>
              <th>{t.channelRank}</th>
              <th>{t.unitsSold}</th>
              <th>{t.shareOfChannel}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const overallRank = p.salesRank;
              const meta = p.platformMeta;
              const sharePct = p.platformCountedUnits > 0
                ? Math.round((p.units_sold / p.platformCountedUnits) * 100)
                : 0;
              const relativeBarPct = Math.round((p.units_sold / maxUnitsInBatch) * 100);

              return (
                <tr
                  key={`${p.platformKey}-${p.rank}-${p.sku || p.barcode}`}
                >
                  <td>
                    <div className={`overall-rank-box ${overallRank === 1 ? 'gold' : overallRank === 2 ? 'silver' : overallRank === 3 ? 'bronze' : 'normal'}`}>
                      {overallRank}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="product-thumb-box" style={{ width: 48, height: 48 }}>
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <span className="no-img" style={{ display: p.image_url ? 'none' : 'block' }}>
                          {p.sku ? p.sku.slice(0, 4) : <Package size={18} />}
                        </span>
                      </div>
                      <div style={{ minWidth: 0, maxWidth: 380 }}>
                        <div
                          style={{
                            fontWeight: 650,
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={p.name || `SKU: ${p.sku}`}
                        >
                          {p.name || `SKU: ${p.sku}`}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '6px', marginTop: 2 }}>
                          {p.sku && <span>SKU: {p.sku}</span>}
                          {p.asin && <span>ASIN: {p.asin}</span>}
                          {p.barcode && <span>Barcode: {p.barcode}</span>}
                          {p.warehouses?.length > 0 && <span>Wh: {p.warehouses.join(',')}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="channel-tag-badge"
                      style={{ background: meta.pillBg, color: meta.pillText }}
                    >
                      {meta.name}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#334155' }}>#{p.rank}</span>
                  </td>
                  <td>
                    <div style={{ minWidth: 120 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 13, color: '#0f172a' }}>{p.units_sold} {t.unitsSold}</strong>
                      </div>
                      <div className="units-share-bar" style={{ height: 5 }}>
                        <div
                          className="units-share-fill"
                          style={{ width: `${relativeBarPct}%`, backgroundColor: meta.accent || '#2563eb' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                      {sharePct}%
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      aria-label={`${t.inspect}: ${p.name || p.sku || p.barcode}`}
                      className="button button-outline"
                      style={{ minHeight: 30, padding: '4px 10px', fontSize: 11 }}
                      onClick={() => onSelectProduct(p)}
                    >
                      <Eye size={13} />
                      {t.inspect}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr className="leaderboard-empty-row"><td colSpan={7}>
                <div className="leaderboard-empty">
                  <Search size={24} aria-hidden="true" />
                  <strong>{t.noTopSellingResults}</strong>
                  <p>{t.noTopSellingResultsDesc}</p>
                  <button type="button" className="button button-outline" onClick={() => { setSearchTerm(''); setPlatformFilter('ALL'); }}>{t.clearFilters}</button>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* MODALS: Raw JSON Viewer & Product Inspector                               */
/* ========================================================================= */
function RawJsonModal({ dataset, onClose, onCopy, copied, t, lang }) {
  const dialogRef = useModalFocus(onClose);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-window"
        style={{ '--modal-max-width': '750px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="raw-json-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-icon">
            <Code size={20} />
          </div>
          <div className="modal-title">
            <h2 id="raw-json-title">{lang === 'ar' ? 'كود JSON الخاص بالاستجابة' : 'Raw API Response JSON'}</h2>
            <span>POST /connecto_top_selling/get</span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق' : 'Close'} data-autofocus>
            <X size={20} />
          </button>
        </div>

        <div className="json-modal-body">
          <div className="json-modal-bar">
            <span>Payload preview · HTTP 200 OK</span>
            <button className="copy-json-btn" onClick={onCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ JSON' : 'Copy JSON')}
            </button>
          </div>
          <pre className="raw-json-pre">
            {JSON.stringify(dataset, null, 2)}
          </pre>
        </div>

        <div className="modal-dialog-footer">
          <button className="button button-outline" onClick={onClose}>
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailModal({ product, onClose, t, lang }) {
  const dialogRef = useModalFocus(onClose);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-window"
        style={{ '--modal-max-width': '580px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="top-product-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-icon">
            <Package size={20} />
          </div>
          <div className="modal-title">
            <h2 id="top-product-title">{product.name || `SKU: ${product.sku}`}</h2>
            <span>{t.channelRank} #{product.rank} · {product.platformName || product.platformKey}</span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق' : 'Close'} data-autofocus>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content-stack" style={{ padding: '18px' }}>
          {/* Hero Thumbnail */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="product-thumb-box" style={{ width: 88, height: 88, borderRadius: 12 }}>
              {product.image_url ? (
                <img src={product.image_url} alt="" />
              ) : (
                <Package size={38} style={{ color: '#94a3b8' }} />
              )}
            </div>
            <div>
              <span
                className="channel-tag-badge"
                style={{
                  background: platformMeta[product.platformKey]?.pillBg || '#e0f2fe',
                  color: platformMeta[product.platformKey]?.pillText || '#0369a1',
                  marginBottom: 6
                }}
              >
                {platformMeta[product.platformKey]?.name || product.platformKey}
              </span>
              <h3 style={{ margin: '4px 0', fontSize: '15px', color: '#0f172a' }}>
                {product.name || (lang === 'ar' ? 'الاسم غير متوفر من المنصة' : 'Title not provided by provider API')}
              </h3>
              <b style={{ color: '#2563eb', fontSize: '14px' }}>
                {product.units_sold} {t.sampleCompletedUnits}
              </b>
            </div>
          </div>

          {/* Details Table */}
          <section className="detail-block" style={{ marginTop: 14 }}>
            <div className="detail-grid">
              <div className="detail-row">
                <span>{t.rank}</span>
                <strong>#{product.rank}</strong>
              </div>
              <div className="detail-row">
                <span>SKU</span>
                <strong>{product.sku || '—'}</strong>
              </div>
              <div className="detail-row">
                <span>ASIN</span>
                <strong>{product.asin || '—'}</strong>
              </div>
              <div className="detail-row">
                <span>Barcode</span>
                <strong>{product.barcode || '—'}</strong>
              </div>
              {product.brand && (
                <div className="detail-row">
                  <span>{lang === 'ar' ? 'العلامة التجارية' : 'Brand'}</span>
                  <strong>{product.brand}</strong>
                </div>
              )}
              {product.category && (
                <div className="detail-row">
                  <span>{lang === 'ar' ? 'الفئة' : 'Category'}</span>
                  <strong>{product.category}</strong>
                </div>
              )}
            </div>
          </section>

          {/* Product link if available (Trendyol) */}
          {product.product_url && (
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-outline"
              style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ExternalLink size={14} />
              {lang === 'ar' ? 'فتح المنتج في المتجر' : 'Open Product on Marketplace'}
            </a>
          )}
        </div>

        <div className="modal-dialog-footer">
          <button className="button button-primary" onClick={onClose}>
            {lang === 'ar' ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
