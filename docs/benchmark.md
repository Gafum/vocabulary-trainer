# Teil A – Lookup Benchmark

## Ziel

Das Ziel war es, die Geschwindigkeit von zwei Suchmethoden zu vergleichen: lineare Suche und Map-Suche.

## Durchführung

-  Es wurden 100 000 Einträge erzeugt (`{ id, word }`).
-  Danach wurden 1 000 zufällige Suchanfragen durchgeführt.
-  Die Zeitmessung erfolgte mit `console.time()` und `console.timeEnd()`.

## Ergebnisse (Beispiel)

| Schritt       | Zeit   |
| ------------- | ------ |
| Datenaufbau   | 45 ms  |
| Lineare Suche | 394 ms |
| Map-Suche     | 6,8 ms |

## Auswertung

Die lineare Suche prüft jedes Element nacheinander, während die Map eine direkte Zuordnung über Schlüssel verwendet.
Dadurch ist die Map-Suche *viel schneller*.

## Fazit

Bei großen Datenmengen ist die Verwendung einer Map deutlich effizienter als eine lineare Suche.
