<?php
// Secure Distributor Application Handler
session_start();

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Error handling (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php-errors.log');

// ============================================
// 1. CSRF TOKEN VALIDATION
// ============================================
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Missing security token']);
    exit;
}

if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid security token']);
    exit;
}

// Clear token after validation (single-use)
unset($_SESSION['csrf_token']);

// ============================================
// 2. RATE LIMITING (3 submissions per IP per hour)
// ============================================
$ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_limit_file = __DIR__ . '/../logs/rate-limit.json';
$rate_limit_data = [];

if (file_exists($rate_limit_file)) {
    $rate_limit_data = json_decode(file_get_contents($rate_limit_file), true) ?? [];
}

// Clean old entries (older than 1 hour)
$current_time = time();
$rate_limit_data = array_filter($rate_limit_data, function($timestamp) use ($current_time) {
    return ($current_time - $timestamp) < 3600; // 1 hour
});

// Check submission count for this IP
$ip_submissions = array_filter($rate_limit_data, function($timestamp, $ip) use ($ip_address) {
    return $ip === $ip_address;
}, ARRAY_FILTER_USE_BOTH);

if (count($ip_submissions) >= 3) {
    http_response_code(429);
    echo json_encode([
        'success' => false, 
        'message' => 'Too many submissions. Please try again later.'
    ]);
    exit;
}

// Add current submission
$rate_limit_data[$ip_address . '_' . time()] = $current_time;
file_put_contents($rate_limit_file, json_encode($rate_limit_data));

// ============================================
// 3. HONEYPOT CHECK (Bot Detection)
// ============================================
if (!empty($_POST['website'])) { // Honeypot field
    // Bot detected - silently reject
    echo json_encode(['success' => true, 'message' => 'Application submitted successfully']);
    exit;
}

// ============================================
// 4. INPUT VALIDATION & SANITIZATION
// ============================================
function sanitize_input($data, $max_length = 255) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return substr($data, 0, $max_length);
}

function validate_phone($phone) {
    // Remove all non-numeric characters
    $phone = preg_replace('/[^0-9+\-\(\)\s]/', '', $phone);
    return (strlen($phone) >= 10 && strlen($phone) <= 20) ? $phone : false;
}

// Required fields
$fullName = sanitize_input($_POST['fullName'] ?? '', 100);
$companyName = sanitize_input($_POST['companyName'] ?? '', 100);
$email = sanitize_input($_POST['email'] ?? '', 100);
$phone = validate_phone($_POST['phone'] ?? '');
$country = sanitize_input($_POST['country'] ?? '', 100);
$city = sanitize_input($_POST['city'] ?? '', 100);
$businessType = sanitize_input($_POST['businessType'] ?? '', 50);
$yearsInBusiness = filter_var($_POST['yearsInBusiness'] ?? 0, FILTER_VALIDATE_INT);

// Optional fields
$turnover = sanitize_input($_POST['turnover'] ?? 'Not provided', 100);
$currentProducts = sanitize_input($_POST['currentProducts'] ?? 'Not provided', 1000);
$targetMarket = sanitize_input($_POST['targetMarket'] ?? 'Not provided', 1000);
$additionalInfo = sanitize_input($_POST['additionalInfo'] ?? 'Not provided', 2000);

// Validate required fields
if (empty($fullName) || empty($companyName) || empty($email) || 
    empty($phone) || empty($country) || empty($city) || 
    empty($businessType) || $yearsInBusiness === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Validate phone
if ($phone === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid phone number']);
    exit;
}

// Validate years (0-150)
if ($yearsInBusiness < 0 || $yearsInBusiness > 150) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid years in business']);
    exit;
}

// Validate business type (whitelist)
$valid_business_types = ['Distributor', 'Wholesaler', 'Retailer', 'Trading Company', 'Other'];
if (!in_array($businessType, $valid_business_types)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid business type']);
    exit;
}

// ============================================
// 5. EMAIL CONFIGURATION
// ============================================
$to = "ftlok.valves@gmail.com";
$cc = "ftenggcorpn@yahoo.com";
$subject = "🆕 Distributor Application - " . $companyName;

// Build email body
$email_body = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_body .= "NEW DISTRIBUTOR APPLICATION\n";
$email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

$email_body .= "📋 APPLICANT INFORMATION\n";
$email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_body .= "Full Name:      $fullName\n";
$email_body .= "Company:        $companyName\n";
$email_body .= "Email:          $email\n";
$email_body .= "Phone:          $phone\n";
$email_body .= "Location:       $city, $country\n\n";

$email_body .= "🏢 BUSINESS INFORMATION\n";
$email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_body .= "Business Type:  $businessType\n";
$email_body .= "Years Active:   $yearsInBusiness years\n";
$email_body .= "Annual Revenue: $turnover\n\n";

$email_body .= "🎯 MARKET INFORMATION\n";
$email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_body .= "Current Products:\n$currentProducts\n\n";
$email_body .= "Target Markets:\n$targetMarket\n\n";

$email_body .= "💬 ADDITIONAL INFORMATION\n";
$email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_body .= "$additionalInfo\n\n";

$email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_body .= "Submitted:  " . date('Y-m-d H:i:s T') . "\n";
$email_body .= "IP Address: $ip_address\n";
$email_body .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";
$email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

// Email headers
$headers = "From: FTLok Applications <noreply@ftlok.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Cc: $cc\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 1\r\n"; // High priority
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// ============================================
// 6. SEND EMAIL
// ============================================
$mail_sent = @mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    // Send auto-reply
    $applicant_subject = "✅ Application Received - FTLok Valves & Fittings";
    $applicant_message = "Dear $fullName,\n\n";
    $applicant_message .= "Thank you for your interest in becoming a distributor for FTLok Valves & Fittings.\n\n";
    $applicant_message .= "✅ We have successfully received your application.\n";
    $applicant_message .= "⏱️  Our team will review it and contact you within 24-48 hours.\n\n";
    $applicant_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $applicant_message .= "APPLICATION SUMMARY\n";
    $applicant_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $applicant_message .= "Company:        $companyName\n";
    $applicant_message .= "Location:       $city, $country\n";
    $applicant_message .= "Business Type:  $businessType\n";
    $applicant_message .= "Experience:     $yearsInBusiness years\n";
    $applicant_message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $applicant_message .= "If you have any questions, feel free to contact us:\n\n";
    $applicant_message .= "📧 Email: ftlok.valves@gmail.com\n";
    $applicant_message .= "📱 Phone: +91 9321499177 / +91 8451996550\n\n";
    $applicant_message .= "Best regards,\n";
    $applicant_message .= "FTLok Valves & Fittings Team\n";
    
    $applicant_headers = "From: FTLok Valves <ftlok.valves@gmail.com>\r\n";
    $applicant_headers .= "Reply-To: ftlok.valves@gmail.com\r\n";
    $applicant_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    @mail($email, $applicant_subject, $applicant_message, $applicant_headers);
    
    // Log the application
    $log_file = __DIR__ . '/../logs/distributor-applications.log';
    $log_dir = dirname($log_file);
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $log_entry = sprintf(
        "[%s] %s (%s) from %s, %s - IP: %s\n",
        date('Y-m-d H:i:s'),
        $companyName,
        $email,
        $city,
        $country,
        $ip_address
    );
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your application has been submitted successfully. Check your email for confirmation.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error. Please email us directly at ftlok.valves@gmail.com'
    ]);
}
?>
