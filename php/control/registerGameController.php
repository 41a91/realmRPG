<?php
session_start();
require_once("../dbconnector.php");
require_once("../model/Model.php");
require_once("../model/load_save.php");

use load_save_games\load_save;
use load_save_games\Model;


unset($_SESSION["alpha"]);
unset($_SESSION["nameUsed"]);
unset($_SESSION["badPass"]);
unset($_SESSION["loadGameError"]);

if(isset($_POST["username"]) && isset($_POST["password"]))
{

    $a = ctype_alnum($_POST["username"]);

    if($a === true) {

        $_SESSION["alpha"] = false;
        $user = htmlentities(trim($_POST["username"]));

        $r = load_save::checkIfUserExists($db,$user);
        $_SESSION["r"] = $r;
        if($r !== false)
        {
            $_SESSION["nameUsed"] = true;
            $_SESSION["loggedIn"] = false;
            header("Location: ../../index.php");
        }
        else{
            $_SESSION["nameUsed"] = false;
        }

        $uppercase = preg_match('@[A-Z]@', $_POST["password"]);
        $lowercase = preg_match('@[a-z]@', $_POST["password"]);
        $numbers = preg_match('@[0-9]@', $_POST["password"]);

        if(!$uppercase || !$lowercase || !$numbers)
        {
            $_SESSION["badPass"] = true;
            $_SESSION["loggedIn"] = false;
            header("Location: ../../index.php");
        }
        else{
            $_SESSION["badPass"] = false;
        }

        $pass = htmlentities(trim($_POST["password"]));


        if(!$_SESSION["alpha"] && !$_SESSION["nameUsed"] && !$_SESSION["badPass"])
        {

            load_save::registerRequest($db, $user, $pass);
            $userObj = load_save::loginRequest($db, $user, $pass);

            $_SESSION["loggedIn"] = true;
            $_SESSION["username"] = $userObj[1];
            $_SESSION["character"] = $userObj[3];
            $_SESSION["mapDetail"] = $userObj[4];
            header("Location: ../../index.php");
        }




    }
    else{
        $_SESSION["alpha"] = true;
        $_SESSION["loggedIn"] = false;
        header("Location: ../../index.php");
    }
}