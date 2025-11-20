<?php
// Simple integration test that runs migrations into a temp sqlite file,
// inserts a user and words and checks basic queries.

echo "Running php-service integration test...\n";

$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'php_service_test_' . uniqid() . '.sqlite';
if (file_exists($tmp)) unlink($tmp);
touch($tmp);

try {
    $pdo = new PDO('sqlite:' . $tmp);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = file_get_contents(__DIR__ . '/../database/migrations/001_create_tables.sql');
    if ($sql === false) throw new Exception('Could not read migration file');
    $pdo->exec($sql);

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
