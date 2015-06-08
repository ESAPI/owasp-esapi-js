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

org.owasp.esapi.reference.validation.DateValidationRule = function( sTypeName, oEncoder, oLocale ) {
    var _super = new org.owasp.esapi.reference.validation.BaseValidationRule( sTypeName, oEncoder, oLocale );
    var _validationTarget = "Date";

    var format = DateFormat.getDateInstance();

    var safelyParse = function(sContext,sInput) {
        if ( !sContext || sContext.trim() == '' ) {
            if ( _super.isAllowNull() ) {
                return null;
            }
            _super.validationException( sContext, _validationTarget, "Required", { "context":sContext, "input":sInput, "format":format } );
        }

        var canonical = _super.getEncoder().cananicalize(sInput);

        try {
            return format.parse(canonical);
        } catch (e) {
            _super.validationException( sContext, _validationTarget, "Invalid", { "context":sContext, "input":sInput, "format":format } );
        }
    };

    return {
        setDateFormat: function(fmt) {
            if ( !fmt ) {
                throw new IllegalArgumentException("DateValidationRule.setDateFormat requires a non-null DateFormat");
            }
            format = fmt;
        },

        setAllowNull: _super.setAllowNull,

        isAllowNull: _super.isAllowNull,

        getTypeName: _super.getTypeName,

        setTypeName: _super.setTypeName,

        setEncoder: _super.setEncoder,

        getEncoder: _super.getEncoder,

        assertValid: _super.assertValid,

        getValid: _super.getValid,

        getValidInput: function( sContext, sInput ) {
            return safelyParse(sContext,sInput);
        },

        getSafe: _super.getSafe,

        sanitize: function( sContext, sInput ) {
            var date = new Date(0);
            try {
                date = safelyParse(sContext,sInput);
            } catch (e) { }
            return date;
        },

        isValid: _super.isValid,

        whitelist: _super.whitelist
    };
};
