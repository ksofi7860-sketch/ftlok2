<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Check if form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Sanitize and validate inputs
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Get form data
$fullName = sanitize_input($_POST['fullName'] ?? '');
$companyName = sanitize_input($_POST['companyName'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$phone = sanitize_input($_POST['phone'] ?? '');
$country = sanitize_input($_POST['country'] ?? '');
$city = sanitize_input($_POST['city'] ?? '');
$businessType = sanitize_input($_POST['businessType'] ?? '');
$yearsInBusiness = sanitize_input($_POST['yearsInBusiness'] ?? '');
$turnover = sanitize_input($_POST['turnover'] ?? 'Not provided');
$currentProducts = sanitize_input($_POST['currentProducts'] ?? 'Not provided');
$targetMarket = sanitize_input($_POST['targetMarket'] ?? 'Not provided');
$additionalInfo = sanitize_input($_POST['additionalInfo'] ?? 'Not provided');

// Validate required fields
if (empty($fullName) || empty($companyName) || empty($email) || empty($phone) || 
    empty($country) || empty($city) || empty($businessType) || empty($yearsInBusiness)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields'
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit;
}

// Validate years in business is a number
if (!is_numeric($yearsInBusiness)) {
    echo json_encode([
        'success' => false,
        'message' => 'Years in business must be a number'
    ]);
    exit;
}

// Email configuration
$to = "ftlok.valves@gmail.com"; // CHANGE THIS TO YOUR EMAIL
$cc = "ftenggcorpn@yahoo.com"; // OPTIONAL: CC email
$subject = "New Distributor Application - $companyName";

// Build email body
$email_body = "NEW DISTRIBUTOR APPLICATION RECEIVED\n\n";
$email_body .= "=====================================\n\n";
$email_body .= "APPLICANT INFORMATION:\n";
$email_body .= "-------------------------------------\n";
$email_body .= "Full Name: $fullName\n";
$email_body .= "Company Name: $companyName\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: $phone\n";
$email_body .= "Country: $country\n";
$email_body .= "City: $city\n\n";

$email_body .= "BUSINESS INFORMATION:\n";
$email_body .= "-------------------------------------\n";
$email_body .= "Type of Business: $businessType\n";
$email_body .= "Years in Business: $yearsInBusiness\n";
$email_body .= "Annual Turnover: $turnover\n\n";

$email_body .= "MARKET INFORMATION:\n";
$email_body .= "-------------------------------------\n";
$email_body .= "Current Products:\n$currentProducts\n\n";
$email_body .= "Target Market/Industries:\n$targetMarket\n\n";

$email_body .= "ADDITIONAL INFORMATION:\n";
$email_body .= "-------------------------------------\n";
$email_body .= "$additionalInfo\n\n";

$email_body .= "=====================================\n";
$email_body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_body .= "=====================================\n";

// Email headers
$headers = "From: noreply@ftlok.com\r\n"; // CHANGE THIS to your domain
$headers .= "Reply-To: $email\r\n";
if (!empty($cc)) {
    $headers .= "Cc: $cc\r\n";
}
$headers .= "X-Mailer: PHP/" . phpversion();
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    // Optional: Send auto-reply to applicant
    $applicant_subject = "Thank you for your Distributor Application - FTLok Valves";
    $applicant_message = "Dear $fullName,\n\n";
    $applicant_message .= "Thank you for your interest in becoming a distributor for FTLok Valves & Fittings.\n\n";
    $applicant_message .= "We have received your application and our team will review it carefully. ";
    $applicant_message .= "We will contact you within 24-48 hours to discuss the next steps.\n\n";
    $applicant_message .= "Application Summary:\n";
    $applicant_message .= "-------------------------------------\n";
    $applicant_message .= "Company: $companyName\n";
    $applicant_message .= "Country: $country\n";
    $applicant_message .= "Business Type: $businessType\n";
    $applicant_message .= "Years in Business: $yearsInBusiness\n\n";
    $applicant_message .= "If you have any questions in the meantime, please don't hesitate to contact us.\n\n";
    $applicant_message .= "Best regards,\n";
    $applicant_message .= "FTLok Valves & Fittings Team\n\n";
    $applicant_message .= "Email: ftlok.valves@gmail.com\n";
    $applicant_message .= "Phone: +91 9321499177 / +91 8451996550\n";
    
    $applicant_headers = "From: ftlok.valves@gmail.com\r\n"; // CHANGE THIS
    $applicant_headers .= "Reply-To: ftlok.valves@gmail.com\r\n";
    $applicant_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send auto-reply
    mail($email, $applicant_subject, $applicant_message, $applicant_headers);
    
    // Log the application (optional - create logs folder first)
    $log_file = __DIR__ . '/../logs/distributor-applications.log';
    $log_dir = dirname($log_file);
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    $log_entry = date('Y-m-d H:i:s') . " - Application from $companyName ($email)\n";
    file_put_contents($log_file, $log_entry, FILE_APPEND);
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your application has been submitted successfully. We will contact you within 24-48 hours.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your application. Please try again or contact us directly at ftlok.valves@gmail.com'
    ]);
}
?>
