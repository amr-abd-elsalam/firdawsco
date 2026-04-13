/* ── Firdaws Import & Export Co. — Products Catalog Controller ──
   Builds product catalog page: category filter + product cards grid.
   Reads ?category= from URL for initial filter state.
   Registers refreshPage() for instant bilingual switching.
   Uses Utils.el() for all DOM construction — zero innerHTML.
   ES5 strict mode — var only.
   ── End Summary ── */

'use strict';

var ProductsApp = (function () {

  /* ── Guard & Aliases ── */

  var U    = window.Utils;
  var DATA = window.COMPANY_DATA;
  var SP   = window.SharedPage;

  if (!U || !DATA || !SP) {
    console.error('ProductsApp: dependencies missing.');
    return null;
  }

  var META = DATA.META;

  /* ── Constants ── */

  var DETAILS_BASE = './details/?id=';
  var IMG_PREFIX   = '../';

  /* ── State ── */

  var _currentCategory = 'all';
  var _filterWired = false;

  /* ── Helpers ── */

  /**
   * Fix image path from root-relative to products/ relative.
   * './assets/img/...' → '../assets/img/...'
   */
  function fixImgPath(path) {
    if (typeof path !== 'string') return '';
    return path.replace(/^\.\//, IMG_PREFIX);
  }

  function getUrlCategory() {
    var cat = U.getQueryParam('category');
    if (!cat) return 'all';
    for (var i = 0; i < DATA.categories.length; i++) {
      if (DATA.categories[i].id === cat) return cat;
    }
    return 'all';
  }

  function findCategoryById(id) {
    for (var i = 0; i < DATA.categories.length; i++) {
      if (DATA.categories[i].id === id) return DATA.categories[i];
    }
    return null;
  }

  /* ══════════════════════════════════════════
     Builder: Breadcrumb
  ══════════════════════════════════════════ */

  function buildBreadcrumb() {
    var container = document.getElementById('products-breadcrumb');
    if (!container) return;

    var lang = U.getLang();
    clearChildren(container);

    var frag = document.createDocumentFragment();

    /* Home */
    frag.appendChild(
      U.el('li', null, [
        U.el('a', { href: '../', textContent: U.t(META.nav.home, lang) })
      ])
    );

    /* Products (current) */
    frag.appendChild(
      U.el('li', null, [
        U.el('span', { aria: { current: 'page' }, textContent: U.t(META.nav.products, lang) })
      ])
    );

    container.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: Page Header
  ══════════════════════════════════════════ */

  function buildPageHeader() {
    var lang = U.getLang();
    SP.setTextById('products-heading', U.t(META.productsSection.title, lang));
    SP.setTextById('products-subtitle', U.t(META.productsSection.subtitle, lang));
  }

  /* ══════════════════════════════════════════
     Builder: Filter Bar
  ══════════════════════════════════════════ */

  function buildFilterBar() {
    var container = document.getElementById('filter-bar');
    if (!container) return;

    var lang = U.getLang();
    clearChildren(container);

    var frag = document.createDocumentFragment();

    /* "All Products" button with total count */
    var allBtn = U.el('button', {
      type: 'button',
      className: 'fw-filter-btn' + (_currentCategory === 'all' ? ' active' : ''),
      dataset: { category: 'all' }
    }, [
      U.t(META.productsSection.all, lang),
      U.el('span', {
        className: 'fw-filter-count',
        textContent: String(DATA.products.length)
      })
    ]);
    frag.appendChild(allBtn);

    /* Category buttons with count badges */
    DATA.categories.forEach(function (cat) {
      var catName = cat[lang] ? cat[lang].name : cat.en.name;
      var count = U.countProductsInCategory(cat.id);
      var btn = U.el('button', {
        type: 'button',
        className: 'fw-filter-btn' + (_currentCategory === cat.id ? ' active' : ''),
        dataset: { category: cat.id }
      }, [
        catName,
        U.el('span', {
          className: 'fw-filter-count',
          textContent: String(count)
        })
      ]);
      frag.appendChild(btn);
    });

    container.appendChild(frag);

    /* Wire event delegation — once only */
    if (!_filterWired) {
      container.addEventListener('click', function (e) {
        var btn = e.target.closest('.fw-filter-btn');
        if (!btn) return;
        var catId = btn.dataset.category;
        if (catId && catId !== _currentCategory) {
          setCategory(catId);
        }
      });
      _filterWired = true;
    }
  }

  /* ══════════════════════════════════════════
     Builder: Product Card
  ══════════════════════════════════════════ */

  function buildProductCard(product) {
    var lang = U.getLang();
    var prodData = product[lang] || product.en;
    var inSeason = U.isInSeason(product);

    var col = U.el('div', { className: 'col-12 col-sm-6 col-md-4 col-lg-3' });

    var card = U.el('article', { className: 'fw-product-card' });

    /* Image */
    card.appendChild(
      U.el('img', {
        src:     U.sanitizeUrl(fixImgPath(product.image)),
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
        textContent: U.t(META.productsSection.viewDetails, lang)
      })
    );
    body.appendChild(footer);

    card.appendChild(body);
    col.appendChild(card);
    return col;
  }

  /* ══════════════════════════════════════════
     Builder: Products Grid
  ══════════════════════════════════════════ */

  function buildProductsGrid() {
    var container = document.getElementById('products-grid');
    var emptyEl   = document.getElementById('products-empty');
    var emptyText = document.getElementById('products-empty-text');
    if (!container) return;

    var lang = U.getLang();
    clearChildren(container);

    /* Filter products */
    var filtered = [];
    for (var i = 0; i < DATA.products.length; i++) {
      if (_currentCategory === 'all' || DATA.products[i].categoryId === _currentCategory) {
        filtered.push(DATA.products[i]);
      }
    }

    if (filtered.length === 0) {
      container.classList.add('d-none');
      if (emptyEl) emptyEl.classList.remove('d-none');
      if (emptyText) emptyText.textContent = U.t(META.productsSection.noResults, lang);
      return;
    }

    container.classList.remove('d-none');
    if (emptyEl) emptyEl.classList.add('d-none');

    var frag = document.createDocumentFragment();
    for (var j = 0; j < filtered.length; j++) {
      frag.appendChild(buildProductCard(filtered[j]));
    }
    container.appendChild(frag);

    U.announce(filtered.length + ' ' + U.t(META.productsSection.productsLabel, lang));
  }

  /* ══════════════════════════════════════════
     Set Category (filter change)
  ══════════════════════════════════════════ */

  function setCategory(categoryId) {
    _currentCategory = categoryId;

    /* Update URL without reload */
    if (history.replaceState) {
      var newUrl = categoryId === 'all' ? './' : './?category=' + encodeURIComponent(categoryId);
      history.replaceState(null, '', newUrl);
    }

    buildFilterBar();
    buildProductsGrid();
  }

  /* ══════════════════════════════════════════
     Builder: CTA
  ══════════════════════════════════════════ */

  function buildCTA() {
    var lang = U.getLang();
    SP.setTextById('products-cta-heading', U.t(META.ctaSection.title, lang));
    SP.setTextById('products-cta-text', U.t(META.ctaSection.text, lang));
    var btnEl = document.getElementById('products-cta-btn');
    if (btnEl) btnEl.textContent = U.t(META.ctaSection.btn, lang);
  }

  /* ══════════════════════════════════════════
     Builder: SEO Injection
  ══════════════════════════════════════════ */

  function injectSEO() {
    var lang = U.getLang();
    var baseUrl = 'https://' + DATA.DOMAIN;

    SP.injectBaseSEO({
      pageTitle: U.t(META.productsSection.title, lang) + ' \u2014 ' + U.t(DATA.BRAND_NAME, lang),
      pageDesc:  U.t(META.productsSection.subtitle, lang),
      pageUrl:   baseUrl + '/products/',
      pageImage: baseUrl + META.ogImage
    });

    /* BreadcrumbList JSON-LD */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': U.t(META.nav.home, 'en'), 'item': baseUrl + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': U.t(META.nav.products, 'en'), 'item': baseUrl + '/products/' }
      ]
    }, 'schema-breadcrumb');
  }

  /* ══════════════════════════════════════════
     Refresh Page (called by switchLanguage)
  ══════════════════════════════════════════ */

  function refreshPage(lang) {
    buildBreadcrumb();
    buildPageHeader();
    buildFilterBar();
    buildProductsGrid();
    buildCTA();
    injectSEO();
  }

  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */

  function init() {
    _currentCategory = getUrlCategory();

    /* Register refresh callback BEFORE initPage */
    SP.registerPageRefresh(refreshPage);

    /* Initialize shared page infrastructure */
    SP.initPage({
      pageUrl:   'https://' + DATA.DOMAIN + '/products/',
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage,
      footerCategoryBase: './',
      navMatchFn: function (href) {
        return href.indexOf('products') !== -1 && href.indexOf('details') === -1;
      }
    });

    /* Build all page sections */
    buildBreadcrumb();
    buildPageHeader();
    buildFilterBar();
    buildProductsGrid();
    buildCTA();
  }

  /* ── DOMContentLoaded ── */

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ── */

  return Object.freeze({ init: init });

})();
