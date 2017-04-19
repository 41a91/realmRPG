<?php
session_start();

require_once("../dbconnector.php");
require_once("../model/Model.php");
require_once("../model/load_save.php");

use load_save_games\load_save;
use load_save_games\Model;



$post = $_POST;


if(isset($post["username"]) && isset($post["password"]))
{
   $check = load_save::checkIfUserExists($db,$post["username"]);
   if($check)
   {
       $userObj = load_save::loginRequest($db,$post["username"],$post["password"]);

       $_SESSION["loggedIn"] = true;
       $_SESSION["username"] = $userObj[0];
       $_SESSION["character"] = $userObj[1];
       $_SESSION["inventory"] = $userObj[2];
       $_SESSION["mapDetail"] = $userObj[3];
       header("Location: ../../../index.html");
   }
   else
   {
       echo "You failed somewhere on the loadGame controller";
   }
}
