<?php
//Like a routes folder in NODEJS Express
require __DIR__ . '/../bootstrap.php';

use App\Http\Middleware\ApiKeyMiddleware;
use App\Http\Controllers\ProgressController;

// "app.use" - get method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Quick debug endpoint to report DB path and tables (dev only)
if ($path === '/debug-db') {
    header('Content-Type: application/json');
    try {
        $candidates = [];
        $serviceRoot = dirname(__DIR__);
        $candidates[] = $serviceRoot . '/progress.sqlite';
        $candidates[] = dirname($serviceRoot) . '/progress.sqlite';
        $candidates[] = getcwd() . '/progress.sqlite';
        $candidates[] = (getenv('DB_PATH') ?: '');
        $info = [];
        foreach ($candidates as $c) {
            if (!$c) continue;
            $real = realpath($c) ?: null;
            $exists = file_exists($c) || ($real && file_exists($real));
            $tables = null;
            if ($exists) {
                try {
                    $pdo = new PDO('sqlite:' . ($real ?: $c));
                    $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);
                } catch (Exception $e) {
                    $tables = ['error'=>$e->getMessage()];
                }
            }
            $info[] = ['candidate'=>$c, 'realpath'=>$real, 'exists'=>$exists, 'tables'=>$tables];
        }
        echo json_encode(['cwd'=>getcwd(), 'info'=>$info]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// Simple routing: include API routes which will return a callable
$routes = require __DIR__ . '/../routes/api.php';

// API key middleware check for all API routes
foreach ($routes as $route) {
    // Check if $route matches current request
    if ($route['method'] === $method && preg_match($route['regex'], $path, $matches)) { 
        // build request object
        $req = (object) [
            'method' => $method,
            'path' => $path,
            'params' => $matches,
            'body' => json_decode(file_get_contents('php://input'), true) ?: []
        ];

        // run middleware (Check API key)
        $mw = new ApiKeyMiddleware();
        $mwResult = $mw->handle();
        // if api secret key is false, return 401
        if ($mwResult !== true) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        // call handler (controller and service) 
        $handler = $route['handler']; // [ControllerClass, 'methodName']<- array
        $controller = new $handler[0](); // instantiate controller new ProgressController()
        call_user_func([$controller, $handler[1]], $req); // call the right method on the controller
        exit;
    }
}

// not found
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not Found']);
