<?php
// === CONFIG ===
define("RECIPIENT_NAME", "RODRI-GO");
define("RECIPIENT_EMAIL", "info@rodri-go.co.uk");

// Form inputs
$name     = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : "";
$senderEmail = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : "";
$phone    = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : "";
$subject  = isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : "";
$message  = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : "";

// Validate required fields
if (empty($name) || empty($senderEmail) || empty($message)) {
    echo "<div class='inner error'><p class='error'>Please fill in all required fields.</p></div>";
    exit;
}

// Email subject & body
$mail_subject = $subject ? $subject : "Contact Request from $name";
$body  = "Name: $name\r\n";
$body .= "Email: $senderEmail\r\n";
if ($phone)   $body .= "Phone: $phone\r\n";
if ($subject) $body .= "Subject: $subject\r\n";
$body .= "Message:\r\n$message\r\n";

// Email headers
$headers  = "From: $name <$senderEmail>\r\n";
$headers .= "Reply-To: $senderEmail\r\n";

// Send email
if (mail(RECIPIENT_EMAIL, $mail_subject, $body, $headers)) {
    echo "<div class='inner success'><p class='success'>Thanks for contacting us. We will get back to you ASAP!</p></div>";
} else {
    echo "<div class='inner error'><p class='error'>Something went wrong. Please try again later.</p></div>";
}