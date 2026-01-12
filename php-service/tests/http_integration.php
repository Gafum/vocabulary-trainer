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
    $ch = curl_init(); // CURL like in the documentation (Readmy) - simpler request function
    curl_setopt($ch, CURLOPT_URL, $url); // set URL
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method); // GET, POST, PUT, DELETE, etc.
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // return response as string

    $headers = [];
    if ($apiKey) $headers[] = "x-api-key: $apiKey"; // set API key header as the first element of the headers array
    if ($data) {
        $headers[] = "Content-Type: application/json"; // second header if data is present
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); // set headers

    $response = curl_exec($ch); // execute request
    $info = curl_getinfo($ch); // get info (like HTTP code (200, 404, etc.))
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
