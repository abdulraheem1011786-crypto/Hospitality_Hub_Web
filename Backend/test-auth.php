<?php
// Simple test to verify auth endpoint works

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

$request = \Illuminate\Http\Request::create('/api/auth/login', 'POST', [], [], [], [
    'HTTP_CONTENT_TYPE' => 'application/json'
], json_encode([
    'email' => 'admin@hospitalityhub.pk',
    'password' => 'admin123'
]));

$response = $kernel->handle($request);

echo $response->getContent();
exit;
