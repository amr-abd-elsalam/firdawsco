/* ── Firdaws Import & Export Co. — About Page Controller ──
   Builds all 7 sections of about.html dynamically from COMPANY_DATA.
   Sections: Hero+Breadcrumb, Story, Mission, Values, Facilities,
   Certifications, CTA.
   Registers refreshPage() callback for instant bilingual switching.
   Uses Utils.el() for all DOM construction — zero innerHTML.
   ES5 strict mode — var only.
   ── End Summary ── */

'use strict';

var AboutApp = (function () {

  /* ── Guard & Aliases ── */

  var U    = window.Utils;
  var DATA = window.COMPANY_DATA;
  var SP   = window.SharedPage;

  if (!U || !DATA || !SP) {
    console.error('AboutApp: dependencies missing.');
    return null;
  }

  var META = DATA.META;

  /* ── Constants ── */

  var VALUE_ICONS = ['bi-award', 'bi-clock-history', 'bi-recycle', 'bi-globe-americas'];

  /* ══════════════════════════════════════════
     Builder 1: Breadcrumb
  ══════════════════════════════════════════ */

  function buildBreadcrumb() {
    var container = document.getElementById('about-breadcrumb');
    if (!container) return;

    var lang = U.getLang();
    U.clearChildren(container);

    var frag = document.createDocumentFragment();

    /* Home */
    frag.appendChild(
      U.el('li', null, [
        U.el('a', { href: './', textContent: U.t(META.nav.home, lang) })
      ])
    );

    /* About (current) */
    frag.appendChild(
      U.el('li', null, [
        U.el('span', { aria: { current: 'page' }, textContent: U.t(META.nav.about, lang) })
      ])
    );

    container.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 2: Page Header
  ══════════════════════════════════════════ */

  function buildPageHeader() {
    var lang = U.getLang();
    SP.setTextById('about-heading', U.t(META.aboutPage.title, lang));
    SP.setTextById('about-subtitle', U.t(META.description, lang));
  }

  /* ══════════════════════════════════════════
     Builder 3: Story
  ══════════════════════════════════════════ */

  function buildStory() {
    var lang = U.getLang();
    SP.setTextById('about-story-heading', U.t(META.aboutPage.story.title, lang));
    SP.setTextById('about-story-text', U.t(META.aboutPage.story.text, lang));
  }

  /* ══════════════════════════════════════════
     Builder 4: Mission
  ══════════════════════════════════════════ */

  function buildMission() {
    var lang = U.getLang();
    SP.setTextById('about-mission-heading', U.t(META.aboutPage.mission.title, lang));
    SP.setTextById('about-mission-text', U.t(META.aboutPage.mission.text, lang));
  }

  /* ══════════════════════════════════════════
     Builder 5: Values
  ══════════════════════════════════════════ */

  function buildValues() {
    var lang = U.getLang();

    SP.setTextById('about-values-heading', U.t(META.aboutPage.values.title, lang));

    var grid = document.getElementById('about-values-grid');
    if (!grid) return;

    U.clearChildren(grid);

    var items = META.aboutPage.values.items;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < items.length; i++) {
      var itemData = items[i][lang] || items[i].en;

      var col = U.el('div', { className: 'col-12 col-sm-6 col-lg-3' });

      var card = U.el('div', { className: 'fw-value-card' });

      card.appendChild(
        U.el('i', {
          className: 'bi ' + VALUE_ICONS[i],
          aria: { hidden: 'true' }
        })
      );

      card.appendChild(
        U.el('h3', { textContent: itemData.title })
      );

      card.appendChild(
        U.el('p', { textContent: itemData.text })
      );

      col.appendChild(card);
      frag.appendChild(col);
    }

    grid.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 6: Facilities
  ══════════════════════════════════════════ */

  function buildFacilities() {
    var lang = U.getLang();
    SP.setTextById('about-facilities-heading', U.t(META.aboutPage.facilities.title, lang));
    SP.setTextById('about-facilities-text', U.t(META.aboutPage.facilities.text, lang));
  }

  /* ══════════════════════════════════════════
     Builder 7: Certifications
  ══════════════════════════════════════════ */

  function buildCertifications() {
    var lang = U.getLang();

    SP.setTextById('about-certs-heading', U.t(META.certificationsSection.title, lang));
    SP.setTextById('about-certs-subtitle', U.t(META.certificationsSection.subtitle, lang));

    var grid = document.getElementById('about-certs-grid');
    if (!grid) return;

    U.clearChildren(grid);

    var frag = document.createDocumentFragment();

    DATA.certifications.forEach(function (cert) {
      var certData = cert[lang] || cert.en;

      var col = U.el('div', { className: 'col-6 col-md-4 col-lg' });

      var card = U.el('div', { className: 'fw-cert-card' });

      card.appendChild(
        U.el('img', {
          src:       U.sanitizeUrl(cert.logo),
          alt:       cert.altText ? U.t(cert.altText, lang) : certData.name,
          className: 'fw-cert-logo',
          loading:   'lazy',
          decoding:  'async',
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
    });

    grid.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 8: CTA
  ══════════════════════════════════════════ */

  function buildCTA() {
    var lang = U.getLang();

    SP.setTextById('about-cta-heading', U.t(META.ctaSection.title, lang));
    SP.setTextById('about-cta-text', U.t(META.ctaSection.text, lang));

    var btnEl = document.getElementById('about-cta-btn');
    if (btnEl) btnEl.textContent = U.t(META.ctaSection.btn, lang);
  }

  /* ══════════════════════════════════════════
     Builder 9: SEO Injection
  ══════════════════════════════════════════ */

  function injectSEO() {
    var lang = U.getLang();
    var baseUrl = 'https://' + DATA.DOMAIN;

    var descText = U.t(META.aboutPage.story.text, lang);
    var shortDesc = descText.length > 155 ? descText.substring(0, 155) + '...' : descText;

    SP.injectBaseSEO({
      pageTitle: U.t(META.aboutPage.title, lang) + ' \u2014 ' + U.t(DATA.BRAND_NAME, lang),
      pageDesc:  shortDesc,
      pageUrl:   baseUrl + '/about.html',
      pageImage: baseUrl + META.ogImage
    });

    /* BreadcrumbList JSON-LD (always English) */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': U.t(META.nav.home, 'en'), 'item': baseUrl + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': U.t(META.nav.about, 'en'), 'item': baseUrl + '/about.html' }
      ]
    }, 'schema-breadcrumb');
  }

  /* ══════════════════════════════════════════
     Refresh Page (called by switchLanguage)
  ══════════════════════════════════════════ */

  function refreshPage(lang) {
    buildBreadcrumb();
    buildPageHeader();
    buildStory();
    buildMission();
    buildValues();
    buildFacilities();
    buildCertifications();
    buildCTA();
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
      pageUrl:   'https://' + DATA.DOMAIN + '/about.html',
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage,
      navMatchFn: function (href) {
        return href.indexOf('about') !== -1;
      }
    });

    /* Build all page sections */
    buildBreadcrumb();
    buildPageHeader();
    buildStory();
    buildMission();
    buildValues();
    buildFacilities();
    buildCertifications();
    buildCTA();
    injectSEO();
  }

  /* ── DOMContentLoaded ── */

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ── */

  return Object.freeze({ init: init });

})();
