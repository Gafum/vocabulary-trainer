// =============== First Task ================

console.log("Generating Data");
console.time("setup");
// Generate 100,000 entries { id: number, word: string }
const entries = Array.from({ length: 100_000 }, (_, i) => ({
   id: i,
   word: `word${i}`,
}));

// Create a Map for faster lookups by ID
const map = new Map(entries.map((e) => [e.id, e.word]));
console.timeEnd("setup");

// =============== Second Task ================
console.log("\nGenerating randoms numbers list");
// Generate array from 1_000 randoms numbers
const lookups = Array.from({ length: 1_000 }, () =>
   Math.floor(Math.random() * 100_000)
);

// ----------- Check Search Methods ------------
// Run linear search benchmark
console.log("\nStarting linear search benchmark");
console.time("linear search");
for (const id of lookups) {
   entries.find((e) => e.id === id);
}
console.timeEnd("linear search");

// Run map lookup benchmark
console.log("\nStarting map lookup benchmark");
console.time("map search");
for (const id of lookups) {
   map.get(id);
}
console.timeEnd("map search");

console.log("\nBenchmark finished.");


/*
Data structures quick reminder:

Array (List):
  [ item1, item2, item3 ]
  - ordered
  - good for rendering and iteration
  - slow for lookups by id (needs loop)

Object:
  { key: value, key2: value2 }
  - keys are strings
  - simple structure
  - not optimized for large-scale lookups

Map:
  key => value
  1 => {...}
  "id" => {...}
  {obj} => {...}
  - any type as key
  - very fast lookups
  - perfect for id -> entity, caches, dictionaries

Set:
  value
  value
  value
  - something like array with unique values
  - only unique values
  - no keys, only existence check
  - good for "is in list?" checks

Rule of thumb:
  Array  -> lists, UI rendering
  Map    -> id -> object, cache, dictionary
  Set    -> unique values, flags
  Object -> config, simple data containers
*/