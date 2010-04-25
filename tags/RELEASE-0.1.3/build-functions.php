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

/**
 * Delete a file, or a folder and its contents (recursive algorithm)
 *
 * @author      Aidan Lister <aidan@php.net>
 * @version     1.0.3
 * @link        http://aidanlister.com/repos/v/function.rmdirr.php
 * @param       string   $dirname    Directory to delete
 * @return      bool     Returns TRUE on success, FALSE on failure
 */
function rmdirr($dirname)
{
    // Sanity check
    if (!file_exists($dirname)) {
        return false;
    }

    // Simple delete for a file
    if (is_file($dirname) || is_link($dirname)) {
        return unlink($dirname);
    }

    // Loop through the folder
    $dir = dir($dirname);
    while (false !== $entry = $dir->read()) {
        // Skip pointers
        if ($entry == '.' || $entry == '..' || $entry == '.svn' ) {
            continue;
        }

        // Recurse
        rmdirr($dirname . DIRECTORY_SEPARATOR . $entry);
    }

    // Clean up
    $dir->close();
    return;// rmdir($dirname);
}

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

function get_files($root_dir, $allow_extensions = array( 'js' ), $ignore_files = array( ), $ignore_regex = '/^_/', $ignore_dirs = array(".","..",".svn"), $all_data=array() )
{
// run through content of root directory
$dir_content = scandir($root_dir);
foreach($dir_content as $key => $content)
{
  $path = $root_dir.'/'.$content;
  if(is_file($path) && is_readable($path))
  {
    // skip ignored files
    if(!in_array($content, $ignore_files))
    {
      if (preg_match($ignore_regex,$content) == 0)
      {
        $content_chunks = explode(".",$content);
        $ext = $content_chunks[count($content_chunks) - 1];
        // only include files with desired extensions
        if ( ( is_array( $allow_extensions ) && in_array($ext, $allow_extensions) ) || ( is_string( $allow_extensions ) && $allow_extensions == '*' ) )
        {
            // save file name with path
            $all_data[] = $path;
        }
      }
    }
  }
  // if content is a directory and readable, add path and name
  elseif(is_dir($path) && is_readable($path))
  {
    // skip any ignored dirs
    if(!in_array($content, $ignore_dirs))
    {
      // recursive callback to open new directory
      $all_data = get_files($path, $allow_extensions, $ignore_files, $ignore_regex, $ignore_dirs, $all_data);
    }
  }
} // end foreach
return $all_data;
} // end get_files()

function microtime_float() {
    list($usec,$sec) = explode(" ",microtime());
    return ((float)$usec + (float)$sec);
}

function copydir( $src, $dst, $allow_extensions = array( 'js' ), $ignore_files = array( ), $ignore_regex = '/^_/', $ignore_dirs = array(".","..",".svn") ) {
    $filelist = get_files($src, $allow_extensions, $ignore_files, $ignore_regex, $ignore_dirs);
    foreach($filelist as $i=>$file) {
        $dir_name = substr( $file, 0, strrpos( $file, '/' ) );
        $dir_name = substr( $dir_name, strlen($src)+1 );
        if ( !is_dir($dst.$dir_name) ) {
            echo("- Creating Directory: $dst$dir_name\n");
            mkdir($dst.$dir_name);
        }

        $dst_file = substr( $file, strlen( $src )+1 );
        echo("- $file (".filesize($file)." bytes) => $dst$dst_file");
        copy( $file, $dst.$dst_file );
        usleep(5000);
        if ( filesize($file) == filesize($dst.$dst_file) )
            echo("\t[OK]\n");
        else
            echo("\t[ERROR]\n");
    }
}
?>