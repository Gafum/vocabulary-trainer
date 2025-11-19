<?php
namespace App\Http\Controllers;

use App\Database;
use App\Http\Requests\MarkWordRequest;
use App\Utils;

class ProgressController
{
    protected $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function createUser($req)
    {
        $data = $req->body;
        if (empty($data['username'])) {
            http_response_code(400);
            echo json_encode(['error' => 'username required']);
            return;
        }
        // sanitize and safety-check
        $username = trim((string)($data['username'] ?? ''));
        if (!Utils::isSafeInput($username)) {
            http_response_code(400);
            echo json_encode(['error' => 'invalid username']);
            return;
        }
        $username = Utils::sanitizeHTML($username);

        // enforce unique username
        $existing = $this->db->one('SELECT id FROM users WHERE username = :username', [':username' => $username]);
        if ($existing) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'username already exists']);
            return;
        }
        $id = $this->db->uuid();
        $this->db->query('INSERT INTO users (id, username) VALUES (:id, :username)', [':id'=>$id, ':username'=>$username]);
        http_response_code(201);
        header('Content-Type: application/json');
        echo json_encode(['id'=>$id, 'username'=>$username]);
    }

    public function createWord($req)
    {
        $username = (string)$req->params[1];
        if (!Utils::isSafeInput($username)) {
            http_response_code(400);
            echo json_encode(['error' => 'invalid username']);
            return;
        }
        $username = Utils::sanitizeHTML($username);
        $data = $req->body;
        $user = $this->db->one('SELECT id FROM users WHERE username = :username', [':username' => $username]);
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        $userId = $user['id'];
        if (empty($data['word']) || empty($data['meaning'])) {
            http_response_code(400);
            echo json_encode(['error' => 'word and meaning required']);
            return;
        }
        // sanitize and safety-check word and meaning
        $word = trim((string)$data['word']);
        $meaning = trim((string)$data['meaning']);
        if (!Utils::isSafeInput($word) || !Utils::isSafeInput($meaning)) {
            http_response_code(400);
            echo json_encode(['error' => 'invalid word or meaning']);
            return;
        }
        $word = Utils::sanitizeHTML($word);
        $meaning = Utils::sanitizeHTML($meaning);
        $id = $this->db->uuid();
        $this->db->query('INSERT INTO words (id, userId, word, meaning, learned, progress) VALUES (:id, :userId, :word, :meaning, 0, 0)', [
            ':id'=>$id, ':userId'=>$userId, ':word'=>$word, ':meaning'=>$meaning
        ]);
        http_response_code(201);
        header('Content-Type: application/json');
        echo json_encode(['id'=>$id, 'username'=>$username, 'word'=>$word, 'meaning'=>$meaning]);
    }

    public function getWords($req)
    {
        $username = $req->params[1];
        $user = $this->db->one('SELECT id FROM users WHERE username = :username', [':username' => $username]);
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        $rows = $this->db->all('SELECT * FROM words WHERE userId = :userId', [':userId'=>$user['id']]);
        header('Content-Type: application/json');
        echo json_encode($rows);
    }

    public function getWord($req)
    {
        $username = $req->params[1];
        $wordId = $req->params[2];
        $user = $this->db->one('SELECT id FROM users WHERE username = :username', [':username' => $username]);
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        $row = $this->db->one('SELECT * FROM words WHERE id = :id AND userId = :userId', [':id'=>$wordId, ':userId'=>$user['id']]);
        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Word not found']);
            return;
        }
        header('Content-Type: application/json');
        echo json_encode($row);
    }

    public function updateWord($req)
    {
        $username = $req->params[1];
        $wordId = $req->params[2];
        $user = $this->db->one('SELECT id FROM users WHERE username = :username', [':username' => $username]);
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        $row = $this->db->one('SELECT * FROM words WHERE id = :id AND userId = :userId', [':id'=>$wordId, ':userId'=>$user['id']]);
        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Word not found']);
            return;
        }
        $data = $req->body;
        $validator = new MarkWordRequest();
        $errors = $validator->validate($data);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors'=>$errors]);
            return;
        }
        $learned = isset($data['learned']) ? ($data['learned'] ? 1 : 0) : $row['learned'];
        $progress = isset($data['progress']) ? (int)$data['progress'] : $row['progress'];
        $this->db->query('UPDATE words SET learned = :learned, progress = :progress WHERE id = :id', [':learned'=>$learned, ':progress'=>$progress, ':id'=>$wordId]);
        header('Content-Type: application/json');
        echo json_encode(['id'=>$wordId, 'learned'=>$learned, 'progress'=>$progress]);
    }

    // Return all users and words (useful for console export)
    public function dumpAll($req)
    {
        $users = $this->db->all('SELECT * FROM users');
        $words = $this->db->all('SELECT * FROM words');
        header('Content-Type: application/json');
        echo json_encode(['users' => $users, 'words' => $words]);
    }
}
