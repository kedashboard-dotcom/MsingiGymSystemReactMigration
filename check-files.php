<?php
echo "<h1>Files in public_html</h1>";
echo "<pre>";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        $size = filesize($file);
        $type = is_dir($file) ? 'DIR' : 'FILE';
        echo "$type: $file ($size bytes)\n";
    }
}
echo "</pre>";
?>