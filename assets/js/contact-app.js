/* ── Firdaws Import & Export Co. — Contact Page Controller ──
   Builds contact page: form (→ WhatsApp redirect) + contact info panel + CTA.
   Form submits via window.open() to WhatsApp — CSP form-action:none compliant.
   Registers refreshPage() callback for instant bilingual switching.
   Uses Utils.el() for all DOM construction — zero innerHTML.
   ES5 strict mode — var only.
   ── End Summary ── */

'use strict';

var ContactApp = (function () {

  /* ── Guard & Aliases ── */

  var U    = window.Utils;
  var DATA = window.COMPANY_DATA;
  var SP   = window.SharedPage;

  if (!U || !DATA || !SP) {
    console.error('ContactApp: dependencies missing.');
    return null;
  }

  var META = DATA.META;

  /* ── State ── */

  var _formWired = false;

  /* ══════════════════════════════════════════
     Builder 1: Breadcrumb
  ══════════════════════════════════════════ */

  function buildBreadcrumb() {
    var container = document.getElementById('contact-breadcrumb');
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

    /* Contact (current) */
    frag.appendChild(
      U.el('li', null, [
        U.el('span', { aria: { current: 'page' }, textContent: U.t(META.nav.contact, lang) })
      ])
    );

    container.appendChild(frag);
  }

  /* ══════════════════════════════════════════
     Builder 2: Page Header
  ══════════════════════════════════════════ */

  function buildPageHeader() {
    var lang = U.getLang();
    SP.setTextById('contact-heading', U.t(META.contactPage.title, lang));
    SP.setTextById('contact-subtitle', U.t(META.contactPage.subtitle, lang));
  }

  /* ══════════════════════════════════════════
     Builder 3: Form Labels + Product Dropdown
  ══════════════════════════════════════════ */

  function buildFormLabels() {
    var lang = U.getLang();

    SP.setTextById('contact-form-heading', U.t(META.contactPage.form.formHeading, lang));
    SP.setTextById('cf-name-label', U.t(META.contactPage.form.name, lang));
    SP.setTextById('cf-email-label', U.t(META.contactPage.form.email, lang));
    SP.setTextById('cf-company-label', U.t(META.contactPage.form.company, lang));
    SP.setTextById('cf-country-label', U.t(META.contactPage.form.country, lang));
    SP.setTextById('cf-product-label', U.t(META.contactPage.form.product, lang));
    SP.setTextById('cf-message-label', U.t(META.contactPage.form.message, lang));
    SP.setTextById('cf-submit-text', U.t(META.contactPage.form.submit, lang));
    SP.setTextById('cf-success-text', U.t(META.contactPage.form.success, lang));

    /* Product dropdown — clear and rebuild */
    var select = document.getElementById('cf-product');
    if (!select) return;

    /* Save current value to restore after rebuild */
    var currentVal = select.value;
    U.clearChildren(select);

    /* Placeholder option */
    select.appendChild(
      U.el('option', { value: '', textContent: U.t(META.contactPage.form.placeholder, lang) })
    );

    /* Product options — grouped by category using <optgroup> */
    DATA.categories.forEach(function (cat) {
      var catName = cat[lang] ? cat[lang].name : cat.en.name;
      var group = U.el('optgroup', { label: catName });

      DATA.products.forEach(function (p) {
        if (p.categoryId === cat.id) {
          var prodName = p[lang] ? p[lang].name : p.en.name;
          group.appendChild(
            U.el('option', { value: p.id, textContent: prodName })
          );
        }
      });

      select.appendChild(group);
    });

    /* Restore previous selection */
    if (currentVal) select.value = currentVal;
  }

  /* ══════════════════════════════════════════
     Builder 4: Contact Info Panel
  ══════════════════════════════════════════ */

  function buildContactInfo() {
    var lang = U.getLang();

    /* Labels */
    SP.setTextById('ci-address-label', U.t(META.contactPage.info.address, lang));
    SP.setTextById('ci-phone-label', U.t(META.contactPage.info.phone, lang));
    SP.setTextById('ci-whatsapp-label', U.t(META.contactPage.info.whatsapp, lang));
    SP.setTextById('ci-email-label', U.t(META.contactPage.info.email, lang));
    SP.setTextById('ci-register-label', U.t(META.contactPage.info.register, lang));
    SP.setTextById('ci-tax-label', U.t(META.contactPage.info.tax, lang));

    /* Values */
    SP.setTextById('ci-address-text', U.t(DATA.ADDRESS, lang));
    SP.setTextById('ci-register-text', META.commercialRegister);
    SP.setTextById('ci-tax-text', META.taxId);

    /* Links — href + visible text */
    var phoneLink = document.getElementById('ci-phone-link');
    if (phoneLink) {
      phoneLink.href = U.sanitizeUrl('tel:+' + DATA.PHONE_NUMBER);
      phoneLink.textContent = U.formatPhoneDisplay(DATA.PHONE_NUMBER);
    }

    var waLink = document.getElementById('ci-whatsapp-link');
    if (waLink) {
      waLink.href = U.sanitizeUrl(SP.getDefaultWhatsAppUrl());
      waLink.textContent = U.formatPhoneDisplay(DATA.WHATSAPP_NUMBER);
    }

    var emailLink = document.getElementById('ci-email-link');
    if (emailLink) {
      emailLink.href = U.sanitizeUrl('mailto:' + META.supportEmail);
      emailLink.textContent = META.supportEmail;
    }
  }

  /* ══════════════════════════════════════════
     Builder 5: CTA
  ══════════════════════════════════════════ */

  function buildCTA() {
    var lang = U.getLang();

    SP.setTextById('contact-cta-heading', U.t(META.ctaSection.title, lang));
    SP.setTextById('contact-cta-text', U.t(META.ctaSection.text, lang));

    /* WhatsApp button (direct link — not contact.html) */
    var btnEl = document.getElementById('contact-cta-btn');
    if (btnEl) btnEl.href = U.sanitizeUrl(SP.getDefaultWhatsAppUrl());

    SP.setTextById('contact-cta-btn-text', U.t(META.hero.ctaSecondary, lang));
  }

  /* ══════════════════════════════════════════
     Builder 6: Form Submit Handler (wired once)
  ══════════════════════════════════════════ */

  function initFormHandler() {
    var form = document.getElementById('contact-form');
    if (!form || _formWired) return;
    _formWired = true;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var lang = U.getLang();

      /* Basic validation */
      var name  = document.getElementById('cf-name').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      if (!name || !email) {
        U.showToast(U.t(META.contactPage.form.validation, lang), 'warning');
        return;
      }

      /* Gather fields */
      var company = document.getElementById('cf-company').value.trim();
      var country = document.getElementById('cf-country').value.trim();
      var productEl = document.getElementById('cf-product');
      var productId = productEl ? productEl.value : '';
      var productName = '';
      if (productId) {
        for (var i = 0; i < DATA.products.length; i++) {
          if (DATA.products[i].id === productId) {
            productName = DATA.products[i].en.name;  /* Always English for WhatsApp */
            break;
          }
        }
      }
      var message = document.getElementById('cf-message').value.trim();

      /* Build WhatsApp message */
      var lines = [];
      lines.push('New Inquiry from ' + name);
      if (email) lines.push('Email: ' + email);
      if (company) lines.push('Company: ' + company);
      if (country) lines.push('Country: ' + country);
      if (productName) lines.push('Product: ' + productName);
      if (message) lines.push('Message: ' + message);

      var waMsg = lines.join('\n');
      var waUrl = SP.buildWhatsAppUrl(DATA.WHATSAPP_NUMBER, waMsg);

      /* Open WhatsApp in new tab */
      window.open(U.sanitizeUrl(waUrl), '_blank', 'noopener,noreferrer');

      /* Show success */
      var successEl = document.getElementById('cf-success');
      if (successEl) successEl.classList.remove('d-none');

      U.announce(U.t(META.contactPage.form.redirecting, lang));

      /* Reset form after delay */
      setTimeout(function () { form.reset(); }, 1000);
    });
  }

  /* ══════════════════════════════════════════
     Builder 8: SEO Injection
  ══════════════════════════════════════════ */

  function injectSEO() {
    var lang = U.getLang();
    var baseUrl = 'https://' + DATA.DOMAIN;

    SP.injectBaseSEO({
      pageTitle: U.t(META.contactPage.title, lang) + ' \u2014 ' + U.t(DATA.BRAND_NAME, lang),
      pageDesc:  U.t(META.contactPage.subtitle, lang),
      pageUrl:   baseUrl + '/contact.html',
      pageImage: baseUrl + META.ogImage
    });

    /* BreadcrumbList JSON-LD (always English) */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': U.t(META.nav.home, 'en'), 'item': baseUrl + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': U.t(META.nav.contact, 'en'), 'item': baseUrl + '/contact.html' }
      ]
    }, 'schema-breadcrumb');

    /* ContactPage JSON-LD */
    SP.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact ' + U.t(DATA.BRAND_NAME, 'en'),
      'url': baseUrl + '/contact.html',
      'mainEntity': {
        '@type': 'Organization',
        'name': U.t(DATA.BRAND_NAME, 'en'),
        'telephone': '+' + DATA.PHONE_NUMBER,
        'email': META.supportEmail,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Manshyet Ganzour',
          'addressLocality': 'Tanta',
          'addressRegion': 'Gharbia Governorate',
          'addressCountry': 'EG'
        }
      }
    }, 'schema-contactpage');
  }

  /* ══════════════════════════════════════════
     Refresh Page (called by switchLanguage)
  ══════════════════════════════════════════ */

  function refreshPage(lang) {
    buildBreadcrumb();
    buildPageHeader();
    buildFormLabels();
    buildContactInfo();
    buildCTA();
    injectSEO();

    /* Note: initFormHandler() NOT called here — only in init() */
    /* Hide success message on language switch */
    var successEl = document.getElementById('cf-success');
    if (successEl) successEl.classList.add('d-none');
  }

  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */

  function init() {
    /* Register refresh callback BEFORE initPage */
    SP.registerPageRefresh(refreshPage);

    /* Initialize shared page infrastructure */
    SP.initPage({
      pageUrl:   'https://' + DATA.DOMAIN + '/contact.html',
      pageImage: 'https://' + DATA.DOMAIN + META.ogImage,
      navMatchFn: function (href) {
        return href.indexOf('contact') !== -1;
      }
    });

    /* Build all page sections */
    buildBreadcrumb();
    buildPageHeader();
    buildFormLabels();
    buildContactInfo();
    buildCTA();
    injectSEO();

    /* Wire form submit — once only */
    initFormHandler();
  }

  /* ── DOMContentLoaded ── */

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ── */

  return Object.freeze({ init: init });

})();
