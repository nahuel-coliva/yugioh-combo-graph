/* Mazzo: Structure Deck "Attenzione alla Trappolatrice" (Beware of Traptrix), una copia.
 * Turno 1 giocando per primi: le Trappole "Buco" non si attivano nel proprio turno,
 * quindi contano come interruzioni Posizionate per il turno avversario.
 */
(function (root) {
'use strict';
const Core = typeof module !== 'undefined' && module.exports ? require('../core.js') : root.ComboCore;
const S = Core.STAPLES;

// tx: carta "Trappolatrice".  nt: Trappola Normale.  hole: Trappola Normale "Buco".
const tx = (en, race, atk, def) => ({ en, k: 'M', lv: 4, attr: 'EARTH', race, tx: 1, atk, def });
const hole = (en) => ({ en, k: 'T', nt: 1, hole: 1 });
const cards = {
  PUDICA:  tx('Traptrix Pudica', 'Plant', 900, 1900),
  ARACHNO: tx('Traptrix Arachnocampa', 'Insect', 1300, 1500),
  ATRAX:   tx('Traptrix Atrax', 'Insect', 1800, 1000),
  MYRM:    tx('Traptrix Myrmeleo', 'Insect', 1600, 1200),
  NEPEN:   tx('Traptrix Nepenthes', 'Plant', 800, 2000),
  DION:    tx('Traptrix Dionaea', 'Plant', 1700, 1100),
  GENLI:   tx('Traptrix Genlisea', 'Plant', 1200, 1600),
  VESI:    tx('Traptrix Vesiculo', 'Plant', 1400, 1400),
  MANTIS:  tx('Traptrix Mantis', 'Insect', 1500, 1300),
  GADARLA: { en: 'Gadarla, the Mystery Dust Kaiju', k: 'M', lv: 8, attr: 'WIND', race: 'Insect', atk: 2700, def: 1600 },
  KUMO:    { en: 'Kumongous, the Sticky String Kaiju', k: 'M', lv: 7, attr: 'EARTH', race: 'Insect', atk: 2400, def: 2500 },
  RETC:    { en: 'Retaliating "C"', k: 'M', lv: 4, attr: 'EARTH', race: 'Insect', atk: 1400, def: 1400 },
  RESO:    { en: 'Resonance Insect', k: 'M', lv: 4, attr: 'EARTH', race: 'Insect', atk: 1000, def: 700 },
  LONE:    { en: 'Lonefire Blossom', k: 'M', lv: 3, attr: 'FIRE', race: 'Plant', atk: 500, def: 1400 },
  ASH:     S.ASH,
  ROSE:    { en: 'Rose Lover', k: 'M', lv: 1, attr: 'EARTH', race: 'Plant', atk: 800, def: 800 },
  SAUGE:   { en: 'Sauge de Fleur', k: 'M', lv: 8, attr: 'DARK', race: 'Spellcaster', atk: 2900, def: 0 },
  PURPLE:  { en: 'Mekk-Knight Purple Nightfall', k: 'M', lv: 8, attr: 'LIGHT', race: 'Psychic', atk: 2500, def: 2000 },
  BLUE:    { en: 'Mekk-Knight Blue Sky', k: 'M', lv: 5, attr: 'LIGHT', race: 'Psychic', atk: 2000, def: 2500 },
  MORAL:   { en: 'Artifact Moralltach', k: 'M', lv: 5, attr: 'LIGHT', race: 'Fairy', atk: 2100, def: 1400 },
  FIREH:   { en: 'Fire Hand', k: 'M', lv: 4, attr: 'FIRE', race: 'Pyro', atk: 1600, def: 1000 },
  ICEH:    { en: 'Ice Hand', k: 'M', lv: 4, attr: 'WATER', race: 'Aqua', atk: 1400, def: 1600 },
  THUNDH:  { en: 'Thunder Hand', k: 'M', lv: 4, attr: 'LIGHT', race: 'Thunder', atk: 1600, def: 1600 },
  GARDEN:  { en: 'Traptrip Garden', k: 'S', field: 1 },
  TUNE:    { en: 'Traptantalizing Tune', k: 'S' },
  RAIGEKI: { en: 'Raigeki', k: 'S' },
  HFD:     { en: "Harpie's Feather Duster", k: 'S' },
  TERR:    hole('Terrifying Trap Hole Nightmare'),
  TRAPHOLE: hole('Trap Hole'),
  BOTTOM:  hole('Bottomless Trap Hole'),
  VOID:    hole('Void Trap Hole'),
  TTHN:    hole('Traptrix Trap Hole Nightmare'),
  FLOOD:   hole('Floodgate Trap Hole'),
  GRAVE:   hole("Gravedigger's Trap Hole"),
  TRICK:   { en: 'Trap Trick', k: 'T', nt: 1 },
  // Trappole che diventano mostri: sul campo valgono come mostri Normali di Livello 4
  BRIG:    { en: 'The Phantom Knights of Shade Brigandine', k: 'T', nt: 1, lv: 4, attr: 'DARK', race: 'Warrior', normal: 1, atk: 0, def: 300 },
  SANCTUM: { en: 'Artifact Sanctum', k: 'T', nt: 1 },
  TREE:    { en: 'Naturia Sacred Tree', k: 'T' },
  EVENLY:  { en: 'Evenly Matched', k: 'T', nt: 1 },
  HOLEUTEA: { en: 'Traptrix Holeutea', k: 'T', nt: 1, hole: 1, tx: 1, lv: 4, attr: 'EARTH', race: 'Plant', normal: 1, atk: 400, def: 2400 },
  RAFF:    { en: 'Traptrix Rafflesia', k: 'M', x: 'xyz', attr: 'EARTH', race: 'Plant', tx: 1, atk: 300, def: 2500 },
  ALLO:    { en: 'Traptrix Allomerus', k: 'M', x: 'xyz', attr: 'EARTH', race: 'Insect', tx: 1, atk: 2200, def: 600 },
  PING:    { en: 'Traptrix Pinguicula', k: 'M', x: 'xyz', attr: 'EARTH', race: 'Plant', tx: 1, atk: 2500, def: 300 },
  CULARIA: { en: 'Traptrix Cularia', k: 'M', x: 'link', link: 2, attr: 'EARTH', race: 'Plant', tx: 1, atk: 1800 },
  ATYPUS:  { en: 'Traptrix Atypus', k: 'M', x: 'link', link: 3, attr: 'EARTH', race: 'Insect', tx: 1, atk: 1800 },
  SERA:    { en: 'Traptrix Sera', k: 'M', x: 'link', link: 1, attr: 'EARTH', race: 'Plant', tx: 1, atk: 800 },
};

Core.register({
  id: 'traptrix',
  name: 'Attenzione alla Trappolatrice',
  note: 'Structure Deck · turno 1 · senza banlist',
  cards,
  main: {
    PUDICA: 1, ARACHNO: 1, ATRAX: 1, MYRM: 1, NEPEN: 1, DION: 1, GENLI: 1, VESI: 1, MANTIS: 1,
    GADARLA: 1, KUMO: 1, RETC: 1, RESO: 1, LONE: 1, ASH: 1, ROSE: 1, SAUGE: 1, PURPLE: 1, BLUE: 1, MORAL: 1,
    FIREH: 1, ICEH: 1, THUNDH: 1, GARDEN: 1, TUNE: 1, RAIGEKI: 1, HFD: 1,
    TERR: 1, TRAPHOLE: 1, BOTTOM: 2, VOID: 1, TTHN: 2, FLOOD: 1, GRAVE: 1, TRICK: 1, BRIG: 1, SANCTUM: 1, TREE: 1, EVENLY: 1, HOLEUTEA: 1,
  },
  extra: { RAFF: 1, ALLO: 1, PING: 1, CULARIA: 1, ATYPUS: 1, SERA: 1 },
  presets: [['MYRM'], ['MANTIS'], ['PUDICA'], ['MYRM', 'BRIG'], ['MANTIS', 'BOTTOM'], ['PUDICA', 'MYRM'], ['LONE'], ['MYRM', 'ARACHNO'],
    ['MANTIS', 'HOLEUTEA', 'BOTTOM'], ['DION', 'BRIG', 'TUNE']],
  weights: {
    hole: { BOTTOM: 7, FLOOD: 7, TTHN: 7, VOID: 6, TERR: 6, GRAVE: 5, TRAPHOLE: 4 },
    trick: 8, sanctum: 7, tree: 3, trapMon: 2, moral: 2,
    raff: 14, raffProt: 3, sera: 10, cularia: 6, atypus: 3, allo: 5, ping: 5,
    nepen: 6, atrax: 3, arachno: 3, arachnoHand: 2, txBody: 1, body: 2, hand: 1.5, draw: 1.5, handtrap: 6,
  },

  setup(K) {
    const { C, N, W, has, rm, uniq, count, flag, setf, addPend, mon, P, unP, negd, clone,
      onField, curLv, canPlace, canSS, toGY, banish, leaveField, summon } = K;

    const isM = (c) => C[c].k === 'M';
    const txMon = (c) => isM(c) && C[c].tx;                 // mostro "Trappolatrice" in mano/Deck/Cimitero
    const txField = (m) => !!C[P(m).c].tx;                    // sul campo vale anche Holeutea diventata mostro
    const insPlant = (p) => C[p.c].race === 'Insect' || C[p.c].race === 'Plant';
    const holes = (zone) => uniq(zone.filter((c) => C[c].hole));
    const setCode = (x) => x.replace('*', '');
    const PRIORITY = ['BOTTOM', 'FLOOD', 'TTHN', 'VOID', 'TERR', 'GRAVE', 'TRAPHOLE'];

    // Scelta di una Trappola "Buco": al turno 1 sono quasi equivalenti, quindi il risolutore considera
    // solo Holeutea (che apre combo) e la migliore non ancora posseduta; le altre restano giocabili a mano.
    function holePick(s, list) {
      const own = new Set(s.hand.concat(s.st.map(setCode)));
      const rest = list.filter((c) => c !== 'HOLEUTEA')
        .sort((a, b) => (own.has(a) - own.has(b)) || (PRIORITY.indexOf(a) - PRIORITY.indexOf(b)));
      const out = [];
      if (has(list, 'HOLEUTEA')) out.push({ c: 'HOLEUTEA', minor: false });
      rest.forEach((c, i) => out.push({ c, minor: i > 0 }));
      return out;
    }
    const tg = (base, minor) => (minor ? Object.assign({ minor: 1 }, base) : base);

    // Sera: reagisce agli effetti delle altre Trappolatrici e alle Trappole Normali attivate
    const txEff = (n) => { if (onField(n, 'SERA') && !flag(n, 'seraB')) addPend(n, 'seraSet'); };
    function trapAct(n, isHole) {
      if (onField(n, 'SERA') && !flag(n, 'seraA')) addPend(n, 'seraSS');
      if (isHole && onField(n, 'NEPEN') && !flag(n, 'nepen')) addPend(n, 'nepen');
    }

    // ---------------------------------------------------------------- inneschi
    function onSummon(s, p, how) {
      if (how === 'ns') {
        if (p.c === 'PUDICA' && !flag(s, 'pudNS')) addPend(s, 'pudicaNS');
        if (p.c === 'MYRM') addPend(s, 'myrmNS');
        if (p.c === 'DION') addPend(s, 'dionNS');
        if (p.c === 'MANTIS') addPend(s, 'mantisNS');
      } else if (p.c === 'DION' && !negd(p) && !flag(s, 'dionSS')) addPend(s, 'dionSS');
    }
    function onToGY(s, c, fromField) {
      if (c === 'RETC' && fromField) addPend(s, 'retC');
      if (c === 'RESO' && fromField) addPend(s, 'reso');
    }
    function onBanish(s, c) {
      if (c === 'RESO') addPend(s, 'resoBan');
    }
    const RETC_OK = ['ARACHNO', 'MANTIS', 'RESO'];                      // TERRA Insetto con ATK <= 1500
    const RESO_SEND = ['MYRM', 'ARACHNO', 'ATRAX', 'MANTIS', 'RETC'];   // Insetti utili nel Cimitero
    const seraSSok = (s, c) => { const ctrl = new Set(s.mz.map((m) => P(m).c).concat(s.st.map(setCode), s.fz ? [s.fz] : [])); return txMon(c) && has(s.deck, c) && !ctrl.has(c); };

    const pending = {
      pudicaNS: {
        ok: (s) => onField(s, 'PUDICA') && !flag(s, 'pudNS') && has(s.deck, 'GARDEN'),
        run: (s, add, done) => add(`${N('PUDICA')}: aggiungi ${N('GARDEN')} dal Deck`, 'PUDICA', { ash: 1, mon: 1 },
          (n) => { done(n); setf(n, 'pudNS'); txEff(n); }, (n) => { rm(n.deck, 'GARDEN'); n.hand.push('GARDEN'); }),
      },
      myrmNS: {
        ok: (s) => onField(s, 'MYRM') && holes(s.deck).length > 0,
        run: (s, add, done) => { for (const o of holePick(s, holes(s.deck)))
          add(`${N('MYRM')}: aggiungi ${N(o.c)} dal Deck`, 'MYRM', tg({ ash: 1, mon: 1 }, o.minor), (n) => { done(n); txEff(n); }, (n) => { rm(n.deck, o.c); n.hand.push(o.c); }); },
      },
      dionNS: {
        ok: (s) => onField(s, 'DION') && s.gy.some(txMon) && canPlace(s, 'DION'),
        run: (s, add, done) => { for (const c of uniq(s.gy.filter(txMon)))
          add(`${N('DION')}: Evoca ${N(c)} dal Cimitero in Difesa`, 'DION', { mon: 1, summon: 1 }, (n) => { done(n); txEff(n); }, (n) => { rm(n.gy, c); summon(n, mon(c), 'ss'); }); },
      },
      dionSS: {
        ok: (s) => onField(s, 'DION') && !flag(s, 'dionSS') && holes(s.gy).length > 0,
        run: (s, add, done) => { for (const c of holes(s.gy))
          add(`${N('DION')}: Posiziona ${N(c)} dal Cimitero`, 'DION', { mon: 1 }, (n) => { done(n); setf(n, 'dionSS'); txEff(n); }, (n) => { rm(n.gy, c); n.st.push(c + '*'); }); },
      },
      mantisNS: {
        ok: (s) => onField(s, 'MANTIS') && s.deck.some(txMon),
        run: (s, add, done) => { for (const c of uniq(s.deck.filter(txMon)))
          add(`${N('MANTIS')}: aggiungi ${N(c)} dal Deck`, 'MANTIS', { ash: 1, mon: 1 }, (n) => { done(n); txEff(n); }, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      seraSS: {
        ok: (s) => onField(s, 'SERA') && !flag(s, 'seraA') && uniq(s.deck).some((c) => seraSSok(s, c) && canSS(s, c)),
        run: (s, add, done) => { for (const c of uniq(s.deck)) if (seraSSok(s, c) && canSS(s, c))
          add(`${N('SERA')}: Evoca ${N(c)} dal Deck`, 'SERA', { ash: 1, mon: 1, summon: 1 }, (n) => { done(n); setf(n, 'seraA'); }, (n) => { rm(n.deck, c); summon(n, mon(c), 'ss'); }); },
      },
      seraSet: {
        ok: (s) => onField(s, 'SERA') && !flag(s, 'seraB') && holes(s.deck).length > 0,
        run: (s, add, done) => { for (const o of holePick(s, holes(s.deck)))
          add(`${N('SERA')}: Posiziona ${N(o.c)} dal Deck`, 'SERA', tg({ mon: 1 }, o.minor), (n) => { done(n); setf(n, 'seraB'); }, (n) => { rm(n.deck, o.c); n.st.push(o.c + '*'); }); },
      },
      nepen: {
        ok: (s) => onField(s, 'NEPEN') && !flag(s, 'nepen') && s.deck.some((c) => txMon(c) && c !== 'NEPEN'),
        run: (s, add, done) => { for (const c of uniq(s.deck)) if (txMon(c) && c !== 'NEPEN') {
          const cost = (n) => { done(n); setf(n, 'nepen'); txEff(n); };
          add(`${N('NEPEN')}: aggiungi ${N(c)} dal Deck`, 'NEPEN', { ash: 1, mon: 1 }, cost, (n) => { rm(n.deck, c); n.hand.push(c); });
          if (canSS(s, c)) add(`${N('NEPEN')}: Evoca ${N(c)} dal Deck`, 'NEPEN', { ash: 1, mon: 1, summon: 1 }, cost, (n) => { rm(n.deck, c); summon(n, mon(c), 'ss'); });
        } },
      },
      retC: {
        ok: (s) => RETC_OK.some((c) => has(s.deck, c)),
        run: (s, add, done) => { for (const c of RETC_OK) if (has(s.deck, c))
          add(`${N('RETC')}: aggiungi ${N(c)} dal Deck`, 'RETC', { ash: 1 }, done, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      reso: {
        ok: (s) => has(s.deck, 'KUMO') || has(s.deck, 'GADARLA'),
        run: (s, add, done) => { const c = has(s.deck, 'KUMO') ? 'KUMO' : 'GADARLA';
          add(`${N('RESO')}: aggiungi ${N(c)} dal Deck`, 'RESO', { ash: 1 }, done, (n) => { rm(n.deck, c); n.hand.push(c); }); },
      },
      resoBan: {
        ok: (s) => RESO_SEND.some((c) => has(s.deck, c)),
        run: (s, add, done) => { for (const c of RESO_SEND) if (has(s.deck, c))
          add(`${N('RESO')} (bandito): manda ${N(c)} dal Deck al Cimitero`, 'RESO', { ash: 1 }, done, (n) => { rm(n.deck, c); toGY(n, c, false); }); },
      },
    };

    // ---------------------------------------------------------------- End Phase
    const culOK = (s) => onField(s, 'CULARIA') && !flag(s, 'culEP') && s.gy.some(txMon) && canPlace(s, 'DION');
    function endPhase(s, add) {
      if (culOK(s)) for (const c of uniq(s.gy.filter(txMon)))
        add(`End Phase – ${N('CULARIA')}: Evoca ${N(c)} dal Cimitero in Difesa`, 'CULARIA', { mon: 1, summon: 1 },
          (n) => { setf(n, 'culEP'); txEff(n); }, (n) => { rm(n.gy, c); summon(n, mon(c), 'ss'); });
    }

    // ---------------------------------------------------------------- Main Phase
    function main(s, add) {
      const hand = uniq(s.hand);
      const fieldU = uniq(s.mz);
      const ctrlTx = s.mz.some(txField);

      // Giardino delle Trappolatrici: una Evocazione Normale in piu' per una "Trappolatrice"
      K.normalSummons(s, add, (st, c) => (C[c].tx && st.fz === 'GARDEN' && !flag(st, 'ns2') ? { flag: 'ns2', note: `extra del ${N('GARDEN')}` } : null));

      // ---------- dalla mano
      if (has(s.hand, 'ARACHNO') && !flag(s, 'arach') && ctrlTx && canSS(s, 'ARACHNO'))
        add(`${N('ARACHNO')}: si Evoca Specialmente dalla mano`, 'ARACHNO', { summon: 1 }, (n) => { setf(n, 'arach'); txEff(n); }, (n) => { rm(n.hand, 'ARACHNO'); summon(n, mon('ARACHNO'), 'ss'); });
      if (has(s.hand, 'VESI') && !flag(s, 'vesi') && canSS(s, 'VESI')) {
        const eff = (n) => { rm(n.hand, 'VESI'); summon(n, mon('VESI'), 'ss'); };
        for (const x of uniq(s.st)) if (x.endsWith('*') && C[setCode(x)].k === 'T')
          add(`${N('VESI')}: manda ${N(setCode(x))} Posizionata al Cimitero e si Evoca Specialmente`, 'VESI', { summon: 1 },
            (n) => { setf(n, 'vesi'); rm(n.st, x); toGY(n, setCode(x), false); txEff(n); }, eff);
        for (const c of hand) if (C[c].k === 'T')
          add(`${N('VESI')}: Posiziona ${N(c)} dalla mano, mandala al Cimitero e si Evoca Specialmente`, 'VESI', { summon: 1 },
            (n) => { setf(n, 'vesi'); rm(n.hand, c); toGY(n, c, false); txEff(n); }, eff);
      }
      if (has(s.gy, 'VESI') && !flag(s, 'vesi') && !s.st.length)
        for (const c of holes(s.gy))
          add(`${N('VESI')} (bandita dal Cimitero): Posiziona ${N(c)} dal Cimitero`, 'VESI', {},
            (n) => { setf(n, 'vesi'); rm(n.gy, 'VESI'); banish(n, 'VESI'); txEff(n); }, (n) => { rm(n.gy, c); n.st.push(c + '*'); });
      // Cavalieri Mekk: servono 2 carte nella stessa colonna (un tuo mostro e una tua Magia/Trappola bastano)
      const column = s.mz.length >= 1 && (s.st.length >= 1 || s.hand.some((c) => C[c].k === 'T' || (C[c].k === 'S' && !C[c].field)));
      for (const [c, f] of [['PURPLE', 'pSS'], ['BLUE', 'bSS']])
        if (has(s.hand, c) && !flag(s, f) && column && canSS(s, c))
          add(`${N(c)}: si Evoca Specialmente nella colonna con 2 carte`, c, { summon: 1 }, null, (n) => { setf(n, f); rm(n.hand, c); summon(n, mon(c), 'ss'); });
      if (onField(s, 'PURPLE') && !flag(s, 'pEff') && has(s.deck, 'BLUE')) {
        const m = s.mz.find((x) => P(x).c === 'PURPLE');
        add(`${N('PURPLE')}: si bandisce fino alla prossima Standby Phase, aggiungi ${N('BLUE')}`, 'PURPLE', { ash: 1, mon: 1 }, (n) => setf(n, 'pEff'),
          (n) => { leaveField(n, m, 'ban'); rm(n.deck, 'BLUE'); n.hand.push('BLUE'); });
      }
      if (has(s.gy, 'ROSE') && !flag(s, 'rose'))
        for (const c of hand) if (isM(c) && C[c].race === 'Plant' && canSS(s, c))
          add(`${N('ROSE')} (bandita dal Cimitero): Evoca ${N(c)} dalla mano`, 'ROSE', { summon: 1 },
            (n) => { setf(n, 'rose'); rm(n.gy, 'ROSE'); banish(n, 'ROSE'); }, (n) => { rm(n.hand, c); summon(n, mon(c), 'ss'); });

      // ---------- effetti sul campo
      if (!flag(s, 'genli')) {
        const dk = holes(s.deck), gy = holes(s.gy);
        for (const m of fieldU) if (P(m).c === 'GENLI' && !negd(P(m)))
          for (const o of holePick(s, dk)) for (const g of gy) if (g !== o.c)
            add(`${N('GENLI')} (si tributa): Posiziona ${N(o.c)} dal Deck e ${N(g)} dal Cimitero`, 'GENLI', tg({ mon: 1 }, o.minor),
              (n) => { setf(n, 'genli'); leaveField(n, m, 'gy'); txEff(n); },
              (n) => { rm(n.deck, o.c); n.st.push(o.c + '*'); rm(n.gy, g); n.st.push(g + '*'); });
      }
      if (onField(s, 'LONE') && !flag(s, 'lone'))
        for (const m of fieldU) if (C[P(m).c].race === 'Plant')
          for (const c of uniq(s.deck)) if (isM(c) && C[c].race === 'Plant')
            add(`${N('LONE')}: tributa ${N(P(m).c)}, Evoca ${N(c)} dal Deck`, 'LONE', { ash: 1, mon: 1, summon: 1 },
              (n) => { setf(n, 'lone'); leaveField(n, m, 'gy'); }, (n) => { if (canSS(n, c)) { rm(n.deck, c); summon(n, mon(c), 'ss'); } });

      // ---------- Magie
      if (has(s.hand, 'GARDEN') && !s.fz)
        add(`Attiva ${N('GARDEN')} (Magia Terreno)`, 'GARDEN', {}, null, (n) => { rm(n.hand, 'GARDEN'); n.fz = 'GARDEN'; });
      if (s.fz === 'GARDEN' && !flag(s, 'garden')) {
        const opts = [];
        for (const c of hand) if (txMon(c)) opts.push(['hand', c, 'dalla mano']);
        for (const c of uniq(s.gy)) if (txMon(c)) opts.push(['gy', c, 'dal Cimitero']);
        for (const m of fieldU) for (const [from, c, txt] of opts)
          add(`${N('GARDEN')}: bandisci ${N(P(m).c)}, Evoca ${N(c)} ${txt}`, 'GARDEN', { summon: 1 },
            (n) => { setf(n, 'garden'); leaveField(n, m, 'ban'); }, (n) => { if (rm(n[from], c)) summon(n, mon(c), 'ss'); });
      }
      if (has(s.hand, 'TUNE') && !flag(s, 'tune'))
        for (const d of hand) if ((isM(d) && C[d].lv === 4 && insPlant({ c: d })) || (C[d].k === 'T' && C[d].nt))
          add(`${N('TUNE')}: scarta ${N(d)}, pesca 2`, 'TUNE', { draw: 1 },
            (n) => { setf(n, 'tune'); rm(n.hand, 'TUNE'); n.gy.push('TUNE'); rm(n.hand, d); toGY(n, d, false); }, (n) => { n.draws += 2; });

      // ---------- Trappole che si attivano nel turno in cui vengono Posizionate
      if (has(s.hand, 'BRIG') && !flag(s, 'brig') && !s.gy.some((c) => C[c].k === 'T') && canPlace(s, 'BRIG'))
        add(`Posiziona e attiva ${N('BRIG')}: si Evoca come mostro Normale di Livello 4`, 'BRIG', { summon: 1 },
          (n) => { setf(n, 'brig'); rm(n.hand, 'BRIG'); trapAct(n, false); }, (n) => summon(n, mon('BRIG'), 'ss'));
      if (!flag(s, 'holeu') && canPlace(s, 'HOLEUTEA')) {
        const src = has(s.st, 'HOLEUTEA*') ? 'st' : has(s.hand, 'HOLEUTEA') ? 'hand' : null;
        if (src) {
          const h2 = s.hand.slice(); if (src === 'hand') rm(h2, 'HOLEUTEA');
          for (const d of uniq(h2)) if (C[d].k === 'T' && C[d].nt)
            add(`${src === 'hand' ? 'Posiziona e attiva' : 'Attiva'} ${N('HOLEUTEA')} scartando ${N(d)}: si Evoca come mostro di Livello 4`, 'HOLEUTEA', { summon: 1 },
              (n) => { setf(n, 'holeu'); if (src === 'st') rm(n.st, 'HOLEUTEA*'); else rm(n.hand, 'HOLEUTEA'); rm(n.hand, d); toGY(n, d, false); trapAct(n, true); },
              (n) => summon(n, mon('HOLEUTEA'), 'ss'));
        }
      }
      if (has(s.gy, 'HOLEUTEA') && !flag(s, 'holeu'))
        for (const c of uniq(s.gy.filter(txMon))) if (canSS(s, c))
          add(`${N('HOLEUTEA')} (bandita dal Cimitero): Evoca ${N(c)} dal Cimitero`, 'HOLEUTEA', { summon: 1 },
            (n) => { setf(n, 'holeu'); rm(n.gy, 'HOLEUTEA'); banish(n, 'HOLEUTEA'); }, (n) => { rm(n.gy, c); summon(n, mon(c), 'ss'); });

      // ---------- Extra Deck
      const lv4 = (p) => curLv(p) === 4;
      K.xyz(s, add, { code: 'RAFF', n: 2, ok: lv4 });
      K.xyz(s, add, { code: 'PING', n: 2, ok: lv4 });
      K.xyz(s, add, { code: 'ALLO', n: 2, ok: lv4 });
      K.xyz(s, add, { code: 'ALLO', n: 3, ok: lv4 });
      K.link(s, add, { code: 'SERA', n: 1, ok: (p) => C[p.c].tx && C[p.c].x !== 'link' });
      K.link(s, add, { code: 'CULARIA', n: 2, min: 1, ok: insPlant });
      K.link(s, add, { code: 'ATYPUS', n: 3, min: 2, valid: (ps) => ps.some(insPlant) });
      const detach = (n, m, d) => { const i = n.mz.indexOf(m); const q = P(m); rm(q.mats, d); n.mz[i] = unP(q); toGY(n, d, false); return n.mz[i]; };
      if (!flag(s, 'ping'))
        for (const m of fieldU) { const p = P(m); if (p.c !== 'PING' || negd(p)) continue;
          for (const d of uniq(p.mats)) for (const c of uniq(s.deck.filter(txMon)))
            add(`${N('PING')}: stacca ${N(d)}, aggiungi ${N(c)} dal Deck`, 'PING', { ash: 1, mon: 1 },
              (n) => { setf(n, 'ping'); detach(n, m, d); txEff(n); }, (n) => { rm(n.deck, c); n.hand.push(c); }); }
      if (!flag(s, 'allo'))
        for (const m of fieldU) { const p = P(m); if (p.c !== 'ALLO' || negd(p) || p.mats.length < 2) continue;
          const pairs = [], seen = new Set();
          for (let i = 0; i < p.mats.length; i++) for (let j = i + 1; j < p.mats.length; j++) {
            const sig = [p.mats[i], p.mats[j]].sort().join('+'); if (!seen.has(sig)) { seen.add(sig); pairs.push([p.mats[i], p.mats[j]]); } }
          for (const [a, b] of pairs) {
            const gy = uniq(s.gy.concat([a, b]));
            for (const c of gy) if (isM(c) && C[c].lv === 4 && insPlant({ c }) && canSS(s, c))
              add(`${N('ALLO')}: stacca ${N(a)} + ${N(b)}, Evoca ${N(c)} dal Cimitero`, 'ALLO', { mon: 1, summon: 1 },
                (n) => { setf(n, 'allo'); const m2 = detach(n, m, a); detach(n, m2, b); txEff(n); }, (n) => { if (rm(n.gy, c)) summon(n, mon(c), 'ss'); });
          } }
    }

    // ---------------------------------------------------------------- valutazione del campo finale
    function evaluate(s) {
      const sc = K.scorer(), it = sc.it;
      const ps = s.mz.map(P);
      // Magie/Trappole che restano Posizionate: quelle gia' sul campo piu' quelle in mano (5 zone in tutto)
      const sets = [];
      const val = (c) => {
        if (C[c].hole && c !== 'HOLEUTEA') return [W.hole[c], `${N(c)} Posizionata`];
        if (c === 'TRICK') return [W.trick, `${N(c)} Posizionata: prende dal Deck la Trappola che serve`];
        if (c === 'SANCTUM') return [has(s.deck, 'MORAL') ? W.sanctum : 0, `${N(c)} Posizionata: evoca ${N('MORAL')} e distrugge 1 carta`];
        if (c === 'TREE') return [W.tree, `${N(c)} Posizionata`];
        if (c === 'BRIG' || c === 'HOLEUTEA') return [W.trapMon, `${N(c)} Posizionata`];
        if (c === 'MORAL') return [W.moral, `${N(c)} Posizionato come Magia`];
        return [0, ''];
      };
      for (const x of s.st) sets.push(val(setCode(x)));
      const fromHand = s.hand.filter((c) => C[c].k === 'T' || c === 'MORAL').map(val).sort((a, b) => b[0] - a[0]);
      for (const v of fromHand.slice(0, Math.max(0, 5 - s.st.length))) sets.push(v);
      for (const [pts, label] of sets) it(pts, label);

      const others = ps.filter((p) => C[p.c].tx && p.c !== 'RAFF').length;
      for (const p of ps) {
        if (p.c === 'RAFF' && p.mats.length) {
          it(W.raff, `${N('RAFF')}: stacca un materiale e usa una Trappola "Buco" direttamente dal Deck`);
          if (others) it(W.raffProt, `${N('RAFF')}: le altre Trappolatrici non sono bersagliabili né distruttibili`);
        }
        if (p.c === 'SERA') it(W.sera, `${N('SERA')}: a ogni Trappola Normale evoca una Trappolatrice dal Deck, a ogni loro effetto Posiziona un "Buco"`);
        if (p.c === 'CULARIA') it(W.cularia, `${N('CULARIA')}: ri-Posiziona la Trappola "Buco" appena usata`);
        if (p.c === 'ATYPUS') it(W.atypus, `${N('ATYPUS')}: al tuo prossimo turno annulla e distrugge`);
        if (p.c === 'ALLO' && p.mats.length) it(W.allo, `${N('ALLO')}: ruba il mostro avversario eliminato da un tuo effetto`);
        if (p.c === 'PING' && p.mats.length) it(W.ping, `${N('PING')}: immune ai mostri dello stesso Tipo dei materiali, cerca una Trappolatrice`);
        if (p.c === 'NEPEN') it(W.nepen, `${N('NEPEN')}: quando attivi un "Buco" aggiunge o evoca una Trappolatrice dal Deck`);
        if (p.c === 'ATRAX') it(W.atrax, `${N('ATRAX')}: le tue Trappole Normali non possono essere annullate`);
        if (p.c === 'ARACHNO') it(W.arachno, `${N('ARACHNO')}: le tue carte Posizionate resistono a una distruzione`);
        if (C[p.c].tx) it(W.txBody, `${N(p.c)} sul campo`);
        if ((C[p.c].atk || 0) >= 2500) it(W.body, `${N(p.c)}: ${C[p.c].atk} ATK sul campo`);
      }
      if (has(s.hand, 'ARACHNO') && ps.some((p) => C[p.c].tx)) it(W.arachnoHand, `${N('ARACHNO')} in mano: si evoca nel turno avversario`);
      const n = count(s.hand, 'ASH'); if (n) it(W.handtrap * n, `${N('ASH')} in mano`);
      const other = s.hand.filter((c) => c !== 'ASH' && c !== 'ARACHNO' && C[c].k !== 'T' && c !== 'MORAL').length;
      it(W.hand * other, `${other} altre carte in mano`);
      it(W.draw * s.draws, `${s.draws} carte pescate (ignote)`);
      return sc.result();
    }

    return { onSummon, onToGY, onBanish, pending, epAvail: culOK, endPhase, main, evaluate };
  },
});
})(typeof window !== 'undefined' ? window : globalThis);
