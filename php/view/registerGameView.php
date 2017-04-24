<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/save_load_scripts.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
</head>
<body>
<form id="newSave" action="../realmRPG/php/control/registerGameController.php" method="post">
    <label>Username: <input type="text" id="username" name="username" required="required"/></label><br/>
    <label>Password: <input type="password" id="password" name="password" required="required"/></label>
    <input type="submit" id="submit" name="submit" value="Submit"/>
</form>

</body>
</html>