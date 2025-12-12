/* OVNI PERDU – widget v1 (root) */
;(() => {
  console.log("ovni-widget v1: online");
  window.dispatchEvent(new CustomEvent("ovni-widget-ready", { detail: { v: "1.0.0" } }));
})();