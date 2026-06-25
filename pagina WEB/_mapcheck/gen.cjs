const fs = require("fs");

// ---- 1. Load + decode TopoJSON (Natural Earth land-110m, lon/lat degrees) ----
const topo = JSON.parse(fs.readFileSync(__dirname + "/land-110m.json", "utf8"));
console.log("topo.type:", topo.type);
console.log("objects:", Object.keys(topo.objects));
console.log("bbox (lon/lat):", topo.bbox);
console.log("transform:", JSON.stringify(topo.transform));
console.log("arc count:", topo.arcs.length);

const tr = topo.transform; // { scale:[sx,sy], translate:[tx,ty] }
// decode quantized arcs into absolute [lon,lat]
function decodeArc(arc) {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => {
    x += dx; y += dy;
    return [x * tr.scale[0] + tr.translate[0], y * tr.scale[1] + tr.translate[1]];
  });
}
const arcs = topo.arcs.map(decodeArc);

// sanity: global lon/lat extent of decoded data
let minLon = 1e9, maxLon = -1e9, minLat = 1e9, maxLat = -1e9;
for (const a of arcs) for (const [lon, lat] of a) {
  if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
  if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
}
console.log("decoded lon extent:", minLon.toFixed(2), "..", maxLon.toFixed(2));
console.log("decoded lat extent:", minLat.toFixed(2), "..", maxLat.toFixed(2));

// ---- 2. Projection: plate carree clipped to framing region ----
const REGION = { lonMin: -95, lonMax: 135, latMin: -38, latMax: 60 };
const VB = { w: 1000, h: 460 }; // keep existing viewBox so nothing else in the component changes
// linear lon -> x, lat -> y (y inverted)
const project = (lon, lat) => {
  const x = ((lon - REGION.lonMin) / (REGION.lonMax - REGION.lonMin)) * VB.w;
  const y = ((REGION.latMax - lat) / (REGION.latMax - REGION.latMin)) * VB.h;
  return [x, y];
};

// ---- 3. Project city nodes ----
const cities = [
  ["bog", "Bogotá", 4.71, -74.07, true],
  ["mia", "Miami", 25.76, -80.19, false],
  ["sao", "São Paulo", -23.55, -46.63, false],
  ["mad", "Madrid", 40.42, -3.70, false],
  ["rot", "Rotterdam", 51.92, 4.48, false],
  ["dxb", "Dubái", 25.20, 55.27, false],
  ["sin", "Singapur", 1.35, 103.82, false],
  ["sha", "Shanghái", 31.23, 121.47, false],
];
console.log("\n--- NODES ---");
const nodeOut = cities.map(([id, label, lat, lon, hub]) => {
  const [x, y] = project(lon, lat);
  console.log(`${id.padEnd(4)} ${label.padEnd(11)} lat=${lat}  lon=${lon}  -> x=${x.toFixed(1)}  y=${y.toFixed(1)}`);
  return { id, label, lat, lon, x: +x.toFixed(1), y: +y.toFixed(1), hub: !!hub };
});

// ---- 4. Reconstruct geometries from topology and build clipped SVG path ----
// resolve a geometry's arc indices (handle negative = reversed)
function geomToRings(geom) {
  const polys = geom.type === "MultiPolygon" ? geom.arcs : [geom.arcs];
  const rings = [];
  for (const poly of polys) {
    for (const ringArcs of poly) {
      const pts = [];
      for (let idx of ringArcs) {
        let a, rev = false;
        if (idx < 0) { a = arcs[~idx]; rev = true; } else { a = arcs[idx]; }
        const seg = rev ? a.slice().reverse() : a;
        for (const p of seg) pts.push(p);
      }
      rings.push(pts);
    }
  }
  return rings;
}

// simple lon clamp to region so paths off-screen don't blow up; keep points, project, clamp in screen space
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

let pathData = "";
let ringCount = 0, ptCount = 0;
for (const geom of topo.objects.land.geometries) {
  for (const ring of geomToRings(geom)) {
    // skip rings entirely outside region (quick reject by bbox)
    let rlonMin = 1e9, rlonMax = -1e9, rlatMin = 1e9, rlatMax = -1e9;
    for (const [lon, lat] of ring) {
      if (lon < rlonMin) rlonMin = lon; if (lon > rlonMax) rlonMax = lon;
      if (lat < rlatMin) rlatMin = lat; if (lat > rlatMax) rlatMax = lat;
    }
    if (rlonMax < REGION.lonMin || rlonMin > REGION.lonMax || rlatMax < REGION.latMin || rlatMin > REGION.latMax) continue;
    ringCount++;
    let d = "";
    ring.forEach(([lon, lat], i) => {
      let [x, y] = project(lon, lat);
      // clamp to viewBox padding so edge rings stay tidy
      x = clamp(x, -20, VB.w + 20);
      y = clamp(y, -20, VB.h + 20);
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
      ptCount++;
    });
    d += "Z";
    pathData += d;
  }
}
console.log("\nrings kept:", ringCount, " points:", ptCount, " path length(chars):", pathData.length);

fs.writeFileSync(__dirname + "/continents-path.txt", pathData);
fs.writeFileSync(__dirname + "/nodes.json", JSON.stringify(nodeOut, null, 2));

// ---- 5. Emit a standalone preview SVG to verify alignment visually ----
const dots = nodeOut.map(n =>
  `<circle cx="${n.x}" cy="${n.y}" r="${n.hub ? 6 : 4}" fill="${n.hub ? '#00e5ff' : '#7cc'}"/>` +
  `<text x="${n.x}" y="${n.y - 8}" font-size="11" fill="#fff" text-anchor="middle" font-family="monospace">${n.label}</text>`
).join("\n");
const svg =
`<svg viewBox="0 0 ${VB.w} ${VB.h}" xmlns="http://www.w3.org/2000/svg">
<rect width="${VB.w}" height="${VB.h}" fill="#010B40"/>
<path d="${pathData}" fill="#1b2a6b" stroke="#33509a" stroke-width="0.6"/>
${dots}
</svg>`;
fs.writeFileSync(__dirname + "/preview.svg", svg);
console.log("\nwrote continents-path.txt, nodes.json, preview.svg");
