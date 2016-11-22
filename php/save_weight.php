<?php

$iid = $_POST["iid"];
$lym_weight = $_POST["lymweight"];
$nec_weight = $_POST["necweight"];

$fname = "../data/" . $iid . ".txt";
$file = fopen($fname, 'w') or die(print_r(error_get_last(),true));
$content = $lym_weight . "\n" . $nec_weight;
fwrite($file, $content);
fclose($file);
echo "Saved weight successful";
?> 
