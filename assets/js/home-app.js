/* ── Firdaws Import & Export Co. — Home Page Controller ──
   Builds all 8 sections of index.html dynamically from COMPANY_DATA.
   Registers refreshPage() callback for instant bilingual switching.
   Uses Utils.el() for all DOM construction — zero innerHTML.
   ES5 strict mode — var only.
   ── End Summary ── */

'use strict';

var HomeApp = (function () {

  /* ── Guard & Aliases ── */

  var U    = window.Utils;
  var DATA = window.COMPANY_DATA;
  var SP   = window.SharedPage;

  if (!U || !DATA || !SP) {
    console.error('HomeApp: dependencies missing.');
    return null;
  }

  var META = DATA.META;

  /* ── Constants ── */

  var FEATURED_MAX  = 8;
  var PRODUCTS_BASE = './products/';
  var DETAILS_BASE  = './products/details/?id=';

  /* Local strings not in META */
  var FAQ_TITLE = { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' };
  var PRODUCTS_LABEL = { en: 'products', ar: 'منتج' };
  var VIEW_DETAILS = { en: 'View Details', ar: 'عرض التفاصيل' };

  /* ── Helper: Clear container children ── */

  function clearChildren(el) {
    while (el && el.firstChild) el.removeChild(el.firstChild);
  }

  /* ── Helper: Check if month (1-12) is in product season ── */

  function isMonthInSeason(product, month) {
    var from = product.season.from;
    var to   = product.season.to;
    if (from === 1 && to === 12) return true;
    if (from <= to) return month >= from && month <= to;
    return month >= from || month <= to;
  }

  /* ── Helper: Count products per category ── */

  function countProductsInCategory(categoryId) {
    var count = 0;
    for (var i = 0; i < DATA.products.length; i++) {
      if (DATA.products[i].categoryId === categoryId) count++;
    }
    return count;
  }

  /* ══════════════════════════════════════════
     Builder 1: Hero
  ══════════════════════════════════════════ */

  function buildHero() {
    var lang = U.getLang();

    /* Set hero background image via CSS variable */
    var heroSection = document.getElementById('hero-section');
    if (heroSection && META.heroImage) {
      heroSection.style.setProperty('--fw-hero-bg', 'url(' + U.sanitizeUrl('.' + META.heroImage) + ')');
    }

    SP.setTextById('hero-heading', U.t(META.hero.title, lang));
    SP.setTextById('hero-subtitle', U.t(META.hero.subtitle, lang));

    /* CTA: Explore Products */
    var ctaEl = document.getElementById('hero-cta');
    if (ctaEl) ctaEl.textContent = U.t(META.hero.cta, lang);

    /* CTA: Request a Quote (WhatsApp) */
    var quoteEl = document.getElementById('hero-cta-quote');
    if (quoteEl) quoteEl.href = U.sanitizeUrl(SP.getDefaultWhatsAppUrl());

    SP.setTextById('hero-cta-quote-text', U.t(META.hero.ctaSecondary, lang));
  }

  /* ══════════════════════════════════════════
     Builder 1B: Stats Bar
  ══════════════════════════════════════════ */
  function buildStatsBar() {
    var grid = document.getElementById('stats-grid');
    if (!grid) return;
    if (!META.statsBar || !META.statsBar.items) return;

    var lang = U.getLang();
    clearChildren(grid);

    var frag = document.createDocumentFragment();

    META.statsBar.items.forEach(function (item) {
      var itemData = item[lang] || item.en;
      var stat = U.el('div', { className: 'fw-stat-item' });

      /* Icon */
      var iconWrap = U.el('div', { className: 'fw-stat-icon' });
      iconWrap.appendChild(
        U.el('i', { className: 'bi ' + item.icon, aria: { hidden: 'true' } })
      );
      stat.appendChild(iconWrap);

      /* Value + Suffix */
      var rawValue = Number(item.value);
      var displayValue = lang === 'ar' ? U.formatNumberAr(rawValue) : U.formatNumber(rawValue);
      var suffix = U.t(item.suffix, lang) || '';

      stat.appendChild(
        U.el('span', { className: 'fw-stat-value', textContent: displayValue + suffix })
      );

      /* Label */
      stat.appendChild(
        U.el('span', { className: 'fw-stat-label', textContent: itemData.label })
      );

      frag.appendChild(stat);
    });

    grid.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 2: About Preview
  ══════════════════════════════════════════ */

  function buildAboutPreview() {
    var lang = U.getLang();

    SP.setTextById('about-preview-heading', U.t(META.aboutPreview.title, lang));
    SP.setTextById('about-preview-text', U.t(META.aboutPreview.text, lang));

    /* Certification mini-logos */
    var certsRow = document.getElementById('about-certs-row');
    if (!certsRow) return;

    clearChildren(certsRow);

    var frag = document.createDocumentFragment();
    DATA.certifications.forEach(function (cert) {
      var certName = cert[lang] ? cert[lang].name : cert.en.name;
      frag.appendChild(
        U.el('img', {
          src:     U.sanitizeUrl(cert.logo),
          alt:     certName,
          loading: 'lazy',
          width:   '80',
          height:  '40'
        })
      );
    });
    certsRow.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 3: Categories Grid
  ══════════════════════════════════════════ */

  function buildCategoriesGrid() {
    var lang = U.getLang();
    SP.setTextById('categories-heading', U.t(META.productsSection.title, lang));
    SP.setTextById('categories-subtitle', U.t(META.productsSection.subtitle, lang));

    var grid = document.getElementById('categories-grid');
    if (!grid) return;
    clearChildren(grid);

    var frag = document.createDocumentFragment();

    DATA.categories.forEach(function (cat) {
      var count = countProductsInCategory(cat.id);
      var catData = cat[lang] || cat.en;

      var col = U.el('div', { className: 'col-12 col-sm-6 col-md-4' });
      var card = U.el('a', {
        className: 'fw-cat-card fw-cat-card--' + cat.color,
        href: U.sanitizeUrl(PRODUCTS_BASE + '?category=' + encodeURIComponent(cat.id))
      });

      /* Image wrapper + badge overlay */
      if (cat.image) {
        var imgWrap = U.el('div', { className: 'fw-cat-card-img-wrap' });

        imgWrap.appendChild(
          U.el('img', {
            className: 'fw-cat-card-img',
            src: U.sanitizeUrl(cat.image),
            alt: catData.name,
            loading: 'lazy',
            width: '600',
            height: '400'
          })
        );

        var badge = U.el('div', { className: 'fw-cat-card-badge' });
        badge.appendChild(
          U.el('i', { className: 'bi ' + cat.icon, aria: { hidden: 'true' } })
        );
        imgWrap.appendChild(badge);

        card.appendChild(imgWrap);
      }

      /* Card body */
      var body = U.el('div', { className: 'fw-cat-card-body' });

      body.appendChild(
        U.el('h3', { textContent: catData.name })
      );
      body.appendChild(
        U.el('p', { textContent: catData.desc })
      );
      body.appendChild(
        U.el('span', { className: 'fw-cat-count', textContent: count + ' ' + U.t(PRODUCTS_LABEL, lang) })
      );

      card.appendChild(body);
      col.appendChild(card);
      frag.appendChild(col);
    });

    grid.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 4: Featured Products (In-Season)
  ══════════════════════════════════════════ */

  function buildFeaturedProducts() {
    var lang = U.getLang();

    SP.setTextById('featured-heading', U.t(META.productsSection.inSeason, lang));

    var grid = document.getElementById('featured-grid');
    if (!grid) return;

    clearChildren(grid);

    /* Filter in-season products */
    var featured = DATA.products.filter(function (p) {
      return U.isInSeason(p);
    });

    /* Fallback: if none in season, use first FEATURED_MAX */
    if (featured.length === 0) {
      featured = DATA.products.slice(0, FEATURED_MAX);
    } else {
      featured = featured.slice(0, FEATURED_MAX);
    }

    var frag = document.createDocumentFragment();

    featured.forEach(function (product) {
      var prodData = product[lang] || product.en;
      var inSeason = U.isInSeason(product);

      var col = U.el('div', { className: 'col-12 col-sm-6 col-md-4 col-lg-3' });

      var card = U.el('article', { className: 'fw-product-card' });

      /* Image */
      card.appendChild(
        U.el('img', {
          src:     U.sanitizeUrl(product.image),
          alt:     prodData.name,
          loading: 'lazy',
          width:   '400',
          height:  '300'
        })
      );

      /* Card Body */
      var body = U.el('div', { className: 'fw-product-card-body' });

      /* Season badge */
      if (inSeason) {
        body.appendChild(
          U.el('span', {
            className:   'fw-product-badge fw-badge-season',
            textContent: U.t(META.productsSection.inSeason, lang)
          })
        );
      }

      /* Name */
      body.appendChild(
        U.el('h3', { textContent: prodData.name })
      );

      /* Season text */
      body.appendChild(
        U.el('p', { textContent: U.seasonText(product, lang) })
      );

      /* View Details link */
      var footer = U.el('div', { className: 'fw-product-card-footer' });
      footer.appendChild(
        U.el('a', {
          href:        U.sanitizeUrl(DETAILS_BASE + encodeURIComponent(product.id)),
          className:   'btn btn-sm fw-btn-outline',
          textContent: U.t(VIEW_DETAILS, lang)
        })
      );
      body.appendChild(footer);

      card.appendChild(body);
      col.appendChild(card);
      frag.appendChild(col);
    });

    grid.appendChild(frag);

    /* View All link */
    var viewAllEl = document.getElementById('featured-view-all');
    if (viewAllEl) viewAllEl.textContent = U.t(META.productsSection.viewAll, lang);
  }

  /* ══════════════════════════════════════════
     Builder 5: Season Calendar
  ══════════════════════════════════════════ */

  function buildSeasonCalendar() {
    var lang = U.getLang();

    SP.setTextById('calendar-heading', U.t(META.seasonCalendar.title, lang));
    SP.setTextById('calendar-subtitle', U.t(META.seasonCalendar.subtitle, lang));

    var monthNames = META.seasonCalendar.months[lang] || META.seasonCalendar.months.en;

    /* ── thead ── */
    var thead = document.getElementById('calendar-thead');
    if (thead) {
      clearChildren(thead);

      var headerRow = U.el('tr');

      /* Product column header */
      headerRow.appendChild(
        U.el('th', { textContent: U.t(META.seasonCalendar.product, lang) })
      );

      /* 12 month headers */
      for (var m = 0; m < 12; m++) {
        headerRow.appendChild(
          U.el('th', { textContent: monthNames[m] })
        );
      }

      thead.appendChild(headerRow);
    }

    /* ── tbody ── */
    var tbody = document.getElementById('calendar-tbody');
    if (!tbody) return;

    clearChildren(tbody);

    var frag = document.createDocumentFragment();

    DATA.products.forEach(function (product) {
      var prodData = product[lang] || product.en;
      var row = U.el('tr');

      /* Product name cell */
      row.appendChild(
        U.el('td', { textContent: prodData.name })
      );

      /* 12 month cells */
      for (var month = 1; month <= 12; month++) {
        var active = isMonthInSeason(product, month);
        row.appendChild(
          U.el('td', {
            className: active ? 'fw-cal-active' : '',
            textContent: active ? '\u2713' : ''
          })
        );
      }

      frag.appendChild(row);
    });

    tbody.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 5B: Season Calendar — Mobile (Horizontal Bars)
  ══════════════════════════════════════════ */
  function buildSeasonCalendarMobile() {
    var container = document.getElementById('calendar-mobile');
    if (!container) return;

    var lang = U.getLang();
    var monthNames = META.seasonCalendar.months[lang] || META.seasonCalendar.months.en;

    clearChildren(container);

    var frag = document.createDocumentFragment();

    DATA.products.forEach(function (product) {
      var prodData = product[lang] || product.en;

      var item = U.el('div', { className: 'fw-cal-m-item' });

      /* Product name */
      item.appendChild(
        U.el('div', { className: 'fw-cal-m-name', textContent: prodData.name })
      );

      /* Bar wrap — 12 cells */
      var barWrap = U.el('div', { className: 'fw-cal-m-bar-wrap' });

      for (var m = 1; m <= 12; m++) {
        var active = isMonthInSeason(product, m);
        barWrap.appendChild(
          U.el('div', { className: 'fw-cal-m-cell' + (active ? ' active' : '') })
        );
      }

      item.appendChild(barWrap);

      /* Month labels row */
      var labelsRow = U.el('div', { className: 'fw-cal-m-months' });

      for (var j = 0; j < 12; j++) {
        labelsRow.appendChild(
          U.el('span', {
            className: 'fw-cal-m-month-label',
            textContent: monthNames[j].substring(0, 1)
          })
        );
      }

      item.appendChild(labelsRow);
      frag.appendChild(item);
    });

    container.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 6: Certifications
  ══════════════════════════════════════════ */

  function buildCertifications() {
    var lang = U.getLang();

    SP.setTextById('certs-heading', U.t(META.certificationsSection.title, lang));
    SP.setTextById('certs-subtitle', U.t(META.certificationsSection.subtitle, lang));

    var grid = document.getElementById('certs-grid');
    if (!grid) return;

    clearChildren(grid);

    var frag = document.createDocumentFragment();

    DATA.certifications.forEach(function (cert) {
      var certData = cert[lang] || cert.en;

      var col = U.el('div', { className: 'col-6 col-md-4 col-lg' });

      var card = U.el('div', { className: 'fw-cert-card' });

      card.appendChild(
        U.el('img', {
          src:       U.sanitizeUrl(cert.logo),
          alt:       certData.name,
          className: 'fw-cert-logo',
          loading:   'lazy',
          width:     '80',
          height:    '60'
        })
      );

      card.appendChild(
        U.el('h4', { textContent: certData.name })
      );

      card.appendChild(
        U.el('p', { textContent: certData.desc })
      );

      col.appendChild(card);
      frag.appendChild(col);
    });

    grid.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 7: CTA
  ══════════════════════════════════════════ */

  function buildCTA() {
    var lang = U.getLang();

    SP.setTextById('cta-heading', U.t(META.ctaSection.title, lang));
    SP.setTextById('cta-text', U.t(META.ctaSection.text, lang));

    var btnEl = document.getElementById('cta-btn');
    if (btnEl) btnEl.textContent = U.t(META.ctaSection.btn, lang);
  }

  /* ══════════════════════════════════════════
     Builder 8: FAQ
  ══════════════════════════════════════════ */

  function buildFAQ() {
    var lang = U.getLang();

    SP.setTextById('faq-heading', U.t(FAQ_TITLE, lang));

    var accordion = document.getElementById('faq-accordion');
    if (!accordion) return;

    clearChildren(accordion);

    var frag = document.createDocumentFragment();

    DATA.faq.forEach(function (item, idx) {
      var faqData  = item[lang] || item.en;
      var headerId = 'faq-h-' + idx;
      var bodyId   = 'faq-c-' + idx;

      /* Accordion item */
      var accItem = U.el('div', { className: 'accordion-item' });

      /* Header */
      var header = U.el('h3', {
        className: 'accordion-header',
        id:        headerId
      });

      var button = U.el('button', {
        className:   'accordion-button collapsed',
        type:        'button',
        textContent: faqData.question,
        aria:        { expanded: 'false', controls: bodyId },
        dataset:     { bsToggle: 'collapse', bsTarget: '#' + bodyId }
      });

      header.appendChild(button);
      accItem.appendChild(header);

      /* Collapse body */
      var collapseDiv = U.el('div', {
        id:        bodyId,
        className: 'accordion-collapse collapse',
        aria:      { labelledby: headerId },
        dataset:   { bsParent: '#faq-accordion' }
      });

      collapseDiv.appendChild(
        U.el('div', {
          className:   'accordion-body',
          textContent: faqData.answer
        })
      );

      accItem.appendChild(collapseDiv);
      frag.appendChild(accItem);
    });

    accordion.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 9: Footer Contact Text
  ══════════════════════════════════════════ */

  function buildFooterContactText() {
    /* shared-page.js sets href only — we set the visible text */
    SP.setTextById('footer-phone-link', '+20 1010018811');
    SP.setTextById('footer-whatsapp-link', '+20 1209500578');
    SP.setTextById('footer-email-link', 'info@firdawsco.com');
  }

  /* ══════════════════════════════════════════
     Builder 10: SEO Injection
  ══════════════════════════════════════════ */

  function injectSEO() {
    var lang = U.getLang();
    var baseUrl = 'https://' + DATA.DOMAIN;

    SP.injectBaseSEO({
      pageTitle: U.t(DATA.BRAND_NAME, lang) + ' \u2014 ' + U.t(META.tagline, lang),
      pageDesc:  U.t(META.description, lang),
      pageUrl:   baseUrl + '/',
      pageImage: baseUrl + META.ogImage
    });
  }

  /* ══════════════════════════════════════════
     Refresh Page (called by switchLanguage)
  ══════════════════════════════════════════ */

  function refreshPage() {
    buildHero();
    buildStatsBar();
    buildAboutPreview();
    buildCategoriesGrid();
    buildFeaturedProducts();
    buildSeasonCalendar();
    buildSeasonCalendarMobile();
    buildCertifications();
    buildCTA();
    buildFAQ();
    buildFooterContactText();
    injectSEO();
  }

  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */

  function init() {
    /* Register refresh callback BEFORE initPage */
    SP.registerPageRefresh(refreshPage);

    /* Initialize shared page infrastructure */
    SP.initPage({
      pageUrl:   'https://' + DATA.DOMAIN + '/',
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage,
      navMatchFn: function (href) {
        return href === './' || href === '/' || href.indexOf('index.html') !== -1;
      }
    });

    /* Build all page sections */
    buildHero();
    buildStatsBar();
    buildAboutPreview();
    buildCategoriesGrid();
    buildFeaturedProducts();
    buildSeasonCalendar();
    buildSeasonCalendarMobile();
    buildCertifications();
    buildCTA();
    buildFAQ();
    buildFooterContactText();

    /* Inject FAQ JSON-LD */
    SP.injectFaqSchema();
  }

  /* ── DOMContentLoaded ── */

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ── */

  return Object.freeze({ init: init });

})();
