<?php

$to 		= 'karthik.lal558@gmail.com';
$headers	= 'FROM: "'.$email.'"';

//All form values
$name 		= $_POST['name'];
$email 		= $_POST['email'];
$subject 	= $_POST['subject'];
$msg 		= $_POST['msg'];
$output 	= "Name: ".$name."\nEmail: ".$email."\nSubject: ".$subject."\n\nMessage: ".$msg;

$send		= mail($to, $name, $output, $headers);