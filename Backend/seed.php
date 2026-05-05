<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);

$code = $kernel->call('db:seed', ['--force' => true]);
if ($code === 0) {
    echo "Database seeded successfully!\n";
} else {
    echo "Database seeding failed with code: $code\n";
}
