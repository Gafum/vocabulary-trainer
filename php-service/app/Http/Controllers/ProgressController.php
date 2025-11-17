<?php
namespace App\Http\Controllers;

use App\Database;
use App\Http\Requests\MarkWordRequest;

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
        $id = $this->db->uuid();
        $this->db->query('INSERT INTO users (id, username) VALUES (:id, :username)', [':id'=>$id, ':username'=>$data['username']]);
        http_response_code(201);
        header('Content-Type: application/json');
        echo json_encode(['id'=>$id, 'username'=>$data['username']]);
    }

    public function createWord($req)
    {
        $userId = $req->params[1];
        $data = $req->body;
        if (!$this->db->userExists($userId)) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        if (empty($data['word']) || empty($data['meaning'])) {
            http_response_code(400);
            echo json_encode(['error' => 'word and meaning required']);
            return;
        }
        $id = $this->db->uuid();
        $this->db->query('INSERT INTO words (id, userId, word, meaning, learned, progress) VALUES (:id, :userId, :word, :meaning, 0, 0)', [
            ':id'=>$id, ':userId'=>$userId, ':word'=>$data['word'], ':meaning'=>$data['meaning']
        ]);
        http_response_code(201);
        header('Content-Type: application/json');
        echo json_encode(['id'=>$id, 'userId'=>$userId, 'word'=>$data['word'], 'meaning'=>$data['meaning']]);
    }

    public function getWords($req)
    {
        $userId = $req->params[1];
        if (!$this->db->userExists($userId)) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        $rows = $this->db->all('SELECT * FROM words WHERE userId = :userId', [':userId'=>$userId]);
        header('Content-Type: application/json');
        echo json_encode($rows);
    }

    public function getWord($req)
    {
        $userId = $req->params[1];
        $wordId = $req->params[2];
        if (!$this->db->userExists($userId)) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        $row = $this->db->one('SELECT * FROM words WHERE id = :id AND userId = :userId', [':id'=>$wordId, ':userId'=>$userId]);
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
        $userId = $req->params[1];
        $wordId = $req->params[2];
        if (!$this->db->userExists($userId)) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        $row = $this->db->one('SELECT * FROM words WHERE id = :id AND userId = :userId', [':id'=>$wordId, ':userId'=>$userId]);
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
}
