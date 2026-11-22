/* Mazzo: The Chronicles Deck "The Fallen & The Virtuous" (una copia per carta, senza banlist).
 * Turno 1 giocando per primi: l'effetto di Albaz il Caduto non e' attivabile (servono mostri avversari),
 * quindi le Fusioni passano da Fusione Marchiata, Cartesia, Marchiato in Bianco/Rosso, ecc.
 */
(function (root) {
'use strict';
const Core = typeof module !== 'undefined' && module.exports ? require('../core.js') : root.ComboCore;
const S = Core.STAPLES;

// men: menziona "Albaz il Caduto".  br: Magia/Trappola "Marchiato".  alb: Fusione che menziona Albaz.
// despia / dogma / bystial / ecc: archetipi.  cont: Magia/Trappola Continua.  ep: Fusione con effetto in End Phase dal Cimitero.
const M = (en, lv, attr, race, atk, def, o) => Object.assign({ en, k: 'M', lv, attr, race, atk, def }, o);
const F = (en, attr, race, atk, def, o) => Object.assign({ en, k: 'M', x: 'fusion', lv: 8, attr, race, atk, def, alb: 1 }, o);
const cards = {
  ALBAZ:   M('Fallen of Albaz', 4, 'DARK', 'Dragon', 1800, 0),
  IECC:    M('Incredible Ecclesia, the Virtuous', 4, 'LIGHT', 'Spellcaster', 1500, 1500, { men: 1, tuner: 1, ecc: 1 }),
  ALUBER:  M('Aluber the Jester of Despia', 4, 'DARK', 'Fairy', 1800, 0, { despia: 1 }),
  CART:    M('Blazing Cartesia, the Virtuous', 4, 'LIGHT', 'Spellcaster', 1500, 1500, { men: 1, tuner: 1 }),
  ALBS:    M('Albion the Shrouded Dragon', 8, 'DARK', 'Dragon', 2500, 2000, { men: 1 }),
  QUEM:    M('Guiding Quem, the Virtuous', 4, 'LIGHT', 'Spellcaster', 1500, 1500, { men: 1, tuner: 1, despia: 1, dogma: 1 }),
  KITT:    M('Springans Kitt', 4, 'DARK', 'Beast', 1700, 1000, { men: 1 }),
  MERC:    M('Tri-Brigade Mercourier', 4, 'DARK', 'Winged Beast', 800, 0, { men: 1 }),
  TRAG:    M('Despian Tragedy', 1, 'DARK', 'Fairy', 400, 400, { despia: 1 }),
  BLUB:    M('The Bystial Lubellion', 8, 'LIGHT', 'Dragon', 2500, 3000, { nons: 1, bystial: 1 }),
  MAGN:    M('Bystial Magnamhut', 6, 'DARK', 'Dragon', 2500, 2000, { bystial: 1 }),
  SARO:    M('Bystial Saronir', 6, 'DARK', 'Dragon', 2500, 2000, { bystial: 1 }),
  DRUIS:   M('Bystial Druiswurm', 6, 'DARK', 'Dragon', 2500, 2000, { bystial: 1 }),
  DECC:    M('Dogmatika Ecclesia, the Virtuous', 4, 'LIGHT', 'Spellcaster', 1500, 1500, { dogma: 1, ecc: 1 }),
  FLEUR:   M('Dogmatika Fleurdelis, the Knighted', 8, 'LIGHT', 'Spellcaster', 2500, 2500, { dogma: 1 }),
  MAXIMUS: M('Dogmatika Maximus', 8, 'LIGHT', 'Spellcaster', 1500, 3000, { dogma: 1 }),
  NIBIRU:  S.NIBIRU,
  KEEPER:  M('Keeper of Dragon Magic', 4, 'DARK', 'Dragon', 1800, 1300),
  TFTV:    { en: 'The Fallen & The Virtuous', k: 'S', quick: 1, br: 1, dogma: 1, men: 1 },
  BFUS:    { en: 'Branded Fusion', k: 'S', br: 1, men: 1 },
  BWHITE:  { en: 'Branded in White', k: 'S', br: 1, men: 1 },
  BRED:    { en: 'Branded in Red', k: 'S', quick: 1, br: 1, men: 1 },
  BOPEN:   { en: 'Branded Opening', k: 'S', quick: 1, br: 1 },
  BHIGH:   { en: 'Branded in High Spirits', k: 'S', quick: 1, br: 1, men: 1 },
  LOST:    { en: 'Branded Lost', k: 'S', br: 1, men: 1, cont: 1 },
  REGAINED: { en: 'Branded Regained', k: 'S', br: 1, cont: 1 },
  NADIR:   { en: 'Nadir Servant', k: 'S', men: 1 },
  BBOND:   { en: 'Branded Bond', k: 'S', br: 1, men: 1 },
  FDEPLOY: { en: 'Fusion Deployment', k: 'S' },
  THRUST:  { en: 'Triple Tactics Thrust', k: 'S' },
  FOOLISH: { en: 'Foolish Burial', k: 'S' },
  SARC:    { en: 'Gold Sarcophagus', k: 'S' },
  SUPERPOLY: { en: 'Super Polymerization', k: 'S', quick: 1 },
  RETRIB:  { en: 'Branded Retribution', k: 'T', br: 1, men: 1 },
  BANISH:  { en: 'Branded Banishment', k: 'T', br: 1 },
  BSWORD:  { en: 'Branded Sword', k: 'T', br: 1, men: 1 },
  BEAST:   { en: 'Branded Beast', k: 'T', br: 1, cont: 1 },
  GOAT:    { en: 'The Black Goat Laughs', k: 'T' },
  PUNISH:  { en: 'Dogmatika Punishment', k: 'T', dogma: 1 },
  FDUP:    { en: 'Fusion Duplication', k: 'T' },
  DOGMA:   F('The Dragon that Devours the Dogma', 'DARK', 'Beast', 3000, 2500, { ep: 1 }),
  MIRROR:  F('Mirrorjade the Iceblade Dragon', 'DARK', 'Wyrm', 3000, 2500),
  ALBB:    F('Albion the Branded Dragon', 'DARK', 'Dragon', 2500, 2000, { ep: 1 }),
  LUBEL:   F('Lubellion the Searing Dragon', 'LIGHT', 'Dragon', 2500, 3000),
  LENATUS: F('Alba-Lenatus the Abyss Dragon', 'DARK', 'Dragon', 2500, 2500, { ep: 1 }),
  TITAN:   F('Titaniklad the Ash Dragon', 'DARK', 'Dragon', 2500, 2500, { ep: 1 }),
  BRIGR:   F('Brigrand the Glory Dragon', 'DARK', 'Beast', 2500, 2000, { ep: 1 }),
  SPRIND:  F('Sprind the Irondash Dragon', 'DARK', 'Machine', 2500, 2000, { ep: 1 }),
  RIND:    F('Rindbrumm the Striking Dragon', 'DARK', 'Winged Beast', 2500, 2000),
  GRAN:    F('Granguignol the Dusk Dragon', 'LIGHT', 'Spellcaster', 2500, 2500, { alb: 0 }),
};

Core.register({
  id: 'fallen-virtuous',
  name: 'The Fallen & The Virtuous',
  note: 'Chronicles Deck · turno 1 · senza banlist',
  cards,
  main: {
    ALBAZ: 1, IECC: 1, ALUBER: 1, CART: 1, ALBS: 1, QUEM: 1, KITT: 1, MERC: 1, TRAG: 1, BLUB: 1, MAGN: 1, SARO: 1, DRUIS: 1,
    DECC: 1, FLEUR: 1, MAXIMUS: 1, NIBIRU: 1, KEEPER: 1,
    TFTV: 1, BFUS: 1, BWHITE: 1, BRED: 1, BOPEN: 1, BHIGH: 1, LOST: 1, REGAINED: 1, NADIR: 1, BBOND: 1, FDEPLOY: 1, THRUST: 1, FOOLISH: 1, SARC: 1, SUPERPOLY: 1,
    RETRIB: 1, BANISH: 1, BSWORD: 1, BEAST: 1, GOAT: 1, PUNISH: 1, FDUP: 1,
  },
  extra: { DOGMA: 1, MIRROR: 1, ALBB: 1, LUBEL: 1, LENATUS: 1, TITAN: 1, BRIGR: 1, SPRIND: 1, RIND: 1, GRAN: 1 },
  presets: [['BFUS'], ['ALUBER'], ['QUEM'], ['FDEPLOY'], ['FOOLISH'], ['ALUBER', 'CART'], ['QUEM', 'BFUS'], ['BFUS', 'MAGN'], ['NADIR', 'X'], ['ALUBER', 'SARO', 'X']],
  weights: {
    mirror: 16, mirrorEP: 3, rind: 12, dogma: 6, dogmaEcc: 4, merc: 10, retrib: 10, punish: 9, tftv: 8, superpoly: 8, superpolyNo: 3,
    banish: 7, beastUp: 10, beast: 3, goat: 5, fdup: 4, bsword: 3, bred: 4, bopen: 2, regained: 4, regainedRevive: 3, lost: 4,
    bystialHand: 5, cart: 5, iecc: 3, gran: 4, fleurHand: 4, titan: 4, brigr: 5, body: 2, mon: 1, hand: 1.5, draw: 1.5, handtrap: 6,
  },

  setup(K) {
    const { C, N, W, has, rm, uniq, count, flag, setf, addPend, mon, P, negd, clone,
      curLv, canPlace, canSS, toGY, banish, leaveField, summon, spellLoc, useSpell } = K;

    const isM = (c) => C[c].k === 'M';
    const faceUp = (p) => p.fl.indexOf('d') < 0;
    // Albion il Drago Avvolto si chiama "Albaz il Caduto" sul campo e nel Cimitero
    const fieldName = (p) => (p.c === 'ALBS' && !negd(p) ? 'ALBAZ' : p.c);
    const up = (s, c) => s.mz.some((m) => { const p = P(m); return p.c === c && faceUp(p) && !negd(p); });
    const find = (s, c) => s.mz.find((m) => P(m).c === c);
    const albFusionOnField = (s) => s.mz.some((m) => C[P(m).c].alb);
    const albazFieldOrGY = (s) => s.mz.some((m) => fieldName(P(m)) === 'ALBAZ') || has(s.gy, 'ALBAZ') || has(s.gy, 'ALBS');
    const eccAround = (s) => s.mz.some((m) => C[P(m).c].ecc) || s.gy.some((c) => C[c].ecc);
    const lightDark = (c) => C[c].attr === 'LIGHT' || C[c].attr === 'DARK';
    const ALBAZ_FAMILY = ['ALBAZ', 'IECC', 'CART', 'ALBS', 'QUEM', 'KITT', 'MERC']; // "Albaz il Caduto" o un mostro del Main Deck che lo menziona
    const DESPIA = ['ALUBER', 'TRAG', 'QUEM'];
    const BYSTIAL = ['MAGN', 'SARO', 'DRUIS'];
    const EPF = ['ALBB', 'TITAN', 'BRIGR', 'SPRIND', 'DOGMA', 'LENATUS']; // Fusioni utili da mandare al Cimitero: hanno un effetto in End Phase
    const branded = (zone) => uniq(zone.filter((c) => C[c].br));
    const disc = (n, c) => { rm(n.hand, c); toGY(n, c, false); };           // scarto come costo
    // al Cimitero / bandito per effetto di una carta (Tragedia di Despia reagisce solo a questo)
    const effGY = (n, c) => { toGY(n, c, false); if (c === 'TRAG' && !flag(n, 'trag')) addPend(n, 'trag'); };
    const fieldGY = (n, m) => { const p = leaveField(n, m, 'gy'); if (p.c === 'TRAG' && !flag(n, 'trag')) addPend(n, 'trag'); };
    // una carta lascia l'Extra Deck: innesca Quem
    const leftExtra = (n) => { if (up(n, 'QUEM') && !flag(n, 'quemB')) addPend(n, 'quem'); };
    const sendExtra = (n, f) => { rm(n.extra, f); toGY(n, f, false); leftExtra(n); };
    // un mostro con condizioni di evocazione si rievoca solo se prima e' stato evocato correttamente
    function canRevive(s, c) {
      if (!isM(c) || c === 'BLUB') return false;
      if (C[c].x) return flag(s, 'ok:' + c);
      return true;
    }

    // ---------------------------------------------------------------- fusioni
    const A = (t) => t.albaz;
    const dragon = (t) => C[t.c].race === 'Dragon';
    const ld = (t) => lightDark(t.c);
    const RECIPES = {
      MIRROR: [[A, (t) => !!C[t.c].x]],
      LUBEL: [[A, (t) => C[t.c].attr === 'DARK']],
      TITAN: [[A, (t) => (C[t.c].atk || 0) >= 2500]],
      BRIGR: [[A, (t) => (C[t.c].lv || 0) >= 8]],
      SPRIND: [[A, (t) => t.loc === 'field' && t.ssEff]],
      ALBB: [[A, (t) => C[t.c].attr === 'LIGHT']],
      RIND: [[A, (t) => ['Beast', 'Beast-Warrior', 'Winged Beast'].indexOf(C[t.c].race) >= 0]],
      LENATUS: [[A, dragon], [A, dragon, dragon]],
      DOGMA: [[A, ld, () => true]],
      GRAN: [[(t) => t.c === 'CART', ld]],
    };
    const ORDER = Object.keys(RECIPES);
    function tokens(s, pools) {
      const t = [], seen = new Set();
      const push = (loc, v, c, albaz, ssEff) => { const id = loc + ':' + v; if (seen.has(id) || c === 'LENATUS') return; seen.add(id); t.push({ id, loc, v, c, albaz, ssEff }); };
      if (has(pools, 'hand')) for (const c of s.hand) if (isM(c)) push('hand', c, c, c === 'ALBAZ');
      if (has(pools, 'deck')) for (const c of s.deck) if (isM(c)) push('deck', c, c, c === 'ALBAZ');
      if (has(pools, 'field')) for (const m of s.mz) { const p = P(m); push('field', m, p.c, fieldName(p) === 'ALBAZ', faceUp(p) && p.fl.indexOf('N') < 0); }
      if (has(pools, 'gy')) for (const c of s.gy) if (isM(c)) push('gy', c, c, c === 'ALBAZ' || c === 'ALBS');
      if (has(pools, 'ban')) for (const c of s.ban) if (isM(c)) push('ban', c, c, c === 'ALBAZ');
      return t;
    }
    // o: {only(f), max: numero massimo di materiali, dragon: serve un Drago tra i materiali, gyAlbaz: il Cimitero vale solo se si usa Albaz}
    function fusionOpts(s, pools, o) {
      o = o || {};
      if (flag(s, 'noExtra')) return [];
      const tk = tokens(s, pools), res = [], seen = new Set();
      for (const f of ORDER) {
        if (!has(s.extra, f) || (o.only && !o.only(f))) continue;
        if (f === 'MIRROR' && s.mz.some((m) => P(m).c === 'MIRROR')) continue; // puoi controllarne solo 1
        if (!canPlaceAfter(s, f)) continue;
        for (const slots of RECIPES[f]) {
          if (o.max && slots.length > o.max) continue;
          const rec = (i, chosen) => {
            if (i === slots.length) {
              if (o.dragon && !chosen.some(dragon)) return;
              if (o.gyAlbaz && chosen.some((t) => t.loc === 'gy') && !chosen.some(A)) return;
              const sig = f + '|' + chosen.map((t) => t.id).sort().join('|');
              if (!seen.has(sig)) { seen.add(sig); res.push({ fus: f, mats: chosen.slice() }); }
              return;
            }
            for (const t of tk) if (chosen.indexOf(t) < 0 && slots[i](t)) { chosen.push(t); rec(i + 1, chosen); chosen.pop(); }
          };
          rec(0, []);
        }
      }
      return res;
    }
    const canPlaceAfter = (s, f) => s.mz.length <= 6; // i materiali dal campo liberano zone: controllo fine in applyFusion
    // dests: dove va il materiale a seconda di dove si trova, es. {hand:'gy', field:'gy', deck:'gy'}
    function applyFusion(n, o, dests) {
      for (const t of o.mats) {
        const d = dests[t.loc];
        if (t.loc === 'field') {
          if (d === 'gy') fieldGY(n, t.v); else leaveField(n, t.v, d);
          continue;
        }
        rm(n[t.loc], t.v);
        if (d === 'gy') effGY(n, t.v);
        else if (d === 'ban') banish(n, t.v);
        else (C[t.v].x ? n.extra : n.deck).push(t.v);
      }
      rm(n.extra, o.fus);
      setf(n, 'ok:' + o.fus);
      leftExtra(n);
      if (canPlace(n, o.fus)) summon(n, mon(o.fus, { fl: 'F' }), 'ss'); else n.gy.push(o.fus);
    }
    const where = { hand: ' (mano)', deck: ' (Deck)', field: '', gy: ' (Cimitero)', ban: ' (bandito)' };
    const matLabel = (o) => o.mats.map((t) => N(t.c) + where[t.loc]).join(' + ');

    // ---------------------------------------------------------------- inneschi
    function onSummon(s, p, how) {
      if (!faceUp(p)) return;
      if (p.c === 'KITT' && !flag(s, 'kittE')) addPend(s, 'kitt');
      if (p.c === 'KEEPER' && !flag(s, 'keepA')) addPend(s, 'keeper');
      if (p.c === 'ALUBER' && !flag(s, 'aluber')) addPend(s, 'aluber');
      if (p.c === 'QUEM' && !flag(s, 'quemA')) addPend(s, 'quemSend');
      if (p.c === 'DECC' && !flag(s, 'deccE')) addPend(s, 'decc');
      if (p.c === 'MAGN' && how !== 'ns' && !flag(s, 'magnE')) { setf(s, 'magnE'); setf(s, 'magnEP'); }
      if (p.fl.indexOf('F') >= 0) {
        if (has(s.st, 'LOST') && !flag(s, 'lost')) addPend(s, 'lost');
        if (p.c === 'LUBEL' && !flag(s, 'lubel')) addPend(s, 'lubel');
        if (p.c === 'ALBB' && !flag(s, 'albb')) addPend(s, 'albb');
        if (p.c === 'GRAN' && !flag(s, 'gran')) addPend(s, 'gran');
      }
    }
    function onToGY(s, c) {
      if (C[c].x === 'fusion') setf(s, 'fgy'); // "una Fusione e' stata mandata al tuo Cimitero in questo turno"
      if (c === 'SARO' && !flag(s, 'saro')) addPend(s, 'saro');
    }
    function onBanish(s, c) {
      if (c === 'MERC' && !flag(s, 'merc')) addPend(s, 'merc');
      if (c === 'TRAG' && !flag(s, 'trag')) addPend(s, 'trag');
      if (isM(c) && lightDark(c) && has(s.st, 'REGAINED') && !flag(s, 'regained')) addPend(s, 'regained');
    }
    const quemTargets = (s) => uniq(s.gy).filter((c) => c !== 'QUEM' && (c === 'ALBAZ' || (isM(c) && (C[c].men || C[c].alb))) && canRevive(s, c) && canSS(s, c));
    const QUEM_SEND = ALBAZ_FAMILY.concat(['BFUS', 'BWHITE', 'BRED', 'BHIGH', 'LOST', 'BBOND', 'TFTV', 'NADIR', 'RETRIB', 'BSWORD']);
    const DOGMATIKA = ['FLEUR', 'MAXIMUS', 'QUEM', 'PUNISH', 'TFTV', 'DECC'];
    const GRAN_SEND = ['SARO', 'MAGN', 'DRUIS', 'ALBS', 'BLUB', 'FLEUR', 'MAXIMUS'];

    const pending = {
      merc: {
        ok: (s) => !flag(s, 'merc') && ALBAZ_FAMILY.some((c) => c !== 'MERC' && has(s.deck, c)),
        run: (s, add, done) => { for (const c of ALBAZ_FAMILY) if (c !== 'MERC' && has(s.deck, c))
          add(`${N('MERC')} (bandito): aggiungi ${N(c)} dal Deck`, 'MERC', { ash: 1 }, (n) => { done(n); setf(n, 'merc'); }, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      trag: {
        ok: (s) => !flag(s, 'trag') && DESPIA.some((c) => c !== 'TRAG' && has(s.deck, c)),
        run: (s, add, done) => { for (const c of DESPIA) if (c !== 'TRAG' && has(s.deck, c))
          add(`${N('TRAG')}: aggiungi ${N(c)} dal Deck`, 'TRAG', { ash: 1 }, (n) => { done(n); setf(n, 'trag'); }, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      aluber: {
        ok: (s) => up(s, 'ALUBER') && !flag(s, 'aluber') && branded(s.deck).length > 0,
        run: (s, add, done) => { for (const c of branded(s.deck))
          add(`${N('ALUBER')}: aggiungi ${N(c)} dal Deck`, 'ALUBER', { ash: 1, mon: 1 }, (n) => { done(n); setf(n, 'aluber'); }, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      quemSend: {
        ok: (s) => up(s, 'QUEM') && !flag(s, 'quemA') && QUEM_SEND.some((c) => has(s.deck, c)),
        run: (s, add, done) => { for (const c of QUEM_SEND) if (has(s.deck, c))
          add(`${N('QUEM')}: manda ${N(c)} dal Deck al Cimitero`, 'QUEM', { ash: 1, mon: 1 }, (n) => { done(n); setf(n, 'quemA'); }, (n) => { rm(n.deck, c); effGY(n, c); }); },
      },
      quem: {
        ok: (s) => up(s, 'QUEM') && !flag(s, 'quemB') && quemTargets(s).length > 0,
        run: (s, add, done) => { for (const c of quemTargets(s))
          add(`${N('QUEM')}: Evoca ${N(c)} dal Cimitero`, 'QUEM', { mon: 1, summon: 1 }, (n) => { done(n); setf(n, 'quemB'); }, (n) => { rm(n.gy, c); summon(n, mon(c), 'ss'); }); },
      },
      decc: {
        ok: (s) => up(s, 'DECC') && !flag(s, 'deccE') && DOGMATIKA.some((c) => c !== 'DECC' && has(s.deck, c)),
        run: (s, add, done) => { for (const c of DOGMATIKA) if (c !== 'DECC' && has(s.deck, c))
          add(`${N('DECC')}: aggiungi ${N(c)} dal Deck (niente più Extra Deck per questo turno)`, 'DECC', { ash: 1, mon: 1 },
            (n) => { done(n); setf(n, 'deccE'); setf(n, 'noExtra'); }, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      kitt: {
        ok: (s) => up(s, 'KITT') && !flag(s, 'kittE') && (branded(s.deck).length + branded(s.gy).length + branded(s.ban).length) > 0,
        run: (s, add, done) => {
          for (const [loc, txt] of [['deck', 'dal Deck'], ['gy', 'dal Cimitero'], ['ban', 'dai banditi']]) for (const c of branded(s[loc])) {
            const bottoms = uniq(s.hand).length ? uniq(s.hand) : [c];
            for (const b of bottoms)
              add(`${N('KITT')}: aggiungi ${N(c)} ${txt}, poi metti ${N(b)} in fondo al Deck`, 'KITT', loc === 'deck' ? { ash: 1, mon: 1 } : { mon: 1 },
                (n) => { done(n); setf(n, 'kittE'); }, (n) => { rm(n[loc], c); n.hand.push(c); rm(n.hand, b); n.deck.push(b); });
          }
        },
      },
      keeper: {
        ok: (s) => up(s, 'KEEPER') && !flag(s, 'keepA') && s.hand.length > 0 && (has(s.deck, 'BFUS') || has(s.deck, 'FDEPLOY')),
        run: (s, add, done) => { for (const d of uniq(s.hand)) for (const c of ['BFUS', 'FDEPLOY']) if (has(s.deck, c))
          add(`${N('KEEPER')}: scarta ${N(d)}, aggiungi ${N(c)} dal Deck`, 'KEEPER', { ash: 1, mon: 1 }, (n) => { done(n); setf(n, 'keepA'); disc(n, d); }, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      lost: {
        ok: (s) => has(s.st, 'LOST') && !flag(s, 'lost') && ALBAZ_FAMILY.some((c) => has(s.deck, c)),
        run: (s, add, done) => { for (const c of ALBAZ_FAMILY) if (has(s.deck, c))
          add(`${N('LOST')}: aggiungi ${N(c)} dal Deck`, 'LOST', { ash: 1 }, (n) => { done(n); setf(n, 'lost'); }, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      regained: {
        ok: (s) => has(s.st, 'REGAINED') && !flag(s, 'regained') && s.ban.some((c) => isM(c) && lightDark(c)),
        run: (s, add, done) => { for (const c of uniq(s.ban)) if (isM(c) && lightDark(c))
          add(`${N('REGAINED')}: ${N(c)} bandito torna in fondo al Deck, peschi 1`, 'REGAINED', { draw: 1 }, (n) => { done(n); setf(n, 'regained'); },
            (n) => { rm(n.ban, c); (C[c].x ? n.extra : n.deck).push(c); n.draws += 1; }); },
      },
      lubel: {
        ok: (s) => up(s, 'LUBEL') && !flag(s, 'lubel') && uniq(s.hand).some((d) => lubelOpts(s, d).length > 0),
        run: (s, add, done) => { for (const d of uniq(s.hand)) for (const o of lubelOpts(s, d))
          add(`${N('LUBEL')}: scarta ${N(d)}, Fusione ${N(o.fus)} rimescolando ${matLabel(o)}`, 'LUBEL', { mon: 1, summon: 1 },
            (n) => { done(n); setf(n, 'lubel'); disc(n, d); }, (n) => applyFusion(n, o, { field: 'deck', gy: 'deck', ban: 'deck' })); },
      },
      albb: {
        ok: (s) => up(s, 'ALBB') && !flag(s, 'albb') && albbOpts(s).length > 0,
        run: (s, add, done) => { for (const o of albbOpts(s))
          add(`${N('ALBB')}: Fusione ${N(o.fus)} bandendo ${matLabel(o)}`, 'ALBB', { mon: 1, summon: 1 },
            (n) => { done(n); setf(n, 'albb'); }, (n) => applyFusion(n, o, { hand: 'ban', field: 'ban', gy: 'ban' })); },
      },
      gran: {
        ok: (s) => up(s, 'GRAN') && !flag(s, 'gran'),
        run: (s, add, done) => {
          const cost = (n) => { done(n); setf(n, 'gran'); };
          for (const c of GRAN_SEND) if (has(s.deck, c))
            add(`${N('GRAN')}: manda ${N(c)} dal Deck al Cimitero`, 'GRAN', { ash: 1, mon: 1 }, cost, (n) => { rm(n.deck, c); effGY(n, c); });
          for (const f of EPF) if (has(s.extra, f))
            add(`${N('GRAN')}: manda ${N(f)} dall'Extra Deck al Cimitero`, 'GRAN', { mon: 1 }, cost, (n) => sendExtra(n, f));
        },
      },
      saro: {
        ok: (s) => !flag(s, 'saro') && (BYSTIAL.concat(['BLUB']).some((c) => c !== 'SARO' && has(s.deck, c)) || branded(s.deck).length > 0),
        run: (s, add, done) => { for (const c of ['MAGN', 'DRUIS', 'BLUB'].concat(branded(s.deck))) if (has(s.deck, c))
          add(`${N('SARO')}: manda ${N(c)} dal Deck al Cimitero`, 'SARO', { ash: 1 }, (n) => { done(n); setf(n, 'saro'); }, (n) => { rm(n.deck, c); effGY(n, c); }); },
      },
    };
    function lubelOpts(s, d) {
      const t = clone(s); rm(t.hand, d); t.gy.push(d);
      return fusionOpts(t, ['field', 'gy', 'ban'], { only: (f) => f !== 'LUBEL' });
    }
    const albbOpts = (s) => fusionOpts(s, ['hand', 'field', 'gy'], { only: (f) => f !== 'ALBB' });

    // ---------------------------------------------------------------- End Phase
    // Le Fusioni finite al Cimitero in questo turno (al turno 1: tutte quelle nel Cimitero) hanno un effetto
    const both = (list) => (s) => list.filter((c) => has(s.deck, c)).flatMap((c) => (isM(c) ? [[c, 'add'], [c, 'ss']] : [[c, 'add']]));
    const EP = {
      ALBB: (s) => branded(s.deck).map((c) => [c, C[c].k === 'T' ? 'set' : 'add']),
      TITAN: both(['ALBAZ', 'FLEUR', 'MAXIMUS', 'DECC', 'QUEM']),
      BRIGR: both(['MERC', 'ALBAZ']),
      SPRIND: both(['KITT', 'ALBAZ']),
      DOGMA: (s) => DOGMATIKA.concat(['MERC']).filter((c) => has(s.deck, c)).map((c) => [c, 'add']),
      LENATUS: (s) => ['BFUS', 'FDEPLOY'].filter((c) => has(s.deck, c)).map((c) => [c, 'add']),
    };
    const epList = (s, f) => (has(s.gy, f) && !flag(s, 'ep' + f) ? EP[f](s).filter(([c, how]) => how !== 'ss' || canSS(s, c)) : []);
    const backOK = (s, c, f) => flag(s, 'fgy') && has(s.gy, c) && !flag(s, f);
    const magnList = (s) => (flag(s, 'magnEP') && !flag(s, 'magnDone')
      ? [['deck', 'dal Deck'], ['gy', 'dal Cimitero']].flatMap(([l, t]) => uniq(s[l]).filter((c) => isM(c) && !C[c].x && C[c].race === 'Dragon' && c !== 'MAGN').map((c) => [l, t, c])) : []);
    const epAvail = (s) => Object.keys(EP).some((f) => epList(s, f).length > 0) || backOK(s, 'IECC', 'ieccEP') || backOK(s, 'CART', 'cartEP') ||
      backOK(s, 'BHIGH', 'bhigh') || magnList(s).length > 0;
    function endPhase(s, add) {
      for (const f of Object.keys(EP)) for (const [c, how] of epList(s, f)) {
        const cost = (n) => setf(n, 'ep' + f);
        if (how === 'add') add(`End Phase – ${N(f)}: aggiungi ${N(c)} dal Deck`, f, { ash: 1 }, cost, (n) => { rm(n.deck, c); n.hand.push(c); });
        else if (how === 'set') add(`End Phase – ${N(f)}: Posiziona ${N(c)} dal Deck`, f, {}, cost, (n) => { rm(n.deck, c); n.st.push(c + '*'); });
        else add(`End Phase – ${N(f)}: Evoca ${N(c)} dal Deck`, f, { ash: 1, summon: 1 }, cost, (n) => { rm(n.deck, c); summon(n, mon(c), 'ss'); });
      }
      for (const [c, f] of [['IECC', 'ieccEP'], ['CART', 'cartEP'], ['BHIGH', 'bhigh']]) if (backOK(s, c, f))
        add(`End Phase – ${N(c)}: torna dal Cimitero in mano (una Fusione è andata al Cimitero)`, c, {}, (n) => setf(n, f), (n) => { rm(n.gy, c); n.hand.push(c); });
      for (const [l, t, c] of magnList(s))
        add(`End Phase – ${N('MAGN')}: aggiungi ${N(c)} ${t}`, 'MAGN', l === 'deck' ? { ash: 1 } : {}, (n) => setf(n, 'magnDone'), (n) => { rm(n[l], c); n.hand.push(c); });
    }

    // ---------------------------------------------------------------- Main Phase
    function main(s, add) {
      const hand = uniq(s.hand);
      const fieldU = uniq(s.mz);
      const xOnField = s.mz.some((m) => C[P(m).c].x);

      K.normalSummons(s, add, null, 'N'); // N = Evocato Normalmente (non vale come materiale per Sprind)

      // ---------- Evocazioni Speciali dalla mano
      const ssHand = (c, f, cond, label) => { if (has(s.hand, c) && !flag(s, f) && cond && canSS(s, c))
        add(label, c, { summon: 1 }, null, (n) => { setf(n, f); rm(n.hand, c); summon(n, mon(c), 'ss'); }); };
      ssHand('KITT', 'kittS', albFusionOnField(s) || s.gy.some((c) => C[c].alb), `${N('KITT')}: si Evoca Specialmente dalla mano`);
      ssHand('CART', 'cartS', albazFieldOrGY(s), `${N('CART')}: si Evoca Specialmente dalla mano (${N('ALBAZ')} sul campo o nel Cimitero)`);
      ssHand('FLEUR', 'fleur', xOnField, `${N('FLEUR')}: si Evoca Specialmente dalla mano (c'è un mostro dell'Extra Deck)`);
      ssHand('DECC', 'deccS', xOnField, `${N('DECC')}: si Evoca Specialmente dalla mano (c'è un mostro dell'Extra Deck)`);
      if (has(s.hand, 'MAXIMUS') && !flag(s, 'maxS') && canSS(s, 'MAXIMUS'))
        for (const f of uniq(s.gy)) if (C[f].x)
          add(`${N('MAXIMUS')}: bandisci ${N(f)} dal Cimitero e si Evoca Specialmente`, 'MAXIMUS', { summon: 1 }, (n) => { setf(n, 'maxS'); rm(n.gy, f); banish(n, f); }, (n) => { rm(n.hand, 'MAXIMUS'); summon(n, mon('MAXIMUS'), 'ss'); });
      // Bystial: bandiscono un mostro LUCE/OSCURITA' da un Cimitero (al turno 1 solo il tuo)
      for (const b of BYSTIAL) if (has(s.hand, b) && !flag(s, 'ss' + b) && canSS(s, b))
        for (const g of uniq(s.gy)) if (isM(g) && lightDark(g))
          add(`${N(b)}: bandisci ${N(g)} dal Cimitero e si Evoca Specialmente`, b, { summon: 1 }, (n) => setf(n, 'ss' + b), (n) => { rm(n.gy, g); banish(n, g); rm(n.hand, b); summon(n, mon(b), 'ss'); });
      if (!flag(s, 'blubS')) for (const src of ['hand', 'gy']) if (has(s[src], 'BLUB'))
        for (const m of fieldU) { const p = P(m); if (faceUp(p) && C[p.c].race === 'Dragon' && C[p.c].attr === 'DARK' && (C[p.c].lv || 0) >= 6)
          add(`${N('BLUB')}: tributa ${N(p.c)} e si Evoca Specialmente ${src === 'hand' ? 'dalla mano' : 'dal Cimitero'}`, 'BLUB', { summon: 1 },
            (n) => { setf(n, 'blubS'); leaveField(n, m, 'gy'); }, (n) => { rm(n[src], 'BLUB'); summon(n, mon('BLUB'), 'ss'); }); }
      if (has(s.hand, 'BLUB') && !flag(s, 'blubA'))
        for (const b of BYSTIAL) if (has(s.deck, b))
          add(`${N('BLUB')} (dalla mano al Cimitero): aggiungi ${N(b)} dal Deck`, 'BLUB', { ash: 1 }, (n) => { setf(n, 'blubA'); disc(n, 'BLUB'); }, (n) => { rm(n.deck, b); n.hand.push(b); });
      if (up(s, 'BLUB') && !flag(s, 'blubC'))
        for (const c of ['BEAST', 'REGAINED', 'LOST']) if (has(s.deck, c) && !has(s.st, c))
          add(`${N('BLUB')}: metti ${N(c)} dal Deck scoperta sul campo`, 'BLUB', { mon: 1 }, (n) => setf(n, 'blubC'), (n) => { rm(n.deck, c); n.st.push(c); });
      // Albion il Drago Avvolto: dalla mano o dal Cimitero
      if (!flag(s, 'albs')) for (const src of ['hand', 'gy']) if (has(s[src], 'ALBS')) {
        const h2 = s.hand.slice(); if (src === 'hand') rm(h2, 'ALBS');
        if (canSS(s, 'ALBS')) for (const c of uniq(h2)) if (c === 'ALBAZ' || C[c].br)
          add(`${N('ALBS')}: manda ${N(c)} dalla mano al Cimitero e si Evoca Specialmente ${src === 'hand' ? 'dalla mano' : 'dal Cimitero'}`, 'ALBS', { summon: 1 },
            (n) => { setf(n, 'albs'); disc(n, c); }, (n) => { rm(n[src], 'ALBS'); summon(n, mon('ALBS'), 'ss'); });
        for (const c of ['ALBAZ'].concat(branded(s.deck))) if (has(s.deck, c))
          add(`${N('ALBS')}: manda ${N(c)} dal Deck al Cimitero, torna in fondo al Deck` + (src === 'hand' ? ' e peschi 1' : ''), 'ALBS', { draw: 1 },
            (n) => { setf(n, 'albs'); rm(n.deck, c); toGY(n, c, false); }, (n) => { rm(n[src], 'ALBS'); n.deck.push('ALBS'); if (src === 'hand') n.draws += 1; });
      }

      // ---------- effetti sul campo / nel Cimitero
      if (up(s, 'IECC') && !flag(s, 'iecc'))
        for (const loc of ['deck', 'hand']) if (has(s[loc], 'ALBAZ'))
          add(`${N('IECC')} (si tributa): Evoca ${N('ALBAZ')} ${loc === 'deck' ? 'dal Deck' : 'dalla mano'}`, 'IECC', loc === 'deck' ? { ash: 1, mon: 1, summon: 1 } : { mon: 1, summon: 1 },
            (n) => { setf(n, 'iecc'); leaveField(n, find(n, 'IECC'), 'gy'); }, (n) => { rm(n[loc], 'ALBAZ'); summon(n, mon('ALBAZ'), 'ss'); });
      if (up(s, 'CART') && !flag(s, 'cartF'))
        for (const o of fusionOpts(s, ['hand', 'field']))
          add(`${N('CART')}: Fusione ${N(o.fus)} con ${matLabel(o)}`, 'CART', { mon: 1, summon: 1 }, (n) => setf(n, 'cartF'), (n) => applyFusion(n, o, { hand: 'gy', field: 'gy' }));
      // Dogmatika Maximus: il risolutore considera solo le coppie di Fusioni con effetto in End Phase
      if (up(s, 'MAXIMUS') && !flag(s, 'maxE') && !flag(s, 'noExtra')) {
        const fs = EPF.filter((f) => has(s.extra, f));
        for (let i = 0; i < fs.length; i++) for (let j = i + 1; j < fs.length; j++)
          add(`${N('MAXIMUS')}: manda ${N(fs[i])} + ${N(fs[j])} dall'Extra Deck al Cimitero (niente più Extra Deck)`, 'MAXIMUS', { mon: 1 },
            (n) => setf(n, 'maxE'), (n) => { sendExtra(n, fs[i]); sendExtra(n, fs[j]); setf(n, 'noExtra'); });
      }
      if (up(s, 'KEEPER') && !flag(s, 'keepB') && canPlace(s, 'ALBAZ'))
        for (const c of ['ALBAZ', 'ALBS', 'CART']) if (has(s.gy, c) && (c !== 'CART' || has(s.extra, 'GRAN')))
          add(`${N('KEEPER')}: rivela una Fusione, Evoca ${N(c)} dal Cimitero coperto in Difesa`, 'KEEPER', { mon: 1, summon: 1 }, (n) => setf(n, 'keepB'),
            (n) => { rm(n.gy, c); summon(n, mon(c, { fl: 'd' }), 'ss'); });
      // Giadaspecchio nel proprio turno: bandisce un tuo mostro, ma poi non puo' usare l'effetto nel turno avversario
      if (up(s, 'MIRROR') && !flag(s, 'mj'))
        for (const f of EPF) if (has(s.extra, f)) for (const t of fieldU)
          add(`${N('MIRROR')}: manda ${N(f)} dall'Extra Deck al Cimitero, bandisci ${N(P(t).c)}`, 'MIRROR', { mon: 1 },
            (n) => { setf(n, 'mj'); sendExtra(n, f); }, (n) => leaveField(n, t, 'ban'));
      if (has(s.gy, 'TRAG') && !flag(s, 'trag'))
        for (const c of branded(s.gy))
          add(`${N('TRAG')} (bandita dal Cimitero): Posiziona ${N(c)} dal Cimitero`, 'TRAG', {}, (n) => { setf(n, 'trag'); rm(n.gy, 'TRAG'); n.ban.push('TRAG'); }, (n) => { rm(n.gy, c); n.st.push(c + '*'); });
      // Alba-Lenatus: mandando Albaz + Draghi dal campo al Cimitero, senza carta Fusione
      if (has(s.extra, 'LENATUS') && !flag(s, 'noExtra'))
        for (const o of fusionOpts(s, ['field'], { only: (f) => f === 'LENATUS' }))
          add(`${N('LENATUS')}: manda ${matLabel(o)} dal campo al Cimitero (senza carta Fusione)`, 'LENATUS', { summon: 1 }, null, (n) => applyFusion(n, o, { field: 'gy' }));

      // ---------- Magie (dalla mano; quelle Normali/Continue anche se Posizionate in questo turno)
      let loc;
      for (const c of ['LOST', 'REGAINED']) if ((loc = spellLoc(s, c)) && !has(s.st, c)) { const L = loc;
        add(`Attiva ${N(c)} (Magia Continua)`, c, {}, null, (n) => { if (L === 'st') rm(n.st, c + '*'); else rm(n.hand, c); n.st.push(c); }); }
      if ((loc = spellLoc(s, 'BFUS')) && !flag(s, 'bfus')) { const L = loc;
        for (const o of fusionOpts(s, ['hand', 'deck', 'field'], { only: (f) => C[f].alb, max: 2 }))
          add(`${N('BFUS')}: Fusione ${N(o.fus)} con ${matLabel(o)}`, 'BFUS', { ash: 1, summon: 1 },
            (n) => { setf(n, 'bfus'); useSpell(n, 'BFUS', L); }, (n) => applyFusion(n, o, { hand: 'gy', deck: 'gy', field: 'gy' })); }
      if ((loc = spellLoc(s, 'BWHITE')) && !flag(s, 'bwhite')) { const L = loc;
        for (const o of fusionOpts(s, ['hand', 'field', 'gy'], { dragon: 1, gyAlbaz: 1 }))
          add(`${N('BWHITE')}: Fusione ${N(o.fus)} con ${matLabel(o)}`, 'BWHITE', { summon: 1 },
            (n) => { setf(n, 'bwhite'); useSpell(n, 'BWHITE', L); }, (n) => applyFusion(n, o, { hand: 'gy', field: 'gy', gy: 'ban' })); }
      if (has(s.hand, 'SUPERPOLY')) { const h2 = s.hand.slice(); rm(h2, 'SUPERPOLY');
        for (const d of uniq(h2)) for (const o of fusionOpts(s, ['field']))
          add(`${N('SUPERPOLY')}: scarta ${N(d)}, Fusione ${N(o.fus)} con ${matLabel(o)}`, 'SUPERPOLY', { summon: 1 },
            (n) => { rm(n.hand, 'SUPERPOLY'); n.gy.push('SUPERPOLY'); disc(n, d); }, (n) => applyFusion(n, o, { field: 'gy' })); }
      if ((loc = spellLoc(s, 'BBOND')) && !flag(s, 'bbond') && canSS(s, 'ALBAZ')) { const L = loc;
        for (const [from, c, txt] of [['hand', 'ALBAZ', 'dalla mano'], ['gy', 'ALBAZ', 'dal Cimitero'], ['gy', 'ALBS', 'dal Cimitero'], ['ban', 'ALBAZ', 'dai banditi']])
          if (has(s[from], c))
            add(`${N('BBOND')}: Evoca ${N(c)} ${txt}`, 'BBOND', { summon: 1 }, (n) => { setf(n, 'bbond'); useSpell(n, 'BBOND', L); }, (n) => { rm(n[from], c); summon(n, mon(c), 'ss'); }); }
      if ((loc = spellLoc(s, 'FDEPLOY')) && !flag(s, 'fdeploy')) { const L = loc;
        for (const c of ['ALBAZ', 'CART']) if (canSS(s, c) && (c === 'ALBAZ' ? s.extra.some((f) => C[f].alb) : has(s.extra, 'GRAN')))
          for (const [from, txt] of [['deck', 'dal Deck'], ['hand', 'dalla mano']]) if (has(s[from], c))
            add(`${N('FDEPLOY')}: Evoca ${N(c)} ${txt}`, 'FDEPLOY', from === 'deck' ? { ash: 1, summon: 1 } : { summon: 1 },
              (n) => { setf(n, 'fdeploy'); useSpell(n, 'FDEPLOY', L); }, (n) => { rm(n[from], c); summon(n, mon(c), 'ss'); }); }
      if ((loc = spellLoc(s, 'NADIR')) && !flag(s, 'nadir') && !flag(s, 'noExtra')) { const L = loc;
        for (const f of EPF) if (has(s.extra, f))
          for (const [from, txt] of [['deck', 'dal Deck'], ['gy', 'dal Cimitero']])
            for (const c of ['FLEUR', 'MAXIMUS', 'DECC', 'QUEM', 'ALBAZ']) if (has(s[from], c) && C[c].atk <= C[f].atk)
              add(`${N('NADIR')}: manda ${N(f)} dall'Extra Deck al Cimitero, aggiungi ${N(c)} ${txt} (niente più Extra Deck)`, 'NADIR', { ash: 1 },
                (n) => { setf(n, 'nadir'); useSpell(n, 'NADIR', L); }, (n) => { sendExtra(n, f); rm(n[from], c); n.hand.push(c); setf(n, 'noExtra'); }); }
      if ((loc = spellLoc(s, 'FOOLISH'))) { const L = loc;
        for (const c of uniq(s.deck)) if (isM(c))
          add(`${N('FOOLISH')}: manda ${N(c)} dal Deck al Cimitero`, 'FOOLISH', c === 'NIBIRU' ? { ash: 1, minor: 1 } : { ash: 1 }, (n) => useSpell(n, 'FOOLISH', L), (n) => { rm(n.deck, c); effGY(n, c); }); }
      // Sarcofago d'Oro: bersagli utili al turno 1 sono Mercourier e Tragedia, che banditi cercano una carta
      if ((loc = spellLoc(s, 'SARC'))) { const L = loc;
        for (const c of ['MERC', 'TRAG']) if (has(s.deck, c))
          add(`${N('SARC')}: bandisci ${N(c)} dal Deck`, 'SARC', {}, (n) => useSpell(n, 'SARC', L), (n) => { rm(n.deck, c); banish(n, c); }); }
      const quick = (c) => (n) => { rm(n.hand, c); n.gy.push(c); };
      if (has(s.hand, 'BRED') && !flag(s, 'bred'))
        for (const c of uniq(s.gy)) if (C[c].despia || c === 'ALBAZ' || c === 'ALBS') {
          const cost = (n) => { setf(n, 'bred'); quick('BRED')(n); };
          const take = (n) => { rm(n.gy, c); n.hand.push(c); };
          add(`${N('BRED')}: riprendi ${N(c)} dal Cimitero`, 'BRED', {}, cost, take);
          const t = clone(s); rm(t.hand, 'BRED'); take(t);
          for (const o of fusionOpts(t, ['hand', 'field']))
            add(`${N('BRED')}: riprendi ${N(c)}, poi Fusione ${N(o.fus)} bandendo ${matLabel(o)}`, 'BRED', { summon: 1 }, cost, (n) => { take(n); applyFusion(n, o, { hand: 'ban', field: 'ban' }); });
        }
      if (has(s.hand, 'BOPEN') && !flag(s, 'bopen')) { const h2 = s.hand.slice(); rm(h2, 'BOPEN');
        for (const d of uniq(h2)) for (const c of DESPIA) if (has(s.deck, c)) {
          const cost = (n) => { setf(n, 'bopen'); quick('BOPEN')(n); };
          add(`${N('BOPEN')}: scarta ${N(d)}, aggiungi ${N(c)} dal Deck`, 'BOPEN', { ash: 1 }, cost, (n) => { rm(n.hand, d); effGY(n, d); rm(n.deck, c); n.hand.push(c); });
          if (canSS(s, c)) add(`${N('BOPEN')}: scarta ${N(d)}, Evoca ${N(c)} dal Deck in Difesa`, 'BOPEN', { ash: 1, summon: 1 }, cost, (n) => { rm(n.hand, d); effGY(n, d); rm(n.deck, c); summon(n, mon(c), 'ss'); });
        } }
      // Marchiato nello Spirito: rivela un mostro e manda una Fusione dello stesso Tipo; poi puo' scartarlo per cercare
      if (has(s.hand, 'BHIGH') && !flag(s, 'bhigh') && !flag(s, 'noExtra'))
        for (const m of hand) if (isM(m)) for (const f of uniq(s.extra)) if (C[f].race === C[m].race && (C[f].atk === 2500 || C[f].def === 2500)) {
          const cost = (n) => { setf(n, 'bhigh'); quick('BHIGH')(n); };
          add(`${N('BHIGH')}: rivela ${N(m)}, manda ${N(f)} dall'Extra Deck al Cimitero`, 'BHIGH', {}, cost, (n) => sendExtra(n, f));
          for (const c of ALBAZ_FAMILY) if (has(s.deck, c))
            add(`${N('BHIGH')}: rivela ${N(m)}, manda ${N(f)} al Cimitero, scarta ${N(m)} e aggiungi ${N(c)} dal Deck`, 'BHIGH', { ash: 1 }, cost,
              (n) => { sendExtra(n, f); rm(n.hand, m); effGY(n, m); rm(n.deck, c); n.hand.push(c); });
        }
      if (has(s.hand, 'TFTV') && !flag(s, 'tftv')) {
        const cost = (n) => { setf(n, 'tftv'); quick('TFTV')(n); };
        if (!flag(s, 'noExtra')) for (const f of EPF) if (has(s.extra, f)) {
          for (const m of fieldU) if (faceUp(P(m)))
            add(`${N('TFTV')}: manda ${N(f)} dall'Extra Deck al Cimitero, distruggi ${N(P(m).c)}`, 'TFTV', {}, cost, (n) => { sendExtra(n, f); fieldGY(n, m); });
          for (const x of uniq(s.st)) if (!x.endsWith('*'))
            add(`${N('TFTV')}: manda ${N(f)} dall'Extra Deck al Cimitero, distruggi ${N(x)}`, 'TFTV', {}, cost, (n) => { sendExtra(n, f); rm(n.st, x); n.gy.push(x); });
        }
        if (eccAround(s)) for (const c of uniq(s.gy)) if (canRevive(s, c) && canSS(s, c))
          add(`${N('TFTV')}: Evoca ${N(c)} dal Cimitero`, 'TFTV', { summon: 1 }, cost, (n) => { rm(n.gy, c); summon(n, mon(c), 'ss'); });
      }

      // ---------- Trappole con effetto dal Cimitero
      if (has(s.gy, 'BSWORD') && !flag(s, 'bsword'))
        for (const c of uniq(s.ban)) if (has(ALBAZ_FAMILY, c))
          add(`${N('BSWORD')} (bandita dal Cimitero): riprendi ${N(c)} bandito in mano`, 'BSWORD', {}, (n) => { setf(n, 'bsword'); rm(n.gy, 'BSWORD'); n.ban.push('BSWORD'); }, (n) => { rm(n.ban, c); n.hand.push(c); });
      if (has(s.gy, 'RETRIB') && !flag(s, 'retrib'))
        for (const c of branded(s.gy)) if (c !== 'RETRIB')
          add(`${N('RETRIB')} (bandita dal Cimitero): riprendi ${N(c)} in mano`, 'RETRIB', {}, (n) => { setf(n, 'retrib'); rm(n.gy, 'RETRIB'); n.ban.push('RETRIB'); }, (n) => { rm(n.gy, c); n.hand.push(c); });
    }

    // ---------------------------------------------------------------- valutazione del campo finale
    function evaluate(s) {
      const sc = K.scorer(), it = sc.it;
      const ps = s.mz.map(P);
      const hasST = (c) => has(s.hand, c) || has(s.st, c + '*');
      const albOnField = albFusionOnField(s);
      const albInGY = s.gy.filter((c) => C[c].alb).length;
      const albInExtra = s.extra.some((c) => C[c].alb);
      for (const p of ps) {
        if (p.c === 'MIRROR') {
          if (flag(s, 'mj')) it(0.1, `${N('MIRROR')}: effetto già usato, non disponibile nel turno avversario`);
          else if (albInExtra) {
            it(W.mirror, `${N('MIRROR')}: bandisce 1 mostro (Effetto Rapido)`);
            it(W.mirrorEP, `${N('MIRROR')}: la Fusione mandata al Cimitero attiva il suo effetto in End Phase`);
          }
        }
        if (p.c === 'RIND') it(W.rind, `${N('RIND')}: annulla un effetto di un mostro dell'Extra Deck e fa tornare in mano 1 mostro`);
        if (p.c === 'DOGMA') { it(W.dogma, `${N('DOGMA')}: mostro grosso che richiede 3 materiali`); if (eccAround(s)) it(W.dogmaEcc, `${N('DOGMA')}: immune agli effetti delle altre carte (c'è una Ecclesia)`); }
        if (p.c === 'TITAN') it(W.titan, `${N('TITAN')}: immune agli effetti attivati dei mostri dell'Extra Deck`);
        if (p.c === 'BRIGR') it(W.brigr, `${N('BRIGR')}: gli altri tuoi mostri non sono bersagliabili da effetti di mostri`);
        if (p.c === 'CART' && faceUp(p)) it(W.cart, `${N('CART')}: Fusione nel turno avversario (Effetto Rapido)`);
        if (p.c === 'IECC' && faceUp(p)) it(W.iecc, `${N('IECC')}: si tributa per evocare ${N('ALBAZ')} nel turno avversario`);
        if (p.c === 'GRAN') it(W.gran, `${N('GRAN')}: si bandisce per evocare un Dogmatika dal Deck`);
        if (faceUp(p) && (C[p.c].atk || 0) >= 2500) it(W.body, `${N(p.c)}: ${C[p.c].atk} ATK sul campo`);
      }
      it(W.mon * ps.length, `${ps.length} mostri sul campo`);
      if (albOnField && (has(s.hand, 'MERC') || up(s, 'MERC'))) it(W.merc, `${N('MERC')}: annulla un effetto di mostro avversario`);
      if (hasST('RETRIB') && (albOnField || albInGY >= 2)) it(W.retrib, `${N('RETRIB')} Posizionata: annulla un effetto che Evoca Specialmente`);
      if (hasST('PUNISH') && s.extra.length) it(W.punish, `${N('PUNISH')} Posizionata: distrugge 1 mostro mandando una Fusione al Cimitero`);
      if (hasST('TFTV') && albInExtra) it(W.tftv, `${N('TFTV')} Posizionata: manda una Fusione al Cimitero e distrugge 1 carta`);
      if (has(s.hand, 'SUPERPOLY')) it(s.mz.some((m) => fieldName(P(m)) === 'ALBAZ') ? W.superpoly : W.superpolyNo, `${N('SUPERPOLY')}: Fusione usando i mostri avversari`);
      if (hasST('BANISH') && s.gy.some((c) => C[c].despia || C[c].x)) it(W.banish, `${N('BANISH')} Posizionata: rievoca e fonde nel turno avversario`);
      if (has(s.st, 'BEAST')) {
        if (ps.some((p) => C[p.c].bystial)) it(W.beastUp, `${N('BEAST')} scoperta: tributa un Drago e distrugge 1 carta in ogni Main Phase`);
        else it(W.beast, `${N('BEAST')} scoperta`);
      } else if (hasST('BEAST')) it(W.beast, `${N('BEAST')} Posizionata`);
      if (has(s.st, 'REGAINED')) {
        it(W.regained, `${N('REGAINED')}: ricicla i mostri banditi e peschi`);
        if (s.gy.some((c) => C[c].bystial)) it(W.regainedRevive, `${N('REGAINED')}: rievoca un Bystial quando l'avversario evoca`);
      }
      if (has(s.st, 'LOST')) it(W.lost, `${N('LOST')}: le tue Fusioni non possono essere annullate e cercano un Albaz`);
      if (hasST('GOAT')) it(W.goat, `${N('GOAT')} Posizionata: blocca le evocazioni di un mostro a scelta`);
      if (hasST('FDUP') && (has(s.gy, 'BFUS') || has(s.gy, 'FDEPLOY'))) it(W.fdup, `${N('FDUP')} Posizionata: ripete una Magia Fusione dal Cimitero`);
      if (hasST('BSWORD')) it(W.bsword, `${N('BSWORD')} Posizionata`);
      if (hasST('BRED') && s.gy.some((c) => C[c].despia || c === 'ALBAZ' || c === 'ALBS')) it(W.bred, `${N('BRED')}: recupera e fonde nel turno avversario`);
      if (hasST('BOPEN')) it(W.bopen, `${N('BOPEN')} in mano`);
      const by = s.hand.filter((c) => C[c].bystial && c !== 'BLUB').length;
      if (by) it(W.bystialHand * by, `${by} Bystial in mano: bandiscono dal Cimitero avversario e si evocano (Effetto Rapido)`);
      if (has(s.hand, 'FLEUR')) it(W.fleurHand, `${N('FLEUR')} in mano: si evoca nel turno avversario`);
      if (has(s.hand, 'NIBIRU')) it(W.handtrap, `${N('NIBIRU')} in mano`);
      const special = new Set(['NIBIRU', 'MERC', 'FLEUR', 'RETRIB', 'PUNISH', 'TFTV', 'SUPERPOLY', 'BANISH', 'BEAST', 'GOAT', 'FDUP', 'BSWORD', 'BRED', 'BOPEN', 'MAGN', 'SARO', 'DRUIS']);
      const other = s.hand.filter((c) => !special.has(c)).length;
      it(W.hand * other, `${other} altre carte in mano`);
      it(W.draw * s.draws, `${s.draws} carte pescate (ignote)`);
      return sc.result();
    }

    return { fieldName, onSummon, onToGY, onBanish, pending, epAvail, endPhase, main, evaluate };
  },
});
})(typeof window !== 'undefined' ? window : globalThis);
