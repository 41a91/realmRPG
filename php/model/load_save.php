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
        $q = $db->query("select * from tablenamehere where username=$username and password=$password limit 1");

        $user = $q->fetch();
        return $user;
    }
    public static function checkIfUserExists($db,$username)
    {
        $q = $db->prepare("select username from tablenamehere where username=? limit 1");
        $log = $q->execute(array($username));
        return $log;
    }
    public static function saveGame($db,$username,$character,$inventory,$mapDetails)
    {
        $q = $db->prepare("update tablenamehere set character=?, inventory=?, mapDetails=? where username=?");
        $log = $q->execute(array($character,$inventory,$mapDetails,$username));

        return $log;
    }
    public static function registerRequest($db,$username,$password)
    {
        $q = $db->prepare("insert into tablenamehere(username,password) values(?,?) ");
        $log = $q->execute(array($username,$password));

        return $log;
    }

}