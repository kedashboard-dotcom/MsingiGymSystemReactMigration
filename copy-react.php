<?php
// copy-react.php - Manually copy React files
echo "<pre>";

// Source: frontend-react/public/
$sourceDir = dirname(__DIR__) . '/frontend-react/public';
$destDir = __DIR__;

echo "📂 Source: $sourceDir\n";
echo "📂 Destination: $destDir\n\n";

if (!is_dir($sourceDir)) {
    die("❌ Source directory not found. Looking for: $sourceDir\n");
}

// List of files to copy
$files = [
    'index.html',
    'favicon.ico', 
    'manifest.json',
    'robots.txt'
];

foreach ($files as $file) {
    $source = $sourceDir . '/' . $file;
    $dest = $destDir . '/' . $file;
    
    if (file_exists($source)) {
        if (copy($source, $dest)) {
            echo "✅ Copied: $file\n";
        } else {
            echo "❌ Failed to copy: $file\n";
        }
    } else {
        echo "⚠️  Source not found: $file\n";
    }
}

// Check if we have index.html now
if (file_exists($destDir . '/index.html')) {
    echo "\n🎉 SUCCESS! React files copied.\n";
    echo "🌐 Visit: https://msingi.co.ke\n";
    
    // Show a preview
    $html = file_get_contents($destDir . '/index.html');
    if (strpos($html, 'react') !== false || strpos($html, 'React') !== false) {
        echo "✅ Detected React app\n";
    }
} else {
    echo "\n⚠️  Creating fallback index.html...\n";
    
    $fallback = '<!DOCTYPE html>
    <html>
    <head>
        <title>Msingi Gym</title>
        <style>body{font-family:Arial;text-align:center;padding:50px;}</style>
    </head>
    <body>
        <h1>Msingi Gym System</h1>
        <p>✅ Backend API is working</p>
        <p>React frontend will be available soon.</p>
        <div>
            <a href="/api/health">Test API</a> | 
            <a href="/api-test.html">Test Page</a> |
            <a href="/deploy.html">Deploy React</a>
        </div>
    </body>
    </html>';
    
    file_put_contents($destDir . '/index.html', $fallback);
    echo "✅ Created fallback index.html\n";
}

echo "\n📁 Current files in public_html:\n";
$currentFiles = scandir($destDir);
foreach ($currentFiles as $file) {
    if ($file !== '.' && $file !== '..') {
        $size = filesize($destDir . '/' . $file);
        echo "- $file ($size bytes)\n";
    }
}

echo "</pre>";
?>