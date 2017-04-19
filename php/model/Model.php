<?php
/**
 * Created by PhpStorm.
 * User: adamsj
 * Date: 2/21/2017
 * Time: 11:11 AM
 */

namespace load_save_games;


class Model
{
    protected $array;

    public function __construct($array)
    {
        $this->array = $array;
    }

    function __get($key)
    {
        if(array_key_exists($key, $this->array)){
            return $this->array[$key];
        }
        throw new \InvalidArgumentException("Key value is invalid");
    }

    function __set($key, $value)
    {
        if(array_key_exists($key, $this->array)){
            $this->array[$key] = $value;
            return;
        }
            throw new \InvalidArgumentException("Cannot set a key that does not exist");

    }
    function __toString(){
        $s = "";
        foreach($this->array as $k =>$v){
            $s .= $k . ": " . $v . "<br />";
        }
        return $s;
    }


}