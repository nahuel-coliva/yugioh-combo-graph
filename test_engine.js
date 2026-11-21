// Uso: node test_engine.js                   (tutti gli scenari predefiniti)
//      node test_engine.js SAGE,MAIDEN 4     (una mano = codici separati da virgola; 4 = giri di affinamento)
const E = require('./engine.js');

const presets = [
  ['MAIDEN'], ['SAGE'], ['WISHES', 'X'], ['DICT'], ['ROAR'], ['MELODY', 'X'], ['NKSH'],
  ['SAGE', 'MAIDEN'], ['MAIDEN', 'ROAR'], ['WISHES', 'SAGE'], ['DICT', 'SAGE'], ['NKSH', 'SAGE', 'MAIDEN'],
];
const arg = process.argv[2];
const rounds = +(process.argv[3] || 1);
const hands = arg ? [arg.split(',')] : presets;

for (const hand of hands) {
  const g = new E.Graph(200000);
  const s0 = E.initial(hand);
  let root;
  for (let r = 0; r < rounds; r++) {
    const t0 = Date.now();
    root = g.solve(s0);
    console.log(`\n=== ${hand.join(' + ')} | giro ${r + 1} | stati ${g.size()}${g.approx[root] ? ' (parziale)' : ''} | migliore ${g.best[root]} in ${g.dist[root]} mosse | ${Date.now() - t0} ms`);
    if (!g.approx[root]) break;
  }
  // controllo di coerenza: ogni chiave deve ricostruire lo stesso stato
  for (let i = 0; i < g.size(); i += 97) if (E.key(g.state(i)) !== g.keys[i]) throw new Error('fromKey incoerente: ' + g.keys[i]);
  const line = g.bestLine(root);
  line.forEach((st, i) => console.log(`  ${i + 1}. ${st.label}`));
  const end = line.length ? line[line.length - 1].state : s0;
  console.log('  CAMPO:', end.mz.map((m) => E.P(m).c).join(', ') || '-', '| M/T:', end.st.join(', ') || '-', '| mano:', end.hand.join(', ') || '-', '| cimitero:', end.gy.join(', ') || '-');
  if (arg) for (const it of E.evaluate(end).items) console.log(`     +${it.pts}  ${it.label}`);
}
