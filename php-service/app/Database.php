<?php
//Some parts are written by AI. But it simplifies database handling and adds debug logging to help diagnose test environment issues.
namespace App;

class Database
// Simple PDO wrapper for SQLite
// with automatic migration on missing tables
// and debug LOGGING of DB path and table states
// to help diagnose test environment issues.
{
    protected $pdo;

    public function __construct()
    {
        // Use the sqlite file located
        $serviceRoot = dirname(__DIR__);
        $dbPath = $serviceRoot . '/progress.sqlite';
        // Normalize to an absolute path when possible
        $resolved = realpath($dbPath) ?: $dbPath;
        // Debug: write which DB path is being used
        @file_put_contents($serviceRoot . '/db-debug.log', "DB path: $resolved\n", FILE_APPEND);
        // Initialize PDO
        $this->pdo = new \PDO('sqlite:' . $resolved);
        // Set errmode to exceptions
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        // If tables are missing, attempt to run migrations automatically (helps dev/serve flow)
        try {
            // Check if 'users' table exists
            $res = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")->fetchAll(\PDO::FETCH_COLUMN);
            // Debug: log existing tables
            @file_put_contents($serviceRoot . '/db-debug.log', "tables before migration: " . implode(',', (array)$res) . "\n", FILE_APPEND);
            // If no tables, run migration
            if (empty($res)) {
                $mig = $serviceRoot . '/database/migrations/001_create_tables.sql';
                // Run migration if file exists
                if (file_exists($mig)) {
                    $sql = file_get_contents($mig);
                    if ($sql) {
                        $this->pdo->exec($sql);
                        @file_put_contents($serviceRoot . '/db-debug.log', "ran migration: $mig\n", FILE_APPEND);
                        $res2 = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(\PDO::FETCH_COLUMN);
                        @file_put_contents($serviceRoot . '/db-debug.log', "tables after migration: " . implode(',', (array)$res2) . "\n", FILE_APPEND);
                    }
                } else {
                    // Debug: log missing migration file
                    @file_put_contents($serviceRoot . '/db-debug.log', "migration file missing: $mig\n", FILE_APPEND);
                }
            }
        } catch (\Exception $e) {
            // Debug: log migration error
            @file_put_contents($serviceRoot . '/db-debug.log', "migration error: " . $e->getMessage() . "\n", FILE_APPEND);
        }
    }

    public function query($sql, $params = [])
    {
        // Debug snapshot of current tables before executing query
        try {
            //try to log existing tables
            $tables = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(\PDO::FETCH_COLUMN);
            @file_put_contents(dirname(__DIR__,2) . '/db-debug.log', "before query tables: " . implode(',', (array)$tables) . "\n", FILE_APPEND);
        } catch (\Exception $e) {
            @file_put_contents(dirname(__DIR__,2) . '/db-debug.log', "before query error: " . $e->getMessage() . "\n", FILE_APPEND);
        }
        // Prepare and execute statement
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public function all($sql, $params = [])
    {
        // Execute query and fetch all results
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function one($sql, $params = [])
    {
        // Execute query and fetch single result
        $stmt = $this->query($sql, $params);
        $res = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $res === false ? null : $res;
    }

    public function uuid()
    {
        // Generate a random UUID v4 (for example user IDs, word IDs)
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public function userExists($id)
    {
        // Check if a user with given ID exists
        $row = $this->one('SELECT id FROM users WHERE id = :id', [':id'=>$id]);
        return (bool)$row;
    }
}
