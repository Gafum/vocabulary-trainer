<?php
// Quick temporary check script to verify the SQLite DB file paths and their contents
$files = [
    'E:/Projects/React/vocabulary-trainer/progress.sqlite',
    'E:/Projects/React/vocabulary-trainer/php-service/progress.sqlite'
];
foreach ($files as $f) {
    echo "== $f ==\n";
    if (file_exists($f)) {
        try {
            $pdo = new PDO('sqlite:' . realpath($f));
            $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);
            echo 'exists, tables: ' . implode(',', (array)$tables) . "\n";
        } catch (Exception $e) {
            echo 'exists but error: ' . $e->getMessage() . "\n";
        }
    } else {
        echo "missing\n";
    }
}
