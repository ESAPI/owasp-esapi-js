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

org.owasp.esapi.reference.validation.BaseValidationRule = function( sTypeName, oEncoder, oLocale ) {
    var log = $ESAPI.logger( "Validation" );
    var EventType = org.owasp.esapi.Logger.EventType;

    var typename = sTypeName;
    var encoder = oEncoder?oEncoder:$ESAPI.encoder();
    var allowNull = false;

    var ResourceBundle = org.owasp.esapi.i18n.ResourceBundle;

    var locale = oLocale?oLocale:$ESAPI.locale();
    var resourceBundle;

    if ( $ESAPI.properties.validation.ResourceBundle ) {
        resourceBundle = ResourceBundle.getResourceBundle( $ESAPI.properties.validation.ResourceBundle, locale );
    }

    if ( !resourceBundle ) {
        resourceBundle = $ESAPI.resourceBundle();
        log.info( EventType.EVENT_FAILURE, "No Validation ResourceBundle - Defaulting to " + resourceBundle.getName() + "(" + resourceBundle.getLocale().toString() + ")" );
    }

    log.info( EventType.EVENT_SUCCESS, "Validation Rule Initialized with ResourceBundle: " + resourceBundle.getName() );

    return {
        setAllowNull: function(b) { allowNull = b; },

        isAllowNull: function() { return allowNull; },

        getTypeName: function() { return typename; },

        setTypeName: function(s) { typename = s; },

        setEncoder: function(oEncoder) { encoder = oEncoder; },

        getEncoder: function() { return encoder; },

        assertValid: function( sContext, sInput ) {
            this.getValid( sContext, sInput );
        },

        getValid: function( sContext, sInput, oValidationErrorList ) {
            var valid = null;
            try {
                valid = this.getValidInput( sContext, sInput );
            } catch (oValidationException) {
                return this.sanitize( sContext, sInput );
            }
            return valid;
        },

        getValidInput: function( sContext, sInput ) {
            return sInput;
        },

        getSafe: function( sContext, sInput ) {
            var valid = null;
            try {
                valid = this.getValidInput( sContext, sInput );
            } catch (oValidationException) {
                return this.sanitize( sContext, sInput );
            }
            return valid;
        },

        /**
     * The method is similar to ValidationRuile.getSafe except that it returns a
     * harmless object that <b>may or may not have any similarity to the original
     * input (in some cases you may not care)</b>. In most cases this should be the
     * same as the getSafe method only instead of throwing an exception, return
     * some default value.
     *
     * @param context
     * @param input
     * @return a parsed version of the input or a default value.
     */
        sanitize: function( sContext, sInput ) {
            return sInput;
        },

        isValid: function( sContext, sInput ) {
            var valid = false;
            try {
                this.getValidInput( sContext, sInput );
                valid = true;
            } catch (oValidationException) {
                return false;
            }
            return valid;
        },

        /**
         * Removes characters that aren't in the whitelist from the input String.
         * O(input.length) whitelist performance
         * @param input String to be sanitized
         * @param whitelist allowed characters
         * @return input stripped of all chars that aren't in the whitelist
         */
        whitelist: function( sInput, aWhitelist ) {
            var stripped = '';
            for ( var i=0;i<sInput.length;i++ ) {
                var c = sInput.charAt(i);
                if ( aWhitelist.contains(c) ) {
                    stripped += c;
                }
            }
            return stripped;
        },

        getUserMessage: function( sContext, sDefault, oContextValues ) {
            return this.getMessage( sContext+".Usr", sDefault+".Usr", oContextValues );
        },

        getLogMessage: function( sContext, sDefault, oContextValues ) {
            return this.getMessage( sContext+".Log", sDefault+".Log", oContextValues );
        },

        getMessage: function( sContext, sDefault, oContextValues ) {
            return resourceBundle.getString( sContext, oContextValues ) ? resourceBundle.getString( sContext, oContextValues ) : resourceBundle.getString( sDefault, oContextValues );
        },

        validationException: function( sContext, sDefault, sValidation, oContextValues ) {
            throw new org.owasp.esapi.reference.validation.ValidationException(
                    this.getUserMessage( sContext+"."+sValidation, sDefault+"."+sValidation, oContextValues ),
                    this.getLogMessage( sContext+"."+sValidation, sDefault+"."+sValidation, oContextValues ),
                    sContext
            );
        }
    };
};
