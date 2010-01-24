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
include('./build-properties.php');

$build_start = microtime_float();

echo("Cleaning up Distribution Directory");
rmdirr($OUTPUT_DIR);
if ( !is_dir($TMP_DIR ) ) mkdir($TMP_DIR, 0700);
if ( !is_dir($OUTPUT_DIR ) ) mkdir($OUTPUT_DIR, 0700);

echo("Building Uncompressed File: $OUTPUT_DIR$OUTPUT_FILE\n\r");
$time_start = microtime_float();
$fpOut = fopen( $OUTPUT_DIR.$OUTPUT_FILE, "w" );

fwrite( $fpOut, $LICENSE_TEXT );

$src = get_files( $SOURCE_DIR );
foreach( $src as $i=>$fn ) {
    echo("- Reading $fn\n");
    $fp = fopen($fn, "r" ) or die("Failed: Cannot open $fn");
    $contents = "";
    while(!feof($fp)) {
        $contents .= fgets($fp);
    }
    $contents = substr( $contents, strpos( $contents, "*/" ) + 2 );
    fwrite( $fpOut, $contents );
    fclose($fp);
}

echo("Finished building $OUTPUT_DIR$OUTPUT_FILE (".filesize($OUTPUT_DIR.$OUTPUT_FILE)." bytes): Took ".( microtime_float() - $time_start )."s\n\n" );
fclose($fpOut);

echo("Building Compressed File: $OUTPUT_DIR$OUTPUT_FILE_COMPRESSED\n\r");
$time_start = microtime_float();

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

echo("Finished building $OUTPUT_DIR$OUTPUT_FILE_COMPRESSED (".filesize($OUTPUT_DIR.$OUTPUT_FILE_COMPRESSED)." bytes): Took ".( microtime_float() - $time_start )."s\n" );

echo("\nCopying Resources to $OUTPUT_DIR$OUTPUT_RESOURCES\n");
if (!is_dir($OUTPUT_DIR.$OUTPUT_RESOURCES))mkdir($OUTPUT_DIR.'resources');
copydir($RESOURCES_DIR,$OUTPUT_DIR.$OUTPUT_RESOURCES);

echo("\nCopying Documentation to $OUTPUT_DIR$OUTPUT_DOCUMENTATION\n");
if (!is_dir($OUTPUT_DIR.$OUTPUT_DOCUMENTATION))mkdir($OUTPUT_DIR.$OUTPUT_DOCUMENTATION);
copydir($DOCUMENTATION_DIR,$OUTPUT_DIR.$OUTPUT_DOCUMENTATION, '*' );

echo("\nCopying Libraries to $OUTPUT_DIR$OUTPUT_LIBS\n");
if (!is_dir($OUTPUT_DIR.$OUTPUT_LIBS))mkdir($OUTPUT_DIR.$OUTPUT_LIBS);
copydir($LIB_DIR,$OUTPUT_DIR.$OUTPUT_LIBS);

echo("\nCopying Build Files and LICENSE\n");
copy( "LICENSE", $OUTPUT_DIR."/LICENSE");

echo("\nCleaning Up\n\n");
rmdir($TMP_DIR);

echo("Build complete took ".(microtime_float()-$build_start)."s\n\n\r");
?>