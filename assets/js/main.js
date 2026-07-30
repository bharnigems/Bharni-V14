/* main.js — universal autoplay safety net.
   Every hero/background video is muted + autoplay + playsinline, but some
   browsers (esp. Safari, Incognito, file://) don't honour the HTML attribute
   reliably. This nudges each video to play once it can, and once more on the
   first user interaction as a last resort. */
(function () {
  function nudgeAll() {
    document.querySelectorAll('video').forEach(function (v) {
      if (v.dataset.noAuto) return;
      try { v.muted = true; v.setAttribute('muted', ''); v.playsInline = true; } catch (e) {}
      var go = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
      go();
      v.addEventListener('canplay', go, { once: true });
      v.addEventListener('loadeddata', go, { once: true });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', nudgeAll);
  } else {
    nudgeAll();
  }
  var kick = function () {
    document.querySelectorAll('video').forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
    document.removeEventListener('pointerdown', kick);
    document.removeEventListener('touchstart', kick);
  };
  document.addEventListener('pointerdown', kick, { once: true, passive: true });
  document.addEventListener('touchstart', kick, { once: true, passive: true });
})();
