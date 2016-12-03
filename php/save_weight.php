<?php

$iid = $_POST["iid"];
$lym_weight = $_POST["lymweight"];
$nec_weight = $_POST["necweight"];
$user = $_POST["user"];

$fname = "../data/" . $iid . "_" . $user . ".txt";
$file = fopen($fname, 'w') or die(print_r(error_get_last(),true));
$content = $lym_weight . "\n" . $nec_weight;
fwrite($file, $content);
fclose($file);
echo "Saved weight successful";
?> 
