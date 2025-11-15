<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
$name = sanitize_input($_POST['name'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$phone = sanitize_input($_POST['phone'] ?? '');
$company = sanitize_input($_POST['company'] ?? 'Not Provided');
$subject = sanitize_input($_POST['subject'] ?? '');
$message = sanitize_input($_POST['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($subject) || empty($message)) {
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

// Email configuration
$to = "ksofi7860@gmail.com"; // CHANGE THIS TO YOUR EMAIL
$email_subject = "New Contact Form Submission - $subject";

// Build email body
$email_body = "You have received a new message from the contact form on your website.\n\n";
$email_body .= "=====================================\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: $phone\n";
$email_body .= "Company: $company\n";
$email_body .= "Subject: $subject\n\n";
$email_body .= "Message:\n";
$email_body .= "$message\n\n";
$email_body .= "=====================================\n";
$email_body .= "Sent from: FTLok Valves Website Contact Form\n";
$email_body .= "Date: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = "From: noreply@ftlok.com\r\n"; // CHANGE THIS
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $email_subject, $email_body, $headers)) {
    // Optional: Send auto-reply to customer
    $customer_subject = "Thank you for contacting FTLok Valves";
    $customer_message = "Dear $name,\n\n";
    $customer_message .= "Thank you for reaching out to us. We have received your message and will respond within 24 hours.\n\n";
    $customer_message .= "Your inquiry details:\n";
    $customer_message .= "Subject: $subject\n\n";
    $customer_message .= "Best regards,\n";
    $customer_message .= "FTLok Valves & Fittings Team\n";
    
    $customer_headers = "From: ksofi7860@gmail.com\r\n"; // CHANGE THIS
    $customer_headers .= "Reply-To: info@ftlok.com\r\n";
    
    mail($email, $customer_subject, $customer_message, $customer_headers);
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.'
    ]);
}
?>
