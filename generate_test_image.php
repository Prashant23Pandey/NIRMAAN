<?php
$im = imagecreatetruecolor(120, 120);
$bg = imagecolorallocate($im, 23, 107, 91);
imagefill($im, 0, 0, $bg);
$fg = imagecolorallocate($im, 245, 158, 11);
imagefilledellipse($im, 60, 60, 80, 80, $fg);
imagepng($im, __DIR__ . '/test_avatar.png');
imagedestroy($im);
echo file_exists(__DIR__ . '/test_avatar.png') ? "Created test_avatar.png successfully\n" : "Failed\n";
