<?php
session_start();



$username = "";
$password = "";
$json = "error";


if(isset($_POST["username"]) && isset($_POST["password"]))
{
    $json = [];
    $json["name"] = "Bob";
    $json["id"] = 55;
    $json["age"] = 35;
    $username = $_POST["username"];
    $password = $_POST["password"];
    $json["username"] = $username;
    $json["password"] = $password;

    $json1 = json_encode($json);
    echo $json1;
}
