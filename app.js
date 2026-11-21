/* Interfaccia del grafo combo. Lo stato del gioco vive in engine.js; qui solo vista e navigazione. */
(function () {
'use strict';
const E = window.Engine, INFO = window.CARD_INFO;
const CAP = 70000;      // nuovi stati esplorati per ogni calcolo / affinamento (~2 s)
const MAX_MEM = 900000; // oltre questa soglia si riparte dal nodo corrente per non saturare la memoria
const $ = (id) => document.getElementById(id);

// nomi italiani (dove il database li ha) e immagini
for (const c in E.C) { const i = INFO[E.C[c].en]; if (i && i.it) E.names[c] = i.it; }
E.names.X = 'una carta qualsiasi';
const info = (c) => INFO[E.C[c].en];
const imgOf = (c) => (c === 'X' || !info(c) ? null : 'img/' + info(c).id + '.jpg');
const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

function cardEl(c, opt) {
  opt = opt || {};
  const d = document.createElement('div');
  d.className = 'card' + (c === 'X' ? ' x' : '') + (opt.cls ? ' ' + opt.cls : '');
  d.dataset.c = c;
  const im = imgOf(c);
  if (im) d.style.backgroundImage = `url(${im})`; else d.textContent = '?';
  if (opt.badge) { const b = document.createElement('span'); b.className = 'b'; b.textContent = opt.badge; d.appendChild(b); }
  if (opt.q) { const q = document.createElement('span'); q.className = 'q'; q.textContent = opt.q; d.appendChild(q); }
  return d;
}

// ---------------------------------------------------------------- anteprima carta al passaggio del mouse
const pv = $('preview');
document.addEventListener('mouseover', (e) => {
  const el = e.target.closest && e.target.closest('.card');
  if (!el) { pv.hidden = true; return; }
  const c = el.dataset.c, i = c !== 'X' && info(c);
  pv.innerHTML = i
    ? `<img src="${imgOf(c)}" alt=""><b>${esc(E.N(c))}</b><p>${esc(i.desc)}</p>`
    : '<b>Una carta qualsiasi</b><p>Carta generica: serve solo come costo da scartare.</p>';
  pv.hidden = false;
  const r = el.getBoundingClientRect();
  const left = r.right + 260 < innerWidth ? r.right + 8 : r.left - 258;
  pv.style.left = Math.max(4, left) + 'px';
  pv.style.top = Math.max(4, Math.min(r.top, innerHeight - pv.offsetHeight - 8)) + 'px';
});

// ---------------------------------------------------------------- scelta della mano
let hand = [];
const ORDER = Object.keys(E.MAIN).concat(['X']);
const PRESETS = [['MAIDEN'], ['SAGE'], ['WISHES', 'X'], ['SAGE', 'MAIDEN'], ['WISHES', 'SAGE'], ['MAIDEN', 'ROAR'], ['DICT', 'SAGE'],
  ['NKSH', 'SAGE', 'MAIDEN'], ['MELODY', 'SAGE', 'X'], ['DICT', 'BEWD', 'MAIDEN']];

function renderHand() {
  const h = $('hand'); h.innerHTML = '';
  hand.forEach((c, i) => { const el = cardEl(c); el.title = 'Clic per togliere'; el.onclick = () => { hand.splice(i, 1); renderHand(); }; h.appendChild(el); });
  const p = $('picker'); p.innerHTML = '';
  for (const c of ORDER) {
    const left = c === 'X' ? 9 : E.MAIN[c] - hand.filter((x) => x === c).length;
    const el = cardEl(c, { q: c === 'X' ? '' : left, cls: left <= 0 || hand.length >= 6 ? 'off' : '' });
    el.onclick = () => { hand.push(c); renderHand(); };
    p.appendChild(el);
  }
}
PRESETS.forEach((p, i) => { const o = document.createElement('option'); o.value = i; o.textContent = p.map(E.N).join(' + '); $('preset').appendChild(o); });
$('preset').onchange = (e) => { if (e.target.value === '') return; hand = PRESETS[+e.target.value].slice(); renderHand(); compute(); };
$('clear').onclick = () => { hand = []; $('preset').value = ''; renderHand(); };
$('go').onclick = () => compute();

// ---------------------------------------------------------------- grafo (Cytoscape)
let cy = null, G = null, path = [], tops = [], nodes = new Map();

function boardImgs(s) {
  const a = s.mz.map((m) => imgOf(E.P(m).c));
  for (const x of s.st) a.push(imgOf(x.replace('*', '')));
  if (s.fz) a.push(imgOf(s.fz));
  return a.filter(Boolean).slice(0, 8);
}
function nodeData(k, s, isRoot) {
  let imgs = boardImgs(s), label;
  if (isRoot) { imgs = s.hand.map(imgOf).filter(Boolean).slice(0, 8); label = 'Mano iniziale'; }
  else label = (imgs.length ? '' : 'campo vuoto · ') + `mano ${s.hand.length} · cim. ${s.gy.length}`;
  if (s.ph === 'X') label = `★ ${E.evaluate(s).total} · ` + label;
  else if (s.ph === 'E') label = 'End Phase · ' + label;
  return { id: k, imgs, w: Math.max(1, imgs.length) * 36 + 6, label, term: s.ph === 'X' ? 1 : 0 };
}
function initCy() {
  const per = (f) => (ele) => { const n = ele.data('imgs').length; return n ? ele.data('imgs').map((_, i) => f(i)) : f(0); };
  cy = cytoscape({
    container: $('cy'), wheelSensitivity: 0.25, minZoom: 0.15, maxZoom: 2.5,
    style: [
      { selector: 'node', style: {
        shape: 'round-rectangle', width: 'data(w)', height: 58, 'background-color': '#1b2433', 'border-width': 2, 'border-color': '#3b4a63',
        label: 'data(label)', 'text-valign': 'bottom', 'text-margin-y': 5, color: '#9fb0c8', 'font-size': 10,
        'background-image': (ele) => (ele.data('imgs').length ? ele.data('imgs') : 'none'),
        'background-fit': per(() => 'none'), 'background-clip': per(() => 'none'), 'background-image-crossorigin': per(() => 'null'),
        'background-width': per(() => '34px'), 'background-height': per(() => '50px'),
        'background-position-x': per((i) => 4 + i * 36 + 'px'), 'background-position-y': per(() => '4px'),
      } },
      { selector: 'node[term = 1]', style: { 'border-color': '#f2c14e', color: '#f2c14e' } },
      { selector: 'node.onpath', style: { 'border-color': '#5db2ff' } },
      { selector: 'node.sel', style: { 'border-color': '#ffffff', 'border-width': 4 } },
      { selector: 'edge', style: {
        width: 1.5, 'line-color': '#3b4a63', 'target-arrow-color': '#3b4a63', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier',
        label: 'data(label)', 'font-size': 9, color: '#8ea0ba', 'text-wrap': 'wrap', 'text-max-width': 150,
        'text-background-color': '#0d1117', 'text-background-opacity': 0.85, 'text-background-padding': 2,
      } },
      { selector: 'edge.best', style: { 'line-color': '#f2c14e', 'target-arrow-color': '#f2c14e', width: 2 } },
      { selector: 'edge.neg', style: { 'line-color': '#ff6b6b', 'target-arrow-color': '#ff6b6b', 'line-style': 'dashed', color: '#ff9c9c' } },
      { selector: 'edge.onpath', style: { 'line-color': '#5db2ff', 'target-arrow-color': '#5db2ff', width: 3.5, color: '#dbe4f0' } },
    ],
  });
  cy.on('tap', 'node', (e) => jumpTo(e.target.id()));
  cy.on('tap', 'edge', (e) => jumpTo(e.target.data('target')));
}
function ensureNode(s, isRoot) {
  const k = E.key(s);
  if (!nodes.has(k)) { nodes.set(k, s); cy.add({ group: 'nodes', data: nodeData(k, s, isRoot) }); }
  return k;
}
function ensureEdge(from, to, via, cls) {
  const a = ensureNode(from), b = ensureNode(to);
  const id = a + '>>' + b + '|' + (via.neg ? 'NEG ' : '') + via.label;
  let e = cy.getElementById(id);
  if (!e.length) e = cy.add({ group: 'edges', data: { id, source: a, target: b, label: (via.neg ? '⊘ annullato: ' : '') + via.label, via } });
  if (via.neg) e.addClass('neg');
  if (cls) e.addClass(cls);
  return id;
}
function layout(fit) {
  cy.layout({ name: 'dagre', rankDir: 'LR', nodeSep: 46, rankSep: 170, edgeSep: 30, animate: false, fit: !!fit, padding: 40 }).run();
}

// risolve lo stato; se il risultato era troncato dal budget, ricalcola partendo da qui
function gid(s, refine) {
  if (G.size() > MAX_MEM) G = new E.Graph(CAP);
  const id = G.id(s);
  if (G.best[id] === null || G.trunc[id] || refine) G.solve(s, CAP);
  return id;
}
function busy(fn) {
  $('busy').hidden = false;
  setTimeout(() => { try { fn(); } finally { $('busy').hidden = true; } }, 30);
}

function compute() {
  if (!hand.length) return;
  busy(() => {
    if (!cy) initCy();
    cy.elements().remove(); nodes = new Map();
    $('empty').hidden = true;
    const s0 = E.initial(hand);
    G = new E.Graph(CAP);
    const root = G.solve(s0, CAP);
    ensureNode(s0, true);
    path = [{ key: E.key(s0), state: s0, via: null }];
    // campi finali migliori (con la loro linea), calcolati una volta dal nodo iniziale
    const T = G.terminals(root, 80);
    const seen = new Set(); tops = [];
    for (const t of T.top) {
      const st = G.state(t.node);
      const sig = st.mz.map((m) => E.P(m).c).sort().join(',') + '|' + st.st.slice().sort().join(',');
      if (seen.has(sig)) continue; seen.add(sig);
      tops.push({ score: t.score, state: st, line: G.lineTo(root, t) });
      if (tops.length >= 8) break;
    }
    $('stats').textContent = `${G.size().toLocaleString('it')} stati` + (G.approx[root] ? ' (parziale)' : '');
    renderTops();
    addLine(s0, G.bestLine(root), 'best');
    layout(true);
    if (cy.zoom() < 0.75) { // linea lunga: meglio leggibile che tutta visibile
      const z = 0.75, p = cy.getElementById(path[0].key).position();
      cy.viewport({ zoom: z, pan: { x: 70 - p.x * z, y: cy.height() / 2 - p.y * z } });
    }
    refresh();
  });
}
function addLine(from, line, cls) {
  let cur = from;
  for (const st of line) { ensureEdge(cur, st.state, st, cls); cur = st.state; }
}
function renderTops() {
  $('topBox').hidden = false;
  const ol = $('top'); ol.innerHTML = '';
  tops.forEach((t) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="sc">${t.score}</span>`;
    const mini = document.createElement('div'); mini.className = 'mini';
    for (const m of t.state.mz) mini.appendChild(cardEl(E.P(m).c));
    for (const x of t.state.st) mini.appendChild(cardEl(x.replace('*', ''), { cls: x.endsWith('*') ? 'set' : '' }));
    if (!mini.children.length) mini.textContent = 'campo vuoto';
    li.appendChild(mini);
    li.title = `${t.line.length} mosse – clic per vedere la linea`;
    li.onclick = () => {
      const s0 = path[0];
      addLine(s0.state, t.line);
      path = [s0]; let cur = s0.state;
      for (const st of t.line) { path.push({ key: E.key(st.state), state: st.state, via: st }); cur = st.state; }
      layout(false); refresh(true);
    };
    ol.appendChild(li);
  });
}

// ---------------------------------------------------------------- navigazione
function go(from, toState, via) {
  ensureEdge(from, toState, via);
  path.push({ key: E.key(toState), state: toState, via });
  layout(false);
  refresh(true);
}
function jumpTo(k) {
  const i = path.findIndex((p) => p.key === k);
  if (i >= 0) path.length = i + 1;
  else { // cerca un percorso sugli archi gia' disegnati
    const rootK = path[0].key, prev = new Map([[rootK, null]]); let q = [rootK];
    while (q.length && !prev.has(k)) {
      const nq = [];
      for (const x of q) cy.getElementById(x).outgoers('edge').forEach((e) => { const t = e.data('target'); if (!prev.has(t)) { prev.set(t, e); nq.push(t); } });
      q = nq;
    }
    if (!prev.has(k)) return;
    const rev = []; let cur = k;
    while (prev.get(cur)) { const e = prev.get(cur); rev.unshift({ key: cur, state: nodes.get(cur), via: e.data('via') }); cur = e.data('source'); }
    path = [path[0]].concat(rev);
  }
  refresh();
}
$('fit').onclick = () => cy && cy.fit(undefined, 40);
$('reset').onclick = () => {
  if (!cy || !path.length) return;
  cy.elements().remove(); nodes = new Map();
  ensureNode(path[0].state, true);
  for (let i = 1; i < path.length; i++) ensureEdge(path[i - 1].state, path[i].state, path[i].via);
  layout(true); refresh();
};
$('expand').onclick = () => {
  if (!path.length) return;
  const cur = path[path.length - 1];
  busy(() => { for (const m of G.moves(gid(cur.state), 3000)) ensureEdge(cur.state, m.state, m); layout(false); refresh(true); });
};
$('bestHere').onclick = () => {
  if (!path.length) return;
  const cur = path[path.length - 1];
  busy(() => { addLine(cur.state, G.bestLine(gid(cur.state)), 'best'); layout(false); refresh(true); });
};

function refresh(center) {
  const cur = path[path.length - 1];
  cy.elements().removeClass('sel onpath');
  for (let i = 0; i < path.length; i++) {
    cy.getElementById(path[i].key).addClass('onpath');
    if (i) cy.getElementById(path[i - 1].key + '>>' + path[i].key + '|' + (path[i].via.neg ? 'NEG ' : '') + path[i].via.label).addClass('onpath');
  }
  const n = cy.getElementById(cur.key); n.addClass('sel');
  if (center) cy.animate({ center: { eles: n } }, { duration: 250 });
  const id = gid(cur.state);
  renderPanel(cur, id);
  renderLine(cur, id);
}

function chips(tags, nSum) {
  let h = '';
  if (tags.ash) h += '<span class="chip ash" title="L\'avversario può rispondere con Fioritura di Cenere">Ash</span>';
  if (tags.mon) h += '<span class="chip mon" title="Effetto di un mostro sul campo: annullabile con Dissimulatore di Effetto / Impermanenza Infinita">Veiler/Imperm</span>';
  if (tags.summon && nSum) h += nSum === 5
    ? '<span class="chip nib" title="Quinta evocazione del turno: da qui l\'avversario può usare Nibiru">5ª evoc. → Nibiru</span>'
    : `<span class="chip sum">${nSum}ª evoc.</span>`;
  return h;
}
function renderLine(cur, id) {
  $('lineBox').hidden = false;
  const ol = $('line'); ol.innerHTML = '';
  let nSum = 0;
  const item = (st, cls, onclick) => {
    if (st.tags.summon) nSum++;
    const li = document.createElement('li'); li.className = cls;
    if (st.card) li.appendChild(cardEl(st.card));
    const t = document.createElement('div');
    t.innerHTML = (st.neg ? '<span style="color:var(--red)">⊘ annullato:</span> ' : '') + esc(st.label) + chips(st.tags, st.tags.summon ? nSum : 0);
    li.appendChild(t); li.onclick = onclick; ol.appendChild(li);
  };
  path.slice(1).forEach((p, i) => item(p.via, i === path.length - 2 ? 'cur' : '', () => jumpTo(p.key)));
  const cont = G.bestLine(id);
  if (cont.length) {
    const sep = document.createElement('li'); sep.className = 'sep';
    sep.textContent = path.length > 1 ? '↓ continuazione migliore da qui' : '↓ linea migliore';
    ol.appendChild(sep);
    cont.forEach((st, j) => item(st, 'future', () => {
      let from = cur.state;
      for (let i = 0; i <= j; i++) { ensureEdge(from, cont[i].state, cont[i], 'best'); path.push({ key: E.key(cont[i].state), state: cont[i].state, via: cont[i] }); from = cont[i].state; }
      layout(false); refresh(true);
    }));
  }
}

function zone(title, els) {
  const h = document.createElement('h3'); h.textContent = title;
  const z = document.createElement('div'); z.className = 'cards zone';
  els.forEach((e) => z.appendChild(e));
  const f = document.createDocumentFragment(); f.appendChild(h); f.appendChild(z); return f;
}
function renderPanel(cur, id) {
  const s = cur.state, P = $('panel'); P.innerHTML = '';
  const head = document.createElement('div'); head.className = 'head';
  const ap = G.approx[id] ? '≈ ' : '';
  if (s.ph === 'X') head.innerHTML = `Campo finale · punteggio <b>${E.evaluate(s).total}</b>`;
  else head.innerHTML = `Miglior campo raggiungibile da qui: <b>${ap}${G.best[id]}</b><br><span class="muted">in ${G.dist[id]} mosse` +
    (G.approx[id] ? ' · ricerca parziale (troppe combinazioni): è il migliore trovato finora' : '') + '</span>';
  if (G.approx[id] && s.ph !== 'X') {
    const rb = document.createElement('button'); rb.textContent = 'Affina la ricerca da qui'; rb.style.marginTop = '8px'; rb.style.display = 'block';
    rb.onclick = () => busy(() => { gid(s, true); refresh(); });
    head.appendChild(rb);
  }
  P.appendChild(head);

  P.appendChild(zone(`Mano (${s.hand.length})` + (s.draws ? ` + ${s.draws} pescate ignote` : ''), s.hand.slice().sort().map((c) => cardEl(c))));
  P.appendChild(zone('Mostri', s.mz.map((m) => {
    const p = E.P(m), b = [];
    if (p.lv) b.push('Lv ' + E.curLv(p));
    if (p.eq) b.push('equip');
    if (p.mats.length) b.push(p.mats.length + ' mat.');
    if (p.fl.indexOf('n') >= 0) b.push('annullato');
    return cardEl(p.c, { badge: b.join(' · ') });
  })));
  const st = s.st.map((x) => cardEl(x.replace('*', ''), x.endsWith('*') ? { cls: 'set', badge: 'coperta' } : {}));
  if (s.fz) st.push(cardEl(s.fz, { badge: 'Terreno' }));
  P.appendChild(zone('Magie / Trappole', st));
  P.appendChild(zone(`Cimitero (${s.gy.length})`, s.gy.map((c) => cardEl(c))));
  if (s.ban.length) P.appendChild(zone('Banditi', s.ban.map((c) => cardEl(c))));

  if (s.ph === 'X') {
    const h = document.createElement('h3'); h.textContent = 'Perché questo punteggio'; P.appendChild(h);
    const ul = document.createElement('ol'); ul.className = 'score';
    for (const it of E.evaluate(s).items) { const li = document.createElement('li'); li.innerHTML = `<span>+${it.pts}</span><span>${esc(it.label)}</span>`; ul.appendChild(li); }
    P.appendChild(ul);
    return;
  }
  const moves = G.moves(id, 3000).sort((a, b) => b.best - a.best || a.dist - b.dist);
  const h = document.createElement('h3'); h.textContent = `Mosse possibili (${moves.length})`; P.appendChild(h);
  const top = moves.length ? moves[0].best : 0;
  for (const m of moves) {
    const d = document.createElement('div'); d.className = 'move' + (m.best === top ? ' top' : '');
    if (m.card) d.appendChild(cardEl(m.card)); else { const sp = document.createElement('div'); sp.style.width = '26px'; sp.style.flex = 'none'; d.appendChild(sp); }
    const t = document.createElement('div'); t.className = 't';
    t.innerHTML = esc(m.label) + chips(m.tags, 0);
    if (m.negState) {
      const nb = document.createElement('button'); nb.className = 'negbtn'; nb.textContent = '⊘ e se viene annullato?';
      nb.onclick = (ev) => { ev.stopPropagation(); busy(() => go(s, m.negState, { label: m.label, card: m.card, tags: {}, neg: 1 })); };
      t.appendChild(document.createElement('br')); t.appendChild(nb);
    }
    d.appendChild(t);
    const v = document.createElement('div'); v.className = 'v';
    v.innerHTML = `<b>${m.approx ? '≈' : ''}${m.best}</b>` + (m.term ? '' : `<br>${m.dist + 1} mosse`);
    v.title = 'Miglior punteggio raggiungibile dopo questa mossa';
    d.appendChild(v);
    d.onclick = () => busy(() => go(s, m.state, m));
    P.appendChild(d);
  }
}

renderHand();
})();
