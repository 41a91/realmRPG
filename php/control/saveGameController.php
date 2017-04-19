<?php

if(isset($_POST["username"]) && isset($_POST["password"]))
{
    echo $_POST["username"];
    echo "<br/>" . $_POST["password"];
}
else
{
    echo $_POST["username"];
    echo "oopsie?";
}





