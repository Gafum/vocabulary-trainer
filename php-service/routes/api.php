<?php
use App\Http\Controllers\ProgressController;

// Return array of routes with regex to match path, method and handler [ControllerClass, method]
return [
    ['method' => 'POST', 'path' => '/users', 'regex' => '#^/users$#', 'handler' => [ProgressController::class, 'createUser']],
    ['method' => 'POST', 'path' => '/words/{userId}', 'regex' => '#^/words/([^/]+)$#', 'handler' => [ProgressController::class, 'createWord']],
    ['method' => 'GET', 'path' => '/words/{userId}', 'regex' => '#^/words/([^/]+)$#', 'handler' => [ProgressController::class, 'getWords']],
    ['method' => 'GET', 'path' => '/words/{userId}/{wordId}', 'regex' => '#^/words/([^/]+)/([^/]+)$#', 'handler' => [ProgressController::class, 'getWord']],
    ['method' => 'PUT', 'path' => '/words/{userId}/{wordId}', 'regex' => '#^/words/([^/]+)/([^/]+)$#', 'handler' => [ProgressController::class, 'updateWord']],
];
