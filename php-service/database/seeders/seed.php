<?php
// Simple seeder: creates SQLite DB file, runs migration and inserts sample data
$base = dirname(__DIR__, 2);
$dbFile = $base . '/progress.sqlite';
// Clear existing DB (delete file)
if (file_exists($dbFile)) {
    unlink($dbFile);
}
// Create new SQLite DB and run migration
touch($dbFile);
$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = file_get_contents(__DIR__ . '/../migrations/001_create_tables.sql');
$pdo->exec($sql);

// insert sample user and words
// create a sample user with unique username
$userId = bin2hex(random_bytes(16)); // will be used to link words to this user
$stmt = $pdo->prepare('INSERT INTO users (id, username) VALUES (:id, :username)');
try {
    // Create a user 'alice'
    $stmt->execute([':id'=>$userId, ':username'=>'alice']);
} catch (Exception $e) {
    // ignore unique constraint errors for idempotency
}

// insert words for the user alice with Id $userId
$words = [
    ['word'=>'apple','meaning'=>'A fruit'],
    ['word'=>'book','meaning'=>'A set of pages']
];
foreach ($words as $w) {
    $id = bin2hex(random_bytes(16));
    $stmt = $pdo->prepare('INSERT OR IGNORE INTO words (id, userId, word, meaning, learned, progress) VALUES (:id, :userId, :word, :meaning, 0, 0)');
    $stmt->execute([':id'=>$id, ':userId'=>$userId, ':word'=>$w['word'], ':meaning'=>$w['meaning']]);
}

echo "Seed complete. Sample user id: $userId\n";
