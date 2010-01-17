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

$namespace('org.owasp.esapi.reference.logging');

org.owasp.esapi.reference.logging = {
    Log4JSLogFactory: function() {
        var loggersMap = Array();

        var Log4JSLogger = function( sModuleName ) {
            var jsLogger = null;
            var moduleName = null;
            var Level = Log4js.Level;

            jsLogger = Log4js.getLogger( moduleName );

            var convertESAPILevel = function( nLevel ) {
                var Logger = org.owasp.esapi.Logger;
                switch (nLevel) {
                    case Logger.OFF:        return Log4js.Level.OFF;
                    case Logger.FATAL:      return Log4js.Level.FATAL;
                    case Logger.ERROR:      return Log4js.Level.ERROR;
                    case Logger.WARNING:    return Log4js.Level.WARN;
                    case Logger.INFO:       return Log4js.Level.INFO;
                    case Logger.DEBUG:      return Log4js.Level.DEBUG;
                    case Logger.TRACE:      return Log4js.Level.TRACE;
                    case Logger.ALL:        return Log4js.Level.ALL;
                }
            };

            return {
                setLevel: function( nLevel ) {
                    try {
                        jsLogger.setLevel( convertESAPILevel( nLevel ) );
                    } catch (e) {
                        this.error( org.owasp.esapi.Logger.SECURITY_FAILURE, "", e );
                    }
                },

                trace: function( oEventType, sMessage, oException ) {
                    this.log( Level.TRACE, oEventType, sMessage, oException );
                },

                debug: function( oEventType, sMessage, oException ) {
                    this.log( Level.DEBUG, oEventType, sMessage, oException );
                },

                info: function( oEventType, sMessage, oException ) {
                    this.log( Level.INFO, oEventType, sMessage, oException );
                },

                warning: function( oEventType, sMessage, oException ) {
                    this.log( Level.WARN, oEventType, sMessage, oException );
                },

                error: function( oEventType, sMessage, oException ) {
                    this.log( Level.ERROR, oEventType, sMessage, oException );
                },

                fatal: function( oEventType, sMessage, oException ) {
                    this.log( Level.FATAL, oEventType, sMessage, oException );
                },

                log: function( oLevel, oEventType, sMessage, oException ) {
                    switch(oLevel) {
                        case Level.TRACE:       if ( !jsLogger.isTraceEnabled() ) { return; } break;
                        case Level.DEBUG:       if ( !jsLogger.isDebugEnabled() ) { return; } break;
                        case Level.INFO:        if ( !jsLogger.isInfoEnabled()  ) { return; } break;
                        case Level.WARNING:     if ( !jsLogger.isWarnEnabled()  ) { return; } break;
                        case Level.ERROR:       if ( !jsLogger.isErrorEnabled() ) { return; } break;
                        case Level.FATAL:       if ( !jsLogger.isFatalEnabled() ) { return; } break;
                    }

                    if ( !sMessage ) {
                        sMessage = "";
                    }

                    var clean = sMessage.replace("\n","_").replace("\r","_");
                    if ( $ESAPI.properties.logging.EncodingRequired ) {
                        clean = $ESAPI.encoder().encodeForHTML(clean);
                        if ( clean != sMessage) {
                            clean += " [Encoded]";
                        }
                    }

                    var appInfo =   ( $ESAPI.properties.logging.LogUrl ? window.location.href : "" ) +
                                    ( $ESAPI.properties.logging.LogApplicationName ? "/" + $ESAPI.properties.logging.ApplicationName : "" );

                    jsLogger.log( oLevel, appInfo != "" ? "[" + appInfo + "] " : "" + clean, oException );
                },

                addAppender: function( oAppender ) {
                    jsLogger.addAppender( oAppender );
                },

                isDebugEnabled: function()   { return jsLogger.isDebugEnabled(); },
                isErrorEnabled: function()   { return jsLogger.isErrorEnabled(); },
                isFatalEnabled: function()   { return jsLogger.isFatalEnabled(); },
                isInfoEnabled: function()    { return jsLogger.isInfoEnabled(); },
                isTraceEnabled: function()   { return jsLogger.isTraceEnabled(); },
                isWarningEnabled: function() { return jsLogger.isWarnEnabled(); }
            };
        };

        return {
            getLogger: function ( moduleName ) {
                var key = ( typeof moduleName == 'string' ) ? moduleName : moduleName.constructor.toString();
                var logger = loggersMap[key];
                if ( !logger ) {
                    logger = new Log4JSLogger(key);

                    if ( Log4js.config && Log4js.config[moduleName] ) {
                        eval("logger.setLevel( Log4js.config[moduleName].level?Log4js.config[moduleName].level:"+$ESAPI.properties.logging.Level+");");
                        if ( Log4js.config[moduleName].appenders ) {
                            Log4js.config[moduleName].appenders.each(function(e){
                                logger.addAppender(e);
                            });
                        }
                    } else {
                        eval('logger.setLevel( '+$ESAPI.properties.logging.Level+' );');
                        $ESAPI.properties.logging.Appenders.each(function(e){
                            logger.addAppender(e);
                        });
                    }

                    loggersMap[key] = logger;
                }
                return logger;
            }
        };
    }
};