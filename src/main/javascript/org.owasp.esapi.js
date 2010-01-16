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
$require('$ESAPI_Properties');

org.owasp.esapi = {
    Encoder: function() {

    },

    EnterpriseSecurityException: function(sUserMessage, sLogMessage, oException) {
        var _logMessage = sLogMessage;
        var _super = new Exception(sUserMessage, oException);

        return {
            getMessage: _super.getMessage(),
            getUserMessage: _super.getMessage,
            getLogMessage: function() {
                return _logMessage;
            },
            getStackTrace: _super.getStackTrace,
            printStackTrace: _super.printStackTrace
        };
    },

    HTTPUtilities: function() {
        return {
            addCookie: false,
            getSessionID: false,
            getCookie: false,
            killAllCookies: false,
            killCookie: false,
            logHTTPRequest: false,
            sendForward: false,
            getRequestParameter: false
        };
    },

    IntrusionException: function(sUserMessage, sLogMessage, oCause) {
        var _super = new org.owasp.esapi.EnterpriseSecurityException(sUserMessage, sLogMessage, oCause);

        return {
            getMessage: _super.getMessage,
            getUserMessage: _super.getMessage,
            getLogMessage: _super.getLogMessage,
            getStackTrace: _super.getStackTrace,
            printStackTrace: _super.printStackTrace
        };
    },

    LogFactory: function() {
        return {
            getLogger: false
        };
    },

    Logger: {
        EventType: function( sName, bNewSuccess ) {
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
        },

        OFF: Number.MAX_VALUE,
        FATAL: 1000,
        ERROR: 800,
        WARNING: 600,
        INFO: 400,
        DEBUG: 200,
        TRACE: 100,
        ALL: Number.MIN_VALUE,

        prototype: {
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
        }
    },

    PreparedString: function(sTemplate, oCodec, sParameterCharacter) {
        // Private Scope
        var parts = [];
        var parameters = [];

        function split(s) {
            var idx = 0, pcount = 0;
            for (var i = 0; i < s.length; i ++) {
                if (s.charAt(i) == sParameterCharacter) {
                    pcount ++;
                    parts.push(s.substr(idx, i));
                    idx = i + 1;
                }
            }
            parts.push(s.substr(idx));
            parameters = new Array(pcount);
        }

        ;

        if (!sParameterCharacter) {
            sParameterCharacter = '?';
        }

        split(sTemplate);

        return {
            set: function(iIndex, sValue, codec) {
                if (iIndex < 1 || iIndex > parameters.length) {
                    throw new IllegalArgumentException("Attempt to set parameter: " + iIndex + " on a PreparedString with only " + parameters.length + " placeholders");
                }
                if (!codec) {
                    codec = oCodec;
                }
                parameters[iIndex - 1] = codec.encode([], sValue);
            },

            toString: function() {
                for (var ix = 0; ix < parameters.length; ix ++) {
                    if (parameters[ix] == null) {
                        throw new RuntimeException("Attempt to render PreparedString without setting parameter " + (ix + 1));
                    }
                }
                var out = '', i = 0;
                for (var p = 0; p < parts.length; p ++) {
                    out += parts[p];
                    if (i < parameters.length) {
                        out += parameters[i++];
                    }
                }
                return out;
            }
        };
    },

    ValidationErrorList: function() {
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
    },

    ValidationRule: function() {
        return {
            getValid: false,
            setAllowNull: false,
            getTypeName: false,
            setTypeName: false,
            setEncoder: false,
            assertValid: false,
            getValid: false,
            getSafe: false,
            isValid: false,
            whitelist: false
        };
    },

    Validator: function() {
        return {
            addRule: false,
            getRule: false,
            getValidInput: false,
            isValidDate: false,
            getValidDate: false,
            isValidSafeHTML: false,
            getValidSafeHTML: false,
            isValidCreditCard: false,
            getValidCreditCard: false,
            isValidFilename: false,
            getValidFilename: false,
            isValidNumber: false,
            getValidNumber: false,
            isValidPrintable: false,
            getValidPrintable: false
        };
    },

    ESAPI: function() {
        var _properties = $ESAPI_Properties;

        var _encoder = null;
        var _validator = null;
        var _logFactory = null;

        return {
            properties: _properties,

            encoder: function() {
                $require(_properties.encoder.Implementation);
                if (!_encoder) {
                    eval('_encoder = new ' + _properties.encoder.Implementation + '();');
                }
                return _encoder;
            },

            logFactory: function() {
                eval('$require('+_properties.logging.Implementation+');');
                if ( !_logFactory ) {
                    eval("_logFactory = new " + _properties.logging.Implementation + "();" );
                }
                return _logFactory;
            },

            logger: function(sModuleName) {
                return this.logFactory().getLogger(sModuleName);
            },

            validator: function() {
                $require(_properties.validation.Implementation);
                if (_validator == null) {
                    eval('_validator = new ' + _properties.validation.Implementation + '();');
                }
                return _validator;
            }
        };
    }
};

var $ESAPI = null;

var ESAPI_Initialize = function() {
    $ESAPI = new org.owasp.esapi.ESAPI();
};