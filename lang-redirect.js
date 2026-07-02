// System-language loading for the EN/KO page pairs (index, vela).
// Runs synchronously from <head> so the switch happens before paint (no flash).
// Target URLs are read from <link rel="alternate" hreflang> so this one file
// works for every page pair without hardcoding paths (clean-URL safe).
//
// Order of precedence:
//   1. An explicit manual choice (localStorage 'lang-pref') always wins.
//   2. Otherwise the browser/system language (navigator.language) decides.
(function () {
  var STORAGE_KEY = 'lang-pref';
  var docEl = document.documentElement;
  var currentLang = docEl.lang === 'ko' ? 'ko' : 'en';

  function alternateHref(lang) {
    var link = document.querySelector(
      'link[rel="alternate"][hreflang="' + lang + '"]'
    );
    return link ? link.getAttribute('href') : null;
  }

  var savedLang = null;
  try {
    savedLang = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    savedLang = null;
  }

  var wantedLang;
  if (savedLang === 'ko' || savedLang === 'en') {
    wantedLang = savedLang;
  } else {
    var browserLang = (navigator.language || '').toLowerCase();
    wantedLang = browserLang.indexOf('ko') === 0 ? 'ko' : 'en';
  }

  if (wantedLang !== currentLang) {
    var target = alternateHref(wantedLang);
    if (target) {
      location.replace(target);
      return;
    }
  }

  // Remember the language the user picks via the manual switch, so the
  // auto-redirect above stops overriding their choice on the next visit.
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.lang-switch');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      try {
        localStorage.setItem(STORAGE_KEY, currentLang === 'ko' ? 'en' : 'ko');
      } catch (e) {
        /* storage unavailable — switch still navigates via its href */
      }
    });
  });
})();
