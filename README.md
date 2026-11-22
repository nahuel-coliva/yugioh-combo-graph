# Grafo combo Yu-Gi-Oh!

Strumento per studiare le combo di un mazzo in modo visivo: scegli una mano iniziale e navighi il grafo
degli stati raggiungibili, mossa per mossa, con la linea migliore evidenziata.

Sito: <https://nahuel-coliva.github.io/yugioh-combo-graph/>

Mazzi modellati finora:

| Mazzo | File | Note |
| --- | --- | --- |
| Destino Bianco Occhi Blu | `decks/blue-eyes.js` | Structure Deck, una copia |
| Attenzione alla Trappolatrice | `decks/traptrix.js` | Structure Deck, una copia |
| The Fallen & The Virtuous | `decks/fallen-virtuous.js` | Chronicles Deck, una copia per carta |

Le liste sono quelle complete dei prodotti: **la banlist è ignorata** (partite tra amici).

## Come si usa

1. Scegli il mazzo, poi le carte della mano (o un esempio) e premi **Calcola**.
2. Al centro c'è il grafo: ogni nodo è uno stato del campo, ogni arco una mossa.
   In oro la linea migliore, in blu il percorso che stai seguendo.
3. A destra trovi mano, campo, Cimitero e tutte le mosse possibili dal nodo selezionato,
   ognuna con il miglior punteggio raggiungibile dopo averla fatta.
4. Le mosse che l'avversario può fermare sono marcate (`Ash`, `Veiler/Imperm`);
   «e se viene annullato?» apre il ramo alternativo. Nella linea è segnata la quinta evocazione (Nibiru).

## Limiti (da leggere)

- **Le regole sono codificate a mano** a partire dai testi delle carte e **non sono state validate**
  contro un simulatore ufficiale. Se una linea non ti torna, probabilmente hai ragione tu: segnalalo.
- Solo **turno 1 giocando per primi**: gli effetti che richiedono carte dell'avversario non sono modellati.
- Il **punteggio** del campo finale è un'euristica (i pesi stanno in `weights` nel file del mazzo), non una verità.
- Con mani da 2 o più carte le combinazioni sono milioni: il valore marcato con `≈` è il migliore trovato
  finora e si migliora con «Affina la ricerca da qui».
- La ricerca dà per attivati i trigger facoltativi; rinunciarvi resta possibile a mano.
- Si può avere **un solo mostro Link sul campo alla volta** (le zone puntate dai Link non sono modellate).
- Carte non modellate perché al turno 1 non fanno nulla o dipendono dal caso: l'effetto di *Albaz il Caduto*
  (servono mostri avversari), *Triple Tactics Thrust*, *Sauge de Fleur*, i Kaiju.
- The Fallen & The Virtuous: per gli effetti che mandano una Fusione dall'Extra Deck al Cimitero la ricerca
  considera solo le Fusioni con un effetto in End Phase; *Dogmatika Maximus* manda solo coppie di quelle.
- Trappolatrice: le Trappole "Buco" sono quasi equivalenti al turno 1, quindi la ricerca ne considera una sola
  per volta (la migliore non ancora posseduta, più *Holeutea*); le altre restano giocabili a mano.

## Eseguirlo in locale

Serve Node 18 o successivo. Le immagini delle carte non sono nel repository: si scaricano una volta con lo script.

```
node tools/fetch_cards.js
python -m http.server 8765
```

Poi apri <http://localhost:8765>.

## Struttura

| File | Contenuto |
| --- | --- |
| `core.js` | nucleo comune: stato di gioco, zone, evocazioni generiche, ricerca a budget |
| `decks/<mazzo>.js` | un mazzo: lista, carte, effetti, valutazione del campo finale |
| `app.js`, `index.html`, `style.css` | interfaccia e grafo |
| `cards.js` | nomi e testi delle carte (generato da `tools/fetch_cards.js`) |
| `tools/fetch_cards.js` | scarica testi e immagini di tutte le carte dei mazzi |
| `test_engine.js`, `tests/baseline.json` | prove del motore e risultati di riferimento |
| `vendor/` | Cytoscape.js e dagre (grafo e disposizione) |

## Aggiungere un mazzo

1. Copia `decks/blue-eyes.js` in `decks/<nome>.js` e sostituisci `id`, `name`, `cards`, `main`, `extra`, `presets`.
   Ogni carta ha un codice breve (es. `SAGE`) e il nome inglese esatto in `en`, usato per scaricare testo e immagine.
   Le carte comuni a molti mazzi (Ash, Veiler, Nibiru, Impermanenza) sono in `Core.STAPLES`.
2. In `setup(K)` descrivi le regole del mazzo con gli attrezzi di `K`:
   - `main(s, add)`: le mosse della Main Phase. Ogni mossa è `add(etichetta, carta, tag, costo, effetto)`,
     dove costo ed effetto modificano una copia dello stato. Tag `ash`/`mon` = annullabile, `summon` = conta per Nibiru.
   - `onSummon`, `onToGY`: cosa succede quando un mostro viene evocato o una carta va al Cimitero
     (di solito `addPend` di un effetto facoltativo).
   - `pending`: gli effetti facoltativi in risposta a un evento (`ok` = attivabile, `run` = le scelte).
   - `endPhase`, `epAvail`: effetti della End Phase.
   - `evaluate(s)`: punteggio del campo finale, con il motivo di ogni voce.
   - `fieldName`, `blocked`: carte che cambiano nome sul campo e restrizioni alle Evocazioni Speciali.
   - Mattoni già pronti: `K.normalSummons`, `K.synchros`, `K.xyz`, `K.link`, `K.fieldCombos`, `K.spellLoc`/`K.useSpell`.
3. Aggiungi `<script src="decks/<nome>.js"></script>` in `index.html`.
4. `node tools/fetch_cards.js` per testi e immagini, poi `node test_engine.js <nome> CARTA1,CARTA2` per provare una mano.
5. Quando le linee tornano, `node test_engine.js --update` salva i risultati come riferimento: da lì in poi
   `node test_engine.js` segnala ogni modifica che cambia i risultati (gira anche a ogni pubblicazione).

## Crediti

Dati e immagini delle carte dall'API di [YGOPRODeck](https://ygoprodeck.com/api-guide/).
Grafo disegnato con [Cytoscape.js](https://js.cytoscape.org/) e dagre.

Progetto amatoriale non affiliato a Konami. Yu-Gi-Oh! e le relative carte sono proprietà dei rispettivi titolari.
