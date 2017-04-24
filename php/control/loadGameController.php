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
       $_SESSION["username"] = $userObj[1];
       $_SESSION["character"] = $userObj[3];
       $_SESSION["mapDetail"] = $userObj[4];
       header("Location: ../../index.php");
   }
   else
   {
       echo "You failed somewhere on the loadGame controller";
   }
}
