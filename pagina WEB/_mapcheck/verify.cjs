// Deterministic verification: is each projected city ON land (or, for coastal/port
// cities, within a few px of land)? Uses the same decoded geometry + projection.
const fs = require("fs");
const topo = JSON.parse(fs.readFileSync(__dirname + "/land-110m.json", "utf8"));
const tr = topo.transform;
function decodeArc(arc) { let x=0,y=0; return arc.map(([dx,dy])=>{x+=dx;y+=dy;return [x*tr.scale[0]+tr.translate[0], y*tr.scale[1]+tr.translate[1]];}); }
const arcs = topo.arcs.map(decodeArc);
const REGION = { lonMin:-95, lonMax:135, latMin:-38, latMax:60 };
const VB = { w:1000, h:460 };
const project = (lon,lat)=>[((lon-REGION.lonMin)/(REGION.lonMax-REGION.lonMin))*VB.w, ((REGION.latMax-lat)/(REGION.latMax-REGION.latMin))*VB.h];

function geomToRings(geom){const polys=geom.type==="MultiPolygon"?geom.arcs:[geom.arcs];const rings=[];for(const poly of polys){for(const ringArcs of poly){const pts=[];for(let idx of ringArcs){let a,rev=false;if(idx<0){a=arcs[~idx];rev=true;}else a=arcs[idx];const seg=rev?a.slice().reverse():a;for(const p of seg)pts.push(p);}rings.push(pts);}}return rings;}

// project all land rings into screen space
const screenRings = [];
for(const geom of topo.objects.land.geometries)
  for(const ring of geomToRings(geom))
    screenRings.push(ring.map(([lon,lat])=>project(lon,lat)));

function pointInRing(px,py,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside;}return inside;}
function pointOnLand(px,py){for(const r of screenRings)if(pointInRing(px,py,r))return true;return false;}
function distToRings(px,py){let best=1e9;for(const r of screenRings){for(let i=0,j=r.length-1;i<r.length;j=i++){const ax=r[i][0],ay=r[i][1],bx=r[j][0],by=r[j][1];const dx=bx-ax,dy=by-ay;const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/((dx*dx+dy*dy)||1)));const cx=ax+t*dx,cy=ay+t*dy;const d=Math.hypot(px-cx,py-cy);if(d<best)best=d;}}return best;}

const cities=[["Bogotá",4.71,-74.07],["Miami",25.76,-80.19],["São Paulo",-23.55,-46.63],["Madrid",40.42,-3.70],["Rotterdam",51.92,4.48],["Dubái",25.20,55.27],["Singapur",1.35,103.82],["Shanghái",31.23,121.47]];
console.log("city          x      y     onLand  dist(px)");
for(const [name,lat,lon] of cities){const [x,y]=project(lon,lat);const on=pointOnLand(x,y);const d=distToRings(x,y);console.log(`${name.padEnd(12)} ${x.toFixed(1).padStart(6)} ${y.toFixed(1).padStart(6)}  ${on?"YES   ":"near  "}  ${d.toFixed(1)}`);}
