import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Calendar, CalendarDays,
  Calculator, Check, CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock,
  Download, DollarSign, Edit, Eye, ExternalLink, FileImage, FileText, Filter, Image as ImageIcon, LayoutDashboard,
  Layers, ListFilter, LoaderCircle, MapPin, Menu, MoreHorizontal, Package, PackageCheck, Plus,
  RefreshCw, Search, Settings, ShieldAlert, ShieldCheck, ShoppingBag, ShoppingCart,
  SlidersHorizontal, Sparkles, PackageX, Tag, Tags, Trash2, TrendingUp, Truck, Upload, UserRound, Wand2, WandSparkles, Coins,
  X, Zap, BarChart2, ImagePlus, Globe,
} from 'lucide-react';
import { amazonListingsMock, amazonOrdersMock, localImage, overviewMock } from './mockData';
import TopSellingTabs from './TopSellingTabs';
import GenerateProductImageModal from './GenerateProductImageModal';
import useModalFocus from './useModalFocus';
import { translations } from './translations';
import './top-selling.css';
import './arabic-rtl.css';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
import { PieChart } from 'recharts/es6/chart/PieChart';
import { Pie } from 'recharts/es6/polar/Pie';
import { Cell } from 'recharts/es6/component/Cell';
import { Tooltip } from 'recharts/es6/component/Tooltip';
import { BarChart } from 'recharts/es6/chart/BarChart';
import { Bar } from 'recharts/es6/cartesian/Bar';
import { XAxis } from 'recharts/es6/cartesian/XAxis';
import { YAxis } from 'recharts/es6/cartesian/YAxis';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';

const money = (value, currency = 'EGP', digits = 2) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits,
}).format(Number(value || 0));
const number = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const shortDate = (value) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
const overviewDateRange = (period) => {
  const end = new Date();
  const start = new Date(end);
  if (period === 'Today') start.setHours(0, 0, 0, 0);
  else if (period === 'Yesterday') { start.setDate(start.getDate() - 1); end.setDate(end.getDate() - 1); }
  else if (period === 'Last 15 days') start.setDate(start.getDate() - 15);
  else if (period === 'Last 30 days') start.setDate(start.getDate() - 30);
  else if (period === 'This month') start.setDate(1);
  else if (period === 'Last month') { start.setMonth(start.getMonth() - 1, 1); end.setDate(0); }
  else if (period === 'All') start.setDate(start.getDate() - 90);
  else start.setDate(start.getDate() - 7);
  return `${shortDate(start)} → ${shortDate(end)}`;
};

function App() {
  const requestedPage = new URLSearchParams(window.location.search).get('screen');
  const screens = ['alpha', 'jumia', 'amazon-orders', 'amazon-listings', 'top-selling-test-1', 'top-selling-test-2'];
  const [page, setPage] = useState(screens.includes(requestedPage) ? requestedPage : 'jumia');
  const [toast, setToast] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState(() => {
    return new URLSearchParams(window.location.search).get('lang') || 'en';
  });

  const t = translations[lang] || translations.en;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    // Keep direct links and refreshes aligned with the currently visible screen.
    const url = new URL(window.location.href);
    url.searchParams.set('screen', page);
    url.searchParams.set('lang', lang);
    window.history.replaceState(window.history.state, '', url);
    document.title = `${page === 'top-selling-test-1' ? t.topSellingTest1 :
      page === 'top-selling-test-2' ? t.topSellingTest2 :
      page === 'amazon-listings' ? t.listings :
      page === 'amazon-orders' ? t.orders :
      page === 'alpha' ? t.alpha : t.overview} · Connecto`;
  }, [page, lang, t]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__mockToastTimer);
    window.__mockToastTimer = window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className={'app-shell' + (lang === 'ar' ? ' is-rtl' : '')} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <aside className={'sidebar' + (collapsed ? ' is-collapsed' : '')}>
        <div className="sidebar-brand">
          <img className="brand-logo" src={collapsed ? '/assets/black_logo_circle.png' : '/assets/connecto-logo.webp'} alt="Connecto" />
          <button className="collapse-button" title="Collapse sidebar" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="nav-section">
            {!collapsed && <div className="nav-section-title">{t.platforms}</div>}
            <button className={'nav-item' + (page === 'jumia' ? ' active' : '')} onClick={() => setPage('jumia')} title={collapsed ? t.overview : undefined}>
              <span className="nav-icon platform-icon"><img src="/assets/brands/jumia.svg" alt="" /></span>{!collapsed && <span className="nav-label">{t.overview}</span>}
            </button>
            <button className={'nav-item' + (page === 'amazon-orders' ? ' active' : '')} onClick={() => setPage('amazon-orders')} title={collapsed ? t.orders : undefined}>
              <span className="nav-icon platform-icon"><img src="/assets/brands/amazon.svg" alt="" /></span>{!collapsed && <span className="nav-label">{t.orders}</span>}
            </button>
            <button className={'nav-item' + (page === 'amazon-listings' ? ' active' : '')} onClick={() => setPage('amazon-listings')} title={collapsed ? t.listings : undefined}>
              <span className="nav-icon platform-icon"><img src="/assets/brands/amazon.svg" alt="" /></span>{!collapsed && <span className="nav-label">{t.listings}</span>}
            </button>
          </div>
          <div className="nav-section">
            {!collapsed && <div className="nav-section-title">{t.topSellingApi}</div>}
            <button className={'nav-item' + (page === 'top-selling-test-1' ? ' active' : '')} onClick={() => setPage('top-selling-test-1')} title={collapsed ? t.topSellingTest1 : undefined}>
              <span className="nav-icon"><TrendingUp size={18} /></span>{!collapsed && <span className="nav-label">{t.topSellingTest1}</span>}
            </button>
            <button className={'nav-item' + (page === 'top-selling-test-2' ? ' active' : '')} onClick={() => setPage('top-selling-test-2')} title={collapsed ? t.topSellingTest2 : undefined}>
              <span className="nav-icon"><BarChart2 size={18} /></span>{!collapsed && <span className="nav-label">{t.topSellingTest2}</span>}
            </button>
          </div>
          <div className="nav-section">
            {!collapsed && <div className="nav-section-title">{t.aiTools}</div>}
            {!collapsed && <div className="ai-category-label">{t.content}</div>}
            <button className={'nav-item' + (page === 'alpha' ? ' active' : '')} onClick={() => setPage('alpha')} title={collapsed ? t.alpha : undefined}>
              <span className="nav-icon alpha-nav-icon"><ImageIcon size={18} /></span>{!collapsed && <span className="nav-label">{t.alpha}</span>}
            </button>
          </div>
        </nav>
      </aside>

      <main className={'main-content' + (collapsed ? ' sidebar-collapsed' : '')}>
        {/* Global Topbar with Language Switcher */}
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Connecto</span>
            <span>/</span>
            <strong>
              {page === 'jumia' ? t.overview :
               page === 'amazon-orders' ? t.orders :
               page === 'amazon-listings' ? t.listings :
               page === 'alpha' ? t.alpha :
               page === 'top-selling-test-1' ? t.topSellingTest1 : t.topSellingTest2}
            </strong>
          </div>
          <div className="topbar-actions">
            <button
              className="language-button"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              title={lang === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
            >
              <Globe size={15} />
              <span>{t.langSwitch}</span>
            </button>
            <span className="demo-pill"><span></span>{t.demoMode}</span>
          </div>
        </header>

        <div className="page-wrap">
          {page !== 'alpha' && !page.startsWith('top-selling') && <PlatformHeader page={page} t={t} />}
          {page === 'alpha' && <AlphaPage notify={notify} onBack={() => setPage('jumia')} t={t} lang={lang} />}
          {page === 'jumia' && <JumiaOverview notify={notify} t={t} lang={lang} />}
          {page === 'amazon-orders' && <AmazonOrders notify={notify} t={t} lang={lang} />}
          {page === 'amazon-listings' && <AmazonListings notify={notify} t={t} lang={lang} />}
          {page.startsWith('top-selling') && (
            <TopSellingTabs
              currentTab={page === 'top-selling-test-2' ? 'test-2' : 'test-1'}
              onTabChange={(tabKey) => setPage(`top-selling-${tabKey}`)}
              notify={notify}
              lang={lang}
            />
          )}
        </div>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function PlatformHeader({ page, t }) {
  const title = page === 'jumia' ? t.overview : page === 'amazon-orders' ? t.orders : page === 'amazon-listings' ? t.listings : t.overview;
  const logo = page === 'jumia' ? '/assets/brands/jumia.svg' : page.startsWith('amazon-') ? '/assets/brands/amazon.svg' : null;
  return <div className="source-page-header"><h1>{title}</h1>{logo && <img src={logo} alt="" />}</div>;
}

function AlphaPage({ notify, onBack, t, lang }) {
  const [activeTab, setActiveTab] = useState('image');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('product-photo');
  const [removeBgMode, setRemoveBgMode] = useState('standard');
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [color, setColor] = useState(1);
  const [sharpness, setSharpness] = useState(1);
  const [blurRadius, setBlurRadius] = useState(0);
  const [result, setResult] = useState(null);
  const [fiveResults, setFiveResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileRef = useRef(null);

  const tabs = [
    { id: 'image', label: t.imageToImage, icon: ImageIcon },
    { id: 'text', label: t.textToImage, icon: FileText },
    { id: 'clear_image', label: t.removeText, icon: Wand2 },
    { id: 'remove_bg', label: t.removeBg, icon: Sparkles },
    { id: 'enhance', label: t.enhance, icon: SlidersHorizontal },
  ];

  const styles = [
    { id: 'product-photo', title: t.productPhoto, detail: t.productPhotoDesc },
    { id: 'lifestyle', title: t.lifestyleScene, detail: t.lifestyleDesc },
    { id: 'infographic', title: t.infographic, detail: t.infographicDesc },
    { id: 'white-bg', title: t.whiteBg, detail: t.whiteBgDesc },
  ];

  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const pickFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify(lang === 'ar' ? 'يرجى تحميل ملف صورة صالح.' : 'Please upload a valid image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { notify(lang === 'ar' ? 'حجم الصورة أكبر من الحد الأقصى 10 ميجابايت.' : 'The image is larger than the 10 MiB upload limit.'); return; }
    setUploadedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setFiveResults(null);
  };
  const canGenerate = activeTab === 'text' ? Boolean(prompt.trim()) : Boolean(uploadedFile);
  const actionLabel = activeTab === 'clear_image' ? t.removeText : activeTab === 'remove_bg' ? t.removeBg : activeTab === 'enhance' ? t.enhance : t.generateImage;

  const runGeneration = (count = 1) => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setProgress(0);
    setResult(null);
    setFiveResults(null);
    let value = 0;
    const timer = window.setInterval(() => {
      value = Math.min(value + 10, 100);
      setProgress(value);
      if (value === 100) {
        window.clearInterval(timer);
        const image = activeTab === 'text'
          ? localImage('✨', prompt.trim().slice(0, 40) || (lang === 'ar' ? 'صورة مولدة' : 'Generated image'), style === 'white-bg' ? '#ffffff' : '#f5f3ff')
          : preview;
        if (count === 5) {
          const titles = lang === 'ar'
            ? ['واجهة أمامية', 'خلفية بيضاء', 'مشهد واقعي', 'إنفوجرافيك', 'صورة مقربة']
            : ['Front View', 'White Background', 'Lifestyle', 'Infographic', 'Detail View'];
          setFiveResults(Array.from({ length: 5 }, (_, index) => ({ url: image, title: titles[index] })));
          notify(lang === 'ar' ? '5 صور جاهزة للمعاينة' : '5 local image previews are ready');
        } else {
          setResult({ url: image, style: style });
          notify(lang === 'ar' ? 'معاينة الصورة جاهزة' : 'Image preview is ready');
        }
        setIsGenerating(false);
      }
    }, 110);
  };

  const downloadImage = (image, index = 0) => {
    if (!image) return;
    const anchor = document.createElement('a');
    anchor.href = image;
    anchor.download = `alpha-image-${index + 1}.png`;
    anchor.click();
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const panelTitle = activeTab === 'text' ? t.alphaHeadText : activeTab === 'image' ? t.alphaHeadImage : activeTab === 'clear_image' ? t.alphaHeadClear : activeTab === 'remove_bg' ? t.alphaHeadRemoveBg : t.alphaHeadEnhance;
  const panelDesc = activeTab === 'text' ? t.alphaSubText : activeTab === 'image' ? t.alphaSubImage : activeTab === 'clear_image' ? t.alphaSubClear : activeTab === 'remove_bg' ? t.alphaSubRemoveBg : t.alphaSubEnhance;

  return (
    <div className="alpha-page">
      <header className="alpha-tool-header">
        <div className="alpha-tool-header-inner">
          <button className="back-tool-button" type="button" aria-label={lang === 'ar' ? 'الرجوع للوحة التحكم' : 'Back to dashboard'} onClick={onBack}><ArrowLeft size={20} /></button>
          <div className="alpha-tool-icon"><ImageIcon size={20} /></div>
          <div className="alpha-tool-copy"><h1>{t.alphaTitle}</h1><p>{t.alphaSubtitle}</p></div>
          <div className="alpha-usage"><Coins size={15} /><span>250 <small>{t.creditsLabel}</small></span></div>
        </div>
      </header>

      <div className="alpha-content">
        <div className="alpha-tabs" role="tablist" aria-label="Alpha image tools">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'active' : ''} onClick={() => { setActiveTab(id); setResult(null); setFiveResults(null); }}>
              <Icon size={18} />{label}
            </button>
          ))}
        </div>

        <div className="alpha-workspace">
          <section className="alpha-panel alpha-input-panel">
            <div className="alpha-panel-heading"><span><ImageIcon size={20} /></span><div><h2>{panelTitle}</h2><p>{panelDesc}</p></div></div>

            {activeTab !== 'text' && <>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => pickFile(event.target.files?.[0])} />
              {preview ? (
                <div className="alpha-uploaded-file">
                  <img src={preview} alt="Uploaded product" />
                  <div><strong>{uploadedFile?.name}</strong><small>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</small></div>
                  <button type="button" aria-label="Remove image" onClick={clearUpload}><X size={18} /></button>
                </div>
              ) : (
                <button type="button" className="alpha-dropzone" onClick={() => fileRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); pickFile(event.dataTransfer.files?.[0]); }}>
                  <span><Upload size={22} /></span>
                  <strong>{t.uploadImageCard}</strong>
                  <small>{t.dragDropText}</small>
                  <em>{t.fileSupportText}</em>
                </button>
              )}
              {activeTab === 'image' && (
                <label className="alpha-field alpha-description-field">
                  {t.addDescOptional}
                  <textarea className="resize-none" rows="3" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={t.addDescPlaceholder} />
                  <small>{t.leaveEmptyDesc}</small>
                </label>
              )}
            </>}
            {activeTab === 'text' && (
              <label className="alpha-field alpha-description-field">
                {t.productScenePrompt}
                <textarea className="resize-none" rows="5" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={t.promptPlaceholderLong} />
              </label>
            )}

            {activeTab === 'remove_bg' && (
              <div className="alpha-removal-mode">
                <label>{t.removalMethod}</label>
                <div>
                  <button className={removeBgMode === 'standard' ? 'active' : ''} onClick={() => setRemoveBgMode('standard')}>{t.standardRemoval}</button>
                  <button className={removeBgMode === 'ai' ? 'active' : ''} onClick={() => setRemoveBgMode('ai')}><Sparkles size={14} />{t.aiPremiumRemoval}</button>
                </div>
                <p>{removeBgMode === 'standard' ? t.standardRemovalDesc : t.aiPremiumRemovalDesc}</p>
              </div>
            )}

            {activeTab === 'enhance' && (
              <div className="alpha-slider-list">
                {[
                  [t.brightness, brightness, setBrightness, "0", "3", "0.1"],
                  [t.contrast, contrast, setContrast, "0", "3", "0.1"],
                  [t.colorBalance, color, setColor, "0", "3", "0.1"],
                  [t.sharpness, sharpness, setSharpness, "0", "3", "0.1"],
                  [t.blurRadius, blurRadius, setBlurRadius, "0", "20", "0.5"]
                ].map(([label, value, setValue, min, max, step]) => (
                  <label key={label}>
                    <span>{label}<b>{Number(value).toFixed(1)}{label === t.blurRadius ? 'px' : ''}</b></span>
                    <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => setValue(Number(event.target.value))} />
                    <small>{min} <i>{t.normalValue}</i> {max}{label === t.blurRadius ? 'px' : ''}</small>
                  </label>
                ))}
              </div>
            )}

            {(activeTab === 'text' || activeTab === 'image') && (
              <div className="alpha-style-picker">
                <label>{t.selectStyle}</label>
                <div>
                  {styles.map((item) => (
                    <button key={item.id} className={style === item.id ? 'selected' : ''} onClick={() => setStyle(item.id)}>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="alpha-primary-button" disabled={!canGenerate || isGenerating} onClick={() => runGeneration()}>
              {isGenerating ? <><RefreshCw size={18} className="spin" />{t.processing} {progress}%</> : <><Wand2 size={18} />{actionLabel}</>}
            </button>
            {activeTab === 'image' && (
              <>
                <div className="alpha-or-divider"><span>{t.or}</span></div>
                <button className="alpha-five-button" disabled={!canGenerate || isGenerating} onClick={() => runGeneration(5)}>
                  <Sparkles size={18} />{t.get5Images}
                </button>
                <p className="alpha-credit-hint">{t.creditHint5}</p>
              </>
            )}
            {isGenerating && <div className="alpha-progress"><i style={{ width: `${progress}%` }} /></div>}
          </section>

          <section className="alpha-panel alpha-result-panel">
            <div className="alpha-panel-heading">
              <span><Sparkles size={20} /></span>
              <div>
                <h2>{fiveResults ? t.fiveGeneratedImgsTitle : t.generatedImgTitle}</h2>
                <p>{fiveResults ? t.fiveGeneratedImgsSubtitle : t.generatedImgSubtitle}</p>
              </div>
              {(result || fiveResults) && <span className="alpha-ready-badge"><i />{t.readyBadge}</span>}
            </div>
            {isGenerating ? (
              <div className="alpha-empty-state">
                <RefreshCw size={34} className="spin" />
                <strong>{t.creatingYourImage}</strong>
                <span>{progress}%</span>
                <div className="alpha-progress"><i style={{ width: `${progress}%` }} /></div>
              </div>
            ) : fiveResults ? (
              <>
                <div className="alpha-five-gallery">
                  {fiveResults.map((image, index) => (
                    <article key={index}>
                      <img src={image.url} alt={image.title} />
                      <span>{image.title}</span>
                      <button aria-label={`Download ${image.title}`} onClick={() => downloadImage(image.url, index)}><Download size={14} />{t.download}</button>
                    </article>
                  ))}
                </div>
                <div className="alpha-result-actions">
                  <button onClick={() => runGeneration(5)}><RefreshCw size={16} />{t.regenerate}</button>
                </div>
              </>
            ) : result ? (
              <>
                <div className="alpha-single-result"><img src={result.url} alt="Generated product" /></div>
                <div className="alpha-result-actions">
                  <button onClick={() => downloadImage(result.url)}><Download size={16} />{t.download}</button>
                  <button onClick={() => runGeneration()}><RefreshCw size={16} />{t.regenerate}</button>
                </div>
              </>
            ) : (
              <div className="alpha-empty-state">
                <span className="alpha-empty-icon"><ImageIcon size={30} /></span>
                <strong>{t.emptyResultTitle}</strong>
                <small>{t.emptyResultDesc}</small>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function JumiaOverview({ notify, t, lang }) {
  const [period, setPeriod] = useState('Last 7 days');
  const [granularity, setGranularity] = useState('Day');
  const [country, setCountry] = useState('Egypt');
  const [shop, setShop] = useState('My Jumia Shop');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      notify(lang === 'ar' ? 'تم تحديث النظرة العامة ببيانات تجريبية' : 'Overview refreshed with demo data');
    }, 450);
  };
  const statCards = [
    { label: t.totalSales, value: money(overviewMock.totals.totalSales, 'EGP', 0), ctaLabel: t.viewSales, icon: TrendingUp, color: 'purple' },
    { label: t.orderCount, value: number(overviewMock.totals.orderCount), ctaLabel: t.viewOrders, icon: ShoppingCart, color: 'blue' },
    { label: t.pendingOrders, value: number(overviewMock.pendingOrders), ctaLabel: t.viewOrders, icon: Clock, color: 'green' },
    { label: t.avgOrderValue, value: money(overviewMock.totals.averageOrderValue, 'EGP', 0), ctaLabel: t.viewOrders, icon: DollarSign, color: 'amber' },
  ];
  return (
    <div className="screen-flow jumia-flow">
      <div className="overview-filters">
        <div className="period-controls">
          <label className="select-wrap date-select">
            <CalendarDays size={16} />
            <span className="date-select-copy">
              <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                <option value="Today">{t.today}</option>
                <option value="Yesterday">{t.yesterday}</option>
                <option value="Last 7 days">{t.last7Days}</option>
                <option value="Last 15 days">{t.last15Days}</option>
                <option value="Last 30 days">{t.last30Days}</option>
                <option value="This month">{t.thisMonth}</option>
                <option value="Last month">{t.lastMonth}</option>
                <option value="All">{t.allTime}</option>
              </select>
              <small>{overviewDateRange(period)}</small>
            </span>
            <ChevronDown size={14} />
          </label>
          <label className="select-wrap compact">
            <select value={granularity} onChange={(event) => setGranularity(event.target.value)}>
              <option value="Day">{t.day}</option>
              <option value="Week">{t.week}</option>
              <option value="Month">{t.month}</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <label className="source-select">
            <select aria-label="Select country" value={country} onChange={(event) => setCountry(event.target.value)}>
              <option value="Egypt">{t.egypt}</option>
            </select>
          </label>
          <label className="source-select shop-select">
            <select aria-label="Select shop" value={shop} onChange={(event) => setShop(event.target.value)}>
              <option value="My Jumia Shop">{t.myJumiaShop}</option>
            </select>
          </label>
        </div>
        <button className="button button-outline" onClick={refresh} disabled={refreshing}>
          {refreshing ? <LoaderCircle size={16} className="spin" /> : <RefreshCw size={16} />}
          {refreshing ? t.refreshing : t.refresh}
        </button>
      </div>
      <div className="stat-grid overview-stats">{statCards.map((stat) => <OverviewStatCard key={stat.label} {...stat} />)}</div>
      <div className="overview-chart-grid">
        <BreakdownCard id="jumia-order-status" title={t.orderStatusDist} data={overviewMock.statusBreakdown} />
        <BreakdownCard title={t.fulfillmentChannels} data={overviewMock.deliveryBreakdown} />
        <RegionsCard title={t.topRegions} />
      </div>
      <JumiaRichMetrics t={t} lang={lang} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return <div className="stat-card source-stat-card"><div className={'stat-icon ' + color}><Icon size={19} /></div><div className="stat-copy"><strong>{value}</strong><span>{label}</span></div></div>;
}

function OverviewStatCard({ label, value, ctaLabel, icon: Icon, color }) {
  const target = label.includes('Order') || label.includes('طلب') ? '#jumia-order-status' : '#jumia-sales-revenue';
  return <div className="stat-card overview-stat-card"><div className={'stat-icon ' + color}><Icon size={20} /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><a href={target}>{ctaLabel} <ArrowRight size={13} /></a></div></div>;
}

function JumiaRichMetrics({ t, lang }) {
  const metricGroups = [
    { title: t.salesRevenue, cta: t.viewSales, anchor: 'jumia-sales-revenue', cards: [[t.orderTotalAmount, money(16420300, 'EGP', 0)], [t.grossRevenue, money(15884920, 'EGP', 0)], [t.netPayout, money(13982610, 'EGP', 0)], [t.pendingPayout, money(842300, 'EGP', 0)], [t.avgOrderValue, money(19498, 'EGP', 0)]] },
    { title: t.ratesPerf, cta: t.viewOrders, anchor: 'jumia-rates-performance', cards: [[t.deliveryRate, '91.4%'], [t.returnRate, '2.6%'], [t.refundRate, '1.8%'], [t.feeRate, '11.6%'], [t.netMargin, '26.2%']] },
    { title: t.feesFin, cta: t.viewSales, anchor: 'jumia-fees-financials', cards: [[t.totalFees, money(1902310, 'EGP', 0)], [t.totalRefunds, money(294720, 'EGP', 0)], [t.otherRevenue, money(118450, 'EGP', 0)]] },
  ];
  const chipGroups = [
    { title: t.orderStatusBreakdown, values: overviewMock.statusBreakdown },
    { title: t.deliveryOptions, values: overviewMock.deliveryBreakdown },
    { title: t.topRegions, values: overviewMock.regions },
  ];
  return (
    <div id="jumia-metrics" className="jumia-rich-metrics">
      {metricGroups.map((group) => (
        <section id={group.anchor} className="metric-group" key={group.title}>
          <div className="metric-group-heading"><h3>{group.title}</h3><a href={'#' + group.anchor}>{group.cta} <ArrowRight size={14} /></a></div>
          <div className="metric-cards">{group.cards.map(([label, value]) => <div className="metric-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        </section>
      ))}
      <div className="jumia-breakdown-groups">
        {chipGroups.map((group) => (
          <section className="jumia-breakdown-card" key={group.title}>
            <h3>{group.title}</h3>
            <div>{group.values.map((item) => <span className="jumia-data-chip" key={item.name}><span>{item.name || item.region}</span><strong>{number(item.value)}</strong></span>)}</div>
          </section>
        ))}
      </div>
      <section className="statement-highlights">
        <h3>{t.statementHighlights}</h3>
        <div>
          <article><span>{t.bestWeek}</span><strong>{t.week38}</strong><b>{money(4820600, 'EGP', 0)}</b></article>
          <article><span>{t.worstWeek}</span><strong>{t.week36}</strong><b>{money(2143900, 'EGP', 0)}</b></article>
        </div>
      </section>
    </div>
  );
}

function OverviewLegend({ data, colors = [] }) {
  if (!data?.length) return null;
  return <div className="overview-chart-legend">{data.map((item, index) => <div key={item.name}><span><i style={{ backgroundColor: colors[index % colors.length] || item.color || '#2563eb' }} />{item.name}</span><strong>{number(item.value)}</strong></div>)}</div>;
}

function BreakdownCard({ id, title, data }) {
  const colors = data.map((item) => item.color);
  return <div id={id} className="panel breakdown-panel"><h2>{title}</h2><div className="overview-recharts-chart"><ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} isAnimationActive={false}>{data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value, name) => [number(value), name]} /></PieChart></ResponsiveContainer></div><OverviewLegend data={data} colors={colors} /></div>;
}

function RegionsCard({ title }) {
  const data = overviewMock.regions.slice(0, 5);
  return <div className="panel regions-panel"><h2>{title}</h2><div className="overview-recharts-chart"><ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}><BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(value) => number(value)} /><Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563EB" isAnimationActive={false} /></BarChart></ResponsiveContainer></div><OverviewLegend data={data} colors={['#2563EB']} /></div>;
}

function AmazonOrders({ notify, t, lang }) {
  const [orders, setOrders] = useState(amazonOrdersMock);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', fulfillment: '', payment: '', from: '', to: '' });
  const [selected, setSelected] = useState(null);
  const [shipOrder, setShipOrder] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => orders.filter((order) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [order.id, order.customerName, order.customerEmail].some((value) => String(value).toLowerCase().includes(term));
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesFulfillment = !filters.fulfillment || order.fulfillment === filters.fulfillment;
    const matchesPayment = !filters.payment || order.payment === filters.payment;
    const date = order.date.slice(0, 10);
    const matchesFrom = !filters.from || date >= filters.from;
    const matchesTo = !filters.to || date <= filters.to;
    return matchesSearch && matchesStatus && matchesFulfillment && matchesPayment && matchesFrom && matchesTo;
  }), [orders, search, filters]);

  const counts = {
    total: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    unshipped: orders.filter((order) => order.status === 'unshipped').length,
    partiallyShipped: orders.filter((order) => order.status === 'partially_shipped').length,
    shipped: orders.filter((order) => order.status === 'shipped').length,
    delivered: orders.filter((order) => order.status === 'delivered').length,
    cancelled: orders.filter((order) => order.status === 'cancelled').length
  };

  const stats = [
    { label: t.totalOrders, value: counts.total, icon: Package, color: 'info' },
    { label: t.pending, value: counts.pending, icon: Calendar, color: 'amber' },
    { label: t.unshipped, value: counts.unshipped, icon: Calendar, color: 'amber' },
    { label: t.partiallyShipped, value: counts.partiallyShipped, icon: ShoppingBag, color: 'gray' },
    { label: t.shipped, value: counts.shipped, icon: ShoppingBag, color: 'gray' },
    { label: t.delivered, value: counts.delivered, icon: Package, color: 'green' },
    { label: t.cancelled, value: counts.cancelled, icon: Package, color: 'red' },
    { label: t.totalAmount, value: money(orders.reduce((sum, order) => sum + Number(order.total || 0), 0), 'EGP', 0), icon: ShoppingBag, color: 'info' },
  ];

  const ship = ({ partiallyShipped = false } = {}) => {
    setOrders((current) => current.map((order) => order.id === shipOrder.id ? { ...order, status: partiallyShipped ? 'partially_shipped' : 'shipped' } : order));
    setShipOrder(null);
    notify(lang === 'ar' ? 'تم حفظ الشحنة في العرض التجريبي' : 'Shipment saved in this local demo');
  };

  const clearFilters = () => { setFilters({ status: '', fulfillment: '', payment: '', from: '', to: '' }); setSearch(''); };

  return <>
    <div className="screen-flow orders-flow">
      <div className="stat-grid orders-stats">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
      <div className="search-filter-bar">
        <div className="search-input"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchOrders} /></div>
        <button className="button button-outline" onClick={() => setShowFilters(!showFilters)}><Filter size={16} />{t.filter}{Object.values(filters).filter(Boolean).length > 0 && <span className="filter-count">{Object.values(filters).filter(Boolean).length}</span>}</button>
        <button className="button button-outline icon-button" title={t.refresh} aria-label={t.refresh} onClick={() => notify(lang === 'ar' ? 'تم تحديث قائمة الطلبات' : 'Order list refreshed with demo data')}><RefreshCw size={16} /></button>
      </div>
      {showFilters && (
        <div className="filters-panel">
          <label>{t.statusLabel}<select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">{t.allStatuses}</option>{['pending', 'unshipped', 'partially_shipped', 'shipped', 'delivered', 'cancelled'].map((val) => <option key={val} value={val}>{val === 'pending' ? t.statusPending : val === 'unshipped' ? t.statusUnshipped : val === 'partially_shipped' ? t.statusPartiallyShipped : val === 'shipped' ? t.statusShipped : val === 'delivered' ? t.statusDelivered : t.statusCancelled}</option>)}</select></label>
          <label>{t.fulfillment}<select value={filters.fulfillment} onChange={(event) => setFilters({ ...filters, fulfillment: event.target.value })}><option value="">{t.allStatuses}</option><option value="AFN">FBA</option><option value="MFN">MFN</option></select></label>
          <label>{t.paymentMethod}<select value={filters.payment} onChange={(event) => setFilters({ ...filters, payment: event.target.value })}><option value="">{t.allStatuses}</option><option>COD</option><option>CVS</option><option>Other</option></select></label>
          <label>{t.dateFrom}<input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label>
          <label>{t.dateTo}<input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label>
          <div className="filter-actions">
            <button className="button button-quiet" onClick={clearFilters}>{t.clearFilters}</button>
            <button className="button button-primary" onClick={() => setShowFilters(false)}>{t.apply}</button>
          </div>
        </div>
      )}
      <div className="list-card order-list">
        {filtered.slice(0, visibleCount).map((order) => (
          <OrderRow key={order.id} order={order} onSelect={() => setSelected(order)} onShip={() => setShipOrder(order)} t={t} lang={lang} />
        ))}
        {filtered.length === 0 && <EmptyList icon={Package} title={t.noOrdersFound} description={t.noOrdersDesc} />}
      </div>
      {filtered.length > visibleCount && <button className="button button-outline load-more" onClick={() => setVisibleCount((count) => count + 4)}>{t.loadMore} <ChevronDown size={15} /></button>}
    </div>
    {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onShip={() => { setSelected(null); setShipOrder(selected); }} t={t} lang={lang} />}
    {shipOrder && <ShipOrderMock order={shipOrder} onClose={() => setShipOrder(null)} onStatusUpdate={(nextStatus) => setOrders((current) => current.map((item) => item.id === shipOrder.id ? { ...item, status: nextStatus === 'Shipped' ? 'shipped' : 'partially_shipped' } : item))} onComplete={(shipment) => { ship(shipment); setSelected(null); }} t={t} lang={lang} />}
  </>;
}

function listingStatus(listing) {
  if (listing.hasErrors) return 'has_errors';
  if (listing.quantity === 0) return 'out_of_stock';
  if (listing.isBuyable) return 'active';
  if (listing.isDiscoverable) return 'discoverable';
  return 'suppressed';
}

function titleCase(value) { return String(value || '').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); }

function OrderRow({ order, onSelect, onShip, t, lang }) {
  const itemCountLabel = Number(order.itemCount || 1) === 1 ? t.item : t.items;
  return (
    <div className="order-row" onClick={onSelect} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter') onSelect(); }}>
      <div className="row-leading-icon"><Package size={20} /></div>
      <div className="order-main">
        <strong>{order.id}</strong>
        <span>{order.itemCount || 1} {itemCountLabel} · {order.customerName || '—'}</span>
        <small>{shortDate(order.date)}</small>
      </div>
      <StatusBadge status={order.status} lang={lang} />
      <div className="order-total">{money(order.total, order.currency, 0)}</div>
      {['pending', 'unshipped', 'partially_shipped'].includes(order.status) && (
        <button className="ship-icon-button" title={t.shipOrder} onClick={(event) => { event.stopPropagation(); onShip(); }}><Truck size={16} /></button>
      )}
      <ChevronRight size={16} className="row-chevron" />
    </div>
  );
}

function StatusBadge({ status, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const statusMap = {
    active: t.statusActive,
    delivered: t.statusDelivered,
    shipped: t.statusShipped,
    partially_shipped: t.statusPartiallyShipped,
    unshipped: t.statusUnshipped,
    pending: t.statusPending,
    cancelled: t.statusCancelled,
    returned: t.statusReturned,
    has_errors: t.statusHasErrors,
    out_of_stock: t.statusOutOfStock,
    discoverable: t.statusDiscoverable,
    suppressed: t.statusSuppressed,
  };
  const label = statusMap[status] || titleCase(status);
  const kind = status === 'delivered' || status === 'active' ? 'success' : status === 'shipped' ? 'secondary' : status === 'partially_shipped' || status === 'unshipped' || status === 'discoverable' ? 'info' : status === 'cancelled' ? 'danger' : status === 'returned' ? 'warning' : 'warning';
  return <span className={'status-badge ' + kind}><i />{label}</span>;
}

function OrderModal({ order, onClose, t, lang }) {
  const [selectedItem, setSelectedItem] = useState(null);
  return <>
    <Modal title={t.orderDetails} subtitle={order.id} onClose={onClose} icon={Package} maxWidth="672px" showCloseButton><div className="modal-content-stack">
      <section className="detail-block"><h3><Package size={16} />{t.orderInformation}</h3><div className="detail-grid">
        <Detail label={t.statusLabel} value={<StatusBadge status={order.status} lang={lang} />} />
        <Detail label={t.orderTotalLabel} value={<b>{money(order.total, order.currency, 0)}</b>} />
        <Detail label={t.purchaseDate} value={shortDate(order.date)} />
        <Detail label={t.fulfillmentChannel} value={order.fulfillmentChannel || order.fulfillment || 'MFN'} />
      </div></section>
      {(order.customerName || order.customerEmail) && <section className="detail-block"><h3><UserRound size={16} />{t.buyerInfo}</h3>
        {order.customerName && <Detail label={t.buyerName} value={order.customerName} />}
        {order.customerEmail && <Detail label={t.buyerEmail} value={order.customerEmail} />}
        <Detail label={t.companyName} value={order.companyName} />
        <Detail label={t.poNumber} value={order.purchaseOrderNumber} />
      </section>}
      {order.shippingAddress && <section className="detail-block"><h3><MapPin size={16} />{t.shippingAddress}</h3><div className="address-copy"><strong>{order.shippingAddress.name}</strong><span>{order.shippingAddress.line1}</span>{order.shippingAddress.line2 && <span>{order.shippingAddress.line2}</span>}<span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</span><span>{order.shippingAddress.country}</span></div></section>}
      <section className="detail-block"><h3><ShoppingBag size={16} />{t.orderItems} ({order.items.length})</h3>{order.items.map((item, index) => <button className="modal-item modal-item-button" key={`${item.sku}-${index}`} onClick={() => setSelectedItem(item)}><span className="item-icon"><Package size={20} /></span><div><b>{item.title}</b><small>SKU: {item.sku} · ASIN: {item.asin}<br />{t.quantityLabel}: {item.quantity}</small></div><strong>{money(item.price, item.currency || order.currency, 0)}</strong></button>)}</section>
    </div></Modal>
    {selectedItem && <Modal title={t.itemDetails} subtitle={selectedItem.title || selectedItem.sku} onClose={() => setSelectedItem(null)} icon={Package} showCloseButton><div className="modal-content-stack"><Detail label={t.titleLabel} value={selectedItem.title} /><Detail label="SKU" value={selectedItem.sku} /><Detail label="ASIN" value={selectedItem.asin} /><Detail label={t.quantityLabel} value={selectedItem.quantity} /><Detail label={t.quantityShippedLabel} value={selectedItem.quantityShipped ?? 0} /><Detail label={t.itemPriceLabel} value={money(selectedItem.price, selectedItem.currency || order.currency)} /></div></Modal>}
  </>;
}

function ShipOrderMock({ order, onClose, onComplete, onStatusUpdate, t, lang }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('Shipped');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipDate, setShipDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedItems, setSelectedItems] = useState(order.items.map((item) => ({ ...item, selected: true, shipQuantity: item.quantity })));
  const partiallyShipped = status === 'Partially Shipped' || selectedItems.some((item) => !item.selected || item.shipQuantity < item.quantity);

  return (
    <Modal title={t.shipOrderTitle} subtitle={order.id} onClose={onClose} icon={Truck}>
      <div className="ship-order-mock">
        <section className="detail-block">
          <h3><Package size={16} />{t.orderSummary}</h3>
          <div className="detail-grid"><Detail label={t.orderTotalLabel} value={money(order.total, order.currency, 0)} /><Detail label={t.items} value={order.itemCount} /></div>
        </section>
        {step === 1 ? (
          <>
            <h3 className="ship-step-title">{t.step1Status}</h3>
            <label className="modal-field">
              {t.shipmentStatus}
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="Shipped">{t.statusShipped}</option>
                <option value="Partially Shipped">{t.statusPartiallyShipped}</option>
              </select>
            </label>
            <div className="modal-footer">
              <button className="button button-quiet" onClick={() => setStep(2)}>{t.skip}</button>
              <button className="button button-primary" onClick={() => { onStatusUpdate(status); setStep(2); }}>{t.updateStatus}</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="ship-step-title">{t.step2Confirm}</h3>
            <div className="form-grid">
              <label>
                {t.carrier}
                <select value={carrier} onChange={(event) => setCarrier(event.target.value)}>
                  <option value="">{t.selectCarrier}</option>
                  <option>ARAMEX</option>
                  <option>DHL</option>
                  <option>UPS</option>
                  <option>OTHER</option>
                </select>
              </label>
              <label>{t.trackingNumber}<input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder={t.trackingPlaceholder} /></label>
              <label>{t.shipDate}<input type="date" value={shipDate} onChange={(event) => setShipDate(event.target.value)} /></label>
            </div>
            <div className="ship-items">
              {selectedItems.map((item, index) => (
                <label key={`${item.sku}-${index}`}>
                  <input type="checkbox" checked={item.selected} onChange={(event) => setSelectedItems((items) => items.map((current, i) => i === index ? { ...current, selected: event.target.checked } : current))} />
                  <span>{item.title}<small>{t.orderedCount}: {item.quantity}</small></span>
                  <input aria-label={`Quantity to ship for ${item.title}`} type="number" min="1" max={item.quantity} value={item.shipQuantity} disabled={!item.selected} onChange={(event) => setSelectedItems((items) => items.map((current, i) => i === index ? { ...current, shipQuantity: Math.min(current.quantity, Math.max(1, Number(event.target.value) || 1)) } : current))} />
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="button button-outline" onClick={() => setStep(1)}>{t.back}</button>
              <button className="button button-primary" disabled={!carrier || !trackingNumber.trim() || !selectedItems.some((item) => item.selected)} onClick={() => onComplete({ partiallyShipped })}>
                <Truck size={16} />{t.confirmShipment}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function Detail({ label, value }) { return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div>; }

function AmazonListings({ notify, t, lang }) {
  const [listings, setListings] = useState(amazonListingsMock);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const defaultListingFilters = { status: '', sortBy: 'lastUpdatedDate', sortOrder: 'DESC' };
  const [listingFilters, setListingFilters] = useState(defaultListingFilters);
  const [appliedListingFilters, setAppliedListingFilters] = useState(defaultListingFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restrictionOpen, setRestrictionOpen] = useState(false);
  const [generateImageTarget, setGenerateImageTarget] = useState(null);

  const filtered = useMemo(() => {
    const term = appliedSearch.trim().toLowerCase();
    const matching = listings.filter((listing) => {
      const matches = !term || [listing.title, listing.sku, listing.asin].some((value) => String(value || '').toLowerCase().includes(term));
      return matches && (!appliedListingFilters.status || (appliedListingFilters.status === 'BUYABLE' ? listing.isBuyable : listing.isDiscoverable));
    });
    const dateKey = appliedListingFilters.sortBy === 'createdDate' ? 'createdAt' : 'updatedAt';
    return matching.sort((a, b) => {
      const comparison = appliedListingFilters.sortBy === 'sku' ? a.sku.localeCompare(b.sku) : String(a[dateKey] || '').localeCompare(String(b[dateKey] || ''));
      return appliedListingFilters.sortOrder === 'ASC' ? comparison : -comparison;
    });
  }, [listings, appliedSearch, appliedListingFilters]);

  const stats = [
    { label: t.totalListings, value: listings.length, icon: Tags, color: 'info' },
    { label: t.active, value: listings.filter((item) => item.isBuyable).length, icon: CheckCircle, color: 'green' },
    { label: t.withIssues, value: listings.filter((item) => item.issues?.length).length, icon: AlertCircle, color: 'red' },
    { label: t.outOfStock, value: listings.filter((item) => item.quantity === 0).length, icon: PackageX, color: 'gray' },
  ];

  const saveEdit = () => { setListings((current) => current.map((item) => item.sku === editing.sku ? editing : item)); setEditing(null); notify(lang === 'ar' ? 'تم تحديث بيانات المنتج' : 'Listing updated'); };
  const applyListingSearch = (event) => { event?.preventDefault(); setAppliedSearch(search); };

  const handleAddImageToListing = (sku, generatedResult, synced = false) => {
    setListings((current) =>
      current.map((item) => {
        if (item.sku === sku) {
          const newImages = [
            ...(item.images || []),
            { url: generatedResult.previewUrl, r2Url: generatedResult.r2Url, variant: 'PT01' }
          ];
          return {
            ...item,
            image: { url: generatedResult.previewUrl, width: 640, height: 480 },
            images: newImages,
            syncedToMarketplace: synced ? true : item.syncedToMarketplace,
            lastSyncedAt: synced ? new Date().toISOString() : item.lastSyncedAt
          };
        }
        return item;
      })
    );
    if (selected && selected.sku === sku) {
      setSelected((prev) => ({
        ...prev,
        image: { url: generatedResult.previewUrl, width: 640, height: 480 },
        images: [
          ...(prev.images || []),
          { url: generatedResult.previewUrl, r2Url: generatedResult.r2Url, variant: 'PT01' }
        ],
        syncedToMarketplace: synced ? true : prev.syncedToMarketplace
      }));
    }
  };

  return <>
    <div className="screen-flow listings-flow">
      <div className="stat-grid listings-stats">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
      <div className="restriction-callout">
        <div className="restriction-icon"><ShieldCheck size={22} /></div>
        <div><h2>{t.checkRestrictions}</h2><p>{t.checkRestrictionsDesc}</p></div>
        <button className="button button-outline" onClick={() => setRestrictionOpen(true)}><ShieldAlert size={16} />{t.checkAsin}</button>
      </div>
      <form className="search-filter-bar listing-search" onSubmit={applyListingSearch} noValidate>
        <div className="search-input"><Search size={17} /><input aria-label={t.searchListings} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchListings} />{search && <button type="button" className="search-clear" aria-label={t.clearSearch} onClick={(event) => { setSearch(''); setAppliedSearch(''); event.currentTarget.previousElementSibling.focus(); }}><X size={16} /></button>}</div>
        <button className="button button-primary" type="submit"><Search size={16} />{t.searchBtn}</button>
        <button className="button button-outline" type="button" onClick={() => setShowFilters(!showFilters)}><Filter size={16} />{t.filter}</button>
        <button className="button button-outline icon-button" type="button" title={t.refresh} aria-label={t.refresh} onClick={() => notify(lang === 'ar' ? 'تم تحديث قائمة المنتجات' : 'Listings refreshed')}><RefreshCw size={16} /></button>
      </form>
      {showFilters && (
        <div className="filters-panel listing-filter">
          <label>{t.statusLabel}<select value={listingFilters.status} onChange={(event) => setListingFilters({ ...listingFilters, status: event.target.value })}><option value="">{t.allStatuses}</option><option value="BUYABLE">{t.active}</option><option value="DISCOVERABLE">{t.statusDiscoverable}</option></select></label>
          <label>{t.sortBy}<select value={listingFilters.sortBy} onChange={(event) => setListingFilters({ ...listingFilters, sortBy: event.target.value })}><option value="lastUpdatedDate">{t.lastUpdatedDate}</option><option value="createdDate">{t.createdDate}</option><option value="sku">{t.sku}</option></select></label>
          <label>{t.order}<select value={listingFilters.sortOrder} onChange={(event) => setListingFilters({ ...listingFilters, sortOrder: event.target.value })}><option value="DESC">{t.newestFirst}</option><option value="ASC">{t.oldestFirst}</option></select></label>
          <div className="filter-actions">
            <button className="button button-quiet" type="button" onClick={() => { setListingFilters(defaultListingFilters); setAppliedListingFilters(defaultListingFilters); setSearch(''); setAppliedSearch(''); }}>{t.clearFilters}</button>
            <button className="button button-primary" type="button" onClick={() => { setAppliedListingFilters(listingFilters); setAppliedSearch(search); setShowFilters(false); }}>{t.apply}</button>
          </div>
        </div>
      )}
      <div className="list-card listings-list" aria-label={t.listings}>
        <div className="listing-result-count" role="status">{t.showingListings.replace('{shown}', number(filtered.length)).replace('{total}', number(listings.length))}</div>
        {filtered.map((listing) => (
          <ListingRow key={listing.sku} listing={listing} onView={() => setSelected(listing)} onEdit={() => setEditing({ ...listing })} onDelete={() => setDeleteTarget(listing)} onAddImage={() => setGenerateImageTarget(listing)} t={t} lang={lang} />
        ))}
        {filtered.length === 0 && <EmptyList icon={Tag} title={t.noListingsFound} description={t.noListingsDesc} />}
      </div>
    </div>
    {selected && <ListingModal listing={selected} onClose={() => setSelected(null)} onAddImage={() => setGenerateImageTarget(selected)} t={t} lang={lang} />}
    {editing && <EditListingModal listing={editing} onChange={setEditing} onClose={() => setEditing(null)} onSave={saveEdit} t={t} lang={lang} />}
    {deleteTarget && <ConfirmModal title={t.deleteListingTitle} message={t.deleteListingMsg.replace('{title}', deleteTarget.title)} onCancel={() => setDeleteTarget(null)} onConfirm={() => { setListings((current) => current.filter((item) => item.sku !== deleteTarget.sku)); setDeleteTarget(null); notify(lang === 'ar' ? 'تم حذف المنتج من العرض التجريبي' : 'Listing removed from the local demo'); }} confirmLabel={t.deleteListingConfirm} cancelLabel={t.cancel} icon={Trash2} danger />}
    {restrictionOpen && <RestrictionModal onClose={() => setRestrictionOpen(false)} t={t} lang={lang} />}
    {generateImageTarget && (
      <GenerateProductImageModal
        listing={generateImageTarget}
        onClose={() => setGenerateImageTarget(null)}
        onAddImageToListing={handleAddImageToListing}
        notify={notify}
        lang={lang}
      />
    )}
  </>;
}

function ListingRow({ listing, onView, onEdit, onDelete, onAddImage, t, lang }) {
  const issueCount = listing.issues?.length || 0;
  const issueLabel = issueCount === 1 ? t.issue : t.issues;
  return (
    <div className="listing-row">
      <div className="listing-thumb" style={{ background: listing.color }}>
        {listing.image?.url ? <img src={listing.image.url} alt={listing.title || listing.sku} /> : <ImageIcon size={28} />}
      </div>
      <div className="listing-info">
        <button type="button" className="listing-title-button" onClick={onView}>{listing.title || listing.sku}</button>
        <span>SKU: {listing.sku}<i />ASIN: {listing.asin || '—'}</span>
        {listing.syncedToMarketplace && (
          <small className="marketplace-synced-badge"><CheckCircle2 size={12} />{t.syncedToMarketplace}</small>
        )}
        {listing.hasErrors && issueCount > 0 && (
          <small className="listing-issue"><AlertCircle size={13} />{issueCount} {issueLabel}</small>
        )}
      </div>
      <div className="listing-price">
        <strong>{money(listing.price?.amount, listing.price?.currency)}</strong>
        <span>{t.qty}: {number(listing.quantity)}</span>
      </div>
      <StatusBadge status={listingStatus(listing)} lang={lang} />
      <div className="listing-actions">
        <button type="button" className="add-image-action" title={t.addImage} aria-label={`${t.addImage}: ${listing.title || listing.sku}`} onClick={onAddImage}><ImagePlus size={16} /><span>{t.addImage}</span></button>
        <button type="button" title={t.view} aria-label={`${t.view}: ${listing.title || listing.sku}`} onClick={onView}><Eye size={16} /></button>
        <button type="button" title={t.edit} aria-label={`${t.edit}: ${listing.title || listing.sku}`} onClick={onEdit}><Edit size={16} /></button>
        <button type="button" title={t.delete} aria-label={`${t.delete}: ${listing.title || listing.sku}`} className="danger-action" onClick={onDelete}><Trash2 size={16} /></button>
      </div>
      <ChevronRight size={20} className="row-chevron" />
    </div>
  );
}

function ListingModal({ listing, onClose, onAddImage, t, lang }) {
  const productUrl = `https://www.amazon.eg/dp/${encodeURIComponent(listing.asin)}`;
  return (
    <Modal title={listing.title || listing.sku} subtitle={`SKU: ${listing.sku}`} onClose={onClose} icon={Package} showCloseButton>
      <div className="modal-content-stack">
        <div className="listing-detail-hero">
          <div className="listing-detail-art" style={{ background: listing.color }}>
            {listing.image?.url ? <img src={listing.image.url} alt={listing.title || listing.sku} /> : <ImageIcon className="text-body-muted" size={32} />}
          </div>
          <div>
            <StatusBadge status={listingStatus(listing)} lang={lang} />
            <h2>{listing.title || listing.sku}</h2>
            {listing.syncedToMarketplace && <span className="marketplace-synced-badge" style={{ marginTop: 6 }}><CheckCircle2 size={12} />{t.syncedToMarketplace}</span>}
          </div>
        </div>
        {listing.images && listing.images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', padding: '0 4px', overflowX: 'auto' }}>
            {listing.images.map((img, idx) => (
              <div key={idx} style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #cbd5e1', flex: '0 0 auto' }}>
                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
        <section className="detail-block listing-detail-fields"><div className="listing-detail-grid">
          <Detail label="SKU" value={listing.sku} />
          <Detail label="ASIN" value={listing.asin || '-'} />
          <Detail label={t.productType} value={listing.productType || '-'} />
          <Detail label={t.condition} value={listing.condition === 'new_new' ? t.conditionNew : titleCase(listing.condition || '-')} />
          {listing.price != null && <Detail label={t.priceLabel} value={money(listing.price?.amount, listing.price?.currency)} />}
          {listing.quantity != null && <Detail label={t.quantityLabel} value={number(listing.quantity)} />}
          {listing.fulfillmentChannel && <Detail label={t.fulfillment} value={listing.fulfillmentChannel} />}
          {listing.createdAt && <Detail label={t.createdLabel} value={shortDate(listing.createdAt)} />}
          {listing.updatedAt && <Detail label={t.updatedLabel} value={shortDate(listing.updatedAt)} />}
        </div></section>
        {listing.issues?.length > 0 && <section className="detail-block issue-block"><h3><AlertCircle size={16} />{t.issues} ({listing.issues.length})</h3>{listing.issues.map((issue, index) => <div className="issue-message" key={`${issue.message}-${index}`}><StatusBadge status={issue.severity.toLowerCase()} lang={lang} /><span>{issue.message}</span>{issue.enforcement?.actions?.length > 0 && <small>{issue.enforcement.actions.join(', ')}</small>}</div>)}</section>}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="button button-primary" onClick={() => { onClose(); onAddImage(); }}><ImagePlus size={16} />{t.addAiImage}</button>
          {listing.asin && <button className="button button-outline amazon-link-button" onClick={() => window.open(productUrl, '_blank', 'noopener,noreferrer')}><ExternalLink size={16} />{t.viewOnAmazon}</button>}
        </div>
      </div>
    </Modal>
  );
}

function EditListingModal({ listing, onChange, onClose, onSave, t, lang }) {
  const [mode, setMode] = useState('patch');
  return (
    <Modal title={t.editListing} subtitle={listing.sku} onClose={onClose} icon={Package}>
      <div className="modal-content-stack">
        <div className="edit-mode-tabs"><button className={mode === 'patch' ? 'active' : ''} onClick={() => setMode('patch')}>{t.partialPatch}</button><button className={mode === 'put' ? 'active' : ''} onClick={() => setMode('put')}>{t.fullReplace}</button></div>
        <div className="detail-block"><div className="form-grid"><label>{t.priceLabel}<input type="number" step="0.01" value={listing.price?.amount ?? ''} onChange={(event) => onChange({ ...listing, price: { ...listing.price, amount: Number(event.target.value) } })} /><small>{listing.price?.currency}</small></label><label>{t.updateQuantity}<input type="number" value={listing.quantity} onChange={(event) => onChange({ ...listing, quantity: Number(event.target.value) })} /></label></div></div>
        {mode === 'put' && <section className="detail-block"><h3><FileText size={16} />{t.extendedAttributes}</h3><label className="modal-field">{t.productTitle}<input value={listing.title} onChange={(event) => onChange({ ...listing, title: event.target.value })} /></label><label className="modal-field">{t.brand}<input value={listing.brand || 'Oraimo'} onChange={(event) => onChange({ ...listing, brand: event.target.value })} /></label><div className="form-grid"><label>{t.manufacturer}<input value={listing.manufacturer || 'Oraimo'} onChange={(event) => onChange({ ...listing, manufacturer: event.target.value })} /></label><label>{t.modelName}<input value={listing.modelName || 'FreePods 4'} onChange={(event) => onChange({ ...listing, modelName: event.target.value })} /></label><label>{t.origin}<input value={listing.origin || 'Egypt'} onChange={(event) => onChange({ ...listing, origin: event.target.value })} /></label><label>{t.weight}<input type="number" value={listing.weight || 0} onChange={(event) => onChange({ ...listing, weight: Number(event.target.value) })} /></label><label>{t.colorLabel}<input value={listing.colorName || 'Black'} onChange={(event) => onChange({ ...listing, colorName: event.target.value })} /></label><label>{t.material}<input value={listing.material || 'Plastic'} onChange={(event) => onChange({ ...listing, material: event.target.value })} /></label></div><label className="modal-field">{t.description}<textarea className="resize-none" rows="4" value={listing.description || ''} onChange={(event) => onChange({ ...listing, description: event.target.value })} /></label></section>}
        <div className="edit-mode-help">{mode === 'patch' ? t.patchHelp : t.putHelp}</div>
        <div className="modal-footer"><button className="button button-outline" onClick={onClose}>{t.cancel}</button><button className="button button-primary" onClick={onSave}><Check size={16} />{t.updateListingBtn}</button></div>
      </div>
    </Modal>
  );
}

function RestrictionModal({ onClose, t, lang }) {
  const [asin, setAsin] = useState('B0C8F4P2Q1');
  const [checked, setChecked] = useState(false);
  return (
    <Modal title={t.checkRestrictions} subtitle={t.previewEligibility} onClose={onClose} icon={ShieldCheck}>
      <div className="modal-content-stack">
        <label className="modal-field">ASIN<input value={asin} onChange={(event) => { setAsin(event.target.value); setChecked(false); }} /></label>
        {checked && <div className="restriction-result"><CheckCircle2 size={20} /><div><strong>{t.eligibleToSell}</strong><span>{t.eligibleDesc}</span></div></div>}
        <div className="modal-footer"><button className="button button-outline" onClick={onClose}>{t.close}</button><button className="button button-primary" onClick={() => setChecked(true)}><ShieldCheck size={16} />{t.checkSampleAsin}</button></div>
      </div>
    </Modal>
  );
}

function ConfirmModal({ title, message, onCancel, onConfirm, confirmLabel, cancelLabel = 'Cancel', icon: Icon = CircleHelp, danger = false }) {
  return <Modal title={title} onClose={onCancel} icon={Icon}><div className="confirm-content"><p>{message}</p><div className="modal-footer"><button className="button button-outline" onClick={onCancel}>{cancelLabel}</button><button className={'button ' + (danger ? 'button-danger' : 'button-primary')} onClick={onConfirm}>{confirmLabel}</button></div></div></Modal>;
}

function Modal({ title, subtitle, icon: Icon, onClose, children, maxWidth = '512px', showCloseButton = false }) {
  const titleId = useId();
  const dialogRef = useModalFocus(onClose);
  return <div className="modal-backdrop" onClick={onClose}><div ref={dialogRef} className="modal-window" style={{ '--modal-max-width': maxWidth }} role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={(event) => event.stopPropagation()}><div className="modal-header"><div className="modal-title-icon"><Icon size={20} /></div><div className="modal-title"><h2 id={titleId}>{title}</h2>{subtitle && <span>{subtitle}</span>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>{children}{showCloseButton && <div className="modal-dialog-footer"><button className="button button-outline" onClick={onClose}>Close</button></div>}</div></div>;
}

function EmptyList({ icon: Icon, title, description }) { return <div className="empty-list"><div><Icon size={23} /></div><strong>{title}</strong><span>{description}</span></div>; }

export default App;
