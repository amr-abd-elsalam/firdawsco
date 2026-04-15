/* ── Firdaws Import & Export Co. — Legal Pages Controller ──
   Shared controller for legal/privacy.html and legal/terms.html.
   Auto-detects page type via pathname.indexOf('terms').
   Builds TOC, intro note, numbered sections, and contact block
   dynamically from COMPANY_DATA.META.legalPage.
   Registers refreshPage() callback for instant bilingual switching.
   Uses Utils.el() for all DOM construction — zero innerHTML.
   ES5 strict mode — var only.
   ── End Summary ── */

'use strict';

var LegalApp = (function () {

  /* ── Guard & Aliases ── */

  var U    = window.Utils;
  var DATA = window.COMPANY_DATA;
  var SP   = window.SharedPage;

  if (!U || !DATA || !SP) {
    console.error('LegalApp: dependencies missing.');
    return null;
  }

  var META = DATA.META;

  /* ── Page Detection ── */

  var isTerms = window.location.pathname.indexOf('terms') !== -1;

  /* ── Helpers ── */

  function getPageData() {
    return isTerms ? META.legalPage.terms : META.legalPage.privacy;
  }

  function formatDate(dateStr, lang) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var year  = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day   = parseInt(parts[2], 10);

    if (lang === 'ar') {
      var arMonths = META.seasonCalendar.months.ar;
      return U.formatYear(day, 'ar') + ' ' + arMonths[month - 1] + ' ' + U.formatYear(year, 'ar');
    }

    var enMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return enMonths[month - 1] + ' ' + day + ', ' + year;
  }

  function padNumber(n) {
    return n < 10 ? '0' + n : String(n);
  }

  /* ══════════════════════════════════════════
     Builder: Breadcrumb
  ══════════════════════════════════════════ */

  function buildBreadcrumb() {
    var container = document.getElementById('legal-breadcrumb');
    if (!container) return;

    var lang = U.getLang();
    var pageData = getPageData();
    U.clearChildren(container);

    var frag = document.createDocumentFragment();

    /* Home */
    frag.appendChild(
      U.el('li', null, [
        U.el('a', { href: '../', textContent: U.t(META.nav.home, lang) })
      ])
    );

    /* Current page */
    frag.appendChild(
      U.el('li', null, [
        U.el('span', { aria: { current: 'page' }, textContent: U.t(pageData.title, lang) })
      ])
    );

    container.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: Page Header
  ══════════════════════════════════════════ */

  function buildPageHeader() {
    var lang = U.getLang();
    var pageData = getPageData();

    SP.setTextById('legal-heading', U.t(pageData.title, lang));

    /* Badge */
    var badgeEl = document.getElementById('legal-badge-text');
    if (badgeEl) {
      var spans = badgeEl.querySelectorAll('span');
      if (spans.length > 0) {
        spans[spans.length - 1].textContent = U.t(META.legalPage.legalBadge, lang);
      }
    }

    /* Last updated */
    var dateFormatted = formatDate(META.legalLastUpdated, lang);
    SP.setTextById('legal-last-updated',
      U.t(META.legalPage.lastUpdatedLabel, lang) + ': ' + dateFormatted
    );

    /* Applies to */
    SP.setTextById('legal-applies-to',
      U.t(META.legalPage.appliesTo, lang) + ': ' + DATA.DOMAIN
    );
  }

  /* ══════════════════════════════════════════
     Builder: TOC Navigation
  ══════════════════════════════════════════ */

  function buildTocNav() {
    var lang = U.getLang();
    var pageData = getPageData();

    SP.setTextById('legal-toc-title', U.t(META.legalPage.tocTitle, lang));

    var list = document.getElementById('legal-toc-list');
    if (!list) return;
    U.clearChildren(list);

    var frag = document.createDocumentFragment();
    var sections = pageData.sections;

    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var secData = sec[lang] || sec.en;
      frag.appendChild(
        U.el('li', null, [
          U.el('a', { href: '#section-' + sec.id, textContent: secData.heading })
        ])
      );
    }

    list.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: Intro Note
  ══════════════════════════════════════════ */

  function buildIntroNote() {
    var lang = U.getLang();
    var pageData = getPageData();
    SP.setTextById('legal-intro-text', U.t(pageData.introNote, lang));
  }

  /* ══════════════════════════════════════════
     Builder: Contact Block (appended to last section)
  ══════════════════════════════════════════ */

  function buildContactBlock() {
    var lang = U.getLang();
    var baseUrl = 'https://' + DATA.DOMAIN;

    var block = U.el('div', { className: 'fw-legal-contact-block' });

    /* Brand row */
    block.appendChild(
      U.el('div', { className: 'fw-legal-contact-row' }, [
        U.el('i', { className: 'bi bi-building', aria: { hidden: 'true' } }),
        U.el('span', null, [
          U.el('strong', { textContent: U.t(DATA.BRAND_NAME, lang) })
        ])
      ])
    );

    /* Domain row */
    block.appendChild(
      U.el('div', { className: 'fw-legal-contact-row' }, [
        U.el('i', { className: 'bi bi-globe', aria: { hidden: 'true' } }),
        U.el('span', null, [
          U.el('a', { href: U.sanitizeUrl(baseUrl), textContent: DATA.DOMAIN })
        ])
      ])
    );

    /* Email row */
    block.appendChild(
      U.el('div', { className: 'fw-legal-contact-row' }, [
        U.el('i', { className: 'bi bi-envelope-fill', aria: { hidden: 'true' } }),
        U.el('span', null, [
          U.el('a', { href: U.sanitizeUrl('mailto:' + META.supportEmail), textContent: META.supportEmail })
        ])
      ])
    );

    /* Phone row */
    block.appendChild(
      U.el('div', { className: 'fw-legal-contact-row' }, [
        U.el('i', { className: 'bi bi-telephone-fill', aria: { hidden: 'true' } }),
        U.el('span', null, [
          U.el('a', { href: U.sanitizeUrl('tel:+' + DATA.PHONE_NUMBER), textContent: U.formatPhoneDisplay(DATA.PHONE_NUMBER) })
        ])
      ])
    );

    /* WhatsApp row */
    block.appendChild(
      U.el('div', { className: 'fw-legal-contact-row' }, [
        U.el('i', { className: 'bi bi-whatsapp', aria: { hidden: 'true' } }),
        U.el('span', null, [
          U.el('a', {
            href: U.sanitizeUrl(SP.getDefaultWhatsAppUrl()),
            target: '_blank',
            rel: 'noopener noreferrer',
            textContent: U.formatPhoneDisplay(DATA.WHATSAPP_NUMBER)
          })
        ])
      ])
    );

    return block;
  }

  /* ══════════════════════════════════════════
     Builder: Sections
  ══════════════════════════════════════════ */

  function buildSections() {
    var container = document.getElementById('legal-sections');
    if (!container) return;

    var lang = U.getLang();
    var pageData = getPageData();
    U.clearChildren(container);

    var frag = document.createDocumentFragment();
    var sections = pageData.sections;

    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var secData = sec[lang] || sec.en;
      var sectionId = 'section-' + sec.id;
      var headingId = 'heading-' + sec.id;

      var sectionEl = U.el('section', {
        className: 'fw-legal-section',
        id: sectionId,
        aria: { labelledby: headingId }
      });

      /* Heading with number */
      sectionEl.appendChild(
        U.el('h2', { className: 'fw-legal-section-heading', id: headingId }, [
          U.el('span', {
            className: 'fw-legal-section-num',
            aria: { hidden: 'true' },
            textContent: padNumber(i + 1)
          }),
          document.createTextNode(secData.heading)
        ])
      );

      /* Content paragraph */
      sectionEl.appendChild(
        U.el('p', { textContent: secData.content })
      );

      /* If last section (contact), append contact block */
      if (sec.id === 'contact') {
        sectionEl.appendChild(buildContactBlock());
      }

      frag.appendChild(sectionEl);
    }

    container.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder: SEO Injection
  ══════════════════════════════════════════ */

  function injectSEO() {
    var lang = U.getLang();
    var baseUrl = 'https://' + DATA.DOMAIN;
    var pageData = getPageData();
    var pagePath = isTerms ? '/legal/terms.html' : '/legal/privacy.html';

    SP.injectBaseSEO({
      pageTitle: U.t(pageData.title, lang) + ' \u2014 ' + U.t(DATA.BRAND_NAME, lang),
      pageDesc:  U.t(pageData.introNote, lang).substring(0, 155) + '...',
      pageUrl:   baseUrl + pagePath,
      pageImage: baseUrl + META.ogImage
    });

    /* BreadcrumbList JSON-LD (always English) */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': U.t(META.nav.home, 'en'), 'item': baseUrl + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': U.t(pageData.title, 'en'), 'item': baseUrl + pagePath }
      ]
    }, 'schema-breadcrumb');

    /* WebPage JSON-LD */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': baseUrl + pagePath + '#webpage',
      'url': baseUrl + pagePath,
      'name': U.t(pageData.title, 'en') + ' \u2014 ' + U.t(DATA.BRAND_NAME, 'en'),
      'description': U.t(pageData.introNote, 'en').substring(0, 155) + '...',
      'isPartOf': { '@id': baseUrl + '/#website' },
      'inLanguage': lang === 'ar' ? 'ar' : 'en',
      'dateModified': META.legalLastUpdated || '2026-04-01'
    }, 'schema-webpage');
  }

  /* ══════════════════════════════════════════
     Refresh Page (called by switchLanguage)
  ══════════════════════════════════════════ */

  function refreshPage(lang) {
    buildBreadcrumb();
    buildPageHeader();
    buildTocNav();
    buildIntroNote();
    buildSections();
    injectSEO();
  }

  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */

  function init() {
    /* Register refresh callback BEFORE initPage */
    SP.registerPageRefresh(refreshPage);

    /* Initialize shared page infrastructure */
    var pagePath = isTerms ? '/legal/terms.html' : '/legal/privacy.html';

    SP.initPage({
      pageUrl:   'https://' + DATA.DOMAIN + pagePath,
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage,
      footerCategoryBase: '../products/',
      navMatchFn: function (href) { return false; }
    });

    /* Build above-the-fold sections immediately */
    buildBreadcrumb();
    buildPageHeader();
    injectSEO();

    /* Defer below-the-fold sections to unblock first paint */
    requestAnimationFrame(function () {
      buildTocNav();
      buildIntroNote();
      buildSections();

      /* Wire TOC smooth scroll — after sections exist */
      SP.initTocScroll('.fw-legal-toc');
    });
  }

  /* ── DOMContentLoaded ── */

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ── */

  return Object.freeze({ init: init });

})();
