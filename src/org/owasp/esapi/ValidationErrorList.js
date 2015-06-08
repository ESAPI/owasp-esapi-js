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

$namespace('org.owasp.esapi');

org.owasp.esapi.ValidationErrorList = function() {
    var errorList = Array();

    return {
        addError: function( sContext, oValidationException ) {
            if ( sContext == null ) throw new RuntimeException( "Context cannot be null: " + oValidationException.getLogMessage(), oValidationException );
            if ( oValidationException == null ) throw new RuntimeException( "Context (" + sContext + ") - Error cannot be null" );
            if ( errorList[sContext] ) throw new RuntimeException( "Context (" + sContext + ") already exists. must be unique." );
            errorList[sContext] = oValidationException;
        },

        errors: function() {
            return errorList;
        },

        isEmpty: function() {
            return errorList.length == 0;
        },

        size: function() {
            return errorList.length;
        }
    };
};
