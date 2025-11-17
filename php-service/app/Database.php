<?php
namespace App;

class Database
{
    protected $pdo;

    public function __construct()
    {
        $dbPath = getenv('DB_PATH') ?: __DIR__ . '/../../progress.sqlite';
        $dbPath = realpath(dirname(__DIR__) . '/..') . '/progress.sqlite';
        $this->pdo = new \PDO('sqlite:' . $dbPath);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }

    public function query($sql, $params = [])
    {
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
