<?php
    $fp = fopen(dirname(__FILE__).'/hosts', "r");
    $arr = array();
    if($fp) { 
        while (($line = fgets($fp)) !== false) {
            if(strpos($line, '#') !== false){
                continue;
            }
            $line = str_replace("\r\n", "", $line);
            if($line === ""){
                continue;
            }
            $line = preg_split('(\s+)', $line);
            if($line[1] === ""){
                continue;
            }
            array_push($arr, $line[1]);
        }
    }
    $res = array_unique($arr);

    fclose($fp); 
    $fpw = fopen(dirname(__FILE__).'/host2', "w");
    foreach ($res as $value){
        fwrite($fpw, '127.0.0.1'.' '.$value.PHP_EOL);
    }
    fclose($fpw); 
?>