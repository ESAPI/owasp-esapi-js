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

org.owasp.esapi.Logger = function() {
    return {
        setLevel: false,
        fatal: false,
        error: false,
        isErrorEnabled: false,
        warning: false,
        isWarningEnabled: false,
        info: false,
        isInfoEnabled: false,
        debug: false,
        isDebugEnabled: false,
        trace: false,
        isTraceEnabled: false
    };
};

org.owasp.esapi.Logger.EventType = function( sName, bNewSuccess ) {
    var type = sName;
    var success = bNewSuccess;

    return {
        isSuccess: function() {
            return success;
        },

        toString: function() {
            return type;
        }
    };
};

with(org.owasp.esapi.Logger) {

    EventType.SECURITY_SUCCESS = new EventType( "SECURITY SUCCESS", true );
    EventType.SECURITY_FAILURE = new EventType( "SECURITY FAILURE", false );
    EventType.EVENT_SUCCESS    = new EventType( "EVENT SUCCESS", true );
    EventType.EVENT_FAILURE    = new EventType( "EVENT FAILURE", false );

    OFF = Number.MAX_VALUE;
    FATAL = 1000;
    ERROR = 800;
    WARNING = 600;
    INFO = 400;
    DEBUG = 200;
    TRACE = 100;
    ALL = Number.MIN_VALUE;
}