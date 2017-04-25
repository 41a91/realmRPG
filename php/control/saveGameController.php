<?php
session_start();

require_once("../dbconnector.php");
require_once("../model/Model.php");
require_once("../model/load_save.php");

use load_save_games\load_save;
use load_save_games\Model;

if(isset($_POST["character1"]) && isset($_POST["map1"]))
{
   load_save::saveGame($db,$_SESSION["username"],$_POST["character1"],$_POST["map1"]);
}
else
{
    load_save::saveGame($db,"41a91","test","test");
}





