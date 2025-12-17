<?php
// Msingi Gym System - PHP Backend (Temporary Solution)
// Place this file in: /home/msingico/public_html/index.php

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Simple router
$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($request, PHP_URL_PATH);

// API Router
if ($path === '/api/health' || $path === '/api/health/') {
    healthCheck();
} elseif ($path === '/api/members/register' && $method === 'POST') {
    registerMember();
} elseif ($path === '/api/members/renew' && $method === 'POST') {
    renewMembership();
} elseif ($path === '/api/members/status' && $method === 'GET') {
    checkStatus();
} elseif ($path === '/api/check-mpesa' && $method === 'POST') {
    checkMpesa();
} elseif ($path === '/api/payments/mpesa-callback') {
    mpesaCallback($method);
} elseif ($path === '/api/test-axtrax' && $method === 'GET') {
    testAxtrax();
} elseif ($path === '/') {
    // Serve React app
    serveReactApp();
} else {
    // API endpoint not found
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => 'Endpoint not found: ' . $path,
        'method' => $method
    ]);
}

// =====================
// API FUNCTIONS
// =====================

function healthCheck() {
    echo json_encode([
        'status' => 'success',
        'message' => 'Msingi Gym System API (PHP Version) is fully operational',
        'timestamp' => date('c'),
        'environment' => 'production',
        'services' => [
            'database' => 'php_simulation',
            'mpesa' => 'demo_mode',
            'axtrax' => 'demo_mode',
            'callback_validation' => 'working'
        ],
        'note' => 'Node.js backend is not running. Using PHP simulation.'
    ]);
}

function registerMember() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['name']) || !isset($data['phone'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Name and phone are required'
        ]);
        return;
    }
    
    // Generate membership ID
    $membership_id = 'GYM' . date('Ymd') . rand(1000, 9999);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'DEMO: Registration successful (PHP Simulation)',
        'data' => [
            'membership_id' => $membership_id,
            'name' => $data['name'],
            'phone' => $data['phone'],
            'checkout_request_id' => 'demo_' . time(),
            'merchant_request_id' => 'demo_' . time(),
            'note' => 'Real M-Pesa integration requires Node.js backend'
        ]
    ]);
}

function renewMembership() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'DEMO: Renewal successful (PHP Simulation)',
        'data' => [
            'checkout_request_id' => 'renew_demo_' . time(),
            'note' => 'Real renewal requires Node.js backend'
        ]
    ]);
}

function checkStatus() {
    $params = $_GET;
    
    // Demo data
    echo json_encode([
        'status' => 'success',
        'data' => [
            'user' => [
                'name' => 'Demo User',
                'phone' => '254712345678',
                'membership_id' => 'GYM' . date('Ymd') . '001',
                'status' => 'active',
                'membership_type' => 'standard',
                'membership_start' => date('Y-m-d H:i:s', strtotime('-7 days')),
                'membership_end' => date('Y-m-d H:i:s', strtotime('+23 days')),
                'days_remaining' => 23,
                'rfid_card' => 'RFID' . rand(1000, 9999),
                'axtrax_user_id' => 'DEMO001'
            ]
        ]
    ]);
}

function checkMpesa() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'ResultCode' => '0',
            'ResultDesc' => 'DEMO: Payment confirmed (PHP Simulation)',
            'MerchantRequestID' => 'demo_' . time(),
            'CheckoutRequestID' => $data['checkout_request_id'] ?? 'demo_checkout',
            'note' => 'Real payment check requires Node.js backend'
        ]
    ]);
}

function mpesaCallback($method) {
    if ($method === 'GET') {
        // Validation request
        echo json_encode([
            'ResultCode' => 0,
            'ResultDesc' => 'Callback URL validated (PHP)',
            'validation' => [
                'timestamp' => date('c'),
                'method' => 'GET',
                'validated' => true,
                'server' => 'Msingi Gym PHP Backend'
            ]
        ]);
    } elseif ($method === 'POST') {
        // Payment callback
        echo json_encode([
            'ResultCode' => 0,
            'ResultDesc' => 'Success (PHP Simulation)',
            'processed' => true,
            'timestamp' => date('c')
        ]);
    }
}

function testAxtrax() {
    echo json_encode([
        'status' => 'success',
        'message' => 'AxtraxNG Test (PHP Simulation)',
        'details' => [
            'enabled' => true,
            'baseURL' => 'https://demo.msingi.co.ke',
            'authenticated' => true,
            'environment' => 'production',
            'note' => 'Real AxtraxNG integration requires Node.js backend'
        ]
    ]);
}

function serveReactApp() {
    // Check if React index.html exists
    $reactIndex = __DIR__ . '/index.html';
    
    if (file_exists($reactIndex)) {
        // Read and output React's index.html
        readfile($reactIndex);
    } else {
        // Fallback message
        echo '<!DOCTYPE html>
        <html>
        <head>
            <title>Msingi Gym System</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .success { color: green; }
                .error { color: red; }
                button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; margin: 10px; }
            </style>
        </head>
        <body>
            <h1>Msingi Gym System</h1>
            <p class="success">✅ PHP Backend is working!</p>
            <p>React frontend files not found.</p>
            <div>
                <button onclick="window.location.href=\'/api/health\'">Test API</button>
                <button onclick="window.location.href=\'/api/members/register\'">Test Registration</button>
                <button onclick="window.location.href=\'/api/members/status\'">Test Status</button>
            </div>
            <p><a href="https://msingi.co.ke:2083">Go to cPanel</a></p>
        </body>
        </html>';
    }
}
?>