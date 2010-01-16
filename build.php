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

$SOURCE_DIR = "src/main/javascript/";
$COMPLETE_FILES = array( "core.js", "esapi.properties.js", "org.owasp.esapi.js", "org.owasp.esapi.codecs.js", "org.owasp.esapi.reference.encoding.js", "org.owasp.esapi.reference.logging.js" );

$OUTPUT_DIR = "dist/";
$OUTPUT_FILE = "esapi.js";
$OUTPUT_FILE_COMPRESSED = "esapi-compressed.js";

$JDK_HOME = "/home/cschmidt/jdk1.6.0_14/";
$YUI_COMPRESSOR_JAR = "lib/yuicompressor-2.4.2.jar";
$TMP_DIR = "tmp/";

mkdir($TMP_DIR, 0700);
mkdir($OUTPUT_DIR, 0700);
unlink($OUTPUT_DIR.$OUTPUT_FILE);
unlink($OUTPUT_DIR.$OUTPUT_FILE_COMPRESSED);

/**
 * Compress Javascript/CSS using the YUI Compressor
 *
 * You must set $jarFile and $tempDir before calling the minify functions.
 * Also, depending on your shell's environment, you may need to specify
 * the full path to java in $javaExecutable or use putenv() to setup the
 * Java environment.
 *
 * <code>
 * Minify_YUICompressor::$jarFile = '/path/to/yuicompressor-2.3.5.jar';
 * Minify_YUICompressor::$tempDir = '/tmp';
 * $code = Minify_YUICompressor::minifyJs(
 *   $code
 *   ,array('nomunge' => true, 'line-break' => 1000)
 * );
 * </code>
 *
 * @todo unit tests, $options docs
 *
 * @package Minify
 * @author Stephen Clay <steve@mrclay.org>
 */
class Minify_YUICompressor {

    /**
     * Filepath of the YUI Compressor jar file. This must be set before
     * calling minifyJs() or minifyCss().
     *
     * @var string
     */
    public static $jarFile = null;

    /**
     * Writable temp directory. This must be set before calling minifyJs()
     * or minifyCss().
     *
     * @var string
     */
    public static $tempDir = null;

    /**
     * Filepath of "java" executable (may be needed if not in shell's PATH)
     *
     * @var string
     */
    public static $javaExecutable = 'java';

    /**
     * Minify a Javascript string
     *
     * @param string $js
     *
     * @param array $options (verbose is ignored)
     *
     * @see http://www.julienlecomte.net/yuicompressor/README
     *
     * @return string
     */
    public static function minifyJs($js, $options = array())
    {
        return self::_minify('js', $js, $options);
    }

    /**
     * Minify a CSS string
     *
     * @param string $css
     *
     * @param array $options (verbose is ignored)
     *
     * @see http://www.julienlecomte.net/yuicompressor/README
     *
     * @return string
     */
    public static function minifyCss($css, $options = array())
    {
        return self::_minify('css', $css, $options);
    }

    private static function _minify($type, $content, $options)
    {
        self::_prepare();
        if (! ($tmpFile = tempnam(self::$tempDir, 'yuic_'))) {
            throw new Exception('Minify_YUICompressor : could not create temp file.');
        }
        file_put_contents($tmpFile, $content);
        exec(self::_getCmd($options, $type, $tmpFile), $output);
        unlink($tmpFile);
        return implode("\n", $output);
    }

    private static function _getCmd($userOptions, $type, $tmpFile)
    {
        $o = array_merge(
            array(
                'charset' => ''
                ,'line-break' => 5000
                ,'type' => $type
                ,'nomunge' => false
                ,'preserve-semi' => false
                ,'disable-optimizations' => false
            )
            ,$userOptions
        );
        $cmd = self::$javaExecutable . ' -jar ' . escapeshellarg(self::$jarFile)
             . " --type {$type}"
             . (preg_match('/^[a-zA-Z\\-]+$/', $o['charset'])
                ? " --charset {$o['charset']}"
                : '')
             . (is_numeric($o['line-break']) && $o['line-break'] >= 0
                ? ' --line-break ' . (int)$o['line-break']
                : '');
        if ($type === 'js') {
            foreach (array('nomunge', 'preserve-semi', 'disable-optimizations') as $opt) {
                $cmd .= $o[$opt]
                    ? " --{$opt}"
                    : '';
            }
        }
        return $cmd . ' ' . escapeshellarg($tmpFile);
    }

    private static function _prepare()
    {
        if (! is_file(self::$jarFile)
            || ! is_dir(self::$tempDir)
            || ! is_writable(self::$tempDir)
        ) {
            throw new Exception('Minify_YUICompressor : $jarFile and $tempDir must be set.');
        }
    }
}


echo("Building Uncompressed File: $OUTPUT_DIR.$OUTPUT_FILE\n\r");

$fpOut = fopen( $OUTPUT_DIR.$OUTPUT_FILE, "w" );

foreach($COMPLETE_FILES as $fileName) {
    echo("- Reading $fileName\n");
    $fp = fopen( $SOURCE_DIR.$fileName, "r" );
    $contents = "";
    while(!feof($fp)) {
        $contents .= fgets($fp);
    }
    fwrite( $fpOut, $contents );
    fclose($fp);
}

fclose($fpOut);

echo("Building Compressed File: $OUTPUT_DIR.$OUTPUT_FILE_COMPRESSED\n\r");  

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

?>