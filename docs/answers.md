# Antworten auf Theoriefragen

**1. Was ist der Unterschied zwischen `unknown` und `any`?**  
`unknown` ist sicherer, wiel man muss den Typ prüfen, bevor man ihn benutzt.  
`any` erlaubt alles und umgeht die Typprüfung.

**2. Wann würdest du `interface` statt `type` verwenden?**  
Wenn ich Objekte beschreibe, die zusammengeführt werden sollen.

**3. Was bewirkt die Einstellung `"strict": true` in der tsconfig.json?**  
Sie aktiviert alle strengen Typüberprüfungen, damit der Code sicherer wird.

**4. Warum gilt `structuredClone()` als bessere Lösung als `JSON.parse(JSON.stringify(...))`?**  
Weil `structuredClone()` mehr Datentypen korrekt kopieren kann und weniger Daten verliert wie Date, Map oder Regex.

**5. Welche Vorteile bringt `exactOptionalPropertyTypes`?**  
Es unterscheidet zwischen einer fehlenden Eigenschaft (`undefined`) und einer, die gar nicht existiert – das macht Typen genauer.

**6. Was versteht man unter „Type-Inferenz“ in TypeScript?**  
TypeScript erkennt automatisch den Typ einer Variable ohne, dass man ihn extra schreibt.
