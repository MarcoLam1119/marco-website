<?php
$request = trim($_SERVER['REQUEST_URI'], '/');

// If empty, serve index.html
if (empty($request)) {
    $file = 'index.html';
} else {
    $file = $request . '.html';
}

// Check if file exists
if (file_exists($file)) {
    include $file;
} else {
    // Serve 404, but since no 404.html yet, could create a simple one or redirect to index
    http_response_code(404);
    echo '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Page Not Found</h1><p>The requested page does not exist.</p><a href="/">Go Home</a></body></html>';
}
?>
