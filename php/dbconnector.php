<?php

$myerror = null;
try{
    $db = new PDO("mysql:host=localhost dbname=saved_games","root","dennisiscool");
    $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e)
{
    $myerror = "Couldn't connect to DB: " . $e->getMessage();
}



