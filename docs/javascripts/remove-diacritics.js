console.log("✅ remove-diacritics.js loaded");

// Wait for the search to be initialized
document.addEventListener("DOMContentLoaded", function () {
  const waitForLunr = setInterval(() => {
    if (window.search && window.search.lunr) {
      clearInterval(waitForLunr);
      setupAccentInsensitiveSearch();
    }
  }, 100);
});

function setupAccentInsensitiveSearch() {
  console.log("🔁 Patching Lunr to support accent-insensitive search...");

  const lunr = window.search.lunr;

  // Custom token filter to remove accents
  lunr.Pipeline.registerFunction(removeDiacritics, 'removeDiacritics');

  // Add the filter to the pipeline
  lunr.tokenizer.separator = /[\s\-\.]+/;
  lunr.pipeline.before(lunr.stemmer, removeDiacritics);
  lunr.searchPipeline.before(lunr.stemmer, removeDiacritics);

  function removeDiacritics(token) {
    return token.update(function (str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    });
  }

  console.log("✅ Accent-insensitive search enabled!");
}
