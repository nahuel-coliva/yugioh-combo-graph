/* Mazzo: Structure Deck "Destino Bianco Occhi Blu" (TCG, una copia).
 * Ogni carta e' codificata a mano come azioni (costo + effetto) sullo stato del nucleo.
 */
(function (root) {
'use strict';
const Core = typeof module !== 'undefined' && module.exports ? require('../core.js') : root.ComboCore;
const S = Core.STAPLES;

// k: M mostro / S magia / T trappola.  x: tipo Extra Deck.
// be: mostro "Occhi Blu".  men: menziona "Drago Bianco Occhi Blu" nel testo.
const cards = {
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
  NIBIRU:  S.NIBIRU,
  ASH:     S.ASH,
  VEILER:  S.VEILER,
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
  IMPERM:  S.IMPERM,
  CBTG:    S.CBTG,
  INDIGO:  { en: 'Indigo-Eyes Silver Dragon', k: 'M', x: 'xyz', attr: 'LIGHT', race: 'Dragon', atk: 4000, def: 0 },
  SPIRITL: { en: 'Spirit with Eyes of Blue', k: 'M', x: 'link', link: 1, attr: 'LIGHT', race: 'Dragon', atk: 300 },
  ULT:     { en: 'Blue-Eyes Ultimate Dragon', k: 'M', x: 'fusion', lv: 12, attr: 'LIGHT', race: 'Dragon', be: 1, normal: 1, atk: 4500, def: 3800 },
  NEOULT:  { en: 'Neo Blue-Eyes Ultimate Dragon', k: 'M', x: 'fusion', lv: 12, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 4500, def: 3800 },
  TWIN:    { en: 'Blue-Eyes Twin Burst Dragon', k: 'M', x: 'fusion', lv: 10, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 3000, def: 2500 },
  TYRANT:  { en: 'Blue-Eyes Tyrant Dragon', k: 'M', x: 'fusion', lv: 8, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 3400, def: 2900 },
  SPIRITD: { en: 'Blue-Eyes Spirit Dragon', k: 'M', x: 'synchro', lv: 9, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 2500, def: 3000 },
  AZURE:   { en: 'Azure-Eyes Silver Dragon', k: 'M', x: 'synchro', lv: 9, attr: 'LIGHT', race: 'Dragon', atk: 2500, def: 3000 },
  SEAL:    { en: 'Hieratic Seal of the Heavenly Spheres', k: 'M', x: 'link', link: 2, attr: 'LIGHT', race: 'Dragon', atk: 0 },
  USPIRIT: { en: 'Blue-Eyes Ultimate Spirit Dragon', k: 'M', x: 'synchro', lv: 12, attr: 'LIGHT', race: 'Dragon', be: 1, atk: 3500, def: 4000 },
};

Core.register({
  id: 'blue-eyes',
  name: 'Destino Bianco Occhi Blu',
  note: 'Structure Deck · turno 1 · senza banlist',
  cards,
  // Lista completa dello Structure Deck: la banlist e' ignorata (partite tra amici).
  main: {
    BEWD: 3, NKSH: 1, ALT: 1, JET: 1, ABYSS: 1, DSOW: 1, MAX: 1, CHAOSD: 1, LEGEND: 1, ANCIENT: 1,
    SAGE: 3, MASTER: 1, DICT: 2, NIBIRU: 1, ASH: 1, VEILER: 2, MAIDEN: 1,
    ROAR: 1, CFORM: 1, UFUSION: 2, MELODY: 2, MAUS: 1, BURST: 1, TRADE: 2, WISHES: 1, CBTG: 1,
    MAJESTY: 1, TLIGHT: 1, UCREATURE: 1, RIVALS: 1, IMPERM: 1,
  },
  extra: { INDIGO: 1, SPIRITL: 1, ULT: 1, NEOULT: 1, TWIN: 1, TYRANT: 1, SPIRITD: 1, AZURE: 1, SEAL: 1, USPIRIT: 1 },
  presets: [['MAIDEN'], ['SAGE'], ['WISHES', 'X'], ['SAGE', 'MAIDEN'], ['WISHES', 'SAGE'], ['MAIDEN', 'ROAR'], ['DICT', 'SAGE'],
    ['NKSH', 'SAGE', 'MAIDEN'], ['MELODY', 'SAGE', 'X'], ['DICT', 'BEWD', 'MAIDEN']],
  // pesi della valutazione del campo finale (euristica)
  weights: {
    uspirit: 30, spiritdGY: 10, spiritdTrib: 18, spiritdAzure: 5, seal: 14, majesty: 8, rivals: 12, ucreature: 5,
    ufusionBase: 4, ufusionPer: 6, tlight: 3, tlightSS: 3, max: 10, chaosd: 7, jet: 8, azure: 5, tyrant: 5,
    maiden: 4, dsow: 2, body: 2, indigoMat: 3, hand: 1.5, draw: 1.5, handtrap: 6, roarGY: 2, ancGY: 1.5, misc: 1,
  },

  setup(K) {
    const { C, N, W, has, rm, uniq, count, flag, setf, addPend, mon, P, unP, negd, clone,
      onField, curLv, isEffectMon, canPlace, canSS, toGY, leaveField, summon, spellLoc, useSpell } = K;

    // Drago Bianco Alternativo si chiama "Drago Bianco Occhi Blu" sul campo e nel Cimitero
    const fieldName = (p) => (p.c === 'ALT' && !negd(p) ? 'BEWD' : p.c);
    const isBEWDf = (m) => fieldName(P(m)) === 'BEWD';
    const controlsBEWD = (s) => s.mz.some(isBEWDf);
    const gyBEWD = (s) => has(s.gy, 'BEWD') || has(s.gy, 'ALT');
    const bewdFieldOrGY = (s) => controlsBEWD(s) || gyBEWD(s);
    const isL1LT = (c) => C[c].k === 'M' && C[c].lv === 1 && C[c].attr === 'LIGHT' && C[c].tuner && !C[c].x;

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

    // ---------------------------------------------------------------- inneschi
    function onToGY(s, c, fromField) {
      if (c === 'LEGEND' && rm(s.deck, 'BEWD')) s.hand.push('BEWD'); // innesco obbligatorio
      if (c === 'ANCIENT') setf(s, 'ancSent');
      if (c === 'NKSH' && fromField && !flag(s, 'nkshSend')) addPend(s, 'nkshSend');
    }
    function onSummon(s, p, how) {
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
    // effetti facoltativi che si attivano in risposta a un evento: ok = attivabile ora, run = le scelte
    const pending = {
      maidenRev: {
        ok: (s) => has(s.gy, 'MAIDEN') && !flag(s, 'maidenRev') && canSS(s, 'MAIDEN'),
        run: (s, add, done) => add(`${N('MAIDEN')}: si Evoca Specialmente dal Cimitero`, 'MAIDEN', { summon: 1 },
          (n) => { done(n); setf(n, 'maidenRev'); }, (n) => { rm(n.gy, 'MAIDEN'); summon(n, mon('MAIDEN'), 'ss'); }),
      },
      ucSet: {
        ok: (s) => has(s.gy, 'UCREATURE') && !flag(s, 'ucSet'),
        run: (s, add, done) => add(`${N('UCREATURE')}: si Posiziona dal Cimitero`, 'UCREATURE', {},
          (n) => { done(n); setf(n, 'ucSet'); }, (n) => { rm(n.gy, 'UCREATURE'); n.st.push('UCREATURE*'); }),
      },
      abyss: {
        ok: (s) => !flag(s, 'abyssS') && onField(s, 'ABYSS') && bewdFieldOrGY(s) && has(s.deck, 'CFORM'),
        run: (s, add, done) => add(`${N('ABYSS')}: aggiungi ${N('CFORM')} dal Deck`, 'ABYSS', { ash: 1, mon: 1 },
          (n) => { done(n); setf(n, 'abyssS'); }, (n) => { rm(n.deck, 'CFORM'); n.hand.push('CFORM'); }),
      },
      sageNS: {
        ok: (s) => onField(s, 'SAGE') && L1LT.some((c) => c !== 'SAGE' && has(s.deck, c)),
        run: (s, add, done) => { for (const c of L1LT) if (c !== 'SAGE' && has(s.deck, c))
          add(`${N('SAGE')}: aggiungi ${N(c)} dal Deck`, 'SAGE', { ash: 1, mon: 1 }, done, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      masterNS: {
        ok: (s) => onField(s, 'MASTER') && L1LT.some((c) => has(s.gy, c)),
        run: (s, add, done) => { for (const c of L1LT) if (has(s.gy, c))
          add(`${N('MASTER')}: riprendi ${N(c)} dal Cimitero`, 'MASTER', { mon: 1 }, done, (n) => { rm(n.gy, c); n.hand.push(c); }); },
      },
      spMaus: {
        ok: (s) => onField(s, 'SPIRITL') && !flag(s, 'spMaus') && has(s.deck, 'MAUS'),
        run: (s, add, done) => {
          const cost = (n) => { done(n); setf(n, 'spMaus'); };
          add(`${N('SPIRITL')}: aggiungi ${N('MAUS')} alla mano`, 'SPIRITL', { ash: 1, mon: 1 }, cost, (n) => { rm(n.deck, 'MAUS'); n.hand.push('MAUS'); });
          add(`${N('SPIRITL')}: manda ${N('MAUS')} al Cimitero`, 'SPIRITL', { ash: 1, mon: 1 }, cost, (n) => { rm(n.deck, 'MAUS'); toGY(n, 'MAUS', false); });
        },
      },
      nkshSend: {
        ok: (s) => !flag(s, 'nkshSend') && NKSH_SEND.some((c) => has(s.deck, c)),
        run: (s, add, done) => { for (const c of NKSH_SEND) if (has(s.deck, c))
          add(`${N('NKSH')}: manda ${N(c)} dal Deck al Cimitero`, 'NKSH', { ash: 1 }, (n) => { done(n); setf(n, 'nkshSend'); }, (n) => { rm(n.deck, c); toGY(n, c, false); }); },
      },
    };

    // ---------------------------------------------------------------- End Phase
    const ancEPok = (s) => flag(s, 'ancSent') && has(s.gy, 'ANCIENT') && !flag(s, 'ancEP');
    const abyssEPok = (s) => onField(s, 'ABYSS') && bewdFieldOrGY(s) && !flag(s, 'abyssEP');
    function epAvail(s) {
      if (ancEPok(s) && DECK_BE.some((c) => has(s.deck, c) && canSS(s, c))) return true;
      if (abyssEPok(s) && ABYSS_EP.some((c) => has(s.deck, c))) return true;
      return false;
    }
    function endPhase(s, add) {
      if (ancEPok(s))
        for (const c of DECK_BE) if (has(s.deck, c) && canSS(s, c))
          add(`End Phase – ${N('ANCIENT')}: Evoca ${N(c)} dal Deck`, 'ANCIENT', { ash: 1, summon: 1 }, (n) => setf(n, 'ancEP'), (n) => { rm(n.deck, c); summon(n, mon(c), 'ss'); });
      if (abyssEPok(s)) { // una sola scelta canonica: la carta aggiunta non cambia il campo
        const c = ABYSS_EP.find((x) => has(s.deck, x));
        if (c) add(`End Phase – ${N('ABYSS')}: aggiungi ${N(c)} dal Deck`, 'ABYSS', { ash: 1, mon: 1 }, (n) => setf(n, 'abyssEP'), (n) => { rm(n.deck, c); n.hand.push(c); });
      }
    }

    // ---------------------------------------------------------------- Main Phase
    function main(s, add) {
      const hand = uniq(s.hand);
      const fieldU = uniq(s.mz);

      // Mausoleo del Bianco: una Evocazione Normale in piu' per un Tuner LUCE di Livello 1
      K.normalSummons(s, add, (st, c) => (isL1LT(c) && st.fz === 'MAUS' && !flag(st, 'ns2') ? { flag: 'ns2', note: `extra del ${N('MAUS')}` } : null));

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
      let loc;
      if ((loc = spellLoc(s, 'ROAR')) && !flag(s, 'roar')) {
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
      if ((loc = spellLoc(s, 'CFORM')) && rituals.length) {
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

      if ((loc = spellLoc(s, 'WISHES')) && !flag(s, 'wishA')) {
        const L = loc;
        const h2 = s.hand.slice(); if (L === 'hand') rm(h2, 'WISHES');
        const tun = L1LT.filter((c) => has(s.deck, c));
        const sts = MEN_ST.filter((c) => c !== 'WISHES' && has(s.deck, c));
        if (tun.length && sts.length)
          for (const d of uniq(h2)) for (const t of tun) for (const x of sts)
            // cercare Soffio Esplosivo al turno 1 e' una mossa marginale: il risolutore la salta
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
      K.link(s, add, { code: 'SPIRITL', n: 1, ok: (p) => curLv(p) != null && curLv(p) <= 4 && (C[p.c].race === 'Dragon' || C[p.c].race === 'Spellcaster') });
      K.link(s, add, { code: 'SEAL', n: 2, min: 2, ok: (p) => C[p.c].race === 'Dragon' });
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
      K.xyz(s, add, { code: 'INDIGO', n: 2, ok: (p) => curLv(p) === 8 && C[p.c].race === 'Dragon' });
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
      K.synchros(s, add, [
        { code: 'SPIRITD', lv: 9, tuners: [1, 1], nons: [1, 9], nonOK: (p) => C[p.c].be },
        { code: 'AZURE', lv: 9, tuners: [1, 1], nons: [1, 9], nonOK: (p) => C[p.c].normal },
        { code: 'USPIRIT', lv: 12, tuners: [2, 9], nons: [1, 1], nonOK: (p) => C[p.c].be },
      ]);
      if (has(s.extra, 'TWIN'))
        for (const [a, b] of K.fieldCombos(s, 2, (p) => K.fieldName(p) === 'BEWD'))
          add(`${N('TWIN')}: manda ${N(P(a).c)} + ${N(P(b).c)} dal campo al Cimitero (senza Polimerizzazione)`, 'TWIN', { summon: 1 }, null,
            (n) => { leaveField(n, a, 'gy'); leaveField(n, b, 'gy'); rm(n.extra, 'TWIN'); summon(n, mon('TWIN'), 'ss'); });
    }

    // ---------------------------------------------------------------- valutazione del campo finale
    function evaluate(s) {
      const sc = K.scorer(), it = sc.it;
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
        if (p.c === 'MAX') it(W.max, `${N('MAX')}: 4000 ATK, non bersagliabile né distruttibile da effetti`);
        if (p.c === 'CHAOSD') it(W.chaosd, `${N('CHAOSD')}: non bersagliabile né distruttibile da effetti`);
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
        if (has(s.hand, 'BEWD') || has(s.gy, 'BEWD')) it(W.tlightSS, `${N('TLIGHT')}: può evocare ${N('BEWD')} nel turno avversario`);
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
      return sc.result();
    }

    return {
      fieldName,
      blocked: (s, c) => onField(s, 'SPIRITL') && C[c].race !== 'Dragon', // Spirito con gli Occhi di Blu: solo Draghi
      onToGY, onSummon, pending, epAvail, endPhase, main, evaluate,
    };
  },
});
})(typeof window !== 'undefined' ? window : globalThis);
