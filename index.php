<?php
   session_start();

if(!isset($_SESSION["loggedIn"]))
{
    $_SESSION["loggedIn"] = false;
    $_SESSION["username"] = "";
    $_SESSION["character"] = "";
    $_SESSION["mapDetail"] = "";
}
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link href="css/mystyles.css" type="text/css" rel="stylesheet"/>
    <script src="js/prototype.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
    <script src="js/mylib.js" type="text/javascript"></script>
    <script src="js/myscripts.js" type="text/javascript"></script>

</head>
<body>

<section id="gameSection">
    <div id="sideBarLeft"></div>
    <canvas id="gameCanvas" height="600" width="800"></canvas>
    <div id="sideBarRight"></div>
</section>
<section id="phpIncludeSection"></section>

<img src="images/MainCharacterRight.png" alt="Right sprite sheet" id="mainCharacterRight" class="noDraw"/>
<img src="images/MainCharacterLeft.png" alt="Left sprite sheet" id="mainCharacterLeft" class="noDraw"/>
<img src="images/MainCharacterFront.png" alt="Front Image" id="mainCharacterFrontStatic" class="noDraw"/>
<img src="images/MainCharacterFrontSheet.png" alt="Front sprite sheet" id="mainCharacterFront" class="noDraw"/>
<img src="images/MainCharacterBackSheet.png" alt="Back sprite sheet" id="mainCharacterBack" class="noDraw"/>
<img src="images/dungeonTileBlack.png" id="dungeonTileBlack" class="noDraw"/>
<img src="images/DungeonWallTile.png" id="dungeonWallTile" class="noDraw"/>
<img src="images/voidTile.png" id="voidTile" class="noDraw"/>
<img src="images/dungeonWall2Type1.png" id="dungWall2Type1" class="noDraw"/>
<img src="images/dungeonWall2Type2.png" id="dungWall2Type2" class="noDraw">
<img src="images/dungeonTile2Black.png" id="dungTile2Black" class="noDraw"/>
<img src="images/dungeonGate1.png" id="dungGate1" class="noDraw"/>
<img src="images/dungeonGate2.png" id="dungGate2" class="noDraw"/>
<img src="images/stairsRight.png" id="stairsRight" class="noDraw"/>
<img src="images/blankTile.png" id="blank" class="noDraw"/>
<img src="images/ArmorLight.png" id="ArmorLight" class="noDraw"/>
<img src="images/WeaponDagger.png" id="WeaponDagger" class="noDraw"/>
<img src="images/ArmorUnequip.png" id="armorUnequip" class="noDraw"/>
<img src="images/WeaponUnequip.png" id="weaponUnequip" class="noDraw"/>
<img src="images/MainCharacterBattleStance.png" id="mainCharacterBattleStance" class="noDraw"/>
<img src="images/fireSpell.png" id="fireSpell" class="noDraw"/>
<img src="images/healSpell.png" id="healSpell" class="noDraw"/>
<img src="images/enemy1.png" id="enemy1" class="noDraw"/>
<img src="images/redHealth.png" id="redHealth" class="noDraw"/>
<img src="images/blueMana.png" id="blueMana" class="noDraw"/>
<img src="images/enemy2.png" id="enemy2" class="noDraw"/>
<img src="images/swordAnimation.png" id="swordAnimation" class="noDraw"/>
<img src="images/healSpellAnimation.png" id="healSpellAnimation" class="noDraw"/>
<img src="images/explosionAnimation.png" id="explosionAnimation" class="noDraw"/>
<img src="images/scratchAnimation.png" id="scratchAnimation" class="noDraw"/>

<input id="loggedIn" type="hidden" name="loggedIn" value='<?=$_SESSION["loggedIn"];?>'/>
<input id="username" type="hidden" name="username" value='<?=$_SESSION["username"];?>'/>
<input id="character" type="hidden" name="character" value='<?=$_SESSION["character"];?>'/>
<input id="mapDetail" type="hidden" name="mapDetail" value='<?=$_SESSION["mapDetail"];?>'/>
<section id="errors">
<?php


if(isset($_SESSION["alpha"]))
{
    if($_SESSION["alpha"] === true)
    {
        echo "Those characters are not aloud in the username <br/>";
    }
    if($_SESSION["badPass"] === true)
    {
        echo "Your password must have an uppercase, lowercase, and a number  <br/>";
    }
    if($_SESSION["nameUsed"] === true)
    {
        echo "That username is already taken  <br/>";
    }
}
if(isset($_SESSION["loadGameError"]) && $_SESSION["loadGameError"] === true)
{
    echo "That username and password combination is incorrect  <br/>";
}

?>
</section>

</body>
</html>