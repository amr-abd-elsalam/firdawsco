/* ── Firdaws Import & Export Co. — Shared Page Infrastructure ──
   Builds common page chrome: navbar brand + nav links, footer,
   WhatsApp float, back-to-top, language switcher, SEO injection,
   JSON-LD, copyright. All bilingual-aware — reads from COMPANY_DATA
   via Utils.t(). switchLanguage() is the central orchestrator.
   ── End Summary ── */

'use strict';

var SharedPage = (function () {

  var U    = window.Utils;
  var DATA = window.COMPANY_DATA;

  if (!U || !DATA) {
    console.error('SharedPage: dependencies missing (Utils or COMPANY_DATA).');
    return null;
  }

  var META = DATA.META;

  /* Page-specific refresh callback — set by each page controller */
  var _pageRefreshCallback = null;

  /* Flag to ensure lang switcher listener is wired only once */
  var _langSwitcherWired = false;

  /* ── DOM Helpers ── */

  function setTextById(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = (text != null) ? text : '';
  }

  function setHrefById(id, href) {
    var el = document.getElementById(id);
    if (el) el.href = U.sanitizeUrl(href);
  }

  function setAttrById(id, attr, val) {
    var el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  }

  /* ── URL Builders ── */

  function buildWhatsAppUrl(phone, message) {
    var base = 'https://wa.me/' + encodeURIComponent(phone);
    if (message) base += '?text=' + encodeURIComponent(message);
    return U.sanitizeUrl(base);
  }

  function getDefaultWhatsAppUrl() {
    return buildWhatsAppUrl(DATA.WHATSAPP_NUMBER, U.t(META.whatsapp.general));
  }

  function buildProductWhatsAppUrl(productName) {
    var template = U.t(META.whatsapp.product);
    var msg = template.replace('{product}', productName);
    return buildWhatsAppUrl(DATA.WHATSAPP_NUMBER, msg);
  }

  /* ── Copyright Builder (bilingual) ── */

  function buildCopyrightText() {
    var lang = U.getLang();
    var year = U.formatYear(new Date().getFullYear(), lang);
    var template = U.t(META.footer.copyright);
    return template.replace('{year}', year);
  }

  /* ── Nav Brand (bilingual) ── */

  function buildNavBrand() {
    setTextById('nav-brand-name', U.t(DATA.BRAND_NAME));
  }

  /* ── Nav Links (bilingual) ── */

  function buildNavLinks() {
    setTextById('nav-home', U.t(META.nav.home));
    setTextById('nav-products', U.t(META.nav.products));
    setTextById('nav-about', U.t(META.nav.about));
    setTextById('nav-contact', U.t(META.nav.contact));
  }

  /* ── Language Switcher ── */

  function buildLangSwitcher() {
    var btn = document.getElementById('lang-switch');
    if (!btn) return;

    /* Update button text */
    btn.textContent = U.t(META.langSwitch);

    /* Wire click handler only once */
    if (!_langSwitcherWired) {
      btn.addEventListener('click', function () {
        var currentLang = U.getLang();
        var newLang = currentLang === 'en' ? 'ar' : 'en';
        switchLanguage(newLang);
      });
      _langSwitcherWired = true;
    }
  }

  /* ── Language Switch — Central Orchestrator ── */

  function switchLanguage(lang) {
    /* (a) Save to localStorage */
    try { localStorage.setItem('lang', lang); } catch (e) {}

    /* (b) Update <html dir> and <html lang> */
    var html = document.documentElement;
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);

    /* (c) Swap Bootstrap CSS (LTR ↔ RTL) */
    var bsLink = document.getElementById('bootstrap-css');
    if (bsLink) {
      var currentHref = bsLink.getAttribute('href');
      if (lang === 'ar' && currentHref.indexOf('bootstrap.rtl.min.css') === -1) {
        bsLink.setAttribute('href', currentHref.replace('bootstrap.min.css', 'bootstrap.rtl.min.css'));
      } else if (lang === 'en' && currentHref.indexOf('bootstrap.rtl.min.css') !== -1) {
        bsLink.setAttribute('href', currentHref.replace('bootstrap.rtl.min.css', 'bootstrap.min.css'));
      }
    }

    /* (d) Update font CSS variable */
    var fontBody = lang === 'ar' ? "var(--fw-font-ar)" : "var(--fw-font-en)";
    html.style.setProperty('--fw-font-body', fontBody);

    /* (e) Re-render shared UI */
    buildNavBrand();
    buildNavLinks();
    setTextById('lang-switch', U.t(META.langSwitch, lang));
    buildFooter();
    buildWhatsAppFloat();
    updateBackToTopLabel();

    /* (f) Call page-specific refresh */
    if (typeof _pageRefreshCallback === 'function') {
      _pageRefreshCallback(lang);
    }

    /* (g) Announce to screen readers */
    U.announce(lang === 'ar' ? 'تم التبديل إلى العربية' : 'Switched to English');
  }

  /* ── Footer Builder (bilingual) ── */

  function buildFooter() {
    setTextById('footer-brand-name', U.t(DATA.BRAND_NAME));
    setTextById('footer-tagline', U.t(META.footer.tagline));
    setTextById('footer-quick-title', U.t(META.footer.quickLinks));
    setTextById('footer-categories-title', U.t(META.footer.categories));
    setTextById('footer-contact-title', U.t(META.footer.contact));
    setTextById('footer-address', U.t(DATA.ADDRESS));
    setTextById('footer-copyright', buildCopyrightText());

    /* Phone link */
    setHrefById('footer-phone-link', 'tel:+' + DATA.PHONE_NUMBER);

    /* WhatsApp link */
    setHrefById('footer-whatsapp-link', getDefaultWhatsAppUrl());

    /* Email link */
    setHrefById('footer-email-link', 'mailto:' + META.supportEmail);

    /* Quick links — update text per language */
    var quickLinks = document.getElementById('footer-quick-links');
    if (quickLinks) {
      var links = quickLinks.querySelectorAll('a');
      var navKeys = ['home', 'products', 'about', 'contact'];
      for (var i = 0; i < links.length && i < navKeys.length; i++) {
        links[i].textContent = U.t(META.nav[navKeys[i]]);
      }
    }

    /* Category links — rebuild from data */
    buildFooterCategories();

    /* Legal links */
    var privacyLink = document.querySelector('[data-legal="privacy"]');
    var termsLink = document.querySelector('[data-legal="terms"]');
    if (privacyLink) privacyLink.textContent = U.t(META.legal.privacy);
    if (termsLink) termsLink.textContent = U.t(META.legal.terms);
  }

  /* ── Footer Category Links ── */

  function buildFooterCategories() {
    var container = document.getElementById('footer-categories');
    if (!container) return;

    var lang = U.getLang();

    /* Clear existing */
    while (container.firstChild) container.removeChild(container.firstChild);

    /* Build new */
    var frag = document.createDocumentFragment();
    DATA.categories.forEach(function (cat) {
      var href = './products/?category=' + encodeURIComponent(cat.id);
      var catName = cat[lang] ? cat[lang].name : (cat.en ? cat.en.name : cat.id);
      frag.appendChild(
        U.el('li', null, [
          U.el('a', { href: U.sanitizeUrl(href), textContent: catName })
        ])
      );
    });

    container.appendChild(frag);
  }

  /* ── WhatsApp Float ── */

  function buildWhatsAppFloat() {
    var url = getDefaultWhatsAppUrl();
    setHrefById('whatsapp-float', url);
    var floatEl = document.getElementById('whatsapp-float');
    if (floatEl) {
      floatEl.setAttribute('aria-label', U.getLang() === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp');
      floatEl.setAttribute('target', '_blank');
      floatEl.setAttribute('rel', 'noopener noreferrer');
    }
  }

  /* ── Back to Top ── */

  var _backToTopWired = false;

  function updateBackToTopLabel() {
    var btn = document.getElementById('back-to-top');
    if (btn) btn.setAttribute('aria-label', U.t(META.backToTop));
  }

  function buildBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    updateBackToTopLabel();

    if (!_backToTopWired) {
      window.addEventListener('scroll', U.throttle(function () {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      }, 200));

      btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      _backToTopWired = true;
    }
  }

  /* ── SEO Injection ── */

  function injectBaseSEO(config) {
    config = config || {};
    var lang = U.getLang();
    var pageTitle = config.pageTitle || (U.t(DATA.BRAND_NAME) + ' — ' + U.t(META.tagline));
    var pageDesc = config.pageDesc || U.t(META.description);
    var pageUrl = config.pageUrl || ('https://' + DATA.DOMAIN + '/');
    var pageImage = config.pageImage || ('https://' + DATA.DOMAIN + META.ogImage);

    document.title = pageTitle;

    setAttrById('page-desc', 'content', pageDesc);
    setAttrById('page-canonical', 'href', pageUrl);

    /* Open Graph */
    setAttrById('og-url', 'content', pageUrl);
    setAttrById('og-title', 'content', pageTitle);
    setAttrById('og-desc', 'content', pageDesc);
    setAttrById('og-image', 'content', pageImage);
    setAttrById('og-site-name', 'content', U.t(DATA.BRAND_NAME));

    /* Twitter Card */
    setAttrById('tw-title', 'content', pageTitle);
    setAttrById('tw-desc', 'content', pageDesc);
    setAttrById('tw-image', 'content', pageImage);

    /* hreflang */
    setAttrById('hreflang-en', 'href', pageUrl);
    setAttrById('hreflang-ar', 'href', pageUrl);
  }

  /* ── JSON-LD Injection ── */

  function injectJsonLd(schema, id) {
    /* Remove existing if same id */
    if (id) {
      var existing = document.getElementById(id);
      if (existing) existing.parentNode.removeChild(existing);
    }
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    if (id) script.id = id;
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  /* ── Organization JSON-LD ── */

  function injectOrganizationSchema() {
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: U.t(DATA.BRAND_NAME, 'en'),
      alternateName: U.t(DATA.BRAND_NAME, 'ar'),
      url: 'https://' + DATA.DOMAIN,
      logo: 'https://' + DATA.DOMAIN + META.logoPath,
      description: U.t(META.description, 'en'),
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Manshyet Ganzour',
        addressLocality: 'Tanta',
        addressRegion: 'Gharbia Governorate',
        addressCountry: 'EG'
      },
      telephone: '+' + DATA.PHONE_NUMBER,
      email: META.supportEmail,
      foundingDate: META.foundingYear
    };
    injectJsonLd(schema, 'schema-organization');
  }

  /* ── FAQ JSON-LD ── */

  function injectFaqSchema() {
    var entities = DATA.faq.map(function (item) {
      return {
        '@type': 'Question',
        name: U.t(item, 'en') ? item.en.question : '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: U.t(item, 'en') ? item.en.answer : ''
        }
      };
    });
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entities
    };
    injectJsonLd(schema, 'schema-faq');
  }

  /* ── aria-current on nav links ── */

  function markCurrentNavLink(matchFn) {
    U.qsa('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && matchFn(href)) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ── TOC Smooth Scroll (for legal pages) ── */

  function initTocScroll(tocSelector) {
    var toc = U.qs(tocSelector || '.legal-toc');
    if (!toc) return;

    toc.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var targetId = anchor.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (history.replaceState) {
        history.replaceState(null, '', '#' + targetId);
      }
    });
  }

  /* ── Page Registration ── */

  function registerPageRefresh(callback) {
    _pageRefreshCallback = callback;
  }

  /* ── Init Page — call from each page controller ── */

  function initPage(config) {
    config = config || {};

    /* Apply stored language on page load */
    var lang = U.getLang();

    /* Build all shared chrome */
    buildNavBrand();
    buildNavLinks();
    buildLangSwitcher();
    buildFooter();
    buildWhatsAppFloat();
    buildBackToTop();
    injectBaseSEO(config);
    injectOrganizationSchema();

    if (config.navMatchFn) {
      markCurrentNavLink(config.navMatchFn);
    }

    /* If stored language is Arabic, apply full switch */
    if (lang === 'ar') {
      switchLanguage('ar');
    }
  }

  /* ── Public API ── */

  return Object.freeze({
    /* DOM helpers */
    setTextById: setTextById,
    setHrefById: setHrefById,
    setAttrById: setAttrById,

    /* URL builders */
    buildWhatsAppUrl: buildWhatsAppUrl,
    getDefaultWhatsAppUrl: getDefaultWhatsAppUrl,
    buildProductWhatsAppUrl: buildProductWhatsAppUrl,

    /* Page chrome builders */
    buildNavBrand: buildNavBrand,
    buildNavLinks: buildNavLinks,
    buildFooter: buildFooter,
    buildFooterCategories: buildFooterCategories,
    buildWhatsAppFloat: buildWhatsAppFloat,
    buildBackToTop: buildBackToTop,
    buildLangSwitcher: buildLangSwitcher,

    /* Language */
    switchLanguage: switchLanguage,
    registerPageRefresh: registerPageRefresh,

    /* SEO */
    injectBaseSEO: injectBaseSEO,
    injectJsonLd: injectJsonLd,
    injectOrganizationSchema: injectOrganizationSchema,
    injectFaqSchema: injectFaqSchema,
    markCurrentNavLink: markCurrentNavLink,

    /* Utility */
    buildCopyrightText: buildCopyrightText,
    initTocScroll: initTocScroll,
    initPage: initPage
  });

})();

if (typeof window !== 'undefined' && SharedPage) window.SharedPage = SharedPage;
