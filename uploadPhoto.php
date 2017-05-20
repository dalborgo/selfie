<?php
$invia=false;
$invia=true;

$img=$_POST["image"];
$imgData = str_replace(' ','+',$img);
$imgData =  substr($imgData,strpos($imgData,",")+1);
$imgData = base64_decode($imgData);
// Path where the image is going to be saved
$ora=date('Y-m-d-H-i-s');
$ora2=date('d/m/Y H:i');
$filePath = 'photo/Asten '.$ora.'.jpg';
// Write $imgData into the image file
$file = fopen($filePath, 'w');
fwrite($file, $imgData);
fclose($file);

set_time_limit(0);
date_default_timezone_set('UTC');

require __DIR__.'/vendor/autoload.php';

/////// CONFIG ///////
$username = 'dalborgo81';
$password = 'Montebaldo1';
$debug = false;
$truncatedDebug = false;
//////////////////////

/////// MEDIA ////////
$photoFilename = $filePath;
$captionText = 'Blanka Selfie Machine';
//////////////////////



if($invia) {
    $ig = new \InstagramAPI\Instagram($debug, $truncatedDebug);

    try {
        $ig->setUser($username, $password);
        $ig->login();
    } catch (\Exception $e) {
        echo 'Something went wrong: ' . $e->getMessage() . "\n";
        exit(0);
    }

    try {
        $resp = $ig->uploadTimelinePhoto($photoFilename, ['caption' => $captionText]);
        echo $filePath;
    } catch (\Exception $e) {
        $filePath = 'photo/log.txt';
        $file = fopen($filePath, 'w');
        fwrite($file, $e->getMessage());
        fclose($file);
        echo $filePath;
        //echo 'Something went wrong: '.$e->getMessage()."\n";
    }
}
else{
    echo $filePath;
}


