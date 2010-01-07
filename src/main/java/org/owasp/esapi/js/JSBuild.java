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

package org.owasp.esapi.js;

import java.util.Properties;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.io.IOException;

public class JSBuild {
    private static final String MODULES_PROPERTIES = "Modules.properties";
    private static final Logger log = Logger.getLogger( "JSBuild" );

    private Properties modules;

    private String srcDir;
    private String outDir;

    private JSBuild()
    {
        modules = new Properties();
        try {
            modules.load( this.getClass().getClassLoader().getResourceAsStream( MODULES_PROPERTIES ) );
        } catch (IOException e) {
            log.log( Level.SEVERE, "Unable to load " + MODULES_PROPERTIES, e );
        }
    }

    public Properties getModules() {
        return modules;
    }

    public void setModules(Properties modules) {
        this.modules = modules;
    }

    public String getSrcDir() {
        return srcDir;
    }

    public void setSrcDir(String srcDir) {
        this.srcDir = srcDir;
    }

    public String getOutDir() {
        return outDir;
    }

    public void setOutDir(String outDir) {
        this.outDir = outDir;
    }

    private void start() {

    }

    private static void usage()
    {
        StringBuilder out = new StringBuilder();
        out.append( "JSBuild v1.0 Usage\n" );
        out.append( "--------------------------------------------------------------------------\n" )
           .append( "java <vmargs> org.owasp.esapi.js.JSBuild <srcDir> <outDir>")
           .append( "\n" );
        System.out.println( out );
    }

    public static void main( String... args ) {
        if ( args.length < 2 ) {
            log.log( Level.SEVERE, "Invalid Arguments" );
            usage();
            System.exit( 1 );
        }

        JSBuild build = new JSBuild();
        build.setSrcDir( args[0] );
        build.setOutDir( args[1] );
        build.start();
    }
}
