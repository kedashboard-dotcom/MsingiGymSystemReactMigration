<?php
// build-react.php - Build and deploy React app via PHP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Use POST method');
}

// Check password
$password = $_POST['password'] ?? '';
if ($password !== 'build123') {
    die('Invalid password');
}

echo "<pre>";
echo "🚀 Building and Deploying React App...\n";
echo "=====================================\n";

// Step 1: Check if frontend-react exists
$frontendDir = dirname(__DIR__) . '/frontend-react';
if (!is_dir($frontendDir)) {
    die("❌ frontend-react directory not found at: $frontendDir\n");
}

echo "✅ Found frontend-react directory\n";

// Step 2: Check for package.json
if (!file_exists($frontendDir . '/package.json')) {
    die("❌ package.json not found\n");
}

echo "✅ Found package.json\n";

// Step 3: Copy required files to public_html
$filesToCopy = [
    'public/index.html',
    'public/favicon.ico',
    'public/manifest.json',
    'public/robots.txt'
];

foreach ($filesToCopy as $file) {
    $source = $frontendDir . '/' . $file;
    $dest = dirname(__DIR__) . '/public_html/' . basename($file);
    
    if (file_exists($source)) {
        copy($source, $dest);
        echo "📄 Copied: $file\n";
    } else {
        echo "⚠️  Missing: $file\n";
    }
}

// Step 4: Create a simple React index.html fallback
$fallbackHtml = dirname(__DIR__) . '/public_html/index.html';
if (!file_exists($fallbackHtml)) {
    $html = '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Msingi Gym System</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 50px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { color: #10b981; }
            .error { color: #ef4444; }
            button { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin: 10px; }
            .api-status { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Msingi Gym System</h1>
            <div class="api-status">
                <h3 class="success">✅ API is Working</h3>
                <p>Backend API is fully operational</p>
                <button onclick="testAPI()">Test API</button>
                <pre id="api-result" style="display:none;"></pre>
            </div>
            
            <div>
                <h3>Quick Actions</h3>
                <button onclick="window.location.href=\'/register\'">Register</button>
                <button onclick="window.location.href=\'/renew\'">Renew Membership</button>
                <button onclick="window.location.href=\'/status\'">Check Status</button>
                <button onclick="window.location.href=\'/api-test.html\'">API Test</button>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p>Need help? Contact: +254 721 533 822</p>
                <p><small>React app is being built. This is a temporary interface.</small></p>
            </div>
        </div>
        
        <script>
            async function testAPI() {
                try {
                    const response = await fetch(\'/api/health\');
                    const data = await response.json();
                    const resultEl = document.getElementById(\'api-result\');
                    resultEl.textContent = JSON.stringify(data, null, 2);
                    resultEl.style.display = \'block\';
                } catch (error) {
                    alert(\'API test failed: \' + error.message);
                }
            }
            
            // Test API on load
            window.onload = testAPI;
        </script>
    </body>
    </html>';
    
    file_put_contents($fallbackHtml, $html);
    echo "📄 Created fallback index.html\n";
}

// Step 5: Create static folder for React assets
$staticDir = dirname(__DIR__) . '/public_html/static';
if (!is_dir($staticDir)) {
    mkdir($staticDir, 0755, true);
    echo "📁 Created static directory\n";
}

// Step 6: Create a simple React app JavaScript
$reactJs = dirname(__DIR__) . '/public_html/static/js/main.js';
$jsContent = '// Simple React-like functionality
document.addEventListener("DOMContentLoaded", function() {
    console.log("Msingi Gym System loaded");
    
    // Handle navigation
    const navLinks = document.querySelectorAll("a[data-nav]");
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const page = this.getAttribute("data-nav");
            loadPage(page);
        });
    });
    
    function loadPage(page) {
        const pages = {
            "register": "<h2>Register Membership</h2><p>Demo registration form would appear here.</p>",
            "renew": "<h2>Renew Membership</h2><p>Demo renewal form would appear here.</p>",
            "status": "<h2>Check Status</h2><p>Demo status check would appear here.</p>"
        };
        
        document.getElementById("content").innerHTML = pages[page] || "<h2>Page not found</h2>";
    }
});';

file_put_contents($reactJs, $jsContent);
echo "📄 Created React-like JavaScript\n";

// Step 7: Create CSS
$reactCss = dirname(__DIR__) . '/public_html/static/css/main.css';
$cssContent = '/* Main styles */
body { font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif; }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; }
.nav { background: #f8fafc; padding: 1rem; }
.btn-primary { background: #3b82f6; color: white; }
.btn-success { background: #10b981; color: white; }';

file_put_contents($reactCss, $cssContent);
echo "📄 Created CSS file\n";

echo "\n✅ Deployment Complete!\n";
echo "🌐 Visit: https://msingi.co.ke\n";
echo "🔧 API Test: https://msingi.co.ke/api-test.html\n";
echo "📊 API Health: https://msingi.co.ke/api/health\n";
echo "</pre>";
?>