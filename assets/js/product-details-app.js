/* ── Firdaws Import & Export Co. — Product Details Controller ──
   Builds single product detail page from ?id= URL parameter.
   Sections: hero, specs table, packaging, certifications, related products.
   Registers refreshPage() for instant bilingual switching.
   Uses Utils.el() for all DOM construction — zero innerHTML.
   ES5 strict mode — var only.
   ── End Summary ── */

'use strict';

var ProductDetailsApp = (function () {

  /* ── Guard & Aliases ── */

  var U    = window.Utils;
  var DATA = window.COMPANY_DATA;
  var SP   = window.SharedPage;

  if (!U || !DATA || !SP) {
    console.error('ProductDetailsApp: dependencies missing.');
    return null;
  }

  var META = DATA.META;

  /* ── Constants ── */

  var CATALOG_URL   = '../';
  var DETAILS_BASE  = './?id=';
  var IMG_PREFIX    = '../../';
  var RELATED_MAX   = 4;

  /* ── Section IDs for show/hide ── */

  var CONTENT_SECTIONS = [
    'pd-hero-section',
    'pd-specs-section',
    'pd-certs-section',
    'pd-related-section',
    'pd-cta-section'
  ];

  /* ── Helpers ── */

  /**
   * Fix image path from root-relative to products/details/ relative.
   * './assets/img/...' → '../../assets/img/...'
   */
  function fixImgPath(path) {
    if (typeof path !== 'string') return '';
    return path.replace(/^\.\//, IMG_PREFIX);
  }

  function getProductFromUrl() {
    var id = U.getQueryParam('id');
    if (!id) return null;
    for (var i = 0; i < DATA.products.length; i++) {
      if (DATA.products[i].id === id) return DATA.products[i];
    }
    return null;
  }

  function findCategoryById(id) {
    for (var i = 0; i < DATA.categories.length; i++) {
      if (DATA.categories[i].id === id) return DATA.categories[i];
    }
    return null;
  }

  function getProductCerts(product) {
    var certs = [];
    for (var i = 0; i < product.certifications.length; i++) {
      for (var j = 0; j < DATA.certifications.length; j++) {
        if (DATA.certifications[j].id === product.certifications[i]) {
          certs.push(DATA.certifications[j]);
          break;
        }
      }
    }
    return certs;
  }

  function getRelatedProducts(product) {
    var related = [];
    for (var i = 0; i < DATA.products.length; i++) {
      if (DATA.products[i].categoryId === product.categoryId && DATA.products[i].id !== product.id) {
        related.push(DATA.products[i]);
      }
      if (related.length >= RELATED_MAX) break;
    }
    return related;
  }

  /* ══════════════════════════════════════════
     Show / Hide Content Sections
  ══════════════════════════════════════════ */

  function showContentSections() {
    var notFound = document.getElementById('pd-not-found');
    if (notFound) notFound.classList.add('d-none');
    for (var i = 0; i < CONTENT_SECTIONS.length; i++) {
      var sec = document.getElementById(CONTENT_SECTIONS[i]);
      if (sec) sec.classList.remove('d-none');
    }
  }

  function hideContentSections() {
    for (var i = 0; i < CONTENT_SECTIONS.length; i++) {
      var sec = document.getElementById(CONTENT_SECTIONS[i]);
      if (sec) sec.classList.add('d-none');
    }
  }

  /* ══════════════════════════════════════════
     Builder: Not Found
  ══════════════════════════════════════════ */

  function buildNotFound() {
    var lang = U.getLang();
    hideContentSections();

    var notFound = document.getElementById('pd-not-found');
    if (notFound) {
      notFound.classList.remove('d-none');
      SP.setTextById('pd-not-found-title', U.t(META.notFound.title, lang));
      SP.setTextById('pd-not-found-text', U.t(META.notFound.text, lang));

      var link = document.getElementById('pd-not-found-link');
      if (link) link.textContent = U.t(META.productDetails.backToProducts, lang);
    }
  }

  /* ══════════════════════════════════════════
     Builder: Breadcrumb
  ══════════════════════════════════════════ */

  function buildBreadcrumb(product, category) {
    var container = document.getElementById('pd-breadcrumb');
    if (!container) return;

    var lang = U.getLang();
    U.clearChildren(container);

    var frag = document.createDocumentFragment();

    /* Home */
    frag.appendChild(
      U.el('li', null, [
        U.el('a', { href: '../../', textContent: U.t(META.nav.home, lang) })
      ])
    );

    /* Products */
    frag.appendChild(
      U.el('li', null, [
        U.el('a', { href: '../', textContent: U.t(META.nav.products, lang) })
      ])
    );

    /* Category */
    var catName = category[lang] ? category[lang].name : category.en.name;
    frag.appendChild(
      U.el('li', null, [
        U.el('a', {
          href: U.sanitizeUrl('../?category=' + encodeURIComponent(category.id)),
          textContent: catName
        })
      ])
    );

    /* Current product */
    var prodName = product[lang] ? product[lang].name : product.en.name;
    frag.appendChild(
      U.el('li', null, [
        U.el('span', { aria: { current: 'page' }, textContent: prodName })
      ])
    );

    container.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: Product Hero
  ══════════════════════════════════════════ */

  function buildProductHero(product) {
    var lang = U.getLang();
    var prodData = product[lang] || product.en;
    var inSeason = U.isInSeason(product);

    /* Image */
    var imgEl = document.getElementById('pd-image');
    if (imgEl) {
      imgEl.setAttribute('src', U.sanitizeUrl(fixImgPath(product.image)));
      imgEl.setAttribute('alt', prodData.name);
    }

    /* Season badge */
    var badge = document.getElementById('pd-season-badge');
    if (badge) {
      if (inSeason) {
        badge.classList.remove('d-none');
        badge.textContent = U.t(META.productsSection.inSeason, lang);
      } else {
        badge.classList.add('d-none');
      }
    }

    /* Name + Description */
    SP.setTextById('pd-name', prodData.name);
    SP.setTextById('pd-description', prodData.description);

    /* Varieties */
    SP.setTextById('pd-varieties-title', U.t(META.productDetails.varieties, lang));
    var varietiesList = document.getElementById('pd-varieties-list');
    if (varietiesList) {
      U.clearChildren(varietiesList);
      var varieties = prodData.varieties || [];
      var frag = document.createDocumentFragment();
      for (var i = 0; i < varieties.length; i++) {
        frag.appendChild(U.el('li', { textContent: varieties[i] }));
      }
      varietiesList.appendChild(frag);
    }

    /* Quote button (WhatsApp) — always use English name */
    var quoteBtn = document.getElementById('pd-quote-btn');
    if (quoteBtn) {
      quoteBtn.href = U.sanitizeUrl(SP.buildProductWhatsAppUrl(product.en.name));
    }
    SP.setTextById('pd-quote-text', U.t(META.productDetails.requestQuote, lang));
  }

  /* ══════════════════════════════════════════
     Builder: Specs Table
  ══════════════════════════════════════════ */

  function buildSpecsTable(product) {
    var lang = U.getLang();
    var prodData = product[lang] || product.en;

    SP.setTextById('pd-specs-heading', U.t(META.productDetails.specifications, lang));

    var tbody = document.getElementById('pd-specs-body');
    if (!tbody) return;

    U.clearChildren(tbody);

    var rows = [
      { label: META.productDetails.caliber, value: prodData.specs.caliber },
      { label: META.productDetails.brix,    value: prodData.specs.brix },
      { label: META.productDetails.color,   value: prodData.specs.color },
      { label: META.productDetails.season,  value: U.seasonText(product, lang) },
      { label: META.productDetails.shelfLife, value: product.shelfLife },
      { label: META.productDetails.minOrder,  value: product.minOrder },
      { label: META.productDetails.hsCode,    value: product.hsCode }
    ];

    var frag = document.createDocumentFragment();
    for (var i = 0; i < rows.length; i++) {
      var tr = U.el('tr', null, [
        U.el('th', { textContent: U.t(rows[i].label, lang) }),
        U.el('td', { textContent: rows[i].value || '' })
      ]);
      frag.appendChild(tr);
    }

    tbody.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: Packaging
  ══════════════════════════════════════════ */

  function buildPackaging(product) {
    var lang = U.getLang();

    SP.setTextById('pd-packaging-title', U.t(META.productDetails.packaging, lang));

    var list = document.getElementById('pd-packaging-list');
    if (!list) return;

    U.clearChildren(list);

    var options = product.packagingOptions || [];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < options.length; i++) {
      frag.appendChild(U.el('li', { textContent: options[i] }));
    }

    list.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: Certifications
  ══════════════════════════════════════════ */

  function buildCertifications(product) {
    var lang = U.getLang();

    SP.setTextById('pd-certs-heading', U.t(META.productDetails.certifications, lang));

    var grid = document.getElementById('pd-certs-grid');
    if (!grid) return;

    U.clearChildren(grid);

    var certs = getProductCerts(product);
    var frag = document.createDocumentFragment();

    for (var i = 0; i < certs.length; i++) {
      var cert = certs[i];
      var certData = cert[lang] || cert.en;

      var col = U.el('div', { className: 'col-6 col-md-4 col-lg' });

      var card = U.el('div', { className: 'fw-cert-card' });

      card.appendChild(
        U.el('img', {
          src:       U.sanitizeUrl(fixImgPath(cert.logo)),
          alt:       certData.name,
          className: 'fw-cert-logo',
          loading:   'lazy',
          width:     '80',
          height:    '60'
        })
      );

      card.appendChild(
        U.el('h3', { textContent: certData.name })
      );

      card.appendChild(
        U.el('p', { textContent: certData.desc })
      );

      col.appendChild(card);
      frag.appendChild(col);
    }

    grid.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: Related Products
  ══════════════════════════════════════════ */

  function buildRelatedProducts(product) {
    var lang = U.getLang();

    SP.setTextById('pd-related-heading', U.t(META.productDetails.relatedProducts, lang));

    var grid = document.getElementById('pd-related-grid');
    if (!grid) return;

    U.clearChildren(grid);

    var related = getRelatedProducts(product);
    var frag = document.createDocumentFragment();

    for (var i = 0; i < related.length; i++) {
      var rel = related[i];
      var relData = rel[lang] || rel.en;
      var inSeason = U.isInSeason(rel);

      var col = U.el('div', { className: 'col-12 col-sm-6 col-md-4 col-lg-3' });

      var card = U.el('article', { className: 'fw-product-card' });

      /* Image */
      card.appendChild(
        U.el('img', {
          src:     U.sanitizeUrl(fixImgPath(rel.image)),
          alt:     relData.name,
          loading: 'lazy',
          width:   '400',
          height:  '300'
        })
      );

      /* Card Body */
      var body = U.el('div', { className: 'fw-product-card-body' });

      if (inSeason) {
        body.appendChild(
          U.el('span', {
            className:   'fw-product-badge fw-badge-season',
            textContent: U.t(META.productsSection.inSeason, lang)
          })
        );
      }

      body.appendChild(U.el('h3', { textContent: relData.name }));
      body.appendChild(U.el('p', { textContent: U.seasonText(rel, lang) }));

      var footer = U.el('div', { className: 'fw-product-card-footer' });
      footer.appendChild(
        U.el('a', {
          href:        U.sanitizeUrl(DETAILS_BASE + encodeURIComponent(rel.id)),
          className:   'btn btn-sm fw-btn-outline',
          textContent: U.t(META.productsSection.viewDetails, lang)
        })
      );
      body.appendChild(footer);

      card.appendChild(body);
      col.appendChild(card);
      frag.appendChild(col);
    }

    grid.appendChild(frag);

    /* Back button */
    var backBtn = document.getElementById('pd-back-btn');
    if (backBtn) backBtn.textContent = U.t(META.productDetails.backToProducts, lang);
  }

  /* ══════════════════════════════════════════
     Builder: Sticky CTA (Mobile)
  ══════════════════════════════════════════ */
  var _stickyWired = false;

  function buildStickyCTA(product) {
    var container = document.getElementById('pd-sticky-cta');
    if (!container) return;

    var lang = U.getLang();
    U.clearChildren(container);

    /* Build WhatsApp button */
    var waUrl = SP.buildProductWhatsAppUrl(product.en.name);
    var btn = U.el('a', {
      href: U.sanitizeUrl(waUrl),
      target: '_blank',
      rel: 'noopener noreferrer',
      className: 'fw-btn-whatsapp'
    }, [
      U.el('i', { className: 'bi bi-whatsapp', aria: { hidden: 'true' } }),
      U.t(META.productDetails.requestQuote, lang)
    ]);

    container.appendChild(btn);

    /* Add body class for repositioning floats */
    document.body.classList.add('has-sticky-cta');

    /* Show/hide on scroll — only wire once */
    if (!_stickyWired) {
      var heroSection = document.getElementById('pd-hero-section');

      window.addEventListener('scroll', U.throttle(function () {
        if (!heroSection) return;
        var heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
          container.classList.add('visible');
        } else {
          container.classList.remove('visible');
        }
      }, 150));

      _stickyWired = true;
    }
  }

  /* ══════════════════════════════════════════
     Builder: CTA
  ══════════════════════════════════════════ */

  function buildCTA() {
    var lang = U.getLang();
    SP.setTextById('pd-cta-heading', U.t(META.ctaSection.title, lang));
    SP.setTextById('pd-cta-text', U.t(META.ctaSection.text, lang));
    var btnEl = document.getElementById('pd-cta-btn');
    if (btnEl) btnEl.textContent = U.t(META.ctaSection.btn, lang);
  }

  /* ══════════════════════════════════════════
     Builder: SEO Injection
  ══════════════════════════════════════════ */

  function injectSEO(product, category) {
    var lang = U.getLang();
    var baseUrl = 'https://' + DATA.DOMAIN;
    var prodName = product[lang] ? product[lang].name : product.en.name;
    var prodDesc = product[lang] ? product[lang].description : product.en.description;
    var shortDesc = prodDesc.length > 155 ? prodDesc.substring(0, 155) + '...' : prodDesc;
    var imageUrl = baseUrl + '/' + product.image.replace('./', '');

    SP.injectBaseSEO({
      pageTitle: prodName + ' \u2014 ' + U.t(DATA.BRAND_NAME, lang),
      pageDesc:  shortDesc,
      pageUrl:   baseUrl + '/products/details/?id=' + product.id,
      pageImage: imageUrl
    });

    /* Set og:type to product (default in HTML is "website") */
    SP.setAttrById('og-type', 'content', 'product');

    /* Product JSON-LD (always English) */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.en.name,
      'description': product.en.description,
      'image': imageUrl,
      'sku': product.hsCode,
      'brand': {
        '@type': 'Brand',
        'name': U.t(DATA.BRAND_NAME, 'en')
      },
      'category': category.en.name,
      'manufacturer': {
        '@type': 'Organization',
        'name': U.t(DATA.BRAND_NAME, 'en'),
        'url': baseUrl
      },
      'countryOfOrigin': {
        '@type': 'Country',
        'name': 'Egypt'
      },
      'additionalProperty': [
        { '@type': 'PropertyValue', 'name': 'HS Code', 'value': product.hsCode },
        { '@type': 'PropertyValue', 'name': 'Caliber', 'value': product.en.specs.caliber },
        { '@type': 'PropertyValue', 'name': 'Brix', 'value': product.en.specs.brix },
        { '@type': 'PropertyValue', 'name': 'Season', 'value': U.seasonText(product, 'en') },
        { '@type': 'PropertyValue', 'name': 'Shelf Life', 'value': product.shelfLife },
        { '@type': 'PropertyValue', 'name': 'Minimum Order', 'value': product.minOrder }
      ]
    }, 'schema-product');

    /* BreadcrumbList JSON-LD (always English) */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': baseUrl + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Products', 'item': baseUrl + '/products/' },
        { '@type': 'ListItem', 'position': 3, 'name': category.en.name, 'item': baseUrl + '/products/?category=' + category.id },
        { '@type': 'ListItem', 'position': 4, 'name': product.en.name, 'item': baseUrl + '/products/details/?id=' + product.id }
      ]
    }, 'schema-breadcrumb');
  }

  /* ══════════════════════════════════════════
     Refresh Page (called by switchLanguage)
  ══════════════════════════════════════════ */

  function refreshPage(lang) {
    var product = getProductFromUrl();
    if (!product) {
      buildNotFound();
      return;
    }

    var category = findCategoryById(product.categoryId);
    showContentSections();
    buildBreadcrumb(product, category);
    buildProductHero(product);
    buildSpecsTable(product);
    buildPackaging(product);
    buildCertifications(product);
    buildRelatedProducts(product);
    buildStickyCTA(product);
    buildCTA();
    injectSEO(product, category);
  }

  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */

  function init() {
    var product = getProductFromUrl();

    /* Register refresh callback BEFORE initPage */
    SP.registerPageRefresh(refreshPage);

    /* Initialize shared page infrastructure */
    SP.initPage({
      pageUrl:   'https://' + DATA.DOMAIN + '/products/details/' + (product ? '?id=' + product.id : ''),
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage,
      footerCategoryBase: '../',
      navMatchFn: function (href) {
        return href.indexOf('products') !== -1;
      }
    });

    if (!product) {
      buildNotFound();
      return;
    }

    var category = findCategoryById(product.categoryId);

    showContentSections();
    buildBreadcrumb(product, category);
    buildProductHero(product);
    buildSpecsTable(product);
    buildPackaging(product);
    buildCertifications(product);
    buildRelatedProducts(product);
    buildStickyCTA(product);
    buildCTA();
  }

  /* ── DOMContentLoaded ── */

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ── */

  return Object.freeze({ init: init });

})();
