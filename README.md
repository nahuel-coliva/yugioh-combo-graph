# Grafo combo Yu-Gi-Oh!

Strumento per studiare le combo di un mazzo in modo visivo: scegli una mano iniziale e navighi il grafo
degli stati raggiungibili, mossa per mossa, con la linea migliore evidenziata.

Mazzo modellato finora: **Structure Deck "Destino Bianco Occhi Blu"** (TCG, una copia).

## Come si usa

1. Scegli le carte della mano a sinistra (o un esempio) e premi **Calcola**.
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
- Il **punteggio** del campo finale è un'euristica (pesi in `W` dentro `engine.js`), non una verità.
- Con mani da 2 o più carte le combinazioni sono milioni: il valore marcato con `≈` è il migliore trovato
  finora e si migliora con «Affina la ricerca da qui».
- La ricerca dà per attivati i trigger facoltativi; rinunciarvi resta possibile a mano.
- Banlist TCG considerata: quella nel database al 16/11/2026. *Richiamato dalla Tomba* è Proibita ed è
  esclusa, quindi il mazzo conta 39 carte.

## Eseguirlo in locale

Le immagini delle carte non sono nel repository: si scaricano una volta con lo script.

```
python tools/fetch_cards.py
python -m http.server 8765
```

Poi apri <http://localhost:8765>. Per provare il motore da terminale: `node test_engine.js`.

## Struttura

| File | Contenuto |
| --- | --- |
| `engine.js` | carte, regole, valutazione del campo e ricerca |
| `app.js`, `index.html`, `style.css` | interfaccia e grafo |
| `cards.js` | nomi e testi delle carte (generato da `tools/fetch_cards.py`) |
| `tools/fetch_cards.py` | scarica testi e immagini |
| `test_engine.js` | prova del motore da riga di comando |
| `vendor/` | Cytoscape.js e dagre (grafo e disposizione) |

## Crediti

Dati e immagini delle carte dall'API di [YGOPRODeck](https://ygoprodeck.com/api-guide/).
Grafo disegnato con [Cytoscape.js](https://js.cytoscape.org/) e dagre.

Progetto amatoriale non affiliato a Konami. Yu-Gi-Oh! e le relative carte sono proprietà dei rispettivi titolari.
