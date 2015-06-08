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

$namespace('org.owasp.esapi.reference.validation');

org.owasp.esapi.reference.validation.ValidationException = function( sUserMessage, sLogMessage ) {
    var oException, sContext;
    if ( arguments[2] && arguments[2] instanceof Exception ) {
        oException = arguments[2];
        if ( arguments[3] && arguments[3] instanceof String ) {
            sContext = arguments[3];
        }
    } else if ( arguments[2] && arguments[2] instanceof String ) {
        sContext = arguments[2];
    }

    var _super = new org.owasp.esapi.EnterpriseSecurityException( sUserMessage, sLogMessage, oException );

    return {
        setContext: function(s) { sContext = s; },
        getContext: function() { return sContext; },
        getMessage: _super.getMessage,
        getUserMessage: _super.getMessage,
        getLogMessage: _super.getLogMessage,
        getStackTrace: _super.getStackTrace,
        printStackTrace: _super.printStackTrace
    };
};
