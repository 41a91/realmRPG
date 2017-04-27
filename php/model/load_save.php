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
        $q = $db->query("select * from current_games where username='$username' limit 1");

        $user = $q->fetch();

        if(password_verify($password,$user[2]))
        {
            return $user;
        }
        else
        {
            return false;
        }
    }
    public static function checkIfUserExists($db,$username)
    {
        $q = $db->prepare("select username from current_games where username=? limit 1");
        $log = $q->execute(array($username));
        return $log;
    }
    public static function saveGame($db,$username,$character,$mapDetails)
    {
        $db->query("UPDATE current_games SET player='$character', current_map='$mapDetails' where username='$username'");
    }
    public static function registerRequest($db,$username,$password)
    {
        $q = $db->prepare("insert into current_games(username,password,current_map) values(?,?,'[0,1]') ");

        $options = ['cost' => 12];
        $newpass = password_hash($password,PASSWORD_DEFAULT,$options);

        $log = $q->execute(array($username,$newpass));

        return $log;
    }

}