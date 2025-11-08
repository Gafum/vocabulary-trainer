# Teil B – Frontend Optimierung

## Ziel

Die Suchfunktion des Vokabeltrainers soll schneller und effizienter werden.

## Umgesetzte Optimierungen

1. **Debounce**

   -  Die Suche startet erst, wenn der Benutzer kurz aufhört zu tippen.

2. **React.memo()**

   -  Verringern Rendering von Komponenten.
   -  Besonders sinnvoll bei wiederholten Komponent `WordItem`.

## Auswertung

Bei der Suche gibt es jetzt weniger Updates. Das kannst man in React Devtools sehen. 
