<?php
session_start();

require_once("../dbconnector.php");
require_once("../model/Model.php");
require_once("../model/load_save.php");

use load_save_games\load_save;
use load_save_games\Model;


if(isset($_POST["username"]) && isset($_POST["password"]))
{
   $check = load_save::checkIfUserExists($db,$_POST["username"]);
   if($check)
   {
       $userObj = load_save::loginRequest($db,$_POST["username"],$_POST["password"]);

       if($userObj !== false)
       {
           $_SESSION["loggedIn"] = true;
           $_SESSION["username"] = $userObj[1];
           $_SESSION["character"] = $userObj[3];
           $_SESSION["mapDetail"] = $userObj[4];
           header("Location: ../../index.php");
       }
       else
       {
           $_SESSION["loadGameError"] = true;
           header("Location: ../../index.php");
       }
   }
   else
   {
       echo "You failed somewhere on the loadGame controller";
   }
}
