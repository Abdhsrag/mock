import { useEffect, useRef, useState } from 'react';
import {
  Sparkles, ImageIcon, RefreshCw, Check, CheckCircle2, Copy,
  Cloud, LoaderCircle, X, Upload, ClipboardCheck, Trash2,
  Circle, Camera, House, ScanLine
} from 'lucide-react';
import { translations } from './translations';
import useModalFocus from './useModalFocus';
import './generate-image-modal.css';

// SVG Generator tailored to product, style, and optional input source image
function createGeneratedPreview(symbol, title, style, color = '#eef2ff', lang = 'en', sourceImageUrl = null) {
  let badgeText = style === 'lifestyle'
    ? (lang === 'ar' ? 'مشهد واقعي' : 'LIFESTYLE SHOT')
    : style === 'infographic'
    ? (lang === 'ar' ? 'إنفوجرافيك' : 'INFOGRAPHIC FEATURE')
    : style === 'product-photo'
    ? (lang === 'ar' ? 'صورة استوديو' : 'STUDIO PRODUCT SHOT')
    : (lang === 'ar' ? 'خلفية بيضاء' : 'WHITE BACKGROUND');
  let accent = style === 'lifestyle' ? '#ea580c' : style === 'infographic' ? '#16a34a' : style === 'product-photo' ? '#6366f1' : '#3b82f6';

  // Embed source image if provided, otherwise render emoji symbol
  const productVisual = sourceImageUrl
    ? `<image href="${sourceImageUrl}" x="220" y="140" width="200" height="200" preserveAspectRatio="xMidYMid meet" filter="url(#dropShadow)" />`
    : `<text x="320" y="285" text-anchor="middle" font-size="110">${symbol || '📦'}</text>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 520" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${style === 'white-bg' ? '#ffffff' : style === 'lifestyle' ? '#fff7ed' : style === 'infographic' ? '#f0fdf4' : '#f8fafc'}" />
          <stop offset="100%" stop-color="${style === 'white-bg' ? '#f8fafc' : style === 'lifestyle' ? '#fed7aa' : style === 'infographic' ? '#bbf7d0' : '#e2e8f0'}" />
        </linearGradient>
        <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-opacity="0.12" />
        </filter>
      </defs>

      <!-- Canvas background -->
      <rect width="640" height="520" rx="20" fill="url(#bgGrad)" />

      <!-- Style Badge Pill -->
      <rect x="24" y="24" width="170" height="28" rx="14" fill="#ffffff" stroke="${accent}" stroke-width="1.5" />
      <text x="109" y="42" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="10" font-weight="700" fill="${accent}" letter-spacing="1">
        ${badgeText}
      </text>

      <!-- The image is a local demo preview, not a remote storage result. -->
      <rect x="470" y="24" width="146" height="28" rx="6" fill="#f1f5f9" />
      <text x="543" y="42" text-anchor="middle" font-family="monospace" font-size="10" font-weight="600" fill="#475569">
        DEMO PREVIEW
      </text>

      <!-- Product Platform Pedestal / Studio Circle -->
      <ellipse cx="320" cy="360" rx="180" ry="32" fill="#000000" opacity="0.06" />
      <circle cx="320" cy="240" r="130" fill="#ffffff" filter="url(#dropShadow)" />

      <!-- Product Graphic or Symbol -->
      ${productVisual}

      <!-- Product Label Footer -->
      <rect x="40" y="440" width="560" height="52" rx="12" fill="#ffffff" fill-opacity="0.95" stroke="#e2e8f0" />
      <text x="320" y="472" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="13" font-weight="700" fill="#1e293b">
        ${(title || 'AI Generated Product Image').slice(0, 55).replace(/[<>&]/g, '')}
      </text>
    </svg>
  `.trim();

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

async function imageAsDataUrl(url) {
  if (!url || url.startsWith('data:')) return url;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Reference image unavailable');
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export default function GenerateProductImageModal({
  listing,
  onClose,
  onAddImageToListing,
  notify,
  lang = 'en'
}) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('white-bg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Source Reference Image selection states
  // mode: 'current' | 'upload'
  const [sourceMode, setSourceMode] = useState('current');
  const [sourceImage, setSourceImage] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [sourceError, setSourceError] = useState('');
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef([]);
  const generationTimerRef = useRef(null);
  const closeDialog = () => onClose();
  const dialogRef = useModalFocus(closeDialog, true);

  const t = translations[lang] || translations.en;

  const currentProductImgUrl = listing.image?.url || listing.images?.[0]?.url || null;

  useEffect(() => () => {
    if (generationTimerRef.current) window.clearInterval(generationTimerRef.current);
    objectUrlsRef.current.forEach(URL.revokeObjectURL);
  }, []);

  const createTrackedUrl = (blob) => {
    const url = URL.createObjectURL(blob);
    objectUrlsRef.current.push(url);
    return url;
  };

  // Listen for Clipboard Paste (Ctrl+V) anywhere inside the modal
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const url = createTrackedUrl(file);
            setSourceImage({
              type: 'pasted',
              url,
              name: `pasted-${new Date().getTime().toString().slice(-4)}.png`,
              size: `${(file.size / 1024).toFixed(0)} KB`,
              isCopied: true,
            });
            setSourceError('');
            if (notify) notify(lang === 'ar' ? 'تم لصق الصورة من الحافظة وتعيينها كمرجع' : 'Image pasted from clipboard and set as reference');
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [lang, notify]);

  // Copy Current Product Image into memory as local image data
  const handleCopyCurrentProductImage = async () => {
    if (!currentProductImgUrl) {
      if (notify) notify(t.noImageAttached);
      return;
    }

    setIsCopying(true);
    try {
      let localUrl = currentProductImgUrl;
      if (currentProductImgUrl.startsWith('data:')) {
        const res = await fetch(currentProductImgUrl);
        const blob = await res.blob();
        localUrl = createTrackedUrl(blob);
      } else {
        try {
          const res = await fetch(currentProductImgUrl);
          const blob = await res.blob();
          localUrl = createTrackedUrl(blob);
        } catch {
          localUrl = currentProductImgUrl;
        }
      }

      setSourceImage({
        type: 'copied_product',
        url: localUrl,
        name: `${listing.sku}-catalog-image.png`,
        size: '124 KB',
        isCopied: true,
      });

      if (notify) notify(t.imageCopiedSuccess);
    } catch (err) {
      console.error('Error copying product image:', err);
      if (notify) notify(lang === 'ar' ? 'فشل نسخ صورة المنتج' : 'Failed to copy product image');
    } finally {
      setIsCopying(false);
    }
  };

  // Upload an image from local filesystem
  const handleFileUpload = (file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size === 0) {
      setSourceError(lang === 'ar' ? 'اختر صورة PNG أو JPG أو WEBP غير فارغة.' : 'Choose a non-empty PNG, JPG, or WEBP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSourceError(lang === 'ar' ? 'حجم الصورة أكبر من 10 ميجابايت. اختر صورة أصغر.' : 'Image exceeds 10 MB. Choose a smaller file.');
      return;
    }

    setSourceError('');
    const url = createTrackedUrl(file);
    setSourceImage({
      type: 'uploaded',
      url,
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      file,
    });
    if (notify) notify(lang === 'ar' ? 'تم تحميل الصورة المرجعية بنجاح' : 'Reference image loaded');
  };

  // Copy image to system clipboard
  const handleCopyToClipboard = async () => {
    const targetUrl = sourceImage?.url || currentProductImgUrl;
    if (!targetUrl) return;
    try {
      const res = await fetch(targetUrl);
      const blob = await res.blob();
      if (navigator.clipboard?.write && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type || 'image/png']: blob })
        ]);
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 2000);
        if (notify) notify(t.copiedToClipboardSuccess);
      }
    } catch (e) {
      console.warn('Clipboard write restricted', e);
    }
  };

  const alphaStyles = [
    {
      id: 'white-bg',
      title: t.whiteBg,
      detail: t.whiteBgDesc,
      Icon: Circle
    },
    {
      id: 'product-photo',
      title: t.productPhoto,
      detail: t.productPhotoDesc,
      Icon: Camera
    },
    {
      id: 'lifestyle',
      title: t.lifestyleScene,
      detail: t.lifestyleDesc,
      Icon: House
    },
    {
      id: 'infographic',
      title: t.infographic,
      detail: t.infographicDesc,
      Icon: ScanLine
    },
  ];

  // Create a local preview of the selected style and prompt.
  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setProgress(0);
    setGeneratedResult(null);

    const effectivePrompt = prompt.trim() || listing.title || 'Product listing photo';
    let current = 0;

    generationTimerRef.current = window.setInterval(async () => {
      current += 15;
      if (current >= 100) {
        window.clearInterval(generationTimerRef.current);
        generationTimerRef.current = null;
        setProgress(100);

        try {
          // Embed source bytes so the local preview still works after the dialog closes.
          const sourceDataUrl = await imageAsDataUrl(sourceImage?.url);
          const dateStamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
          const r2Url = `https://pub-2828d39640284bd1b08194cd95d1cb43.r2.dev/Create_product_in_environment_${dateStamp}.jpeg`;
          const previewSvg = createGeneratedPreview(
            listing.symbol || '📦', effectivePrompt, style, listing.color, lang, sourceDataUrl
          );
          setGeneratedResult({
            r2Url, previewUrl: previewSvg, promptUsed: effectivePrompt, styleUsed: style,
            sourceImageUsed: sourceImage?.name || null,
            generatedAt: new Date().toISOString(), storageHeader: 'cloudflare-r2'
          });
          notify?.(lang === 'ar' ? 'تم إنشاء معاينة الصورة' : 'Image preview created');
        } catch {
          setSourceError(lang === 'ar' ? 'تعذر قراءة الصورة المرجعية. جرّب صورة أخرى.' : 'Could not read the reference image. Try another image.');
        } finally {
          setIsGenerating(false);
        }
      } else {
        setProgress(current);
      }
    }, 110);
  };

  const copyR2Url = () => {
    if (!generatedResult?.r2Url) return;
    navigator.clipboard.writeText(generatedResult.r2Url);
    setCopied(true);
    if (notify) notify(lang === 'ar' ? 'تم نسخ الرابط التجريبي' : 'Demo image URL copied');
    setTimeout(() => setCopied(false), 2000);
  };

  // Add the reviewed preview to this listing in the local catalog.
  const handleAddImage = () => {
    if (!generatedResult) return;
    onAddImageToListing(listing.sku, generatedResult);
    notify?.(lang === 'ar' ? `تمت إضافة الصورة لـ ${listing.sku}` : `Image added to ${listing.sku}`);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={closeDialog}>
      <div
        ref={dialogRef}
        className="modal-window generate-image-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="generate-image-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-icon" aria-hidden="true">
            <Sparkles size={20} />
          </div>
          <div className="modal-title">
            <h2 id="generate-image-title">{t.genProductImage}</h2>
            <span>{t.genSubtitle}</span>
          </div>
          <button className="icon-button" onClick={closeDialog} aria-label={t.close}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-content-stack generate-image-body">
          <div className="gen-modal-layout">
            {/* Left Controls */}
            <div className="gen-controls-panel">
              {/* Product Target Summary */}
              <div className="product-summary-strip">
                <div className="product-summary-thumb" style={{ background: listing.color, width: 56, height: 56 }}>
                  {listing.image?.url ? (
                    <img src={listing.image.url} alt="" />
                  ) : (
                    <span style={{ fontSize: '24px' }}>{listing.symbol || '📦'}</span>
                  )}
                </div>
                <div className="product-summary-info">
                  <strong>{listing.title || listing.sku}</strong>
                  <span>SKU: {listing.sku} · ASIN: {listing.asin || '—'}</span>
                </div>
              </div>

              {/* Source Reference Image (Choose current image via copying OR upload) */}
              <div className="source-selection-box">
                <div className="source-section-heading">
                  <span className="workflow-step-index" aria-hidden="true">1</span>
                  <div>
                    <h3>{t.sourceImageSection}</h3>
                    <span>{t.sourceImageSubtitle}</span>
                  </div>
                </div>

                {/* Source Mode Tabs */}
                <div className="source-tabs-header">
                  <button
                    type="button"
                    className={`source-tab-btn ${sourceMode === 'current' ? 'active' : ''}`}
                    onClick={() => setSourceMode('current')}
                    aria-pressed={sourceMode === 'current'}
                    data-autofocus
                  >
                    <Copy size={13} />
                    {t.tabCurrentProduct}
                  </button>
                  <button
                    type="button"
                    className={`source-tab-btn ${sourceMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setSourceMode('upload')}
                    aria-pressed={sourceMode === 'upload'}
                  >
                    <Upload size={13} />
                    {t.tabUploadImage}
                  </button>
                </div>

                {/* Tab 1: Current Product Image (Copy) */}
                {sourceMode === 'current' && (
                  <div className="current-img-option-card">
                    <div className="current-img-preview-group">
                      <div className="current-img-preview-thumb">
                        {currentProductImgUrl ? (
                          <img src={currentProductImgUrl} alt="Product" />
                        ) : (
                          <span style={{ fontSize: 18 }}>{listing.symbol || '📦'}</span>
                        )}
                      </div>
                      <div className="current-img-info">
                        <strong>{t.currentImageLabel}</strong>
                    <small>{listing.sku} · {currentProductImgUrl ? t.catalogAsset : t.noImageAttached}</small>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        className={`copy-use-btn ${sourceImage?.type === 'copied_product' ? 'is-active' : ''}`}
                        onClick={handleCopyCurrentProductImage}
                        disabled={isCopying || !currentProductImgUrl}
                      >
                        {isCopying ? (
                          <>
                            <LoaderCircle size={13} className="spin" />
                            {t.copyingImageData}
                          </>
                        ) : sourceImage?.type === 'copied_product' ? (
                          <>
                            <Check size={13} />
                            {t.copiedBadge}
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            {t.copyProductImageBtn}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Upload File / Dropzone */}
                {sourceMode === 'upload' && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      hidden
                      onChange={(e) => { handleFileUpload(e.target.files?.[0]); e.target.value = ''; }}
                    />
                    <button
                      type="button"
                      className={`modal-dropzone ${isDragActive ? 'is-drag-active' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragEnter={(e) => { e.preventDefault(); setIsDragActive(true); }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragActive(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragActive(false);
                        handleFileUpload(e.dataTransfer.files?.[0]);
                      }}
                    >
                      <span className="dropzone-icon"><Upload size={20} aria-hidden="true" /></span>
                      <strong>{t.dropzoneTitle}</strong>
                      <small>{t.dropzoneSubtitle}</small>
                      <span className="dropzone-browse-label">{t.browseFiles}</span>
                      <em>{t.dropzoneFormats}</em>
                    </button>
                  </>
                )}
                {sourceError && <p className="source-image-error" role="alert">{sourceError}</p>}

                {/* Active Source Image Indicator */}
                {sourceImage && (
                  <div className="active-source-pill" role="status" aria-live="polite">
                    <div className="active-source-left">
                      <div className="active-source-thumb">
                        <img src={sourceImage.url} alt="Active reference" />
                      </div>
                      <div className="active-source-meta">
                        <strong>{sourceImage.name}</strong>
                        <small>
                          <CheckCircle2 size={12} color="#16a34a" />
                          {sourceImage.type === 'copied_product'
                            ? t.copiedBadge
                            : sourceImage.type === 'pasted'
                            ? t.pastedBadge
                            : t.uploadedBadge} ({sourceImage.size || 'image'})
                        </small>
                      </div>
                    </div>
                    <div className="active-source-actions">
                      <button
                        type="button"
                        className="button button-outline"
                        style={{ padding: '3px 8px', fontSize: 10, minHeight: 24 }}
                        onClick={handleCopyToClipboard}
                        title={t.copyToSystemClipboard}
                      >
                        {copiedToClipboard ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                        {t.copyToSystemClipboard}
                      </button>
                      <button
                        type="button"
                        className="source-clear-btn"
                        onClick={() => setSourceImage(null)}
                        title={t.clearImage}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="paste-hint">
                  <ClipboardCheck size={12} color="#7c3aed" />
                  <span>{t.pasteHintText}</span>
                </div>
              </div>

              {/* Alpha Style Choices */}
              <div className="gen-field-group">
                <div className="gen-field-heading">
                  <span className="workflow-step-index" aria-hidden="true">2</span>
                  <div>
                    <h3>{t.selectAlphaStyle}</h3>
                    <small>{t.ecommercePreset}</small>
                  </div>
                </div>
                <div className="alpha-style-grid">
                  {alphaStyles.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`alpha-style-card ${style === item.id ? 'selected' : ''}`}
                      onClick={() => setStyle(item.id)}
                      aria-pressed={style === item.id}
                    >
                      <strong><item.Icon size={17} aria-hidden="true" />{item.title}</strong>
                      <small>{item.detail}</small>
                      <Check className="alpha-style-check" size={15} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input with Product Name as Placeholder */}
              <div className="gen-field-group">
                <div className="gen-field-heading">
                  <span className="workflow-step-index" aria-hidden="true">3</span>
                  <label htmlFor="generation-prompt">
                    <strong>{t.promptLabel}</strong>
                    <small id="generation-prompt-hint">{t.promptHelper}</small>
                  </label>
                </div>
                <textarea
                  id="generation-prompt"
                  className="gen-textarea"
                  rows={2}
                  aria-describedby="generation-prompt-hint"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={listing.title || 'Enter product description...'}
                />
              </div>

            </div>

            {/* Right Preview & Results Panel */}
            <div className="gen-preview-panel">
              <div className="preview-panel-heading">
                <div>
                  <h3>{t.previewTitle}</h3>
                  <span>{generatedResult ? t.previewReadyHint : t.previewEmptyHint}</span>
                </div>
                {generatedResult && (
                  <span className="ready-badge">
                    <i />
                    {t.readyBadge}
                  </span>
                )}
              </div>

              {/* Viewport */}
              <div className="preview-viewport">
                {isGenerating ? (
                  <div className="preview-loading-state" role="status" aria-live="polite">
                    <div className="loading-pulse-ring">
                      <RefreshCw size={26} className="spin" />
                    </div>
                    <strong style={{ fontSize: 13, color: '#4338ca' }}>
                      {t.generatingText}
                    </strong>
                    <div
                      className="gen-progress-track"
                      role="progressbar"
                      aria-label={t.generatingText}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    >
                      <div className="gen-progress-fill" style={{ transform: `scaleX(${progress / 100})` }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      {t.previewProcessingHint}
                    </span>
                  </div>
                ) : generatedResult ? (
                  <img src={generatedResult.previewUrl} alt={`${t.generatedPreviewAlt}: ${listing.title || listing.sku}`} />
                ) : sourceImage ? (
                  <div className="preview-empty-state" style={{ padding: '20px' }}>
                    <div style={{ width: 84, height: 84, borderRadius: 12, overflow: 'hidden', border: '2px solid #7c3aed', background: '#f5f3ff', margin: '0 auto 10px', boxShadow: '0 4px 12px rgba(124,58,237,0.15)' }}>
                      <img src={sourceImage.url} alt={`${t.referenceImagePreview}: ${sourceImage.name}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <strong style={{ color: '#4338ca', fontSize: 13 }}>{t.usingSourcePreview}</strong>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>
                      {sourceImage.type === 'copied_product' ? t.copiedBadge : t.uploadedBadge}: {sourceImage.name}
                    </p>
                  </div>
                ) : (
                  <div className="preview-empty-state">
                    <span className="empty-preview-icon"><ImageIcon size={24} /></span>
                    <strong>{t.noImageYet}</strong>
                    <p>{t.noImageYetDesc}</p>
                  </div>
                )}
              </div>

              {/* Cloudflare Public URL Box */}
              {generatedResult && (
                <div className="r2-url-card">
                  <div className="r2-url-header">
                    <span className="r2-badge">
                      <Cloud size={12} />
                      {t.r2UrlTitle}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {t.r2Header}
                    </span>
                  </div>
                  <div className="r2-url-line">
                    <span className="r2-url-text" title={generatedResult.r2Url}>
                      {generatedResult.r2Url}
                    </span>
                    <button
                      type="button"
                      className="r2-copy-btn"
                      onClick={copyR2Url}
                      title={lang === 'ar' ? 'نسخ الرابط' : 'Copy URL'}
                    >
                      {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="gen-modal-footer">
          <button className="button button-outline" onClick={closeDialog}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          {generatedResult && (
            <button
              className="button button-outline"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <RefreshCw size={14} />
              {t.regenerate}
            </button>
          )}
          <button
            className="button button-primary"
            disabled={isGenerating}
            onClick={generatedResult ? handleAddImage : handleGenerate}
          >
            {isGenerating ? (
              <><LoaderCircle size={15} className="spin" />{t.generatingText}</>
            ) : !generatedResult ? (
              <><Sparkles size={15} />{t.generateButton}</>
            ) : (
              <>
                <Check size={15} />
                {t.addToListing}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
