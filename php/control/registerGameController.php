<?php
require_once("../dbconnector.php");
require_once("../model/Model.php");
require_once("../model/load_save.php");

use load_save_games\load_save;
use load_save_games\Model;



$post = $_POST;

if(isset($post["username"]) && isset($post["password"]))
{
    load_save::registerRequest($db,$post["username"],$post["password"]);

    echo "it might of done something";
}