<?php
use App\Http\Controllers\ProgressController;

// Return array of routes with regex to match path, method and handler [ControllerClass, method]
return [
    // Create user
    ['method' => 'POST', 'path' => '/users', 'regex' => '#^/users$#', 'handler' => [ProgressController::class, 'createUser']],
    // Use username in path instead of userId to simplify console usage
    // Create word for user
    ['method' => 'POST', 'path' => '/words/{username}', 'regex' => '#^/words/([^/]+)$#', 'handler' => [ProgressController::class, 'createWord']],
    // Get all words for user
    ['method' => 'GET', 'path' => '/words/{username}', 'regex' => '#^/words/([^/]+)$#', 'handler' => [ProgressController::class, 'getWords']],
    // Get specific word for user
    ['method' => 'GET', 'path' => '/words/{username}/{wordId}', 'regex' => '#^/words/([^/]+)/([^/]+)$#', 'handler' => [ProgressController::class, 'getWord']],
    // Update specific word for user
    ['method' => 'PUT', 'path' => '/words/{username}/{wordId}', 'regex' => '#^/words/([^/]+)/([^/]+)$#', 'handler' => [ProgressController::class, 'updateWord']],
    // Dump all data (users + words)
    ['method' => 'GET', 'path' => '/dump', 'regex' => '#^/dump$#', 'handler' => [ProgressController::class, 'dumpAll']],
];

// like in Node js: app.get('/words/:username', ProgressController.getWords);