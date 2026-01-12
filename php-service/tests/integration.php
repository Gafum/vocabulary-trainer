<?php
// Simple integration test that runs migrations into a temp sqlite file,
// inserts a user and words and checks basic queries.

echo "Running php-service integration test...\n";

$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'php_service_test_' . uniqid() . '.sqlite'; // generete temp file path
if (file_exists($tmp)) unlink($tmp); // check and remove if exists
touch($tmp); // create empty file

try {
    $pdo = new PDO('sqlite:' . $tmp); // Create a new PDO instance to connect to the SQLite database file
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Set the error mode to throw exceptions so any SQL error stops execution

    $sql = file_get_contents(__DIR__ . '/../database/migrations/001_create_tables.sql'); // load migration for creating Table SQL
    if ($sql === false) throw new Exception('Could not read migration file'); // Verify if the file was read successfully;
    $pdo->exec($sql); // Execute the SQL to create tables

    // Make a request simulation ============== >

    // insert user
    $userId = bin2hex(random_bytes(8));
    $stmt = $pdo->prepare('INSERT INTO users (id, username) VALUES (:id, :username)');
    $stmt->execute([':id'=>$userId, ':username'=>'test_user']);

    // verify user
    $row = $pdo->query("SELECT id, username FROM users WHERE username='test_user'")->fetch(PDO::FETCH_ASSOC);
    if (!$row || $row['username'] !== 'test_user') throw new Exception('User insertion check failed');

    // insert word
    $wordId = bin2hex(random_bytes(8));
    $stmt = $pdo->prepare('INSERT INTO words (id, userId, word, meaning, learned, progress) VALUES (:id, :userId, :word, :meaning, 0, 0)');
    $stmt->execute([':id'=>$wordId, ':userId'=>$userId, ':word'=>'apple', ':meaning'=>'A fruit']);

    // verify word
    $w = $pdo->query("SELECT id, word, meaning FROM words WHERE id='$wordId'")->fetch(PDO::FETCH_ASSOC);
    if (!$w || $w['word'] !== 'apple') throw new Exception('Word insertion check failed');

    echo "All tests passed. Temp DB: $tmp\n";
    // keep DB for inspection
    exit(0);
} catch (Exception $e) {
    echo "TEST FAILED: " . $e->getMessage() . "\n";
    if (file_exists($tmp)) {
        echo "Temp DB located at: $tmp\n";
    }
    exit(1);
}
