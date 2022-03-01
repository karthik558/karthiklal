<?php
    
   $to =  $_POST["email"];
    $firstname = $_POST["fname"];
    $email= 'karthik.lal558@gmail.com';
    $text= $_POST["message"];
    $phone= $_POST["phone"];
    $subject= $_POST["subject"];



    $headers = 'MIME-Version: 1.0' . "\r\n";
    $headers .= "From: " . $email . "\r\n"; // Sender's E-mail
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

    $message ='hello<br>subject:'.$subject.'<br>phone:'.$phone.'<br>message:'.$text;

    if (@mail($to, $email, $message, $headers))
    {
        echo 'The message has been sent.';
    }else{
        echo 'failed';
    }
    
   

?>
