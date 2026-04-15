/* ── Firdaws Import & Export Co. — 404 Not Found Controller ──
   Minimal controller for 404.html — bilingual text + shared chrome.
   ES5 strict mode — var only.
   ── End Summary ── */

'use strict';

var NotFoundApp = (function () {

  /* ── Guard & Aliases ── */
  var U = window.Utils;
  var DATA = window.COMPANY_DATA;
  var SP = window.SharedPage;

  if (!U || !DATA || !SP) {
    console.error('NotFoundApp: dependencies missing.');
    return null;
  }

  var META = DATA.META;

  /* ══════════════════════════════════════════
     Builder: 404 Content
  ══════════════════════════════════════════ */
  function buildContent() {
    var lang = U.getLang();

    SP.setTextById('nf-title', U.t(META.notFound.title, lang));
    SP.setTextById('nf-text', U.t(META.notFound.text, lang));
    SP.setTextById('nf-home-text', U.t(META.notFound.goBack, lang));
  }

  /* ══════════════════════════════════════════
     Builder: SEO Injection
  ══════════════════════════════════════════ */
  function injectSEO() {
    var lang = U.getLang();
    SP.injectBaseSEO({
      pageTitle: U.t(META.notFound.title, lang) + ' \u2014 ' + U.t(DATA.BRAND_NAME, lang),
      pageDesc: U.t(META.notFound.text, lang),
      pageUrl: 'https://' + DATA.DOMAIN + '/404.html',
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage
    });
  }

  /* ══════════════════════════════════════════
     Refresh Page (called by switchLanguage)
  ══════════════════════════════════════════ */
  function refreshPage(lang) {
    buildContent();
    injectSEO();
  }

  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */
  function init() {
    /* Register refresh callback BEFORE initPage */
    SP.registerPageRefresh(refreshPage);

    /* Initialize shared page infrastructure — depth 0, default footerCategoryBase */
    SP.initPage({
      pageUrl: 'https://' + DATA.DOMAIN + '/404.html',
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage
    });

    /* Build page content */
    buildContent();
    injectSEO();
  }

  /* ── DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ── */
  return Object.freeze({
    init: init
  });

})();
