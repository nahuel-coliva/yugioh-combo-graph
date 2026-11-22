/* Scarica testi e immagini delle carte dall'API pubblica di YGOPRODeck.
 *
 * Legge l'elenco delle carte da tutti i mazzi in decks/, genera cards.js (nomi e testi
 * italiani dove disponibili) e riempie img/ con le immagini piccole. Le immagini non
 * stanno nel repository: questo script le riscarica in locale e durante la pubblicazione.
 *
 * Uso:  node tools/fetch_cards.js            (salta le immagini gia' presenti)
 *       node tools/fetch_cards.js --force    (riscarica tutto)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const Core = require(path.join(ROOT, 'core.js'));
for (const f of fs.readdirSync(path.join(ROOT, 'decks'))) if (f.endsWith('.js')) require(path.join(ROOT, 'decks', f));

const API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
const UA = { 'User-Agent': 'combo-graph-script/0.1' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chunks = (a, n) => { const out = []; for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; };

async function query(params) {
  const r = await fetch(API + '?' + new URLSearchParams(params), { headers: UA });
  if (!r.ok) return []; // l'API risponde 400 quando nessuna carta corrisponde (es. traduzione mancante)
  return (await r.json()).data || [];
}

async function main() {
  const force = process.argv.includes('--force');
  const names = new Set();
  for (const id in Core.decks) for (const c of Object.values(Core.decks[id].cards)) names.add(c.en);

  const en = [];
  for (const part of chunks([...names], 15)) { en.push(...await query({ name: part.join('|') })); await sleep(120); }
  // con la ricerca per nome l'API puo' restituire l'id di un'illustrazione alternativa:
  // il codice originale della carta e' il piu' basso tra le sue immagini
  for (const c of en) {
    const img = c.card_images.reduce((x, y) => (y.id < x.id ? y : x));
    c.id = img.id; c.image = img.image_url_small;
  }
  const missing = [...names].filter((n) => !en.some((c) => c.name === n));
  if (missing.length) throw new Error('Carte non trovate nel database: ' + missing.join(', '));

  const it = new Map();
  for (const part of chunks(en.map((c) => c.id), 15)) {
    let got = await query({ id: part.join(','), language: 'it' });
    if (!got.length) { got = []; for (const id of part) { got.push(...await query({ id, language: 'it' })); await sleep(120); } }
    for (const c of got) it.set(c.id, c);
    await sleep(120);
  }

  const out = {};
  for (const c of en.sort((a, b) => a.name.localeCompare(b.name))) {
    const t = it.get(c.id) || {};
    out[c.name] = { id: c.id, it: t.name || c.name, desc: t.desc || c.desc, type: c.type, atk: c.atk ?? null, def: c.def ?? null, level: c.level ?? null };
  }
  fs.writeFileSync(path.join(ROOT, 'cards.js'), 'window.CARD_INFO = ' + JSON.stringify(out, null, 1) + ';\n');
  console.log(`cards.js: ${en.length} carte (${it.size} con testo italiano)`);

  const dir = path.join(ROOT, 'img');
  fs.mkdirSync(dir, { recursive: true });
  let done = 0;
  for (const c of en) {
    const dest = path.join(dir, c.id + '.jpg');
    if (fs.existsSync(dest) && !force) continue;
    const r = await fetch(c.image, { headers: UA });
    if (!r.ok) throw new Error(`Immagine non scaricata: ${c.name} (${r.status})`);
    fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    done++;
    await sleep(100); // resta ben sotto il limite di richieste dell'API
  }
  console.log(`img/: ${done} scaricate, ${en.length - done} gia' presenti`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
