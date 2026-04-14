/* ── Firdaws Import & Export Co. — Utility Layer ──
   DOM helpers, sanitization, formatting, accessibility,
   bilingual helpers (getLang, t, isInSeason, seasonText).
   All functions are pure or read-only — no side effects on data.
   ES5 strict mode — var only (except Object.freeze).
   ── End Summary ── */

'use strict';

var Utils = (function () {

  /* ── Escape / Sanitize ── */

  var _ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;', '`': '&#96;' };
  var _ESC_RE = /[&<>"'\/`]/g;

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(_ESC_RE, function (c) { return _ESC_MAP[c]; });
  }

  function escapeAttr(s) {
    if (s == null) return '';
    return String(s).replace(/[^a-zA-Z0-9,.\-_\s]/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
  }

  var SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

  function sanitizeUrl(url) {
    if (url == null) return '';
    var s = String(url).trim();
    if (!s) return '';
    if (s[0] === '/' || s.indexOf('./') === 0 || s.indexOf('../') === 0 || s[0] === '#') return s;
    try { var p = new URL(s); if (SAFE_PROTOCOLS.indexOf(p.protocol) !== -1) return s; } catch (e) {}
    return '';
  }

  /* ── DOM Creation ── */

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null) return;
        if (k === 'className') e.className = v;
        else if (k === 'textContent') e.textContent = v;
        else if (k === 'innerHTML') { console.warn('el: innerHTML blocked'); }
        else if (k === 'dataset') { Object.keys(v).forEach(function (dk) { e.dataset[dk] = v[dk]; }); }
        else if (k === 'aria') { Object.keys(v).forEach(function (ak) { e.setAttribute('aria-' + ak, v[ak]); }); }
        else if (k === 'events') { Object.keys(v).forEach(function (ev) { e.addEventListener(ev, v[ev]); }); }
        else if (k === 'style' && typeof v === 'object') { Object.keys(v).forEach(function (sp) { e.style[sp] = v[sp]; }); }
        else e.setAttribute(k, v);
      });
    }
    if (children) {
      children.forEach(function (c) {
        if (c == null) return;
        if (typeof c === 'string') e.appendChild(document.createTextNode(c));
        else if (c instanceof Node) e.appendChild(c);
      });
    }
    return e;
  }

  function buildSafeLink(href, text, attrs) {
    var safe = sanitizeUrl(href);
    return el('a', Object.assign({}, attrs || {}, { href: safe || '#' }), [text]);
  }

  /* ── SVG DOM Creation ── */

  function svgEl(tag, attrs) {
    var ns = 'http://www.w3.org/2000/svg';
    var e = document.createElementNS(ns, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null) return;
        if (k === 'className') e.setAttribute('class', v);
        else if (k === 'textContent') e.textContent = v;
        else if (k === 'innerHTML') { console.warn('svgEl: innerHTML blocked'); }
        else e.setAttribute(k, v);
      });
    }
    return e;
  }

  /* ── Clear Children ── */

  function clearChildren(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  /* ── Count Products In Category ── */

  function countProductsInCategory(categoryId) {
    var DATA = window.COMPANY_DATA;
    if (!DATA || !DATA.products) return 0;
    var count = 0;
    for (var i = 0; i < DATA.products.length; i++) {
      if (DATA.products[i].categoryId === categoryId) count++;
    }
    return count;
  }

  /* ── Toast ── */

  var _toastHistory = new Map();

  function showToast(msg, type) {
    type = type || 'info';
    var box = document.querySelector('.toast-container');
    if (!box) { box = el('div', { className: 'toast-container position-fixed bottom-0 end-0 p-3' }); document.body.appendChild(box); }
    var key = type + ':' + msg, now = Date.now();
    if (_toastHistory.has(key) && now - _toastHistory.get(key) < 2000) return;
    _toastHistory.set(key, now);
    var existing = box.querySelectorAll('.toast');
    if (existing.length >= 3) { try { bootstrap.Toast.getInstance(existing[0]).hide(); } catch (e) { existing[0].remove(); } }
    var close = el('button', { type: 'button', className: 'btn-close btn-close-white me-2 m-auto', aria: { label: 'Close' } });
    close.setAttribute('data-bs-dismiss', 'toast');
    var t = el('div', { className: 'toast align-items-center text-bg-' + type + ' border-0 show', role: 'alert', aria: { live: 'assertive', atomic: 'true' } }, [el('div', { className: 'd-flex' }, [el('div', { className: 'toast-body', textContent: msg }), close])]);
    box.appendChild(t);
    try { var bt = new bootstrap.Toast(t, { delay: 5000 }); t.addEventListener('hidden.bs.toast', function () { t.remove(); }); bt.show(); }
    catch (e) { setTimeout(function () { if (t.parentNode) t.remove(); }, 5000); }
  }

  /* ── Selectors ── */

  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.from((r || document).querySelectorAll(s)); }

  /* ── Timing ── */

  function debounce(fn, d) {
    var t; return function () { var c = this, a = arguments; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, d); };
  }

  function throttle(fn, l) {
    var w = false; return function () { if (!w) { fn.apply(this, arguments); w = true; setTimeout(function () { w = false; }, l); } };
  }

  /* ── Accessibility ── */

  function announce(text, priority) {
    priority = priority || 'polite';
    var id = 'sr-' + priority, a = document.getElementById(id);
    if (!a) { a = el('div', { id: id, className: 'visually-hidden', aria: { live: priority, atomic: 'true' }, role: 'status' }); document.body.appendChild(a); }
    a.textContent = '';
    setTimeout(function () { a.textContent = text; }, 100);
  }

  /* ── Number Formatting ── */

  function formatNumber(n) { return (n == null || isNaN(n)) ? '0' : Number(n).toLocaleString('en-US'); }

  function formatNumberAr(n) {
    if (n == null || isNaN(n)) return '';
    return Number(n).toLocaleString('ar-EG');
  }

  function formatYear(y, lang) {
    if (y == null || isNaN(y)) return '';
    var s = String(Math.floor(Number(y)));
    var l = lang || getLang();
    if (l === 'ar') {
      return s.replace(/\d/g, function (d) {
        return String.fromCharCode(0x0660 + Number(d));
      });
    }
    return s;
  }

  /* ── Phone Display Formatting ── */

  /**
   * Format an international phone number for display.
   * formatPhoneDisplay('201010018811') → '+20 1010018811'
   * @param {string} intlNumber — digits only, e.g. '201010018811'
   * @returns {string}
   */
  function formatPhoneDisplay(intlNumber) {
    if (!intlNumber) return '';
    var s = String(intlNumber);
    return '+' + s.substring(0, 2) + ' ' + s.substring(2);
  }

  /* ── Bilingual Helpers ── */

  /**
   * Get current language from localStorage, fallback to defaultLang from config.
   * @returns {string} 'en' or 'ar'
   */
  function getLang() {
    var stored = null;
    try { stored = localStorage.getItem('lang'); } catch (e) {}
    if (stored === 'en' || stored === 'ar') return stored;
    var DATA = window.COMPANY_DATA;
    return (DATA && DATA.META && DATA.META.defaultLang) ? DATA.META.defaultLang : 'en';
  }

  /**
   * Bilingual text resolver — returns text for current language.
   * @param {object} obj — { en: '...', ar: '...' }
   * @param {string} [lang] — override language (optional)
   * @returns {string}
   */
  function t(obj, lang) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    var l = lang || getLang();
    return obj[l] || obj['en'] || '';
  }

  /**
   * Check if a product is currently in season.
   * Handles cross-year seasons (e.g., from: 11, to: 4 = November to April).
   * @param {object} product — must have product.season.from and product.season.to (month numbers 1-12)
   * @returns {boolean}
   */
  function isInSeason(product) {
    if (!product || !product.season) return false;
    var from = product.season.from;
    var to = product.season.to;
    if (from === 1 && to === 12) return true;
    var currentMonth = new Date().getMonth() + 1;
    if (from <= to) {
      return currentMonth >= from && currentMonth <= to;
    }
    return currentMonth >= from || currentMonth <= to;
  }

  /**
   * Get season display text for a product.
   * @param {object} product
   * @param {string} [lang]
   * @returns {string} e.g., "Nov — Apr" or "نوفمبر — أبريل"
   */
  function seasonText(product, lang) {
    if (!product || !product.season) return '';
    var l = lang || getLang();
    var DATA = window.COMPANY_DATA;
    if (!DATA || !DATA.META || !DATA.META.seasonCalendar) return '';
    var months = DATA.META.seasonCalendar.months[l];
    if (!months) return '';
    var from = product.season.from;
    var to = product.season.to;
    if (from === 1 && to === 12) {
      var yr = DATA.META.seasonCalendar.yearRound;
      return yr ? (yr[l] || yr.en || 'Year-round') : 'Year-round';
    }
    return months[from - 1] + ' — ' + months[to - 1];
  }
  /* ── URL Query Parameter ── */

  /**
   * Read a query parameter from the current URL.
   * Pure ES5 implementation — no URLSearchParams.
   * @param {string} name — parameter name
   * @returns {string|null} — decoded value or null if not found
   */
  function getQueryParam(name) {
    var search = window.location.search;
    if (!search) return null;
    var pairs = search.substring(1).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      if (decodeURIComponent(pair[0]) === name) {
        return pair.length > 1 ? decodeURIComponent(pair[1]) : '';
      }
    }
    return null;
  }

  /* ── Public API ── */

  return Object.freeze({
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    sanitizeUrl: sanitizeUrl,
    el: el,
    svgEl: svgEl,
    buildSafeLink: buildSafeLink,
    clearChildren: clearChildren,
    countProductsInCategory: countProductsInCategory,
    showToast: showToast,
    qs: qs,
    qsa: qsa,
    debounce: debounce,
    throttle: throttle,
    announce: announce,
    formatNumber: formatNumber,
    formatNumberAr: formatNumberAr,
    formatYear: formatYear,
    formatPhoneDisplay: formatPhoneDisplay,
    getLang: getLang,
    t: t,
    isInSeason: isInSeason,
    seasonText: seasonText,
    getQueryParam: getQueryParam
  });

})();

if (typeof window !== 'undefined') window.Utils = Utils;
