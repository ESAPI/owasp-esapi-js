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

$namespace('org.owasp.esapi.i18n');

org.owasp.esapi.i18n.ResourceBundle = function( sName, oLocale, oParentResourceBundle ) {
    var parent = oParentResourceBundle;
    var locale = oLocale;
    var name = sName;

    if ( !name ) throw new SyntaxError("Name required for implementations of org.owasp.esapi.i18n.ResourceBundle");
    if ( !locale ) throw new SyntaxError("Locale required for implementations of org.owasp.esapi.i18n.ResourceBundle");

    return {
        getParent: function() { return parent; },
        getLocale: function() { return locale; },
        getName: function() { return name; },
        getMessage: function(sKey) { return sKey; },
        getString: function( sKey, oContextMap ) {
            if ( arguments.length < 1 ) {
                throw new IllegalArgumentException("No key passed to getString");
            }

            var msg = this.getMessage(sKey);
            if ( !msg ) {
                if ( parent ) {
                    return parent.getString( sKey, oContextMap );
                } else {
                    return sKey;
                }
            }

            if ( !msg.match( /\{([A-Za-z]+)\}/ ) || !oContextMap ) {
                return msg;
            }

            var out = '', lastIndex = 0;
            while (true) {
                var nextVarIdx = msg.indexOf( "{", lastIndex );
                var endIndex = msg.indexOf( "}", nextVarIdx );

                if ( nextVarIdx < 0 ) {
                    out += msg.substr( lastIndex, msg.length-lastIndex );
                    break;
                }

                if ( nextVarIdx >= 0 && endIndex < -1 ) {
                    throw new SyntaxError("Invalid Message - Unclosed Context Reference: " + msg );
                }

                out += msg.substring( lastIndex, nextVarIdx );
                var contextKey = msg.substring( nextVarIdx+1, endIndex );
                if ( oContextMap[contextKey] ) {
                    out += oContextMap[contextKey];
                } else {
                    out += msg.substring( nextVarIdx, endIndex+1 );
                }

                lastIndex = endIndex + 1;
            }

            return out;
        }
    };
};

org.owasp.esapi.i18n.ResourceBundle.getResourceBundle = function(sResource, oLocale) {
    var classname = sResource + "_" + oLocale.toString().replace("-","_");

    with( org.owasp.esapi.i18n ) {
        if ( ResourceBundle[classname] instanceof Object ) {
            return ResourceBundle[classname];
        } else {
            return new ResourceBundle[classname]();
        }
    }
};