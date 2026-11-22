/* Nucleo del grafo combo: stato di gioco, regole comuni e ricerca.
 * Non conosce nessuna carta: ogni mazzo sta in decks/<nome>.js e si registra con register().
 * Modello: turno 1, si gioca per primi, l'avversario non controlla carte.
 * Funziona sia in Node (test) sia nel browser (window.ComboCore).
 */
(function (root) {
'use strict';

const decks = {};
function register(deck) { decks[deck.id] = deck; return deck; }

// Carte presenti in molti mazzi: un mazzo le include con Object.assign({}, STAPLES_..., ...)
// k: M mostro / S magia / T trappola.  x: tipo Extra Deck.  nsMinor: evocarla e' una mossa marginale.
const STAPLES = {
  ASH:    { en: 'Ash Blossom & Joyous Spring', k: 'M', lv: 3, attr: 'FIRE', race: 'Zombie', tuner: 1, atk: 0, def: 1800, handtrap: 1, nsMinor: 1 },
  VEILER: { en: 'Effect Veiler', k: 'M', lv: 1, attr: 'LIGHT', race: 'Spellcaster', tuner: 1, atk: 0, def: 0, handtrap: 1 },
  NIBIRU: { en: 'Nibiru, the Primal Being', k: 'M', lv: 11, attr: 'LIGHT', race: 'Rock', atk: 3000, def: 600, handtrap: 1 },
  IMPERM: { en: 'Infinite Impermanence', k: 'T', handtrap: 1 },
  OGRE:   { en: 'Ghost Ogre & Snow Rabbit', k: 'M', lv: 3, attr: 'LIGHT', race: 'Psychic', tuner: 1, atk: 0, def: 1800, handtrap: 1, nsMinor: 1 },
  CBTG:   { en: 'Called by the Grave', k: 'S', quick: 1 },
};

// ---------------------------------------------------------------- utilita' senza stato
const has = (a, c) => a.indexOf(c) >= 0;
function rm(a, c) { const i = a.indexOf(c); if (i < 0) return false; a.splice(i, 1); return true; }
const uniq = (a) => Array.from(new Set(a));
const count = (a, c) => { let n = 0; for (const x of a) if (x === c) n++; return n; };
const flag = (s, f) => s.f.indexOf(f) >= 0;
const setf = (s, f) => { if (s.f.indexOf(f) < 0) s.f.push(f); };
const addPend = (s, t) => { if (s.pend.indexOf(t) < 0) s.pend.push(t); };
const srt = (a) => a.slice().sort().join(',');

// mostro sul campo = stringa "CODICE~deltaLivello~equip~flag~materiali"
//   flag: S = Synchro Evocato, R = Rituale Evocato, n = effetti annullati
function mon(c, o) {
  o = o || {};
  return c + '~' + (o.lv || 0) + '~' + (o.eq || '') + '~' + (o.fl || '') + '~' + (o.mats ? o.mats.slice().sort().join('+') : '');
}
function P(m) {
  const a = m.split('~');
  return { c: a[0], lv: +a[1], eq: a[2], fl: a[3], mats: a[4] ? a[4].split('+') : [] };
}
const unP = (p) => mon(p.c, p);
const negd = (p) => p.fl.indexOf('n') >= 0;

function clone(s) {
  return {
    hand: s.hand.slice(), mz: s.mz.slice(), st: s.st.slice(), fz: s.fz,
    gy: s.gy.slice(), ban: s.ban.slice(), deck: s.deck.slice(), extra: s.extra.slice(),
    f: s.f.slice(), pend: s.pend.slice(), ph: s.ph, draws: s.draws,
  };
}
// deck ed extra sono derivabili dal resto: non servono nella chiave
function key(s) {
  return srt(s.hand) + '/' + srt(s.mz) + '/' + srt(s.st) + '/' + (s.fz || '') + '/' + srt(s.gy) + '/' +
    srt(s.ban) + '/' + srt(s.f) + '/' + srt(s.pend) + '/' + s.ph + s.draws;
}

// ================================================================ motore per un mazzo
function createEngine(deck) {
  const C = Object.assign({ X: { en: 'Any other card', k: 'X' } }, deck.cards);
  const MAIN = deck.main, EXTRA = deck.extra;
  const names = {};
  for (const c in C) names[c] = C[c].en;
  const N = (c) => names[c] || c;
  let H = {}; // regole del mazzo, restituite da deck.setup(K)

  function initial(hand) {
    const dk = [];
    for (const c in MAIN) for (let i = 0; i < MAIN[c]; i++) dk.push(c);
    for (const c of hand) {
      if (c === 'X') continue;
      if (!rm(dk, c)) throw new Error('Troppe copie di ' + c);
    }
    const extra = [];
    for (const c in EXTRA) for (let i = 0; i < EXTRA[c]; i++) extra.push(c);
    return { hand: hand.slice(), mz: [], st: [], fz: null, gy: [], ban: [], deck: dk, extra, f: [], pend: [], ph: 'M', draws: 0 };
  }
  // ricostruisce lo stato dalla chiave: in memoria restano solo le chiavi
  function fromKey(k) {
    const a = k.split('/');
    const L = (x) => (x ? x.split(',') : []);
    const s = { hand: L(a[0]), mz: L(a[1]), st: L(a[2]), fz: a[3] || null, gy: L(a[4]), ban: L(a[5]), f: L(a[6]), pend: L(a[7]), ph: a[8][0], draws: +a[8].slice(1) };
    const cnt = {};
    const use = (c) => { cnt[c] = (cnt[c] || 0) + 1; };
    s.hand.forEach(use); s.gy.forEach(use); s.ban.forEach(use);
    s.st.forEach((x) => use(x.replace('*', '')));
    if (s.fz) use(s.fz);
    for (const m of s.mz) { const p = P(m); use(p.c); if (p.eq) use(p.eq); p.mats.forEach(use); }
    s.deck = []; s.extra = [];
    for (const c in MAIN) for (let n = MAIN[c] - (cnt[c] || 0); n > 0; n--) s.deck.push(c);
    for (const c in EXTRA) for (let n = EXTRA[c] - (cnt[c] || 0); n > 0; n--) s.extra.push(c);
    return s;
  }

  // ---------------------------------------------------------------- regole comuni
  const fieldName = (p) => (H.fieldName ? H.fieldName(p) : p.c); // nome sul campo (es. carte che cambiano nome)
  const onField = (s, c) => s.mz.some((m) => { const p = P(m); return p.c === c && !negd(p); });
  const curLv = (p) => (C[p.c].lv == null ? null : C[p.c].lv + p.lv);
  const isEffectMon = (p) => !C[p.c].normal;
  const isLink = (m) => C[P(m).c].x === 'link';
  // 5 Zone Mostri Principali + 1 Zona Mostri Extra; un solo Link alla volta (semplificazione)
  function canPlace(s, c) {
    const n = s.mz.length + 1;
    if (C[c].x === 'link' && s.mz.some(isLink)) return false;
    if (n <= 5) return true;
    return n === 6 && (!!C[c].x || s.mz.some((m) => C[P(m).c].x));
  }
  const canSS = (s, c) => !(H.blocked && H.blocked(s, c)) && canPlace(s, c);

  function toGY(s, c, fromField) {
    s.gy.push(c);
    if (H.onToGY) H.onToGY(s, c, !!fromField);
  }
  function banish(s, c) {
    s.ban.push(c);
    if (H.onBanish) H.onBanish(s, c);
  }
  // dest: 'gy' | 'deck' | 'ban' | 'mat' (diventa materiale: non va da nessuna parte)
  function leaveField(s, m, dest) {
    const i = s.mz.indexOf(m);
    if (i < 0) throw new Error('mostro non sul campo: ' + m);
    s.mz.splice(i, 1);
    const p = P(m);
    if (p.eq) toGY(s, p.eq, false);
    for (const x of p.mats) toGY(s, x, false);
    if (dest === 'gy') toGY(s, p.c, true);
    else if (dest === 'deck') (C[p.c].x ? s.extra : s.deck).push(p.c);
    else if (dest === 'ban') banish(s, p.c);
    return p;
  }
  // how: 'ns' normale, 'ss' speciale, 'link', 'syn'
  function summon(s, m, how) {
    s.mz.push(m);
    if (H.onSummon) H.onSummon(s, P(m), how);
  }
  const pendOK = (s, t) => !!(H.pending && H.pending[t]) && H.pending[t].ok(s);
  const epAvail = (s) => !!(H.epAvail && H.epAvail(s));

  // ---------------------------------------------------------------- azioni
  // Ogni azione e' {label, card, tags, next, neg}. Tag: ash / mon (annullabile), summon, end, skip, minor.
  function actions(s, withNeg) {
    const out = [];
    if (s.ph === 'X') return out;
    function fin(n) {
      if (n.pend.length) n.pend = n.pend.filter((t) => pendOK(n, t));
      if (n.ph === 'E' && !n.pend.length && !epAvail(n)) n.ph = 'X';
    }
    // add(etichetta, carta, tag, costo, effetto): "neg" = stato se l'effetto viene annullato (costo pagato)
    function add(label, card, tags, cost, eff) {
      const n = clone(s);
      if (cost) cost(n);
      let neg = null;
      if (withNeg && tags && (tags.ash || tags.mon)) { neg = clone(n); fin(neg); }
      if (eff) eff(n);
      fin(n);
      out.push({ label, card, tags: tags || {}, next: n, neg });
    }
    if (s.pend.length) { // inneschi in sospeso, uno alla volta in ordine canonico: si attivano ora o si perdono
      const t = s.pend.slice().sort()[0];
      const done = (n) => { rm(n.pend, t); };
      H.pending[t].run(s, add, done);
      add('Non attivare questo effetto', null, { skip: 1 }, done);
      return out;
    }
    if (s.ph === 'E') {
      if (H.endPhase) H.endPhase(s, add);
      add('Concludi il turno', null, { end: 1 }, (n) => { n.ph = 'X'; });
      return out;
    }
    H.main(s, add);
    add('Fine turno', null, { end: 1 }, null, (n) => { n.ph = 'E'; n.pend = []; });
    return out;
  }

  // ---------------------------------------------------------------- mattoni riusabili dai mazzi
  // Evocazione Normale di ogni mostro di Livello <= 4 in mano.
  // slot(s, c) -> {flag, note} per evocazioni aggiuntive; di base una sola per turno (flag 'ns').
  function normalSummons(s, add, slot, fl) {
    for (const c of uniq(s.hand)) {
      const d = C[c];
      if (d.k !== 'M' || d.lv > 4 || d.ritual || d.nons) continue;
      const sl = (slot && slot(s, c)) || (!flag(s, 'ns') ? { flag: 'ns' } : null);
      if (!sl || !canPlace(s, c)) continue;
      add(`Evoca Normalmente ${N(c)}` + (sl.note ? ` (${sl.note})` : ''), c, d.nsMinor ? { summon: 1, minor: 1 } : { summon: 1 }, null,
        (n) => { setf(n, sl.flag); rm(n.hand, c); summon(n, mon(c, fl ? { fl } : null), 'ns'); });
    }
  }
  // Synchro: specs = [{code, lv, tuners:[min,max], nons:[min,max], tunerOK(p), nonOK(p)}]
  function synchros(s, add, specs) {
    const fm = s.mz.filter((m) => curLv(P(m)) != null);
    if (fm.length < 2) return;
    const seen = new Set();
    for (let mask = 1; mask < (1 << fm.length); mask++) {
      const sel = []; for (let i = 0; i < fm.length; i++) if (mask & (1 << i)) sel.push(fm[i]);
      if (sel.length < 2) continue;
      const ps = sel.map(P);
      const tun = ps.filter((p) => C[p.c].tuner), non = ps.filter((p) => !C[p.c].tuner);
      if (!tun.length || !non.length) continue;
      const tot = ps.reduce((a, p) => a + curLv(p), 0);
      for (const sp of specs) {
        if (tot !== sp.lv || !has(s.extra, sp.code)) continue;
        if (tun.length < sp.tuners[0] || tun.length > sp.tuners[1] || non.length < sp.nons[0] || non.length > sp.nons[1]) continue;
        if ((sp.tunerOK && !tun.every(sp.tunerOK)) || (sp.nonOK && !non.every(sp.nonOK))) continue;
        const sig = sp.code + '|' + sel.slice().sort().join('&'); if (seen.has(sig)) continue; seen.add(sig);
        add(`Synchro ${N(sp.code)} con ${ps.map((p) => N(p.c)).join(' + ')}`, sp.code, { summon: 1 }, null,
          (n) => { for (const m of sel) leaveField(n, m, 'gy'); rm(n.extra, sp.code); summon(n, mon(sp.code, { fl: 'S' }), 'syn'); });
      }
    }
  }
  // tutte le combinazioni distinte di n mostri sul campo che soddisfano ok(p)
  function fieldCombos(s, n, ok) {
    const pool = s.mz.filter((m) => ok(P(m))), res = [], seen = new Set();
    const rec = (start, sel) => {
      if (sel.length === n) { const sig = sel.slice().sort().join('&'); if (!seen.has(sig)) { seen.add(sig); res.push(sel.slice()); } return; }
      for (let i = start; i < pool.length; i++) { sel.push(pool[i]); rec(i + 1, sel); sel.pop(); }
    };
    rec(0, []);
    return res;
  }
  // Xyz con n materiali che soddisfano ok(p): {code, n, ok}
  function xyz(s, add, sp) {
    if (!has(s.extra, sp.code)) return;
    for (const sel of fieldCombos(s, sp.n || 2, sp.ok))
      add(`Xyz ${N(sp.code)} con ${sel.map((m) => N(P(m).c)).join(' + ')}`, sp.code, { summon: 1 }, null, (n) => {
        const mats = sel.map((m) => leaveField(n, m, 'mat').c);
        rm(n.extra, sp.code); summon(n, mon(sp.code, { mats }), 'ss');
      });
  }
  // Link: {code, n: Valore Link, min: numero minimo di materiali (default n), ok(p), valid(ps)}
  // Un mostro Link usato come materiale vale il suo Valore Link (card.link).
  function link(s, add, sp) {
    if (!has(s.extra, sp.code)) return;
    const worth = (m) => C[P(m).c].link || 1;
    for (let size = sp.min || sp.n; size <= sp.n; size++)
      for (const sel of fieldCombos(s, size, sp.ok || (() => true))) {
        if (size !== sp.n && sel.reduce((a, m) => a + worth(m), 0) !== sp.n) continue;
        if (sp.valid && !sp.valid(sel.map(P))) continue;
        const rest = s.mz.slice(); for (const m of sel) rm(rest, m);
        if (rest.some(isLink)) continue;
        add(`Link ${N(sp.code)} usando ${sel.map((m) => N(P(m).c)).join(' + ')}`, sp.code, { summon: 1 }, null,
          (n) => { for (const m of sel) leaveField(n, m, 'gy'); rm(n.extra, sp.code); summon(n, mon(sp.code), 'link'); });
      }
  }
  // Magie: dalla mano oppure Posizionate (codice + '*' nella zona M/T)
  const spellLoc = (s, c) => (has(s.st, c + '*') ? 'st' : has(s.hand, c) ? 'hand' : null);
  const useSpell = (n, c, loc) => { if (loc === 'st') rm(n.st, c + '*'); else rm(n.hand, c); n.gy.push(c); };
  // punteggio del campo finale: const sc = scorer(); sc.it(punti, motivo); return sc.result();
  function scorer() {
    const items = [];
    return {
      it(pts, label) { if (pts) items.push({ pts, label }); },
      result() { let t = 0; for (const x of items) t += x.pts; return { total: Math.round(t * 10) / 10, items }; },
    };
  }
  const evaluate = (s) => H.evaluate(s);

  // ---------------------------------------------------------------- esplorazione (DFS con memo e budget)
  // edges[id][i] corrisponde ad actions(stato)[i]; -1 = mossa non esplorata dal risolutore (rinuncia a un
  // innesco, mosse marginali: restano giocabili a mano); -2 = fine turno senza End Phase (solo punteggio).
  const FLOOR = 1500; // sotto questa quota il budget non viene piu' diviso tra le mosse sorelle
  function Graph(cap) {
    this.cap = cap || 200000;
    this.ids = new Map(); this.keys = []; this.edges = []; this.best = []; this.dist = []; this.term = [];
    this.trunc = []; this.approx = []; this.gen = []; this.endv = []; this.g = 0;
  }
  Graph.prototype.size = function () { return this.keys.length; };
  Graph.prototype.state = function (id) { return fromKey(this.keys[id]); };
  Graph.prototype.id = function (s) {
    const k = key(s);
    let id = this.ids.get(k);
    if (id === undefined) {
      id = this.keys.length; this.ids.set(k, id); this.keys.push(k); this.edges.push(null); this.best.push(null);
      this.dist.push(0); this.term.push(false); this.trunc.push(false); this.approx.push(false); this.gen.push(0); this.endv.push(null);
    }
    return id;
  };
  function endNow(s) { const n = clone(s); n.ph = 'X'; n.pend = []; return evaluate(n).total; } // punteggio chiudendo subito
  // Esplora cio' che e' raggiungibile da s e calcola il miglior punteggio raggiungibile.
  // Il budget (numero di nuovi stati) viene diviso tra le mosse sorelle, cosi' ogni ramo riceve
  // almeno un sondaggio. Dove il budget finisce i nodi restano "trunc" e i loro antenati "approx":
  // una chiamata successiva riparte da li' e affina il risultato.
  Graph.prototype.solve = function (s, budget) {
    const end = this.keys.length + (budget || this.cap);
    let root = this.id(s);
    for (let pass = 0; pass < 40; pass++) { // i passaggi successivi riusano il budget non speso
      const before = this.keys.length;
      root = this.pass(s, end - before);
      if (!this.approx[root] || this.keys.length >= end || this.keys.length === before) break;
    }
    return root;
  };
  Graph.prototype.pass = function (s, budget) {
    const root = this.id(s);
    const g = ++this.g;
    const todo = (id) => this.best[id] === null || (this.approx[id] && this.gen[id] !== g);
    if (!todo(root)) return root;
    const stack = [[root, 0, this.keys.length + budget]];
    const onStack = new Set([root]);
    while (stack.length) {
      const top = stack[stack.length - 1];
      const id = top[0];
      if (top[1] === 0 && (this.edges[id] === null || this.trunc[id])) {
        const st = this.state(id);
        if (st.ph === 'X') { this.edges[id] = []; this.term[id] = true; this.best[id] = evaluate(st).total; }
        else if (this.keys.length > top[2]) { this.edges[id] = []; this.trunc[id] = true; this.best[id] = endNow(st); }
        else {
          this.trunc[id] = false;
          const acts = actions(st, false);
          const real = acts.some((a) => !a.tags.skip);
          let ev = null;
          this.edges[id] = acts.map((a) => {
            if ((a.tags.skip && real) || a.tags.minor) return -1;
            if (a.tags.end && a.next.ph === 'X') { ev = evaluate(a.next).total; return -2; }
            return this.id(a.next);
          });
          this.endv[id] = ev;
        }
      }
      const es = this.edges[id];
      if (top[1] < es.length) {
        const i = top[1]++, to = es[i];
        if (to >= 0 && todo(to) && !onStack.has(to)) {
          const room = top[2] - this.keys.length, left = es.length - i;
          const lim = room >= 2 * FLOOR && left > 1 ? this.keys.length + Math.max(FLOOR, Math.floor(room / left)) : top[2];
          stack.push([to, 0, lim]); onStack.add(to);
        }
        continue;
      }
      if (this.term[id]) { this.dist[id] = 0; this.approx[id] = false; }
      else if (this.trunc[id]) { this.dist[id] = 1; this.approx[id] = true; }
      else {
        let b = -1e9, d = 1e9, ap = false;
        if (this.endv[id] !== null) { b = this.endv[id]; d = 1; }
        for (const to of es) {
          if (to < 0 || this.best[to] === null) continue;
          if (this.approx[to]) ap = true;
          if (this.best[to] > b || (this.best[to] === b && this.dist[to] + 1 < d)) { b = this.best[to]; d = this.dist[to] + 1; }
        }
        this.best[id] = b; this.dist[id] = d; this.approx[id] = ap;
      }
      this.gen[id] = g;
      stack.pop(); onStack.delete(id);
    }
    return root;
  };
  // azioni da un nodo, con miglior punteggio raggiungibile e variante "annullata"
  Graph.prototype.moves = function (id, budget) {
    const acts = actions(this.state(id), true);
    return acts.map((a, i) => {
      let to = this.edges[id] ? this.edges[id][i] : -1;
      if (to === -2) return { label: a.label, card: a.card, tags: a.tags, state: a.next, best: this.endv[id], dist: 0, approx: false, term: true, negState: null };
      if (to === undefined || to < 0 || this.trunc[to]) to = this.solve(a.next, budget);
      return { label: a.label, card: a.card, tags: a.tags, to, state: a.next, best: this.best[to], dist: this.dist[to], approx: this.approx[to], term: this.term[to], negState: a.neg };
    });
  };
  Graph.prototype.bestLine = function (id) {
    const line = [], seen = new Set();
    let cur = id;
    while (!this.term[cur] && this.edges[cur] && this.edges[cur].length && !seen.has(cur)) {
      seen.add(cur);
      const es = this.edges[cur];
      let bi = -1;
      for (let i = 0; i < es.length; i++) {
        const to = es[i];
        if (to < 0 || this.best[to] === null) continue;
        if (bi < 0 || this.best[to] > this.best[es[bi]] || (this.best[to] === this.best[es[bi]] && this.dist[to] < this.dist[es[bi]])) bi = i;
      }
      const ev = this.endv[cur];
      if (ev !== null && (bi < 0 || ev >= this.best[es[bi]])) bi = es.indexOf(-2);
      if (bi < 0) break;
      const a = actions(this.state(cur), false)[bi];
      if (es[bi] === -2) { line.push({ from: cur, to: -2, state: a.next, label: a.label, card: a.card, tags: a.tags }); break; }
      line.push({ from: cur, to: es[bi], state: a.next, label: a.label, card: a.card, tags: a.tags });
      cur = es[bi];
    }
    return line;
  };
  // campi finali raggiungibili da id, ordinati per punteggio: [{score, node, end}]
  // end >= 0: il campo si ottiene da "node" con la mossa di fine turno numero "end"
  Graph.prototype.terminals = function (id, limit) {
    const seen = new Set([id]), q = [id], res = [];
    while (q.length) {
      const x = q.pop();
      if (this.term[x]) { res.push({ score: this.best[x], node: x, end: -1 }); continue; }
      if (this.endv[x] !== null) res.push({ score: this.endv[x], node: x, end: this.edges[x].indexOf(-2) });
      for (const to of this.edges[x] || []) if (to >= 0 && !seen.has(to)) { seen.add(to); q.push(to); }
    }
    res.sort((a, b) => b.score - a.score);
    return { count: res.length, reach: seen.size, top: res.slice(0, limit || 20) };
  };
  // percorso piu' corto da a a b
  Graph.prototype.path = function (a, b) {
    const prev = new Map([[a, null]]); let q = [a];
    while (q.length && !prev.has(b)) {
      const nq = [];
      for (const x of q) { const es = this.edges[x] || []; for (let i = 0; i < es.length; i++) if (es[i] >= 0 && !prev.has(es[i])) { prev.set(es[i], [x, i]); nq.push(es[i]); } }
      q = nq;
    }
    if (!prev.has(b)) return null;
    const line = []; let cur = b;
    while (prev.get(cur)) {
      const [x, i] = prev.get(cur);
      const a2 = actions(this.state(x), false)[i];
      line.unshift({ from: x, to: cur, state: a2.next, label: a2.label, card: a2.card, tags: a2.tags });
      cur = x;
    }
    return line;
  };
  Graph.prototype.lineTo = function (a, t) {
    const line = this.path(a, t.node) || [];
    if (t.end >= 0) { const x = actions(this.state(t.node), false)[t.end]; line.push({ from: t.node, to: -2, state: x.next, label: x.label, card: x.card, tags: x.tags }); }
    return line;
  };

  // K: cassetta degli attrezzi passata al mazzo
  const K = {
    C, N, MAIN, EXTRA, W: deck.weights || {},
    has, rm, uniq, count, flag, setf, addPend, mon, P, unP, negd, clone,
    fieldName, onField, curLv, isEffectMon, isLink, canPlace, canSS, toGY, banish, leaveField, summon,
    normalSummons, synchros, fieldCombos, xyz, link, spellLoc, useSpell, scorer,
  };
  H = deck.setup(K);

  return { deck, C, MAIN, EXTRA, names, N, P, mon, clone, key, fromKey, initial, actions, evaluate, Graph, curLv, fieldName, W: K.W };
}

const Core = { decks, register, createEngine, STAPLES };
if (typeof module !== 'undefined' && module.exports) module.exports = Core;
else root.ComboCore = Core;
})(typeof window !== 'undefined' ? window : globalThis);
