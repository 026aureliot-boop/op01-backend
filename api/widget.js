// OVNI PERDU – widget v1 via API
export default function handler(req, res) {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=31536000, immutable");
  res.status(200).send(`/* ovni-widget v1 */
;(()=>{console.log("ovni-widget v1: online");
window.dispatchEvent(new CustomEvent("ovni-widget-ready",{detail:{v:"1.0.0"}}));})();`);
}