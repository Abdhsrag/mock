import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Calendar, CalendarDays,
  Calculator, Check, CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock,
  Download, DollarSign, Edit, Eye, ExternalLink, FileImage, FileText, Filter, Image as ImageIcon, LayoutDashboard,
  Layers, ListFilter, LoaderCircle, MapPin, Menu, MoreHorizontal, Package, PackageCheck, Plus,
  RefreshCw, Search, Settings, ShieldAlert, ShieldCheck, ShoppingBag, ShoppingCart,
  SlidersHorizontal, Sparkles, PackageX, Tag, Tags, Trash2, TrendingUp, Truck, Upload, UserRound, Wand2, WandSparkles, Coins,
  X, Zap,
} from 'lucide-react';
import { amazonListingsMock, amazonOrdersMock, localImage, overviewMock } from './mockData';
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
  const screens = ['alpha', 'jumia', 'amazon-orders', 'amazon-listings'];
  const [page, setPage] = useState(screens.includes(requestedPage) ? requestedPage : 'jumia');
  const [toast, setToast] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__mockToastTimer);
    window.__mockToastTimer = window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className="app-shell">
      <aside className={'sidebar' + (collapsed ? ' is-collapsed' : '')}>
        <div className="sidebar-brand">
          <img className="brand-logo" src={collapsed ? '/assets/black_logo_circle.png' : '/assets/connecto-logo.webp'} alt="Connecto" />
          <button className="collapse-button" title="Collapse sidebar" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="nav-section">
            {!collapsed && <div className="nav-section-title">Platforms</div>}
            <button className={'nav-item' + (page === 'jumia' ? ' active' : '')} onClick={() => setPage('jumia')} title={collapsed ? 'Overview' : undefined}>
              <span className="nav-icon platform-icon"><img src="/assets/brands/jumia.svg" alt="" /></span>{!collapsed && <span className="nav-label">Overview</span>}
            </button>
            <button className={'nav-item' + (page === 'amazon-orders' ? ' active' : '')} onClick={() => setPage('amazon-orders')} title={collapsed ? 'Orders' : undefined}>
              <span className="nav-icon platform-icon"><img src="/assets/brands/amazon.svg" alt="" /></span>{!collapsed && <span className="nav-label">Orders</span>}
            </button>
            <button className={'nav-item' + (page === 'amazon-listings' ? ' active' : '')} onClick={() => setPage('amazon-listings')} title={collapsed ? 'Listings' : undefined}>
              <span className="nav-icon platform-icon"><img src="/assets/brands/amazon.svg" alt="" /></span>{!collapsed && <span className="nav-label">Listings</span>}
            </button>
          </div>
          <div className="nav-section">
            {!collapsed && <div className="nav-section-title">AI Tools</div>}
            {!collapsed && <div className="ai-category-label">CONTENT</div>}
            <button className={'nav-item' + (page === 'alpha' ? ' active' : '')} onClick={() => setPage('alpha')} title={collapsed ? 'Alpha' : undefined}>
              <span className="nav-icon alpha-nav-icon"><ImageIcon size={18} /></span>{!collapsed && <span className="nav-label">Alpha</span>}
            </button>
          </div>
        </nav>
      </aside>

      <main className={'main-content' + (collapsed ? ' sidebar-collapsed' : '')}>
        <div className="page-wrap">
          {page !== 'alpha' && <PlatformHeader page={page} />}
          {page === 'alpha' && <AlphaPage notify={notify} onBack={() => setPage('jumia')} />}
          {page === 'jumia' && <JumiaOverview notify={notify} />}
          {page === 'amazon-orders' && <AmazonOrders notify={notify} />}
          {page === 'amazon-listings' && <AmazonListings notify={notify} />}
        </div>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function PlatformHeader({ page }) {
  const title = page === 'jumia' ? 'Overview' : page === 'amazon-orders' ? 'Orders' : page === 'amazon-listings' ? 'Listings' : 'Overview';
  const logo = page === 'jumia' ? '/assets/brands/jumia.svg' : page.startsWith('amazon-') ? '/assets/brands/amazon.svg' : null;
  return <div className="source-page-header"><h1>{title}</h1>{logo && <img src={logo} alt={page === 'jumia' ? 'Jumia' : 'Amazon'} />}</div>;
}

function AlphaPage({ notify, onBack }) {
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
    { id: 'image', label: 'Image to Image', icon: ImageIcon },
    { id: 'text', label: 'Text to Image', icon: FileText },
    { id: 'clear_image', label: 'Remove Text', icon: Wand2 },
    { id: 'remove_bg', label: 'Remove BG', icon: Sparkles },
    { id: 'enhance', label: 'Enhance', icon: SlidersHorizontal },
  ];
  const styles = [
    { id: 'product-photo', title: 'Product Photo', detail: 'Clean, professional product shot' },
    { id: 'lifestyle', title: 'Lifestyle', detail: 'Product in use context' },
    { id: 'infographic', title: 'Infographic', detail: 'Features highlighted visually' },
    { id: 'white-bg', title: 'White Background', detail: 'Amazon-style clean background' },
  ];
  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const pickFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify('Please upload a valid image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { notify('The image is larger than the 10 MiB upload limit.'); return; }
    setUploadedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setFiveResults(null);
  };
  const canGenerate = activeTab === 'text' ? Boolean(prompt.trim()) : Boolean(uploadedFile);
  const actionLabel = activeTab === 'clear_image' ? 'Remove Text' : activeTab === 'remove_bg' ? 'Remove BG' : activeTab === 'enhance' ? 'Enhance' : 'Generate Image';
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
          ? localImage('✨', prompt.trim().slice(0, 40) || 'Generated image', style === 'white-bg' ? '#ffffff' : '#f5f3ff')
          : preview;
        if (count === 5) {
          setFiveResults(Array.from({ length: 5 }, (_, index) => ({ url: image, title: ['Front View', 'White Background', 'Lifestyle', 'Infographic', 'Detail View'][index] })));
          notify('5 local image previews are ready');
        } else {
          setResult({ url: image, style: style });
          notify('Image preview is ready');
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

  return <div className="alpha-page">
    <header className="alpha-tool-header">
      <div className="alpha-tool-header-inner">
        <button className="back-tool-button" type="button" aria-label="Back to dashboard" onClick={onBack}><ArrowLeft size={20} /></button>
        <div className="alpha-tool-icon"><ImageIcon size={20} /></div>
        <div className="alpha-tool-copy"><h1>Alpha</h1><p>Your intelligent assistant for image creation</p></div>
        <div className="alpha-usage"><Coins size={15} /><span>250 <small>Cr</small></span></div>
      </div>
    </header>

    <div className="alpha-content">
    <div className="alpha-tabs" role="tablist" aria-label="Alpha image tools">
      {tabs.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'active' : ''} onClick={() => { setActiveTab(id); setResult(null); setFiveResults(null); }}><Icon size={18} />{label}</button>)}
    </div>

    <div className="alpha-workspace">
      <section className="alpha-panel alpha-input-panel">
        <div className="alpha-panel-heading"><span><ImageIcon size={20} /></span><div><h2>{activeTab === 'text' ? 'Describe Your Product' : activeTab === 'image' ? 'Upload a Product Image' : activeTab === 'clear_image' ? 'Upload to Remove Text' : activeTab === 'remove_bg' ? 'Upload to Remove BG' : 'Upload to Enhance'}</h2><p>{activeTab === 'text' ? 'Detailed description of your product and scene' : activeTab === 'image' ? 'Upload an existing image and describe how you want it transformed' : activeTab === 'clear_image' ? 'Upload your image to automatically remove text from it' : activeTab === 'remove_bg' ? 'Upload your image to automatically remove the background' : 'Adjust brightness and color levels to enhance your image'}</p></div></div>

        {activeTab !== 'text' && <>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => pickFile(event.target.files?.[0])} />
          {preview ? <div className="alpha-uploaded-file"><img src={preview} alt="Uploaded product" /><div><strong>{uploadedFile?.name}</strong><small>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</small></div><button type="button" aria-label="Remove image" onClick={clearUpload}><X size={18} /></button></div> : <button type="button" className="alpha-dropzone" onClick={() => fileRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); pickFile(event.dataTransfer.files?.[0]); }}><span><Upload size={22} /></span><strong>Upload an image</strong><small>Drag and drop your image here, or <b>browse files</b></small><em>PNG, JPG or WEBP · Max 10 MB</em></button>}
          {activeTab === 'image' && <label className="alpha-field alpha-description-field">Add Description (Optional)<textarea rows="3" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe how you want to transform this image (optional)..." /><small>Leave empty to use only the selected style</small></label>}
        </>}
        {activeTab === 'text' && <label className="alpha-field alpha-description-field">Product and scene description<textarea rows="5" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g., A sleek black wireless headphones with silver accents, premium leather ear cushions, on a minimalist white surface with soft shadows" /></label>}

        {activeTab === 'remove_bg' && <div className="alpha-removal-mode"><label>Removal Method</label><div><button className={removeBgMode === 'standard' ? 'active' : ''} onClick={() => setRemoveBgMode('standard')}>Standard (Usage-exempt)</button><button className={removeBgMode === 'ai' ? 'active' : ''} onClick={() => setRemoveBgMode('ai')}><Sparkles size={14} />AI Premium</button></div><p>{removeBgMode === 'standard' ? 'Basic, fast, and completely free background removal.' : 'Advanced Gemini model with superior edge detection. Consumes 1 credit.'}</p></div>}

        {activeTab === 'enhance' && <div className="alpha-slider-list">{[["Brightness",brightness,setBrightness,"0","3","0.1"],["Contrast",contrast,setContrast,"0","3","0.1"],["Color",color,setColor,"0","3","0.1"],["Sharpness",sharpness,setSharpness,"0","3","0.1"],["Blur Radius",blurRadius,setBlurRadius,"0","20","0.5"]].map(([label,value,setValue,min,max,step]) => <label key={label}><span>{label}<b>{Number(value).toFixed(1)}{label === 'Blur Radius' ? 'px' : ''}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => setValue(Number(event.target.value))} /><small>{min} <i>1.0 (Normal)</i> {max}{label === 'Blur Radius' ? 'px' : ''}</small></label>)}</div>}

        {(activeTab === 'text' || activeTab === 'image') && <div className="alpha-style-picker"><label>Select Style</label><div>{styles.map((item) => <button key={item.id} className={style === item.id ? 'selected' : ''} onClick={() => setStyle(item.id)}><strong>{item.title}</strong><small>{item.detail}</small></button>)}</div></div>}

        <button className="alpha-primary-button" disabled={!canGenerate || isGenerating} onClick={() => runGeneration()}>{isGenerating ? <><RefreshCw size={18} className="spin" />Processing... {progress}%</> : <><Wand2 size={18} />{actionLabel}</>}</button>
        {activeTab === 'image' && <><div className="alpha-or-divider"><span>or</span></div><button className="alpha-five-button" disabled={!canGenerate || isGenerating} onClick={() => runGeneration(5)}><Sparkles size={18} />Get 5 Images</button><p className="alpha-credit-hint">Alpha · 15 credits · Generates 5 image variations from your uploaded photo</p></>}
        {isGenerating && <div className="alpha-progress"><i style={{ width: `${progress}%` }} /></div>}
      </section>

      <section className="alpha-panel alpha-result-panel">
        <div className="alpha-panel-heading"><span><Sparkles size={20} /></span><div><h2>{fiveResults ? '5 Generated Images' : 'Generated Image'}</h2><p>{fiveResults ? 'Your 5 AI-generated product images' : 'Your AI-generated product image'}</p></div>{(result || fiveResults) && <span className="alpha-ready-badge"><i />Ready</span>}</div>
        {isGenerating ? <div className="alpha-empty-state"><RefreshCw size={34} className="spin" /><strong>{activeTab === 'image' && fiveResults === null && progress > 0 ? 'Creating your image...' : 'Creating your image...'}</strong><span>{progress}%</span><div className="alpha-progress"><i style={{ width: `${progress}%` }} /></div></div> : fiveResults ? <><div className="alpha-five-gallery">{fiveResults.map((image, index) => <article key={index}><img src={image.url} alt={image.title} /><span>{image.title}</span><button aria-label={`Download ${image.title}`} onClick={() => downloadImage(image.url, index)}><Download size={14} />Download</button></article>)}</div><div className="alpha-result-actions"><button onClick={() => runGeneration(5)}><RefreshCw size={16} />Regenerate</button></div></> : result ? <><div className="alpha-single-result"><img src={result.url} alt="Generated product" /></div><div className="alpha-result-actions"><button onClick={() => downloadImage(result.url)}><Download size={16} />Download</button><button onClick={() => runGeneration()}><RefreshCw size={16} />Regenerate</button></div></> : <div className="alpha-empty-state"><span className="alpha-empty-icon"><ImageIcon size={30} /></span><strong>Your generated image will appear here</strong><small>Upload an image or enter a prompt, then start generating.</small></div>}
      </section>
    </div>
    </div>
  </div>;
}

function JumiaOverview({ notify }) {
  const [period, setPeriod] = useState('Last 7 days');
  const [granularity, setGranularity] = useState('Day');
  const [country, setCountry] = useState('Egypt');
  const [shop, setShop] = useState('My Jumia Shop');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); window.setTimeout(() => { setRefreshing(false); notify('Overview refreshed with demo data'); }, 450); };
  const statCards = [
    { label: 'Total Sales', value: money(overviewMock.totals.totalSales, 'EGP', 0), ctaLabel: 'View Sales', icon: TrendingUp, color: 'purple' },
    { label: 'Orders', value: number(overviewMock.totals.orderCount), ctaLabel: 'View Orders', icon: ShoppingCart, color: 'blue' },
    { label: 'Pending Orders', value: number(overviewMock.pendingOrders), ctaLabel: 'View Orders', icon: Clock, color: 'green' },
    { label: 'Average Order Value', value: money(overviewMock.totals.averageOrderValue, 'EGP', 0), ctaLabel: 'View Orders', icon: DollarSign, color: 'amber' },
  ];
  return <div className="screen-flow jumia-flow">
    <div className="overview-filters"><div className="period-controls"><label className="select-wrap date-select"><CalendarDays size={16} /><span className="date-select-copy"><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Today</option><option>Yesterday</option><option>Last 7 days</option><option>Last 15 days</option><option>Last 30 days</option><option>This month</option><option>Last month</option><option>All</option></select><small>{overviewDateRange(period)}</small></span><ChevronDown size={14} /></label><label className="select-wrap compact"><select value={granularity} onChange={(event) => setGranularity(event.target.value)}><option>Day</option><option>Week</option><option>Month</option></select><ChevronDown size={14} /></label><label className="source-select"><select aria-label="Select country" value={country} onChange={(event) => setCountry(event.target.value)}><option>Egypt</option></select></label><label className="source-select shop-select"><select aria-label="Select shop" value={shop} onChange={(event) => setShop(event.target.value)}><option>My Jumia Shop</option></select></label></div><button className="button button-outline" onClick={refresh} disabled={refreshing}>{refreshing ? <LoaderCircle size={16} className="spin" /> : <RefreshCw size={16} />}{refreshing ? 'Refreshing' : 'Refresh'}</button></div>
    <div className="stat-grid overview-stats">{statCards.map((stat) => <OverviewStatCard key={stat.label} {...stat} />)}</div>
    <div className="overview-chart-grid"><BreakdownCard id="jumia-order-status" title="Order Status Distribution" data={overviewMock.statusBreakdown} /><BreakdownCard title="Fulfillment Channels" data={overviewMock.deliveryBreakdown} /><RegionsCard /></div>
    <JumiaRichMetrics />
  </div>;
}

function StatCard({ label, value, icon: Icon, color }) {
  return <div className="stat-card source-stat-card"><div className={'stat-icon ' + color}><Icon size={19} /></div><div className="stat-copy"><strong>{value}</strong><span>{label}</span></div></div>;
}

function OverviewStatCard({ label, value, ctaLabel, icon: Icon, color }) {
  const target = label === 'Orders' || label === 'Pending Orders' ? '#jumia-order-status' : '#jumia-sales-revenue';
  return <div className="stat-card overview-stat-card"><div className={'stat-icon ' + color}><Icon size={20} /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><a href={target}>{ctaLabel} <ArrowRight size={13} /></a></div></div>;
}

function JumiaRichMetrics() {
  const metricGroups = [
    { title: 'Sales & Revenue', cta: 'View Sales', anchor: 'jumia-sales-revenue', cards: [['Order Total Amount', money(16420300, 'EGP', 0)], ['Gross Revenue', money(15884920, 'EGP', 0)], ['Net Payout', money(13982610, 'EGP', 0)], ['Pending Payout', money(842300, 'EGP', 0)], ['Average Order Value', money(19498, 'EGP', 0)]] },
    { title: 'Rates & Performance', cta: 'View Orders', anchor: 'jumia-rates-performance', cards: [['Delivery Rate', '91.4%'], ['Return Rate', '2.6%'], ['Refund Rate', '1.8%'], ['Fee Rate', '11.6%'], ['Net Margin', '26.2%']] },
    { title: 'Fees & Financials', cta: 'View Payout', anchor: 'jumia-fees-financials', cards: [['Total Fees', money(1902310, 'EGP', 0)], ['Total Refunds', money(294720, 'EGP', 0)], ['Other Revenue', money(118450, 'EGP', 0)]] },
  ];
  const chipGroups = [
    { title: 'Order status breakdown', values: overviewMock.statusBreakdown },
    { title: 'Delivery options', values: overviewMock.deliveryBreakdown },
    { title: 'Top regions', values: overviewMock.regions },
  ];
  return <div id="jumia-metrics" className="jumia-rich-metrics">{metricGroups.map((group) => <section id={group.anchor} className="metric-group" key={group.title}><div className="metric-group-heading"><h3>{group.title}</h3><a href={'#' + group.anchor}>{group.cta} <ArrowRight size={14} /></a></div><div className="metric-cards">{group.cards.map(([label, value]) => <div className="metric-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>)}<div className="jumia-breakdown-groups">{chipGroups.map((group) => <section className="jumia-breakdown-card" key={group.title}><h3>{group.title}</h3><div>{group.values.map((item) => <span className="jumia-data-chip" key={item.name}><span>{item.name || item.region}</span><strong>{number(item.value)}</strong></span>)}</div></section>)}</div><section className="statement-highlights"><h3>Statement Highlights</h3><div><article><span>Best week</span><strong>Week 38</strong><b>{money(4820600, 'EGP', 0)}</b></article><article><span>Worst week</span><strong>Week 36</strong><b>{money(2143900, 'EGP', 0)}</b></article></div></section></div>;
}

function OverviewLegend({ data, colors = [] }) {
  if (!data?.length) return null;
  return <div className="overview-chart-legend">{data.map((item, index) => <div key={item.name}><span><i style={{ backgroundColor: colors[index % colors.length] || item.color || '#2563eb' }} />{item.name}</span><strong>{number(item.value)}</strong></div>)}</div>;
}

function BreakdownCard({ id, title, data }) {
  const colors = data.map((item) => item.color);
  return <div id={id} className="panel breakdown-panel"><h2>{title}</h2><div className="overview-recharts-chart"><ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} isAnimationActive={false}>{data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value, name) => [number(value), name]} /></PieChart></ResponsiveContainer></div><OverviewLegend data={data} colors={colors} /></div>;
}

function RegionsCard() {
  const data = overviewMock.regions.slice(0, 5);
  return <div className="panel regions-panel"><h2>Top Regions (Jumia Only)</h2><div className="overview-recharts-chart"><ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}><BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(value) => number(value)} /><Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563EB" isAnimationActive={false} /></BarChart></ResponsiveContainer></div><OverviewLegend data={data} colors={['#2563EB']} /></div>;
}

function AmazonOrders({ notify }) {
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
  const counts = { total: orders.length, pending: orders.filter((order) => order.status === 'pending').length, unshipped: orders.filter((order) => order.status === 'unshipped').length, partiallyShipped: orders.filter((order) => order.status === 'partially_shipped').length, shipped: orders.filter((order) => order.status === 'shipped').length, delivered: orders.filter((order) => order.status === 'delivered').length, cancelled: orders.filter((order) => order.status === 'cancelled').length };
  const stats = [
    { label: 'Total orders', value: counts.total, icon: Package, color: 'info' },
    { label: 'Pending', value: counts.pending, icon: Calendar, color: 'amber' },
    { label: 'Unshipped', value: counts.unshipped, icon: Calendar, color: 'amber' },
    { label: 'Partially shipped', value: counts.partiallyShipped, icon: ShoppingBag, color: 'gray' },
    { label: 'Shipped', value: counts.shipped, icon: ShoppingBag, color: 'gray' },
    { label: 'Delivered', value: counts.delivered, icon: Package, color: 'green' },
    { label: 'Cancelled', value: counts.cancelled, icon: Package, color: 'red' },
    { label: 'Total amount', value: money(orders.reduce((sum, order) => sum + Number(order.total || 0), 0), 'EGP', 0), icon: ShoppingBag, color: 'info' },
  ];
  const ship = ({ partiallyShipped = false } = {}) => { setOrders((current) => current.map((order) => order.id === shipOrder.id ? { ...order, status: partiallyShipped ? 'partially_shipped' : 'shipped' } : order)); setShipOrder(null); notify('Shipment saved in this local demo'); };
  const clearFilters = () => { setFilters({ status: '', fulfillment: '', payment: '', from: '', to: '' }); setSearch(''); };
  return <>
    <div className="screen-flow orders-flow">
    <div className="stat-grid orders-stats">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
    <div className="search-filter-bar"><div className="search-input"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order ID, customer name, or email..." /></div><button className="button button-outline" onClick={() => setShowFilters(!showFilters)}><Filter size={16} />Filter{Object.values(filters).filter(Boolean).length > 0 && <span className="filter-count">{Object.values(filters).filter(Boolean).length}</span>}</button><button className="button button-outline icon-button" title="Refresh orders" aria-label="Refresh orders" onClick={() => notify('Order list refreshed with demo data')}><RefreshCw size={16} /></button></div>
    {showFilters && <div className="filters-panel"><label>Status<select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">All statuses</option>{['pending', 'unshipped', 'partially_shipped', 'shipped', 'delivered', 'cancelled'].map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}</select></label><label>Fulfillment<select value={filters.fulfillment} onChange={(event) => setFilters({ ...filters, fulfillment: event.target.value })}><option value="">All</option><option value="AFN">FBA</option><option value="MFN">MFN</option></select></label><label>Payment method<select value={filters.payment} onChange={(event) => setFilters({ ...filters, payment: event.target.value })}><option value="">All</option><option>COD</option><option>CVS</option><option>Other</option></select></label><label>Date from<input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label><label>Date to<input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label><div className="filter-actions"><button className="button button-quiet" onClick={clearFilters}>Clear filters</button><button className="button button-primary" onClick={() => setShowFilters(false)}>Apply</button></div></div>}
    <div className="list-card order-list">{filtered.slice(0, visibleCount).map((order) => <OrderRow key={order.id} order={order} onSelect={() => setSelected(order)} onShip={() => setShipOrder(order)} />)}{filtered.length === 0 && <EmptyList icon={Package} title="No orders found" description="Try changing your search or filters." />}</div>
    {filtered.length > visibleCount && <button className="button button-outline load-more" onClick={() => setVisibleCount((count) => count + 4)}>Load More <ChevronDown size={15} /></button>}
    </div>
    {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onShip={() => { setSelected(null); setShipOrder(selected); }} />}
    {shipOrder && <ShipOrderMock order={shipOrder} onClose={() => setShipOrder(null)} onStatusUpdate={(nextStatus) => setOrders((current) => current.map((item) => item.id === shipOrder.id ? { ...item, status: nextStatus === 'Shipped' ? 'shipped' : 'partially_shipped' } : item))} onComplete={(shipment) => { ship(shipment); setSelected(null); }} />}
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

function OrderRow({ order, onSelect, onShip }) {
  return <div className="order-row" onClick={onSelect} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter') onSelect(); }}><div className="row-leading-icon"><Package size={20} /></div><div className="order-main"><strong>{order.id}</strong><span>{order.itemCount || 1} {Number(order.itemCount || 1) === 1 ? 'item' : 'items'} · {order.customerName || '—'}</span><small>{shortDate(order.date)}</small></div><StatusBadge status={order.status} /><div className="order-total">{money(order.total, order.currency, 0)}</div>{['pending', 'unshipped', 'partially_shipped'].includes(order.status) && <button className="ship-icon-button" title="Ship order" onClick={(event) => { event.stopPropagation(); onShip(); }}><Truck size={16} /></button>}<ChevronRight size={16} className="row-chevron" /></div>;
}

function StatusBadge({ status }) {
  const kind = status === 'delivered' || status === 'active' ? 'success' : status === 'shipped' ? 'secondary' : status === 'partially_shipped' || status === 'unshipped' || status === 'discoverable' ? 'info' : status === 'cancelled' ? 'danger' : status === 'returned' ? 'warning' : 'warning';
  return <span className={'status-badge ' + kind}><i />{titleCase(status)}</span>;
}

function OrderModal({ order, onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);
  return <>
    <Modal title="Order Details" subtitle={order.id} onClose={onClose} icon={Package} maxWidth="672px" showCloseButton><div className="modal-content-stack">
      <section className="detail-block"><h3><Package size={16} />Order information</h3><div className="detail-grid">
        <Detail label="Status" value={<StatusBadge status={order.status} />} />
        <Detail label="Order total" value={<b>{money(order.total, order.currency, 0)}</b>} />
        <Detail label="Purchase date" value={shortDate(order.date)} />
        <Detail label="Fulfillment channel" value={order.fulfillmentChannel || order.fulfillment || 'MFN'} />
      </div></section>
      {(order.customerName || order.customerEmail) && <section className="detail-block"><h3><UserRound size={16} />Buyer information</h3>
        {order.customerName && <Detail label="Buyer name" value={order.customerName} />}
        {order.customerEmail && <Detail label="Buyer email" value={order.customerEmail} />}
        <Detail label="Company name" value={order.companyName} />
        <Detail label="Purchase order number" value={order.purchaseOrderNumber} />
      </section>}
      {order.shippingAddress && <section className="detail-block"><h3><MapPin size={16} />Shipping address</h3><div className="address-copy"><strong>{order.shippingAddress.name}</strong><span>{order.shippingAddress.line1}</span>{order.shippingAddress.line2 && <span>{order.shippingAddress.line2}</span>}<span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</span><span>{order.shippingAddress.country}</span></div></section>}
      <section className="detail-block"><h3><ShoppingBag size={16} />Order items ({order.items.length})</h3>{order.items.map((item, index) => <button className="modal-item modal-item-button" key={`${item.sku}-${index}`} onClick={() => setSelectedItem(item)}><span className="item-icon"><Package size={20} /></span><div><b>{item.title}</b><small>SKU: {item.sku} · ASIN: {item.asin}<br />Quantity: {item.quantity}</small></div><strong>{money(item.price, item.currency || order.currency, 0)}</strong></button>)}</section>
    </div></Modal>
    {selectedItem && <Modal title="Item Details" subtitle={selectedItem.title || selectedItem.sku} onClose={() => setSelectedItem(null)} icon={Package} showCloseButton><div className="modal-content-stack"><Detail label="Title" value={selectedItem.title} /><Detail label="SKU" value={selectedItem.sku} /><Detail label="ASIN" value={selectedItem.asin} /><Detail label="Quantity" value={selectedItem.quantity} /><Detail label="Quantity Shipped" value={selectedItem.quantityShipped ?? 0} /><Detail label="Item Price" value={money(selectedItem.price, selectedItem.currency || order.currency)} /></div></Modal>}
  </>;
}

function ShipOrderMock({ order, onClose, onComplete, onStatusUpdate }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('Shipped');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipDate, setShipDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedItems, setSelectedItems] = useState(order.items.map((item) => ({ ...item, selected: true, shipQuantity: item.quantity })));
  const partiallyShipped = status === 'Partially Shipped' || selectedItems.some((item) => !item.selected || item.shipQuantity < item.quantity);
  return <Modal title="Ship Order" subtitle={order.id} onClose={onClose} icon={Truck}><div className="ship-order-mock">
    <section className="detail-block"><h3><Package size={16} />Order summary</h3><div className="detail-grid"><Detail label="Order total" value={money(order.total, order.currency, 0)} /><Detail label="Items" value={order.itemCount} /></div></section>
    {step === 1 ? <><h3 className="ship-step-title">Step 1 · Update shipment status</h3><label className="modal-field">Shipment status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>Shipped</option><option>Partially Shipped</option></select></label><div className="modal-footer"><button className="button button-quiet" onClick={() => setStep(2)}>Skip</button><button className="button button-primary" onClick={() => { onStatusUpdate(status); setStep(2); }}>Update Status</button></div></> : <><h3 className="ship-step-title">Step 2 · Confirm shipment</h3><div className="form-grid"><label>Carrier<select value={carrier} onChange={(event) => setCarrier(event.target.value)}><option value="">Select carrier</option><option>ARAMEX</option><option>DHL</option><option>UPS</option><option>OTHER</option></select></label><label>Tracking number<input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="Enter tracking number" /></label><label>Ship date<input type="date" value={shipDate} onChange={(event) => setShipDate(event.target.value)} /></label></div><div className="ship-items">{selectedItems.map((item,index) => <label key={`${item.sku}-${index}`}><input type="checkbox" checked={item.selected} onChange={(event) => setSelectedItems((items) => items.map((current,i) => i === index ? {...current,selected:event.target.checked} : current))} /><span>{item.title}<small>Ordered: {item.quantity}</small></span><input aria-label={`Quantity to ship for ${item.title}`} type="number" min="1" max={item.quantity} value={item.shipQuantity} disabled={!item.selected} onChange={(event) => setSelectedItems((items) => items.map((current,i) => i === index ? {...current,shipQuantity:Math.min(current.quantity, Math.max(1, Number(event.target.value) || 1))} : current))} /></label>)}</div><div className="modal-footer"><button className="button button-outline" onClick={() => setStep(1)}>Back</button><button className="button button-primary" disabled={!carrier || !trackingNumber.trim() || !selectedItems.some((item) => item.selected)} onClick={() => onComplete({ partiallyShipped })}><Truck size={16} />Confirm Shipment</button></div></>}
  </div></Modal>;
}

function emojiFor(text) { return /earbud/i.test(text) ? '🎧' : /phone/i.test(text) ? '📱' : /tv/i.test(text) ? '📺' : /air conditioner/i.test(text) ? '❄️' : /lotion/i.test(text) ? '🧴' : /speaker/i.test(text) ? '🔊' : '📦'; }

function Detail({ label, value }) { return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div>; }

function AmazonListings({ notify }) {
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
    { label: 'Total listings', value: listings.length, icon: Tags, color: 'info' },
    { label: 'Active', value: listings.filter((item) => item.isBuyable).length, icon: CheckCircle, color: 'green' },
    { label: 'With issues', value: listings.filter((item) => item.issues?.length).length, icon: AlertCircle, color: 'red' },
    { label: 'Out of stock', value: listings.filter((item) => item.quantity === 0).length, icon: PackageX, color: 'gray' },
  ];
  const saveEdit = () => { setListings((current) => current.map((item) => item.sku === editing.sku ? editing : item)); setEditing(null); notify('Listing updated'); };
  const applyListingSearch = (event) => { event?.preventDefault(); setAppliedSearch(search); };
  return <>
    <div className="screen-flow listings-flow">
      <div className="stat-grid listings-stats">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
      <div className="restriction-callout"><div className="restriction-icon"><ShieldCheck size={22} /></div><div><h2>Check selling restrictions</h2><p>Verify if you are allowed to sell a specific brand or product on Amazon.</p></div><button className="button button-outline" onClick={() => setRestrictionOpen(true)}><ShieldAlert size={16} />Check ASIN</button></div>
      <form className="search-filter-bar listing-search" onSubmit={applyListingSearch}><div className="search-input"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by SKU or ASIN..." /></div><button className="button button-primary" type="submit"><Search size={16} />Search</button><button className="button button-outline" type="button" onClick={() => setShowFilters(!showFilters)}><Filter size={16} />Filter</button><button className="button button-outline icon-button" type="button" title="Refresh listings" aria-label="Refresh listings" onClick={() => notify('Listings refreshed')}><RefreshCw size={16} /></button></form>
      {showFilters && <div className="filters-panel listing-filter"><label>Status<select value={listingFilters.status} onChange={(event) => setListingFilters({ ...listingFilters, status: event.target.value })}><option value="">All</option><option value="BUYABLE">Active</option><option value="DISCOVERABLE">Discoverable</option></select></label><label>Sort By<select value={listingFilters.sortBy} onChange={(event) => setListingFilters({ ...listingFilters, sortBy: event.target.value })}><option value="lastUpdatedDate">Last Updated</option><option value="createdDate">Created Date</option><option value="sku">SKU</option></select></label><label>Order<select value={listingFilters.sortOrder} onChange={(event) => setListingFilters({ ...listingFilters, sortOrder: event.target.value })}><option value="DESC">Newest First</option><option value="ASC">Oldest First</option></select></label><div className="filter-actions"><button className="button button-quiet" type="button" onClick={() => { setListingFilters(defaultListingFilters); setAppliedListingFilters(defaultListingFilters); setSearch(''); setAppliedSearch(''); }}>Clear</button><button className="button button-primary" type="button" onClick={() => { setAppliedListingFilters(listingFilters); setAppliedSearch(search); setShowFilters(false); }}>Apply</button></div></div>}
      <div className="list-card listings-list">{filtered.map((listing) => <ListingRow key={listing.sku} listing={listing} onView={() => setSelected(listing)} onEdit={() => setEditing({ ...listing })} onDelete={() => setDeleteTarget(listing)} />)}{filtered.length === 0 && <EmptyList icon={Tag} title="No listings found" description="No products match your search or filters." />}</div>
    </div>
    {selected && <ListingModal listing={selected} onClose={() => setSelected(null)} />}
    {editing && <EditListingModal listing={editing} onChange={setEditing} onClose={() => setEditing(null)} onSave={saveEdit} />}
    {deleteTarget && <ConfirmModal title="Delete listing?" message={'Remove “' + deleteTarget.title + '” from the local demo catalog?'} onCancel={() => setDeleteTarget(null)} onConfirm={() => { setListings((current) => current.filter((item) => item.sku !== deleteTarget.sku)); setDeleteTarget(null); notify('Listing removed from the local demo'); }} confirmLabel="Delete listing" icon={Trash2} danger />}
    {restrictionOpen && <RestrictionModal onClose={() => setRestrictionOpen(false)} />}
  </>;
}

function ListingRow({ listing, onView, onEdit, onDelete }) {
  return <div className="listing-row" onClick={onView} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter') onView(); }}><div className="listing-thumb" style={{ background: listing.color }}>{listing.image?.url ? <img src={listing.image.url} alt={listing.title || listing.sku} /> : <ImageIcon size={24} />}</div><div className="listing-info"><strong>{listing.title || listing.sku}</strong><span>SKU: {listing.sku}<i />ASIN: {listing.asin || '—'}</span>{listing.hasErrors && listing.issues?.length > 0 && <small className="listing-issue"><AlertCircle size={13} />{listing.issues.length} {listing.issues.length === 1 ? 'issue' : 'issues'}</small>}</div><div className="listing-price"><strong>{money(listing.price?.amount, listing.price?.currency)}</strong><span>Qty: {number(listing.quantity)}</span></div><StatusBadge status={listingStatus(listing)} /><div className="listing-actions"><button title="View" onClick={(event) => { event.stopPropagation(); onView(); }}><Eye size={16} /></button><button title="Edit" onClick={(event) => { event.stopPropagation(); onEdit(); }}><Edit size={16} /></button><button title="Delete" className="danger-action" onClick={(event) => { event.stopPropagation(); onDelete(); }}><Trash2 size={16} /></button></div><ChevronRight size={20} className="row-chevron" /></div>;
}

function ListingModal({ listing, onClose }) {
  const productUrl = `https://www.amazon.eg/dp/${encodeURIComponent(listing.asin)}`;
  return <Modal title={listing.title || listing.sku} subtitle={`SKU: ${listing.sku}`} onClose={onClose} icon={Package} showCloseButton><div className="modal-content-stack">
    <div className="listing-detail-hero"><div className="listing-detail-art" style={{ background: listing.color }}>{listing.image?.url ? <img src={listing.image.url} alt={listing.title || listing.sku} /> : <ImageIcon className="text-body-muted" size={32} />}</div><div><StatusBadge status={listingStatus(listing)} /><h2>{listing.title || listing.sku}</h2></div></div>
    <section className="detail-block listing-detail-fields"><div className="listing-detail-grid">
      <Detail label="SKU" value={listing.sku} />
      <Detail label="ASIN" value={listing.asin || '-'} />
      <Detail label="Product Type" value={listing.productType || '-'} />
      <Detail label="Condition" value={listing.condition === 'new_new' ? 'New' : titleCase(listing.condition || '-')} />
      {listing.price != null && <Detail label="Price" value={money(listing.price?.amount, listing.price?.currency)} />}
      {listing.quantity != null && <Detail label="Quantity" value={number(listing.quantity)} />}
      {listing.fulfillmentChannel && <Detail label="Fulfillment" value={listing.fulfillmentChannel} />}
      {listing.createdAt && <Detail label="Created" value={shortDate(listing.createdAt)} />}
      {listing.updatedAt && <Detail label="Updated" value={shortDate(listing.updatedAt)} />}
    </div></section>
    {listing.issues?.length > 0 && <section className="detail-block issue-block"><h3><AlertCircle size={16} />Issues ({listing.issues.length})</h3>{listing.issues.map((issue, index) => <div className="issue-message" key={`${issue.message}-${index}`}><StatusBadge status={issue.severity.toLowerCase()} /><span>{issue.message}</span>{issue.enforcement?.actions?.length > 0 && <small>{issue.enforcement.actions.join(', ')}</small>}</div>)}</section>}
    {listing.asin && <button className="button button-outline amazon-link-button" onClick={() => window.open(productUrl, '_blank', 'noopener,noreferrer')}><ExternalLink size={16} />View on Amazon</button>}
  </div></Modal>;
}

function EditListingModal({ listing, onChange, onClose, onSave }) {
  const [mode, setMode] = useState('patch');
  return <Modal title="Edit Listing" subtitle={listing.sku} onClose={onClose} icon={Package}><div className="modal-content-stack">
    <div className="edit-mode-tabs"><button className={mode === 'patch' ? 'active' : ''} onClick={() => setMode('patch')}>Partial (Patch)</button><button className={mode === 'put' ? 'active' : ''} onClick={() => setMode('put')}>Full (Replace)</button></div>
    <div className="detail-block"><div className="form-grid"><label>Price<input type="number" step="0.01" value={listing.price?.amount ?? ''} onChange={(event) => onChange({ ...listing, price: { ...listing.price, amount: Number(event.target.value) } })} /><small>{listing.price?.currency}</small></label><label>Update Quantity<input type="number" value={listing.quantity} onChange={(event) => onChange({ ...listing, quantity: Number(event.target.value) })} /></label></div></div>
    {mode === 'put' && <section className="detail-block"><h3><FileText size={16} />Extended Attributes</h3><label className="modal-field">Product Title<input value={listing.title} onChange={(event) => onChange({ ...listing, title: event.target.value })} /></label><label className="modal-field">Brand<input value={listing.brand || 'Oraimo'} onChange={(event) => onChange({ ...listing, brand: event.target.value })} /></label><div className="form-grid"><label>Manufacturer<input value={listing.manufacturer || 'Oraimo'} onChange={(event) => onChange({ ...listing, manufacturer: event.target.value })} /></label><label>Model Name<input value={listing.modelName || 'FreePods 4'} onChange={(event) => onChange({ ...listing, modelName: event.target.value })} /></label><label>Origin<input value={listing.origin || 'Egypt'} onChange={(event) => onChange({ ...listing, origin: event.target.value })} /></label><label>Weight (g)<input type="number" value={listing.weight || 0} onChange={(event) => onChange({ ...listing, weight: Number(event.target.value) })} /></label><label>Color<input value={listing.colorName || 'Black'} onChange={(event) => onChange({ ...listing, colorName: event.target.value })} /></label><label>Material<input value={listing.material || 'Plastic'} onChange={(event) => onChange({ ...listing, material: event.target.value })} /></label></div><label className="modal-field">Description<textarea rows="4" value={listing.description || ''} onChange={(event) => onChange({ ...listing, description: event.target.value })} /></label></section>}
    <div className="edit-mode-help">{mode === 'patch' ? 'Partial update: Only modifies the specified fields.' : 'Full update: Replaces the entire listing entry. Use with caution.'}</div>
    <div className="modal-footer"><button className="button button-outline" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={onSave}><Check size={16} />Update Listing</button></div>
  </div></Modal>;
}

function RestrictionModal({ onClose }) {
  const [asin, setAsin] = useState('B0C8F4P2Q1');
  const [checked, setChecked] = useState(false);
  return <Modal title="Check selling restrictions" subtitle="Enter an ASIN to preview eligibility." onClose={onClose} icon={ShieldCheck}><div className="modal-content-stack"><label className="modal-field">ASIN<input value={asin} onChange={(event) => { setAsin(event.target.value); setChecked(false); }} /></label>{checked && <div className="restriction-result"><CheckCircle2 size={20} /><div><strong>Eligible to sell</strong><span>This local sample ASIN has no selling restrictions.</span></div></div>}<div className="modal-footer"><button className="button button-outline" onClick={onClose}>Close</button><button className="button button-primary" onClick={() => setChecked(true)}><ShieldCheck size={16} />Check sample ASIN</button></div></div></Modal>;
}

function ConfirmModal({ title, message, onCancel, onConfirm, confirmLabel, icon: Icon = CircleHelp, danger = false }) {
  return <Modal title={title} onClose={onCancel} icon={Icon}><div className="confirm-content"><p>{message}</p><div className="modal-footer"><button className="button button-outline" onClick={onCancel}>Cancel</button><button className={'button ' + (danger ? 'button-danger' : 'button-primary')} onClick={onConfirm}>{confirmLabel}</button></div></div></Modal>;
}

function Modal({ title, subtitle, icon: Icon, onClose, children, maxWidth = '512px', showCloseButton = false }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal-window" style={{ '--modal-max-width': maxWidth }} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div className="modal-title-icon"><Icon size={20} /></div><div className="modal-title"><h2>{title}</h2>{subtitle && <span>{subtitle}</span>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>{children}{showCloseButton && <div className="modal-dialog-footer"><button className="button button-outline" onClick={onClose}>Close</button></div>}</div></div>;
}

function EmptyList({ icon: Icon, title, description }) { return <div className="empty-list"><div><Icon size={23} /></div><strong>{title}</strong><span>{description}</span></div>; }

export default App;
