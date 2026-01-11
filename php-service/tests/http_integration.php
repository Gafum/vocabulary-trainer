<?php
// HTTP integration test for user and word endpoints
// There is only a positive test (200-201 response) here for brevity

echo "Running HTTP integration test...\n";

$apiKey = "supersecret";
$base = "http://127.0.0.1:8000";
$dbPath = __DIR__ . "/../progress.sqlite";

// 1. clean DB
if (file_exists($dbPath)) unlink($dbPath);

// 2. reseed DB
echo "Seeding database...\n";
shell_exec("php " . __DIR__ . "/../artisan seed");

// helper for curl
function request($method, $url, $data = null, $apiKey = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $headers = [];
    if ($apiKey) $headers[] = "x-api-key: $apiKey";
    if ($data) {
        $headers[] = "Content-Type: application/json";
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    return [$info['http_code'], $response];
}

// random username to avoid duplicates
$username = "user_" . bin2hex(random_bytes(3));

// CREATE USER
list($code, $res) = request(
    "POST",
    "$base/users",
    ["username" => $username],
    $apiKey
);
if ($code !== 201) throw new Exception("Create user failed ($code)");

// CREATE WORD
list($code, $res) = request(
    "POST",
    "$base/words/$username",
    ["word" => "Dmytro", "meaning" => "A person"],
    $apiKey
);
if ($code !== 201) throw new Exception("Create word failed ($code)");

$word = json_decode($res, true);
$wordId = $word["id"];

// GET WORDS
list($code, $res) = request(
    "GET",
    "$base/words/$username",
    null,
    $apiKey
);
if ($code !== 200) throw new Exception("Get words failed ($code)");

$words = json_decode($res, true);
if (count($words) < 1) throw new Exception("Words list empty");

// UPDATE WORD
list($code, $res) = request(
    "PUT",
    "$base/words/$username/$wordId",
    ["learned" => true, "progress" => 42],
    $apiKey
);
if ($code !== 200) throw new Exception("Update word failed ($code)");

echo "HTTP integration test passed.\n";
