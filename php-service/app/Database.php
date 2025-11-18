<?php
namespace App;

class Database
{
    protected $pdo;

    public function __construct()
    {
        // Use the sqlite file located in the php-service folder by default
        $serviceRoot = dirname(__DIR__); // php-service/
        $dbPath = $serviceRoot . '/progress.sqlite';
        // Normalize to an absolute path when possible
        $resolved = realpath($dbPath) ?: $dbPath;
        // Debug: write which DB path is being used (dev only)
        @file_put_contents($serviceRoot . '/db-debug.log', "DB path: $resolved\n", FILE_APPEND);
        $this->pdo = new \PDO('sqlite:' . $resolved);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        // If tables are missing, attempt to run migrations automatically (helps dev/serve flow)
        try {
            $res = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")->fetchAll(\PDO::FETCH_COLUMN);
            @file_put_contents($serviceRoot . '/db-debug.log', "tables before migration: " . implode(',', (array)$res) . "\n", FILE_APPEND);
            if (empty($res)) {
                $mig = $serviceRoot . '/database/migrations/001_create_tables.sql';
                if (file_exists($mig)) {
                    $sql = file_get_contents($mig);
                    if ($sql) {
                        $this->pdo->exec($sql);
                        @file_put_contents($serviceRoot . '/db-debug.log', "ran migration: $mig\n", FILE_APPEND);
                        $res2 = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(\PDO::FETCH_COLUMN);
                        @file_put_contents($serviceRoot . '/db-debug.log', "tables after migration: " . implode(',', (array)$res2) . "\n", FILE_APPEND);
                    }
                } else {
                    @file_put_contents($serviceRoot . '/db-debug.log', "migration file missing: $mig\n", FILE_APPEND);
                }
            }
        } catch (\Exception $e) {
            @file_put_contents($serviceRoot . '/db-debug.log', "migration error: " . $e->getMessage() . "\n", FILE_APPEND);
        }
    }

    public function query($sql, $params = [])
    {
        // Debug snapshot of current tables before executing query
        try {
            $tables = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(\PDO::FETCH_COLUMN);
            @file_put_contents(dirname(__DIR__,2) . '/db-debug.log', "before query tables: " . implode(',', (array)$tables) . "\n", FILE_APPEND);
        } catch (\Exception $e) {
            @file_put_contents(dirname(__DIR__,2) . '/db-debug.log', "before query error: " . $e->getMessage() . "\n", FILE_APPEND);
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public function all($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function one($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        $res = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $res === false ? null : $res;
    }

    public function uuid()
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public function userExists($id)
    {
        $row = $this->one('SELECT id FROM users WHERE id = :id', [':id'=>$id]);
        return (bool)$row;
    }
}
