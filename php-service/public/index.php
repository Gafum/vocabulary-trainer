<?php
require __DIR__ . '/../bootstrap.php';

use App\Http\Middleware\ApiKeyMiddleware;
use App\Http\Controllers\ProgressController;

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple routing: include API routes which will return a callable
$routes = require __DIR__ . '/../routes/api.php';

// API key middleware check for all API routes
foreach ($routes as $route) {
    if ($route['method'] === $method && preg_match($route['regex'], $path, $matches)) {
        $req = (object) [
            'method' => $method,
            'path' => $path,
            'params' => $matches,
            'body' => json_decode(file_get_contents('php://input'), true) ?: []
        ];

        // run middleware
        $mw = new ApiKeyMiddleware();
        $mwResult = $mw->handle();
        if ($mwResult !== true) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        // call handler
        $handler = $route['handler'];
        $controller = new $handler[0]();
        call_user_func([$controller, $handler[1]], $req);
        exit;
    }
}

// not found
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not Found']);
