<?php
/**
 * Created by PhpStorm.
 * User: adamsj
 * Date: 2/23/2017
 * Time: 11:15 AM
 */

namespace load_save_games;



class load_save extends Model
{

    public static function loginRequest($db,$username,$password)
    {
        $q = $db->query("select * from current_games where username='$username' and password='$password' limit 1");

        $user = $q->fetch();
        return $user;
    }
    public static function checkIfUserExists($db,$username)
    {
        $q = $db->prepare("select username from current_games where username=? limit 1");
        $log = $q->execute(array($username));
        return $log;
    }
    public static function saveGame($db,$username,$character,$mapDetails)
    {
        $q = $db->prepare("update current_games set character=?, mapDetails=? where username=?");
        $log = $q->execute(array($character,$mapDetails,$username));

        return $log;
    }
    public static function registerRequest($db,$username,$password)
    {
        $q = $db->prepare("insert into current_games(username,password) values(?,?) ");
        $log = $q->execute(array($username,$password));

        return $log;
    }

}