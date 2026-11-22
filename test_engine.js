// Prove del motore.
//   node test_engine.js                          confronto con tests/baseline.json (tutti i mazzi)
//   node test_engine.js --update                 riscrive il riferimento con i risultati attuali
//   node test_engine.js blue-eyes SAGE,MAIDEN 3  esplora una mano (3 = giri di affinamento)
const fs = require('fs');
const path = require('path');
const Core = require('./core.js');
for (const f of fs.readdirSync(path.join(__dirname, 'decks'))) if (f.endsWith('.js')) require('./decks/' + f);

const BASE = path.join(__dirname, 'tests', 'baseline.json');
const CAP = 60000;
const args = process.argv.slice(2);

function run(E, hand) {
  const g = new E.Graph(CAP);
  const s0 = E.initial(hand);
  const root = g.solve(s0, CAP);
  // coerenza: ogni chiave deve ricostruire lo stesso stato
  for (let i = 0; i < g.size(); i += 97) if (E.key(g.state(i)) !== g.keys[i]) throw new Error('fromKey incoerente: ' + g.keys[i]);
  return { g, root, s0, res: { hand, exact: !g.approx[root], states: g.size(), best: g.best[root], dist: g.dist[root] } };
}

if (args.length && !args[0].startsWith('--')) {
  const E = Core.createEngine(Core.decks[args[0]]);
  const hand = args[1].split(',');
  const rounds = +(args[2] || 1);
  const g = new E.Graph(200000), s0 = E.initial(hand);
  let root;
  for (let r = 0; r < rounds; r++) {
    const t0 = Date.now();
    root = g.solve(s0);
    console.log(`giro ${r + 1} | stati ${g.size()}${g.approx[root] ? ' (parziale)' : ''} | migliore ${g.best[root]} in ${g.dist[root]} mosse | ${Date.now() - t0} ms`);
    if (!g.approx[root]) break;
  }
  const line = g.bestLine(root);
  line.forEach((st, i) => console.log(`  ${i + 1}. ${st.label}`));
  const end = line.length ? line[line.length - 1].state : s0;
  console.log('  CAMPO:', end.mz.map((m) => E.P(m).c).join(', ') || '-', '| M/T:', end.st.join(', ') || '-', '| mano:', end.hand.join(', ') || '-');
  for (const it of E.evaluate(end).items) console.log(`     +${it.pts}  ${it.label}`);
} else {
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const update = args[0] === '--update';
  let bad = 0;
  for (const id of Object.keys(Core.decks)) {
    const E = Core.createEngine(Core.decks[id]);
    const cases = base[id] || Core.decks[id].presets.map((hand) => ({ hand }));
    const out = [];
    for (const c of cases) {
      const r = run(E, c.hand).res;
      out.push(r);
      const same = ['exact', 'states', 'best', 'dist'].every((k) => c[k] === r[k]);
      if (!same && !update) bad++;
      console.log(`${same ? 'ok  ' : update ? 'NEW ' : 'DIFF'} ${id} ${c.hand.join('+')} | stati ${r.states} | migliore ${r.best} in ${r.dist}${r.exact ? '' : ' (parziale)'}` +
        (same ? '' : ` | atteso: stati ${c.states}, migliore ${c.best} in ${c.dist}`));
    }
    base[id] = out;
  }
  if (update) fs.writeFileSync(BASE, JSON.stringify(base, null, 1) + '\n');
  if (bad) { console.error(`${bad} risultati diversi dal riferimento`); process.exit(1); }
}
