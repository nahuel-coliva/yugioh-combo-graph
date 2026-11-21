/* Motore combo – Structure Deck "Destino Bianco Occhi Blu" (TCG)
 * Modello: turno 1, si gioca per primi, l'avversario non controlla carte.
 * Ogni carta e' codificata a mano come azioni (costo + effetto) su uno stato.
 * Funziona sia in Node (test) sia nel browser (window.Engine).
 */
(function (root) {
'use strict';

// ---------------------------------------------------------------- carte
// k: M mostro / S magia / T trappola / X carta generica.  x: tipo Extra Deck.
// be: mostro "Occhi Blu".  men: menziona "Drago Bianco Occhi Blu" nel testo.
const C = {
  BEWD:    { en: 'Blue-Eyes White Dragon', k: 'M', lv: 8, attr: 'LIGHT', race: 'Dragon', normal: 1, be: 1, atk: 3000, def: 2500 },
  NKSH:    { en: 'Neo Kaiser Sea Horse', k: 'M', lv: 4, attr: 'LIGHT', race: 'Dragon', tuner: 1, men: 1, atk: 1700, def: 1650 },
  ALT:     { en: 'Blue-Eyes Alternative White Dragon', k: 'M', lv: 8, attr: 'LIGHT', race: 'Dragon', be: 1, men: 1, atk: 3000, def: 2500, nons: 1 },
  JET:     { en: 'Blue-Eyes Jet Dragon', k: 'M', lv: 8, attr: 'LIGHT', race: 'Dragon', be: 1, men: 1, atk: 3000, def: 0 },
  ABYSS:   { en: 'Blue-Eyes Abyss Dragon', k: 'M', lv: 8, attr: 'LIGHT', race: 'Dragon', be: 1, men: 1, atk: 2500, def: 2500 },
  DSOW:    { en: 'Dragon Spirit of White', k: 'M', lv: 8, attr: 'LIGHT', race: 'Dragon', be: 1, men: 1, atk: 2500, def: 2000 },
  MAX:     { en: 'Blue-Eyes Chaos MAX Dragon', k: 'M', lv: 8, attr: 'DARK', race: 'Dragon', be: 1, ritual: 1, atk: 4000, def: 0 },
  CHAOSD:  { en: 'Blue-Eyes Chaos Dragon', k: 'M', lv: 8, attr: 'DARK', race: 'Dragon', be: 1, men: 1, ritual: 1, atk: 3000, def: 0 },
  LEGEND:  { en: 'The White Stone of Legend', k: 'M', lv: 1, attr: 'LIGHT', race: 'Dragon', tuner: 1, men: 1, atk: 300, def: 250 },
  ANCIENT: { en: 'The White Stone of Ancients', k: 'M', lv: 1, attr: 'LIGHT', race: 'Dragon', tuner: 1, atk: 600, def: 500 },
  SAGE:    { en: 'Sage with Eyes of Blue', k: 'M', lv: 1, attr: 'LIGHT', race: 'Spellcaster', tuner: 1, atk: 0, def: 1500 },
  MASTER:  { en: 'Master with Eyes of Blue', k: 'M', lv: 1, attr: 'LIGHT', race: 'Spellcaster', tuner: 1, atk: 300, def: 1200 },
  DICT:    { en: 'Dictator of D.', k: 'M', lv: 4, attr: 'DARK', race: 'Spellcaster', men: 1, atk: 1200, def: 1100 },
  NIBIRU:  { en: 'Nibiru, the Primal Being', k: 'M', lv: 11, attr: 'LIGHT', race: 'Rock', atk: 3000, def: 600 },
  ASH:     { en: 'Ash Blossom & Joyous Spring', k: 'M', lv: 3, attr: 'FIRE', race: 'Zombie', tuner: 1, atk: 0, def: 1800 },
  VEILER:  { en: 'Effect Veiler', k: 'M', lv: 1, attr: 'LIGHT', race: 'Spellcaster', tuner: 1, atk: 0, def: 0 },
  MAIDEN:  { en: 'Maiden of White', k: 'M', lv: 1, attr: 'LIGHT', race: 'Spellcaster', tuner: 1, men: 1, atk: 0, def: 0 },
  ROAR:    { en: 'Roar of the Blue-Eyed Dragons', k: 'S', men: 1 },
  CFORM:   { en: 'Chaos Form', k: 'S', men: 1 },
  UFUSION: { en: 'Ultimate Fusion', k: 'S', men: 1, quick: 1 },
  MELODY:  { en: 'The Melody of Awakening Dragon', k: 'S' },
  MAUS:    { en: 'Mausoleum of White', k: 'S', field: 1 },
  BURST:   { en: 'Burst Stream of Destruction', k: 'S', men: 1 },
  TRADE:   { en: 'Trade-In', k: 'S' },
  WISHES:  { en: 'Wishes for Eyes of Blue', k: 'S', men: 1 },
  MAJESTY: { en: 'Majesty of the White Dragons', k: 'T', men: 1 },
  TLIGHT:  { en: 'True Light', k: 'T', men: 1 },
  UCREATURE: { en: 'The Ultimate Creature of Destruction', k: 'T', men: 1 },
  RIVALS:  { en: 'Destined Rivals', k: 'T', men: 1 },
  IMPERM:  { en: 'Infinite Impermanence', k: 'T' },
  INDIGO:  { en: 'Indigo-Eyes Silver Dragon', k: 'M', x: 'xyz', attr: 'LIGHT', race: 'Dragon', atk: 4000, def: 0 },
  SPIRITL: { en: 'Spirit with Eyes of Blue', k: 'M', x: 'link', attr: 'LIGHT', race: 'Dragon', atk: 300 },
  ULT:     { en: 'Blue-Eyes Ultimate Dragon', k: 'M', x: 'fusion', lv: 12, attr: 'LIGHT', race: 'Dragon', be: 1, normal: 1, atk: 4500, def: 3800 },
  NEOULT:  { en: 'Neo Blue-Eyes Ultimate Dragon', k: 'M', x: 'fusion', lv: 12, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 4500, def: 3800 },
  TWIN:    { en: 'Blue-Eyes Twin Burst Dragon', k: 'M', x: 'fusion', lv: 10, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 3000, def: 2500 },
  TYRANT:  { en: 'Blue-Eyes Tyrant Dragon', k: 'M', x: 'fusion', lv: 8, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 3400, def: 2900 },
  SPIRITD: { en: 'Blue-Eyes Spirit Dragon', k: 'M', x: 'synchro', lv: 9, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 2500, def: 3000 },
  AZURE:   { en: 'Azure-Eyes Silver Dragon', k: 'M', x: 'synchro', lv: 9, attr: 'LIGHT', race: 'Dragon', atk: 2500, def: 3000 },
  SEAL:    { en: 'Hieratic Seal of the Heavenly Spheres', k: 'M', x: 'link', attr: 'LIGHT', race: 'Dragon', atk: 0 },
  USPIRIT: { en: 'Blue-Eyes Ultimate Spirit Dragon', k: 'M', x: 'synchro', lv: 12, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 3500, def: 4000 },
  X:       { en: 'Any other card', k: 'X' },
};

// Main Deck dello Structure (Richiamato dalla Tomba e' Proibita in TCG: esclusa).
const MAIN = {
  BEWD: 3, NKSH: 1, ALT: 1, JET: 1, ABYSS: 1, DSOW: 1, MAX: 1, CHAOSD: 1, LEGEND: 1, ANCIENT: 1,
  SAGE: 3, MASTER: 1, DICT: 2, NIBIRU: 1, ASH: 1, VEILER: 2, MAIDEN: 1,
  ROAR: 1, CFORM: 1, UFUSION: 2, MELODY: 2, MAUS: 1, BURST: 1, TRADE: 2, WISHES: 1,
  MAJESTY: 1, TLIGHT: 1, UCREATURE: 1, RIVALS: 1, IMPERM: 1,
};
const EXTRA = { INDIGO: 1, SPIRITL: 1, ULT: 1, NEOULT: 1, TWIN: 1, TYRANT: 1, SPIRITD: 1, AZURE: 1, SEAL: 1, USPIRIT: 1 };

const names = {};
for (const c in C) names[c] = C[c].en;
const N = (c) => names[c] || c;

// ---------------------------------------------------------------- stato
// mostro sul campo = stringa "CODICE~deltaLivello~equip~flag~materiali"
//   flag: S = Synchro Evocato, n = effetti annullati
function mon(c, o) {
  o = o || {};
  return c + '~' + (o.lv || 0) + '~' + (o.eq || '') + '~' + (o.fl || '') + '~' + (o.mats ? o.mats.slice().sort().join('+') : '');
}
function P(m) {
  const a = m.split('~');
  return { c: a[0], lv: +a[1], eq: a[2], fl: a[3], mats: a[4] ? a[4].split('+') : [] };
}
const unP = (p) => mon(p.c, p);

function clone(s) {
  return {
    hand: s.hand.slice(), mz: s.mz.slice(), st: s.st.slice(), fz: s.fz,
    gy: s.gy.slice(), ban: s.ban.slice(), deck: s.deck.slice(), extra: s.extra.slice(),
    f: s.f.slice(), pend: s.pend.slice(), ph: s.ph, draws: s.draws,
  };
}
const srt = (a) => a.slice().sort().join(',');
function key(s) {
  // deck ed extra sono derivabili dal resto: non servono nella chiave
  return srt(s.hand) + '/' + srt(s.mz) + '/' + srt(s.st) + '/' + (s.fz || '') + '/' + srt(s.gy) + '/' +
    srt(s.ban) + '/' + srt(s.f) + '/' + srt(s.pend) + '/' + s.ph + s.draws;
}
function initial(hand) {
  const deck = [];
  for (const c in MAIN) for (let i = 0; i < MAIN[c]; i++) deck.push(c);
  for (const c of hand) {
    if (c === 'X') continue;
    const i = deck.indexOf(c);
    if (i < 0) throw new Error('Troppe copie di ' + c);
    deck.splice(i, 1);
  }
  const extra = [];
  for (const c in EXTRA) for (let i = 0; i < EXTRA[c]; i++) extra.push(c);
  return { hand: hand.slice(), mz: [], st: [], fz: null, gy: [], ban: [], deck, extra, f: [], pend: [], ph: 'M', draws: 0 };
}

const has = (a, c) => a.indexOf(c) >= 0;
function rm(a, c) { const i = a.indexOf(c); if (i < 0) return false; a.splice(i, 1); return true; }
const uniq = (a) => Array.from(new Set(a));
const flag = (s, f) => s.f.indexOf(f) >= 0;
const setf = (s, f) => { if (s.f.indexOf(f) < 0) s.f.push(f); };
const count = (a, c) => { let n = 0; for (const x of a) if (x === c) n++; return n; };

const fieldName = (p) => (p.c === 'ALT' && p.fl.indexOf('n') < 0 ? 'BEWD' : p.c);
const isBEWDf = (m) => fieldName(P(m)) === 'BEWD';
const controlsBEWD = (s) => s.mz.some(isBEWDf);
const gyBEWD = (s) => has(s.gy, 'BEWD') || has(s.gy, 'ALT');
const bewdFieldOrGY = (s) => controlsBEWD(s) || gyBEWD(s);
const negd = (p) => p.fl.indexOf('n') >= 0;
const onField = (s, c) => s.mz.some((m) => { const p = P(m); return p.c === c && !negd(p); });
const curLv = (p) => (C[p.c].lv == null ? null : C[p.c].lv + p.lv);
const isL1LT = (c) => C[c].k === 'M' && C[c].lv === 1 && C[c].attr === 'LIGHT' && C[c].tuner && !C[c].x;
const isEffectMon = (p) => !C[p.c].normal;

const DECK_BE = ['BEWD', 'JET', 'ABYSS', 'DSOW'];             // "Occhi Blu" evocabili dal Deck
const NKSH_SEND = ['BEWD', 'ALT', 'JET', 'ABYSS', 'DSOW', 'MAX', 'CHAOSD', 'LEGEND', 'DICT', 'MAIDEN'];
const MELODY_OK = ['BEWD', 'ALT', 'JET', 'MAX', 'CHAOSD'];
const ABYSS_EP = ['BEWD', 'ALT', 'JET', 'ABYSS', 'DSOW', 'MAX', 'CHAOSD'];
const L1LT = ['MAIDEN', 'SAGE', 'ANCIENT', 'LEGEND', 'MASTER', 'VEILER'];
const MEN_ST = ['ROAR', 'TLIGHT', 'MAJESTY', 'CFORM', 'UFUSION', 'RIVALS', 'UCREATURE', 'WISHES', 'BURST'];

// un mostro puo' essere rievocato dal Cimitero/bandito solo se non ha restrizioni di evocazione
function canRevive(s, c) {
  if (C[c].k !== 'M' || C[c].x || C[c].ritual) return false;
  if (c === 'ALT') return flag(s, 'altOK');
  return true;
}
const locked = (s) => onField(s, 'SPIRITL'); // Spirito con gli Occhi di Blu: solo Draghi
function canPlace(s, c) {
  const n = s.mz.length + 1;
  if (C[c].x === 'link' && s.mz.some((m) => C[P(m).c].x === 'link')) return false;
  if (n <= 5) return true;
  return n === 6 && (!!C[c].x || s.mz.some((m) => C[P(m).c].x));
}
const canSS = (s, c) => (!locked(s) || C[c].race === 'Dragon') && canPlace(s, c);

function addPend(s, t) { if (s.pend.indexOf(t) < 0) s.pend.push(t); }

function toGY(s, c, fromField) {
  s.gy.push(c);
  if (c === 'LEGEND' && rm(s.deck, 'BEWD')) s.hand.push('BEWD'); // innesco obbligatorio
  if (c === 'ANCIENT') setf(s, 'ancSent');
  if (c === 'NKSH' && fromField && !flag(s, 'nkshSend')) addPend(s, 'nkshSend');
}
function leaveField(s, m, dest) {
  const i = s.mz.indexOf(m);
  if (i < 0) throw new Error('mostro non sul campo: ' + m);
  s.mz.splice(i, 1);
  const p = P(m);
  if (p.eq) toGY(s, p.eq, false);
  for (const x of p.mats) toGY(s, x, false);
  if (dest === 'gy') toGY(s, p.c, true);
  else if (dest === 'deck') (C[p.c].x ? s.extra : s.deck).push(p.c);
  else if (dest === 'ban') s.ban.push(p.c);
  return p;
}
// how: 'ns' normale, 'ss' speciale, 'link', 'syn'
function summon(s, m, how) {
  s.mz.push(m);
  const p = P(m);
  const special = how !== 'ns';
  if (special && fieldName(p) === 'BEWD') {
    if (has(s.gy, 'MAIDEN') && !flag(s, 'maidenRev')) addPend(s, 'maidenRev');
    if (has(s.gy, 'UCREATURE') && !flag(s, 'ucSet')) addPend(s, 'ucSet');
  }
  if (special && p.c === 'ABYSS' && !negd(p) && !flag(s, 'abyssS')) addPend(s, 'abyss');
  if (how === 'ns' && p.c === 'SAGE') addPend(s, 'sageNS');
  if (how === 'ns' && p.c === 'MASTER') addPend(s, 'masterNS');
  if (how === 'link' && p.c === 'SPIRITL' && !flag(s, 'spMaus')) addPend(s, 'spMaus');
  if (p.c === 'AZURE') setf(s, 'azure');
}
function pendOK(s, t) {
  switch (t) {
    case 'maidenRev': return has(s.gy, 'MAIDEN') && !flag(s, 'maidenRev') && canSS(s, 'MAIDEN');
    case 'ucSet': return has(s.gy, 'UCREATURE') && !flag(s, 'ucSet');
    case 'abyss': return !flag(s, 'abyssS') && onField(s, 'ABYSS') && bewdFieldOrGY(s) && has(s.deck, 'CFORM');
    case 'sageNS': return onField(s, 'SAGE') && L1LT.some((c) => c !== 'SAGE' && has(s.deck, c));
    case 'masterNS': return onField(s, 'MASTER') && L1LT.some((c) => has(s.gy, c));
    case 'spMaus': return onField(s, 'SPIRITL') && !flag(s, 'spMaus') && has(s.deck, 'MAUS');
    case 'nkshSend': return !flag(s, 'nkshSend') && NKSH_SEND.some((c) => has(s.deck, c));
  }
  return false;
}
function epAvail(s) {
  if (flag(s, 'ancSent') && has(s.gy, 'ANCIENT') && !flag(s, 'ancEP') && DECK_BE.some((c) => has(s.deck, c) && canSS(s, c))) return true;
  if (onField(s, 'ABYSS') && bewdFieldOrGY(s) && !flag(s, 'abyssEP') && ABYSS_EP.some((c) => has(s.deck, c))) return true;
  return false;
}

// ---------------------------------------------------------------- fusioni
// pools: sottoinsieme di ['hand','field','gy'] ; restituisce [{fus, mats:[{loc,v}]}]
function fusionOpts(s, pools) {
  const tok = [];
  if (pools.indexOf('hand') >= 0) for (const c of s.hand) if (C[c].k === 'M') tok.push({ loc: 'hand', v: c, bewd: c === 'BEWD', dragon: C[c].race === 'Dragon' });
  if (pools.indexOf('field') >= 0) for (const m of s.mz) { const p = P(m); tok.push({ loc: 'field', v: m, bewd: fieldName(p) === 'BEWD', dragon: C[p.c].race === 'Dragon' }); }
  if (pools.indexOf('gy') >= 0) for (const c of s.gy) if (C[c].k === 'M') tok.push({ loc: 'gy', v: c, bewd: c === 'BEWD' || c === 'ALT', dragon: C[c].race === 'Dragon' });
  const res = [], seen = new Set();
  const push = (fus, mats) => {
    const sig = fus + '|' + mats.map((t) => t.loc + ':' + t.v).sort().join(',');
    if (seen.has(sig)) return; seen.add(sig); res.push({ fus, mats });
  };
  const b = tok.filter((t) => t.bewd);
  const three = has(s.extra, 'NEOULT') ? 'NEOULT' : has(s.extra, 'ULT') ? 'ULT' : null;
  if (three) for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) for (let k = j + 1; k < b.length; k++) push(three, [b[i], b[j], b[k]]);
  if (has(s.extra, 'TWIN')) for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) push('TWIN', [b[i], b[j]]);
  if (has(s.extra, 'TYRANT')) for (const x of b) for (const y of tok) if (y !== x && y.dragon) push('TYRANT', [x, y]);
  return res;
}
function applyFusion(s, o, dest) {
  for (const t of o.mats) {
    if (t.loc === 'hand') { rm(s.hand, t.v); if (dest === 'gy') toGY(s, t.v, false); else s.deck.push(t.v); }
    else if (t.loc === 'field') leaveField(s, t.v, dest);
    else { rm(s.gy, t.v); (C[t.v].x ? s.extra : s.deck).push(t.v); }
  }
  rm(s.extra, o.fus);
  if (o.fus === 'TYRANT') setf(s, 'tyrOK');
  if (canPlace(s, o.fus)) summon(s, mon(o.fus), 'ss');
}
const matLabel = (o) => o.mats.map((t) => N(t.loc === 'field' ? P(t.v).c : t.v) + (t.loc === 'hand' ? ' (mano)' : t.loc === 'gy' ? ' (Cimitero)' : '')).join(' + ');

// ---------------------------------------------------------------- azioni
function actions(s, withNeg) {
  const out = [];
  if (s.ph === 'X') return out;
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
  function fin(n) {
    if (n.pend.length) n.pend = n.pend.filter((t) => pendOK(n, t));
    if (n.ph === 'E' && !n.pend.length && !epAvail(n)) n.ph = 'X';
  }

  // ---------- inneschi in sospeso: si attivano ora oppure si perdono
  if (s.pend.length) {
    {
      const t = s.pend.slice().sort()[0];
      const done = (n) => { rm(n.pend, t); };
      if (t === 'maidenRev') add(`${N('MAIDEN')}: si Evoca Specialmente dal Cimitero`, 'MAIDEN', { summon: 1 },
        (n) => { done(n); setf(n, 'maidenRev'); }, (n) => { rm(n.gy, 'MAIDEN'); summon(n, mon('MAIDEN'), 'ss'); });
      if (t === 'ucSet') add(`${N('UCREATURE')}: si Posiziona dal Cimitero`, 'UCREATURE', {},
        (n) => { done(n); setf(n, 'ucSet'); }, (n) => { rm(n.gy, 'UCREATURE'); n.st.push('UCREATURE*'); });
      if (t === 'abyss') add(`${N('ABYSS')}: aggiungi ${N('CFORM')} dal Deck`, 'ABYSS', { ash: 1, mon: 1 },
        (n) => { done(n); setf(n, 'abyssS'); }, (n) => { rm(n.deck, 'CFORM'); n.hand.push('CFORM'); });
      if (t === 'sageNS') for (const c of L1LT) if (c !== 'SAGE' && has(s.deck, c))
        add(`${N('SAGE')}: aggiungi ${N(c)} dal Deck`, 'SAGE', { ash: 1, mon: 1 }, done, (n) => { rm(n.deck, c); n.hand.push(c); });
      if (t === 'masterNS') for (const c of L1LT) if (has(s.gy, c))
        add(`${N('MASTER')}: riprendi ${N(c)} dal Cimitero`, 'MASTER', { mon: 1 }, done, (n) => { rm(n.gy, c); n.hand.push(c); });
      if (t === 'spMaus') {
        add(`${N('SPIRITL')}: aggiungi ${N('MAUS')} alla mano`, 'SPIRITL', { ash: 1, mon: 1 }, (n) => { done(n); setf(n, 'spMaus'); }, (n) => { rm(n.deck, 'MAUS'); n.hand.push('MAUS'); });
        add(`${N('SPIRITL')}: manda ${N('MAUS')} al Cimitero`, 'SPIRITL', { ash: 1, mon: 1 }, (n) => { done(n); setf(n, 'spMaus'); }, (n) => { rm(n.deck, 'MAUS'); toGY(n, 'MAUS', false); });
      }
      if (t === 'nkshSend') for (const c of NKSH_SEND) if (has(s.deck, c))
        add(`${N('NKSH')}: manda ${N(c)} dal Deck al Cimitero`, 'NKSH', { ash: 1 }, (n) => { done(n); setf(n, 'nkshSend'); }, (n) => { rm(n.deck, c); toGY(n, c, false); });
      add('Non attivare questo effetto', null, { skip: 1 }, done);
    }
    return out;
  }

  // ---------- End Phase
  if (s.ph === 'E') {
    if (flag(s, 'ancSent') && has(s.gy, 'ANCIENT') && !flag(s, 'ancEP'))
      for (const c of DECK_BE) if (has(s.deck, c) && canSS(s, c))
        add(`End Phase – ${N('ANCIENT')}: Evoca ${N(c)} dal Deck`, 'ANCIENT', { ash: 1, summon: 1 }, (n) => setf(n, 'ancEP'), (n) => { rm(n.deck, c); summon(n, mon(c), 'ss'); });
    if (onField(s, 'ABYSS') && bewdFieldOrGY(s) && !flag(s, 'abyssEP'))
      for (const c of [ABYSS_EP.find((x) => has(s.deck, x))]) if (c)
        add(`End Phase – ${N('ABYSS')}: aggiungi ${N(c)} dal Deck`, 'ABYSS', { ash: 1, mon: 1 }, (n) => setf(n, 'abyssEP'), (n) => { rm(n.deck, c); n.hand.push(c); });
    add('Concludi il turno', null, { end: 1 }, (n) => { n.ph = 'X'; });
    return out;
  }

  const hand = uniq(s.hand);
  const fieldU = uniq(s.mz);

  // ---------- Evocazione Normale
  for (const c of hand) {
    const d = C[c];
    if (d.k !== 'M' || d.lv > 4 || d.ritual || d.nons) continue;
    let slot = null;
    if (isL1LT(c) && s.fz === 'MAUS' && !flag(s, 'ns2')) slot = 'ns2';
    else if (!flag(s, 'ns')) slot = 'ns';
    if (!slot || !canPlace(s, c)) continue;
    add(`Evoca Normalmente ${N(c)}` + (slot === 'ns2' ? ` (extra del ${N('MAUS')})` : ''), c, c === 'ASH' ? { summon: 1, minor: 1 } : { summon: 1 }, null,
      (n) => { setf(n, slot); rm(n.hand, c); summon(n, mon(c), 'ns'); });
  }

  // ---------- effetti dalla mano
  if (has(s.hand, 'NKSH') && !flag(s, 'nkshSS') && controlsBEWD(s) && canSS(s, 'NKSH'))
    add(`${N('NKSH')}: si Evoca Specialmente dalla mano`, 'NKSH', { summon: 1 }, null, (n) => { setf(n, 'nkshSS'); rm(n.hand, 'NKSH'); summon(n, mon('NKSH'), 'ss'); });
  if (has(s.hand, 'ALT') && has(s.hand, 'BEWD') && !flag(s, 'altSS') && canSS(s, 'ALT'))
    add(`${N('ALT')}: rivela ${N('BEWD')} e si Evoca Specialmente`, 'ALT', { summon: 1 }, null, (n) => { setf(n, 'altSS'); setf(n, 'altOK'); rm(n.hand, 'ALT'); summon(n, mon('ALT'), 'ss'); });
  if (has(s.hand, 'SAGE') && !flag(s, 'sageD'))
    for (const m of fieldU) if (isEffectMon(P(m)))
      for (const c of DECK_BE) if (has(s.deck, c))
        add(`${N('SAGE')} (scarta): manda ${N(P(m).c)} al Cimitero, Evoca ${N(c)} dal Deck`, 'SAGE', { ash: 1, summon: 1 },
          (n) => { setf(n, 'sageD'); rm(n.hand, 'SAGE'); toGY(n, 'SAGE', false); },
          (n) => { leaveField(n, m, 'gy'); if (canSS(n, c)) { rm(n.deck, c); summon(n, mon(c), 'ss'); } });
  if (!flag(s, 'maidenTL')) {
    const srcs = [];
    if (has(s.deck, 'TLIGHT')) srcs.push(['deck', 'dal Deck']);
    if (has(s.hand, 'TLIGHT')) srcs.push(['hand', 'dalla mano']);
    if (has(s.gy, 'TLIGHT')) srcs.push(['gy', 'dal Cimitero']);
    for (const [loc, txt] of srcs) {
      const eff = (n) => { rm(n[loc], 'TLIGHT'); n.st.push('TLIGHT'); };
      if (has(s.hand, 'MAIDEN'))
        add(`${N('MAIDEN')} (dalla mano al Cimitero): metti ${N('TLIGHT')} ${txt} scoperta`, 'MAIDEN', {}, (n) => { setf(n, 'maidenTL'); rm(n.hand, 'MAIDEN'); toGY(n, 'MAIDEN', false); }, eff);
      for (const m of fieldU) if (P(m).c === 'MAIDEN' && !negd(P(m)))
        add(`${N('MAIDEN')} (dal campo al Cimitero): metti ${N('TLIGHT')} ${txt} scoperta`, 'MAIDEN', { mon: 1 }, (n) => { setf(n, 'maidenTL'); leaveField(n, m, 'gy'); }, eff);
    }
  }
  if (has(s.hand, 'DICT') && !flag(s, 'dict1') && canSS(s, 'DICT'))
    for (const loc of ['deck', 'hand']) if (has(s[loc], 'BEWD'))
      add(`${N('DICT')}: manda ${N('BEWD')} ${loc === 'deck' ? 'dal Deck' : 'dalla mano'} al Cimitero e si Evoca Specialmente`, 'DICT', { summon: 1 },
        (n) => { setf(n, 'dict1'); rm(n[loc], 'BEWD'); toGY(n, 'BEWD', false); }, (n) => { rm(n.hand, 'DICT'); summon(n, mon('DICT'), 'ss'); });

  // ---------- effetti di mostri sul campo / nel Cimitero
  if (onField(s, 'DICT') && !flag(s, 'dict2'))
    for (const d of hand) if (d === 'BEWD' || C[d].men) {
      const t = clone(s); rm(t.hand, d); toGY(t, d, false);
      for (const c of uniq(t.gy)) if (C[c].be && canRevive(t, c) && canSS(t, c))
        add(`${N('DICT')}: scarta ${N(d)}, Evoca ${N(c)} dal Cimitero`, 'DICT', { mon: 1, summon: 1 },
          (n) => { setf(n, 'dict2'); rm(n.hand, d); toGY(n, d, false); }, (n) => { if (rm(n.gy, c)) summon(n, mon(c), 'ss'); });
    }
  if (has(s.gy, 'MASTER') && !flag(s, 'masterG'))
    for (const m of fieldU) if (isEffectMon(P(m)))
      for (const c of uniq(s.gy)) if (C[c].be && canRevive(s, c))
        add(`${N('MASTER')} (dal Cimitero nel Deck): manda ${N(P(m).c)} al Cimitero, Evoca ${N(c)} dal Cimitero`, 'MASTER', { summon: 1 },
          (n) => { setf(n, 'masterG'); rm(n.gy, 'MASTER'); n.deck.push('MASTER'); },
          (n) => { leaveField(n, m, 'gy'); if (canSS(n, c) && rm(n.gy, c)) summon(n, mon(c), 'ss'); });
  if (has(s.gy, 'ANCIENT') && !flag(s, 'ancG'))
    for (const c of uniq(s.gy)) if (C[c].be && !C[c].x)
      add(`${N('ANCIENT')} (bandita dal Cimitero): riprendi ${N(c)} in mano`, 'ANCIENT', {},
        (n) => { setf(n, 'ancG'); rm(n.gy, 'ANCIENT'); n.ban.push('ANCIENT'); }, (n) => { rm(n.gy, c); n.hand.push(c); });
  if (onField(s, 'NKSH') && !flag(s, 'nkshLv'))
    for (const m of fieldU) {
      const p = P(m);
      if (!C[p.c].tuner || C[p.c].attr !== 'LIGHT') continue;
      for (const d of [1, -1]) {
        if (curLv(p) + d < 1) continue;
        add(`${N('NKSH')}: Livello di ${N(p.c)} ${d > 0 ? '+1' : '-1'} (diventa ${curLv(p) + d})`, 'NKSH', { mon: 1 }, (n) => setf(n, 'nkshLv'),
          (n) => { const i = n.mz.indexOf(m); const q = P(m); q.lv += d; n.mz[i] = unP(q); });
      }
    }

  // ---------- Magie (dalla mano, o Posizionate da Vera Luce)
  const spellLoc = (c) => (has(s.st, c + '*') ? 'st' : has(s.hand, c) ? 'hand' : null);
  const useSpell = (n, c, loc) => { if (loc === 'st') rm(n.st, c + '*'); else rm(n.hand, c); n.gy.push(c); };
  let loc;

  if ((loc = spellLoc('ROAR')) && !flag(s, 'roar')) {
    const L = loc, cb = controlsBEWD(s), opts = [];
    for (const c of DECK_BE) if (has(s.deck, c)) opts.push(['deck', c, 'dal Deck']);
    for (const c of uniq(s.gy)) if (C[c].be && canRevive(s, c)) opts.push(['gy', c, 'dal Cimitero']);
    for (const c of uniq(s.ban)) if (C[c].be && canRevive(s, c)) opts.push(['ban', c, 'dai banditi']);
    for (const [from, c, txt] of opts) {
      if (!cb && !(c === 'BEWD' || (c === 'ALT' && from === 'gy'))) continue;
      if (!canSS(s, c)) continue;
      add(`${N('ROAR')}: Evoca ${N(c)} ${txt}`, 'ROAR', { ash: 1, summon: 1 }, (n) => { setf(n, 'roar'); useSpell(n, 'ROAR', L); }, (n) => { rm(n[from], c); summon(n, mon(c), 'ss'); });
    }
  }
  if (has(s.gy, 'ROAR') && !flag(s, 'roar'))
    for (const o of fusionOpts(s, ['hand', 'field']))
      add(`${N('ROAR')} (bandito dal Cimitero): Fusione ${N(o.fus)} con ${matLabel(o)}`, 'ROAR', { summon: 1 },
        (n) => { setf(n, 'roar'); rm(n.gy, 'ROAR'); n.ban.push('ROAR'); }, (n) => applyFusion(n, o, 'gy'));

  // Rituali: Forma del Chaos (tributi dalla mano/campo o bandendo BEWD dal Cimitero, Livello totale = 8)
  const rituals = hand.filter((c) => C[c].ritual);
  if ((loc = spellLoc('CFORM')) && rituals.length) {
    const L = loc;
    for (const r of rituals) {
      if (!canPlace(s, r)) continue;
      const fin2 = (n) => { if (rm(n.hand, r) && canPlace(n, r)) summon(n, mon(r, { fl: 'R' }), 'ss'); };
      for (const g of uniq(s.gy)) if (g === 'BEWD' || g === 'ALT')
        add(`${N('CFORM')}: bandisci ${N(g)} dal Cimitero, Rituale ${N(r)}`, 'CFORM', { summon: 1 }, (n) => useSpell(n, 'CFORM', L), (n) => { rm(n.gy, g); n.ban.push(g); fin2(n); });
      const tk = [];
      const h2 = s.hand.slice(); rm(h2, r);
      for (const c of uniq(h2)) if (C[c].k === 'M' && C[c].lv) tk.push({ loc: 'hand', v: c, lv: C[c].lv, n: count(h2, c) });
      for (const m of fieldU) { const lv = curLv(P(m)); if (lv) tk.push({ loc: 'field', v: m, lv, n: count(s.mz, m) }); }
      const pay = (n, t) => { if (t.loc === 'hand') { rm(n.hand, t.v); toGY(n, t.v, false); } else leaveField(n, t.v, 'gy'); };
      const tl = (t) => N(t.loc === 'hand' ? t.v : P(t.v).c) + (t.loc === 'hand' ? ' (mano)' : '');
      for (let i = 0; i < tk.length; i++) {
        if (tk[i].lv === 8) add(`${N('CFORM')}: tributa ${tl(tk[i])}, Rituale ${N(r)}`, 'CFORM', { summon: 1 }, (n) => useSpell(n, 'CFORM', L), (n) => { pay(n, tk[i]); fin2(n); });
        for (let j = i; j < tk.length; j++) {
          if (i === j && tk[i].n < 2) continue;
          if (tk[i].lv + tk[j].lv === 8) add(`${N('CFORM')}: tributa ${tl(tk[i])} + ${tl(tk[j])}, Rituale ${N(r)}`, 'CFORM', { summon: 1 }, (n) => useSpell(n, 'CFORM', L), (n) => { pay(n, tk[i]); pay(n, tk[j]); fin2(n); });
        }
      }
    }
  }
  if (has(s.gy, 'MAJESTY') && !flag(s, 'majG') && rituals.length)
    for (const r of rituals) {
      const cost = (n) => { setf(n, 'majG'); rm(n.gy, 'MAJESTY'); n.ban.push('MAJESTY'); };
      const fin2 = (n) => { if (rm(n.hand, r) && canPlace(n, r)) summon(n, mon(r, { fl: 'R' }), 'ss'); };
      if (has(s.hand, 'BEWD')) add(`${N('MAJESTY')} (bandita dal Cimitero): tributa ${N('BEWD')} (mano), Rituale ${N(r)}`, 'MAJESTY', { summon: 1 }, cost, (n) => { rm(n.hand, 'BEWD'); toGY(n, 'BEWD', false); fin2(n); });
      for (const m of fieldU) if (isBEWDf(m) && curLv(P(m)) === 8)
        add(`${N('MAJESTY')} (bandita dal Cimitero): tributa ${N(P(m).c)}, Rituale ${N(r)}`, 'MAJESTY', { summon: 1 }, cost, (n) => { leaveField(n, m, 'gy'); fin2(n); });
    }

  if (has(s.hand, 'UFUSION') && !flag(s, 'uf'))
    for (const o of fusionOpts(s, ['hand', 'field', 'gy']))
      add(`${N('UFUSION')}: Fusione ${N(o.fus)} rimescolando ${matLabel(o)}`, 'UFUSION', { summon: 1 },
        (n) => { setf(n, 'uf'); rm(n.hand, 'UFUSION'); n.gy.push('UFUSION'); }, (n) => applyFusion(n, o, 'deck'));

  if (has(s.hand, 'MELODY')) {
    const h2 = s.hand.slice(); rm(h2, 'MELODY');
    const pool = [];
    for (const c of MELODY_OK) for (let i = 0; i < Math.min(2, count(s.deck, c)); i++) pool.push(c);
    const picks = [], seen = new Set();
    if (pool.length === 1) picks.push([pool[0]]);
    for (let i = 0; i < pool.length; i++) for (let j = i + 1; j < pool.length; j++) {
      const k = pool[i] + '+' + pool[j];
      if (!seen.has(k)) { seen.add(k); picks.push([pool[i], pool[j]]); }
    }
    for (const d of uniq(h2)) for (const pk of picks)
      add(`${N('MELODY')}: scarta ${N(d)}, aggiungi ${pk.map(N).join(' + ')}`, 'MELODY', { ash: 1 },
        (n) => { rm(n.hand, 'MELODY'); n.gy.push('MELODY'); rm(n.hand, d); toGY(n, d, false); },
        (n) => { for (const c of pk) { rm(n.deck, c); n.hand.push(c); } });
  }

  if (has(s.hand, 'MAUS') && !s.fz)
    add(`Attiva ${N('MAUS')} (Magia Terreno)`, 'MAUS', {}, null, (n) => { rm(n.hand, 'MAUS'); n.fz = 'MAUS'; });
  if (s.fz === 'MAUS' && !flag(s, 'mausE') && s.mz.length) {
    for (const [from, c, txt] of [['deck', 'BEWD', 'dal Deck'], ['hand', 'BEWD', 'dalla mano'], ['hand', 'DSOW', 'dalla mano']])
      if (has(s[from], c))
        add(`${N('MAUS')}: manda ${N(c)} ${txt} al Cimitero`, 'MAUS', { ash: 1 }, (n) => setf(n, 'mausE'), (n) => { rm(n[from], c); toGY(n, c, false); });
  }

  if (has(s.hand, 'TRADE'))
    for (const d of hand) if (C[d].k === 'M' && C[d].lv === 8)
      add(`${N('TRADE')}: scarta ${N(d)}, pesca 2`, 'TRADE', { draw: 1 }, (n) => { rm(n.hand, 'TRADE'); n.gy.push('TRADE'); rm(n.hand, d); toGY(n, d, false); }, (n) => { n.draws += 2; });

  if ((loc = spellLoc('WISHES')) && !flag(s, 'wishA')) {
    const L = loc;
    const h2 = s.hand.slice(); if (L === 'hand') rm(h2, 'WISHES');
    const tun = L1LT.filter((c) => has(s.deck, c));
    const sts = MEN_ST.filter((c) => c !== 'WISHES' && has(s.deck, c));
    if (tun.length && sts.length)
      for (const d of uniq(h2)) for (const t of tun) for (const x of sts)
        add(`${N('WISHES')}: scarta ${N(d)}, aggiungi ${N(t)} + ${N(x)}`, 'WISHES', x === 'BURST' ? { ash: 1, minor: 1 } : { ash: 1 },
          (n) => { setf(n, 'wishA'); useSpell(n, 'WISHES', L); rm(n.hand, d); toGY(n, d, false); },
          (n) => { rm(n.deck, t); n.hand.push(t); rm(n.deck, x); n.hand.push(x); });
  }
  if (has(s.gy, 'WISHES') && !flag(s, 'wishG')) {
    const eqc = ['NEOULT', 'ULT', 'TWIN'].find((c) => has(s.extra, c));
    if (eqc) for (const m of fieldU) if (isBEWDf(m) && !P(m).eq)
      add(`${N('WISHES')} (bandita dal Cimitero): equipaggia ${N(eqc)} a ${N(P(m).c)}`, 'WISHES', {},
        (n) => { setf(n, 'wishG'); rm(n.gy, 'WISHES'); n.ban.push('WISHES'); },
        (n) => { const i = n.mz.indexOf(m); const q = P(m); q.eq = eqc; rm(n.extra, eqc); n.mz[i] = unP(q); });
  }
  if (has(s.extra, 'TYRANT'))
    for (const m of fieldU) { const p = P(m); if (isBEWDf(m) && p.eq && C[p.eq].x === 'fusion')
      add(`Tributa ${N(p.c)} equipaggiato: Evoca ${N('TYRANT')} dall'Extra Deck`, 'TYRANT', { summon: 1 }, null,
        (n) => { leaveField(n, m, 'gy'); rm(n.extra, 'TYRANT'); setf(n, 'tyrOK'); summon(n, mon('TYRANT'), 'ss'); }); }

  // ---------- Vera Luce scoperta
  if (has(s.st, 'TLIGHT') && !flag(s, 'tl')) {
    const cost = (n) => setf(n, 'tl');
    if (has(s.hand, 'BEWD') && canSS(s, 'BEWD')) add(`${N('TLIGHT')}: Evoca ${N('BEWD')} dalla mano`, 'TLIGHT', { summon: 1 }, cost, (n) => { rm(n.hand, 'BEWD'); summon(n, mon('BEWD'), 'ss'); });
    for (const c of ['BEWD', 'ALT']) if (has(s.gy, c) && canRevive(s, c) && canSS(s, c))
      add(`${N('TLIGHT')}: Evoca ${N(c)} dal Cimitero`, 'TLIGHT', { summon: 1 }, cost, (n) => { rm(n.gy, c); summon(n, mon(c), 'ss'); });
    const ctrl = new Set(s.st.map((x) => x.replace('*', '')).concat(s.gy));
    for (const c of MEN_ST) if (has(s.deck, c) && !ctrl.has(c))
      add(`${N('TLIGHT')}: Posiziona ${N(c)} dal Deck`, 'TLIGHT', {}, cost, (n) => { rm(n.deck, c); n.st.push(c + '*'); });
  }

  // ---------- Extra Deck
  const lvMons = fieldU.filter((m) => curLv(P(m)) != null);
  if (has(s.extra, 'SPIRITL') && !s.mz.some((m) => C[P(m).c].x === 'link'))
    for (const m of lvMons) { const p = P(m); if (curLv(p) <= 4 && (C[p.c].race === 'Dragon' || C[p.c].race === 'Spellcaster'))
      add(`Link ${N('SPIRITL')} usando ${N(p.c)}`, 'SPIRITL', { summon: 1 }, null, (n) => { leaveField(n, m, 'gy'); rm(n.extra, 'SPIRITL'); summon(n, mon('SPIRITL'), 'link'); }); }
  if (has(s.extra, 'SEAL')) {
    const dr = s.mz.filter((m) => C[P(m).c].race === 'Dragon'), seen = new Set();
    for (let i = 0; i < dr.length; i++) for (let j = i + 1; j < dr.length; j++) {
      const sig = [dr[i], dr[j]].sort().join('&'); if (seen.has(sig)) continue; seen.add(sig);
      const rest = s.mz.slice(); rm(rest, dr[i]); rm(rest, dr[j]);
      if (rest.some((m) => C[P(m).c].x === 'link')) continue;
      add(`Link ${N('SEAL')} usando ${N(P(dr[i]).c)} + ${N(P(dr[j]).c)}`, 'SEAL', { summon: 1 }, null,
        (n) => { leaveField(n, dr[i], 'gy'); leaveField(n, dr[j], 'gy'); rm(n.extra, 'SEAL'); summon(n, mon('SEAL'), 'link'); });
    }
  }
  if (onField(s, 'SPIRITL') && !flag(s, 'spSS')) {
    const sp = s.mz.find((m) => P(m).c === 'SPIRITL');
    const cost = (n) => { setf(n, 'spSS'); leaveField(n, sp, 'gy'); };
    for (const c of hand) if (C[c].be && !C[c].ritual && c !== 'ALT')
      add(`${N('SPIRITL')} (si tributa): Evoca ${N(c)} dalla mano`, 'SPIRITL', { mon: 1, summon: 1 }, cost, (n) => { rm(n.hand, c); summon(n, mon(c), 'ss'); });
    for (const c of uniq(s.gy)) if (C[c].be && canRevive(s, c)) {
      const eff = !C[c].normal && c !== 'DSOW'; // Drago Spirito del Bianco e' Normale nel Cimitero
      add(`${N('SPIRITL')} (si tributa): Evoca ${N(c)} dal Cimitero` + (eff ? ' (effetti annullati)' : ''), 'SPIRITL', { mon: 1, summon: 1 }, cost,
        (n) => { rm(n.gy, c); summon(n, mon(c, { fl: eff ? 'n' : '' }), 'ss'); });
    }
  }
  if (has(s.extra, 'INDIGO')) {
    const l8 = s.mz.filter((m) => { const p = P(m); return curLv(p) === 8 && C[p.c].race === 'Dragon'; }), seen = new Set();
    for (let i = 0; i < l8.length; i++) for (let j = i + 1; j < l8.length; j++) {
      const sig = [l8[i], l8[j]].sort().join('&'); if (seen.has(sig)) continue; seen.add(sig);
      add(`Xyz ${N('INDIGO')} con ${N(P(l8[i]).c)} + ${N(P(l8[j]).c)}`, 'INDIGO', { summon: 1 }, null, (n) => {
        const a = leaveField(n, l8[i], 'mat'), b = leaveField(n, l8[j], 'mat');
        rm(n.extra, 'INDIGO'); summon(n, mon('INDIGO', { mats: [a.c, b.c] }), 'ss');
      });
    }
  }
  if (!flag(s, 'indigo'))
    for (const m of fieldU) {
      const p = P(m);
      if (p.c !== 'INDIGO' || negd(p) || !p.mats.length) continue;
      for (const d of uniq(p.mats)) {
        const t = clone(s); t.gy.push(d);
        const tg = [];
        for (const c of ['BEWD', 'DSOW']) if (has(t.gy, c)) tg.push(['gy', c, 'dal Cimitero']);
        if (has(s.ban, 'BEWD')) tg.push(['ban', 'BEWD', 'dai banditi']);
        for (const [from, c, txt] of tg) if (canSS(s, c))
          add(`${N('INDIGO')}: stacca ${N(d)}, Evoca ${N(c)} ${txt} (+1000 ATK)`, 'INDIGO', { mon: 1, summon: 1 },
            (n) => { setf(n, 'indigo'); const i = n.mz.indexOf(m); const q = P(m); rm(q.mats, d); n.mz[i] = unP(q); toGY(n, d, false); },
            (n) => { if (rm(n[from], c)) summon(n, mon(c), 'ss'); });
      }
    }
  // Synchro
  if (lvMons.length >= 2) {
    const fm = s.mz.filter((m) => curLv(P(m)) != null);
    const seen = new Set();
    for (let mask = 1; mask < (1 << fm.length); mask++) {
      const sel = []; for (let i = 0; i < fm.length; i++) if (mask & (1 << i)) sel.push(fm[i]);
      if (sel.length < 2) continue;
      const ps = sel.map(P);
      const tun = ps.filter((p) => C[p.c].tuner), non = ps.filter((p) => !C[p.c].tuner);
      if (!tun.length || !non.length) continue;
      const tot = ps.reduce((a, p) => a + curLv(p), 0);
      const res = [];
      if (tot === 9 && tun.length === 1 && non.every((p) => C[p.c].be)) res.push('SPIRITD');
      if (tot === 9 && tun.length === 1 && non.every((p) => C[p.c].normal)) res.push('AZURE');
      if (tot === 12 && tun.length >= 2 && non.length === 1 && C[non[0].c].be) res.push('USPIRIT');
      for (const r of res) {
        if (!has(s.extra, r)) continue;
        const sig = r + '|' + sel.slice().sort().join('&'); if (seen.has(sig)) continue; seen.add(sig);
        add(`Synchro ${N(r)} con ${ps.map((p) => N(p.c)).join(' + ')}`, r, { summon: 1 }, null,
          (n) => { for (const m of sel) leaveField(n, m, 'gy'); rm(n.extra, r); summon(n, mon(r, { fl: 'S' }), 'syn'); });
      }
    }
  }
  if (has(s.extra, 'TWIN')) {
    const b = s.mz.filter(isBEWDf), seen = new Set();
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
      const sig = [b[i], b[j]].sort().join('&'); if (seen.has(sig)) continue; seen.add(sig);
      add(`${N('TWIN')}: manda ${N(P(b[i]).c)} + ${N(P(b[j]).c)} dal campo al Cimitero (senza Polimerizzazione)`, 'TWIN', { summon: 1 }, null,
        (n) => { leaveField(n, b[i], 'gy'); leaveField(n, b[j], 'gy'); rm(n.extra, 'TWIN'); summon(n, mon('TWIN'), 'ss'); });
    }
  }

  add('Fine turno', null, { end: 1 }, null, (n) => { n.ph = 'E'; n.pend = []; });
  return out;
}

// ---------------------------------------------------------------- valutazione del campo finale
const W = {
  uspirit: 30, spiritdGY: 10, spiritdTrib: 18, spiritdAzure: 5, seal: 14, majesty: 8, rivals: 12, ucreature: 5,
  ufusionBase: 4, ufusionPer: 6, tlight: 3, tlightSS: 3, max: 10, chaosd: 7, jet: 8, azure: 5, tyrant: 5,
  maiden: 4, dsow: 2, body: 2, indigoMat: 3, hand: 1.5, draw: 1.5, handtrap: 6, roarGY: 2, ancGY: 1.5, misc: 1,
};
function evaluate(s) {
  const items = [];
  const it = (pts, label) => { if (pts) items.push({ pts, label }); };
  const ps = s.mz.map(P);
  const hasST = (c) => has(s.hand, c) || has(s.st, c + '*');
  const fieldB = s.mz.filter(isBEWDf).length;
  for (const p of ps) {
    if (p.c === 'USPIRIT') it(W.uspirit, `${N('USPIRIT')}: annulla un'attivazione sul campo (Effetto Rapido)`);
    if (p.c === 'SPIRITD') {
      it(W.spiritdGY, `${N('SPIRITD')}: annulla un effetto attivato nel Cimitero`);
      if (p.fl.indexOf('S') >= 0) {
        if (has(s.extra, 'USPIRIT')) it(W.spiritdTrib, `${N('SPIRITD')}: si tributa per ${N('USPIRIT')} (negazione fino alla End Phase)`);
        else if (has(s.extra, 'AZURE')) it(W.spiritdAzure, `${N('SPIRITD')}: si tributa per ${N('AZURE')} (protegge i Draghi)`);
      }
    }
    if (p.c === 'SEAL') it(W.seal, `${N('SEAL')}: tributa un mostro e fa tornare in mano 1 carta scoperta`);
    if (p.c === 'MAX') it(W.max, `${N('MAX')}: 4000 ATK, non bersagliabile ne' distruttibile da effetti`);
    if (p.c === 'CHAOSD') it(W.chaosd, `${N('CHAOSD')}: non bersagliabile ne' distruttibile da effetti`);
    if (p.c === 'JET' && !negd(p) && bewdFieldOrGY(s)) it(W.jet, `${N('JET')}: le altre tue carte non vengono distrutte da effetti`);
    if (p.c === 'TYRANT') it(W.tyrant, `${N('TYRANT')}: immune alle Trappole`);
    if (p.c === 'MAIDEN') it(W.maiden, `${N('MAIDEN')}: se bersagliata rievoca un ${N('BEWD')}/Tuner dal Cimitero`);
    if (p.c === 'DSOW') it(W.dsow, `${N('DSOW')}: si tributa per evocare ${N('BEWD')} dalla mano`);
    if (p.c === 'INDIGO' && p.mats.length) it(W.indigoMat, `${N('INDIGO')}: ha ancora materiali per il prossimo turno`);
    if ((C[p.c].atk || 0) >= 3000) it(W.body, `${N(p.c)}: ${C[p.c].atk} ATK sul campo`);
  }
  if (flag(s, 'azure')) it(W.azure, `${N('AZURE')}: i tuoi Draghi non sono bersagliabili/distruttibili fino al prossimo turno`);
  if (hasST('MAJESTY')) {
    const nb = Math.min(3, count(s.hand, 'BEWD') + fieldB + count(s.gy, 'BEWD') + count(s.gy, 'ALT'));
    it(W.majesty * nb, `${N('MAJESTY')} Posizionata: distrugge fino a ${nb} carte`);
  }
  if (hasST('RIVALS') && controlsBEWD(s)) it(W.rivals, `${N('RIVALS')} Posizionata: annulla tutti i mostri avversari`);
  if (hasST('UCREATURE') && ps.some((p) => C[p.c].be)) it(W.ucreature, `${N('UCREATURE')} Posizionata: un "Occhi Blu" immune agli effetti`);
  if (hasST('UFUSION') && fusionOpts(s, ['hand', 'field', 'gy']).length)
    it(W.ufusionBase + W.ufusionPer * Math.min(3, fieldB), `${N('UFUSION')} Posizionata: Fusione nel turno avversario, distrugge fino a ${Math.min(3, fieldB)} carte`);
  if (has(s.st, 'TLIGHT')) {
    it(W.tlight, `${N('TLIGHT')}: ${N('BEWD')} non bersagliabile`);
    if (has(s.hand, 'BEWD') || has(s.gy, 'BEWD')) it(W.tlightSS, `${N('TLIGHT')}: puo' evocare ${N('BEWD')} nel turno avversario`);
  }
  for (const c of ['ASH', 'VEILER', 'IMPERM', 'NIBIRU']) { const n = count(s.hand, c); if (n) it(W.handtrap * n, `${N(c)} in mano` + (n > 1 ? ` x${n}` : '')); }
  const special = { ASH: 1, VEILER: 1, IMPERM: 1, NIBIRU: 1, MAJESTY: 1, RIVALS: 1, UCREATURE: 1, UFUSION: 1 };
  const other = s.hand.filter((c) => !special[c]).length;
  it(W.hand * other, `${other} altre carte in mano`);
  it(W.draw * s.draws, `${s.draws} carte pescate (ignote)`);
  if (has(s.gy, 'ROAR')) it(W.roarGY, `${N('ROAR')} nel Cimitero: Fusione al prossimo turno`);
  if (has(s.gy, 'ANCIENT')) it(W.ancGY, `${N('ANCIENT')} nel Cimitero: recupera un "Occhi Blu"`);
  if (has(s.gy, 'MAIDEN')) it(W.misc, `${N('MAIDEN')} nel Cimitero: torna quando evochi ${N('BEWD')}`);
  if (has(s.gy, 'WISHES')) it(W.misc, `${N('WISHES')} nel Cimitero`);
  let total = 0; for (const x of items) total += x.pts;
  return { total: Math.round(total * 10) / 10, items };
}

// ---------------------------------------------------------------- esplorazione (DFS con memo e budget)
// Ricostruisce lo stato dalla chiave (deck ed extra si ricavano per differenza): cosi' in memoria
// restano solo le chiavi e si possono tenere molti piu' stati.
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
// edges[id][i] corrisponde ad actions(stato)[i]; -1 = mossa non esplorata dal risolutore
// (rinunciare a un innesco facoltativo: resta giocabile a mano, ma non entra nella ricerca).
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
          if (a.tags.end && a.next.ph === 'X') { ev = evaluate(a.next).total; return -2; } // fine turno: niente nodo, solo il punteggio
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
Graph.prototype.lineTo = function (a, t) {
  const line = this.path(a, t.node) || [];
  if (t.end >= 0) { const x = actions(this.state(t.node), false)[t.end]; line.push({ from: t.node, to: -2, state: x.next, label: x.label, card: x.card, tags: x.tags }); }
  return line;
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

const Engine = { C, MAIN, EXTRA, names, N, P, mon, clone, key, fromKey, initial, actions, evaluate, Graph, W, curLv, fieldName };
if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
else root.Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
