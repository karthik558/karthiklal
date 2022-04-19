<?php
$to =  $_POST["email"];
$firstname = $_POST["fname"];
$email= 'karthik.lal558@gmail.com';
$text= $_POST["message"];
$phone= $_POST["phone"];
$subject= $_POST["subject"];
 
// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= "From: " . $email . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
 
// Create email headers
$headers .= 'From: '.$from."\r\n".
    'Reply-To: '.$from."\r\n" .
    'X-Mailer: PHP/' . phpversion();
 
// Compose a simple HTML email message
$message = '<html><body>';
$message .= '<h1 style="color:#f40;">Hello</h1><br><br>subject:'.$subject.'<br>phone:'.$phone.'<br>message:'.$text;
$message .= '</body></html>';
 
// Sending email
if(mail($to, $subject, $message, $headers)){
    echo 'Your mail has been sent successfully.';
} else{
    echo 'Unable to send email. Please try again.';
}
?>