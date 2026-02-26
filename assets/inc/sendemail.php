<?php

define("RECIPIENT_NAME", "RODRI-GO");
define("RECIPIENT_EMAIL", "info@rodri-go.co.uk");

$success = false;
$name = isset($_POST['name']) ? filter_var($_POST['name'], FILTER_SANITIZE_STRING) : "";
$senderEmail = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : "";
$phone = isset($_POST['phone']) ? filter_var($_POST['phone'], FILTER_SANITIZE_STRING) : "";
$service = isset($_POST['service']) ? filter_var($_POST['service'], FILTER_SANITIZE_STRING) : "";

$mail_subject = 'Contact Request from ' . $name;

$body  = "Name: $name\r\n";
$body .= "Email: $senderEmail\r\n";
if ($phone)   $body .= "Phone: $phone\r\n";
if ($service) $body .= "Service: $service\r\n";

if ($name && $senderEmail) {
    $recipient = RECIPIENT_NAME . " <" . RECIPIENT_EMAIL . ">";
    $headers  = "From: RODRI-GO Website <" . RECIPIENT_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . $senderEmail . "\r\n";

    $success = mail($recipient, $mail_subject, $body, $headers);

    if ($success) {
        echo "<div class='inner success'><p class='success'>Thanks for contacting us. We will contact you ASAP!</p></div>";
    } else {
        echo "<div class='inner error'><p class='error'>Message could not be sent. Please try again later.</p></div>";
    }
} else {
    echo "<div class='inner error'><p class='error'>Please fill in all required fields.</p></div>";
}

?>