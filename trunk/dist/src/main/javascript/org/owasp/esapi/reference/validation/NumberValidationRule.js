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

org.owasp.esapi.reference.validation.NumberValidationRule = function( sTypeName, oEncoder, oLocale, fMinValue, fMaxValue ) {
    var _super = new org.owasp.esapi.reference.validation.BaseValidationRule( sTypeName, oEncoder, oLocale );
    var _validationTarget = 'Number';

    var minValue = fMinValue?fMinValue:Number.MIN_VALUE;
    var maxValue = fMaxValue?fMaxValue:Number.MAX_VALUE;

    if ( minValue >= maxValue ) throw new IllegalArgumentException("MinValue must be less that MaxValue");

    var safelyParse = function( sContext, sInput ) {
        if ( !sInput || sInput.trim() == '' ) {
            if ( _super.isAllowNull() ) {
                return null;
            }
            _super.validationException( sContext, _validationTarget, "Required", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
        }

        var canonical = _super.getEncoder().cananicalize( sInput );

        var f = 0.0;
        try {
            f = parseFloat( canonical );
        } catch (e) {
            _super.validationException( sContext, _validationTarget, "Invalid", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
        }

        if ( f == 'NaN' ) {
            _super.validationException( sContext, _validationTarget, "NaN", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
        }
        if ( f < minValue ) {
            _super.validationException( sContext, _validationTarget, "MinValue", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
        }
        if ( f > maxValue ) {
            _super.validationException( sContext, _validationTarget, "MaxValue", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
        }
        return f;
    };

    return {
        setMinValue: function(n) { minValue = n; },

        getMinValue: function() { return minValue; },

        setMaxValue: function(n) { maxValue = n; },

        getMaxValue: function() { return maxValue; },

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
            var n = 0;
            try {
                n = safelyParse(sContext,sInput);
            } catch (e) { }
            return n;
        },

        isValid: _super.isValid,

        whitelist: _super.whitelist
    };
};
