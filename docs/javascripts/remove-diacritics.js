console.log("✅ remove-diacritics.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  let tries = 0;
  const maxTries = 40; // 40 x 250ms = 10 seconds max

  const wait = setInterval(() => {
    tries++;
    if (window.search) {
      console.log("🔍 Found window.search");
    }
    if (window.search && window.search.lunr) {
      console.log("✅ Found window.search.lunr — patching...");

      const lunr = window.search.lunr;

      function removeDiacritics(token) {
        return token.update(function (text) {
          return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        });
      }

      lunr.Pipeline.registerFunction(removeDiacritics, 'removeDiacritics');
      lunr.pipeline.before(lunr.stemmer, removeDiacritics);
      lunr.searchPipeline.before(lunr.stemmer, removeDiacritics);

      console.log("✅ Accent-insensitive search enabled!");
      clearInterval(wait);
    }

    if (tries > maxTries) {
      console.warn("⏱️ Timed out waiting for Lunr to load");
      clearInterval(wait);
    }
  }, 250);
});
