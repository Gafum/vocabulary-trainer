<?php
namespace App\Http\Middleware;
// Middleware to check for valid API key
class ApiKeyMiddleware
{
    public function handle()
    {
        $expected = getenv('API_KEY') ?: 'supersecret';
        $headers = getallheaders();
        $provided = $headers['x-api-key'] ?? $headers['X-API-KEY'] ?? null;
        if (!$provided) return false;
        return hash_equals($expected, $provided);
    }
}
