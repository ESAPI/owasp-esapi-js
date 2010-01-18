<?php
/*
 * OWASP Enterprise Security API (ESAPI)
 *
 * This file is part of the Open Web Application Security Project (OWASP)
 * Enterprise Security API (ESAPI) project. For details, please see
 * <a href="http://www.owasp.org/index.php/ESAPI">http://www.owasp.org/index.php/ESAPI</a>.
 *
 * Copyright (c) 2008 - The OWASP Foundation
 *
 * The ESAPI is published by OWASP under the BSD license. You should read and accept the
 * LICENSE before you use, modify, and/or redistribute this software.
 */

include('./build-functions.php');

$DOCUMENTATION_DIR = "documentation/";
$SOURCE_DIR = "src/main/javascript";
$RESOURCES_DIR = "src/main/resources/";
$OUTPUT_DIR = "dist/";
$OUTPUT_RESOURCES = "resources/";
$OUTPUT_DOCUMENTATION = "docs/";
$OUTPUT_FILE = "esapi.js";
$OUTPUT_FILE_COMPRESSED = "esapi-compressed.js";

$JDK_HOME = "/home/cschmidt/jdk1.6.0_14/";
$YUI_COMPRESSOR_JAR = "lib/yuicompressor-2.4.2.jar";
$TMP_DIR = "tmp/";

rmdirr($OUTPUT_DIR);
if ( !is_dir($TMP_DIR) ) mkdir($TMP_DIR, 0700);
mkdir($OUTPUT_DIR, 0700);

echo("Building Uncompressed File: $OUTPUT_DIR$OUTPUT_FILE\n\r");

$fpOut = fopen( $OUTPUT_DIR.$OUTPUT_FILE, "w" );

$src = get_files( $SOURCE_DIR );
foreach( $src as $i=>$fn ) {
    echo("- Reading $fn\n");
    $fp = fopen($fn, "r" ) or die("Failed: Cannot open $fn");
    $contents = "";
    while(!feof($fp)) {
        $contents .= fgets($fp);
    }
    fwrite( $fpOut, $contents );
    fclose($fp);
}

echo("Finished building $OUTPUT_DIR$OUTPUT_FILE (".filesize($fpOut)." bytes): Took " );
fclose($fpOut);

echo("Building Compressed File: $OUTPUT_DIR$OUTPUT_FILE_COMPRESSED\n\r");

Minify_YUICompressor::$jarFile = $YUI_COMPRESSOR_JAR;
Minify_YUICompressor::$tempDir = $TMP_DIR;
Minify_YUICompressor::$javaExecutable = $JDK_HOME."/bin/java";

$fp = fopen( $OUTPUT_DIR.$OUTPUT_FILE, "r" );
$uncompressed = "";
while (!feof($fp)) {
    $uncompressed .= fgets( $fp );
}
fclose($fp);

$compressed = Minify_YUICompressor::minifyJs( $uncompressed, array());

$fp = fopen( $OUTPUT_DIR.$OUTPUT_FILE_COMPRESSED, "w" );
fwrite( $fp, $compressed );
fclose($fp);

mkdir($OUTPUT_DIR.'resources');
echo("Copying Resources to $OUTPUT_DIR$OUTPUT_RESOURCES\n");

$dir = dir($RESOURCES_DIR);
while (false !== $entry = $dir->read()) {
    // Skip pointers
    if ($entry == '.' || $entry == '..' || $entry == '.svn' ) {
        continue;
    }
    echo("- Copying $entry to $OUTPUT_DIR.$OUTPUT_RESOURCES.$entry\n");
    copy( $RESOURCES_DIR.$entry, $OUTPUT_DIR.$OUTPUT_RESOURCES.$entry );
}
$dir->close();

mkdir($OUTPUT_DIR.$OUTPUT_DOCUMENTATION);
$dir = dir($DOCUMENTATION_DIR);
while (false !== $entry = $dir->read()) {
    // Skip pointers
    if ($entry == '.' || $entry == '..' || $entry == '.svn' ) {
        continue;
    }
    echo("- Copying $entry to $OUTPUT_DIR.$OUTPUT_DOCUMENTATION.$entry\n");
    copy( $RESOURCES_DIR.$entry, $OUTPUT_DIR.$OUTPUT_DOCUMENTATION.$entry );
}
$dir->close();

echo("Cleaning Up\n");
rmdir($TMP_DIR);

?>