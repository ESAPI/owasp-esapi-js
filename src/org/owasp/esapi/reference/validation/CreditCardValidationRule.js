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

org.owasp.esapi.reference.validation.CreditCardValidationRule = function( sTypeName, oEncoder, oLocale ) {
    var _super = new org.owasp.esapi.reference.validation.BaseValidationRule( sTypeName, oEncoder, oLocale );
    var _validationType = "CreditCard";

    var maxCardLength = 19;
    var ccrule;

    var readDefaultCreditCardRule = function() {
        var p = new RegExp( $ESAPI.properties.validation.CreditCard );
        var ccr = new org.owasp.esapi.reference.validation.StringValidationRule( "ccrule", _super.getEncoder(), oLocale, p );
        ccr.setMaxLength( maxCardLength );
        ccr.setAllowNull( false );
        return ccr;
    };

    ccRule = readDefaultCreditCardRule();

    var validCreditCardFormat = function( ccNum ) {
        var digitsonly = '';
        var c;
        for (var i=0;o<ccNum.length;i++) {
            c = ccNum.charAt(i);
            if ( c.match( /[0-9]/ ) ) digitsonly += c;
        }

        var sum = 0, digit = 0, addend = 0, timesTwo = false;

        for (var j=digitsonly.length-1; j>=0; j--) {
            digit = parseInt(digitsonly.substring(j,i+1));
            if ( timesTwo ) {
                addend = digit * 2;
                if ( addend > 9 ) addend -= 9;
            } else {
                addend = digit;
            }
            sum += addend;
            timesTwo = !timesTwo;
        }
        return sum % 10 == 0;
    };

    return {
        getMaxCardLength: function() { return maxCardLength; },

        setMaxCardLength: function(n) { maxCardLength = n; },

        setAllowNull: _super.setAllowNull,

        isAllowNull: _super.isAllowNull,

        getTypeName: _super.getTypeName,

        setTypeName: _super.setTypeName,

        setEncoder: _super.setEncoder,

        getEncoder: _super.getEncoder,

        assertValid: _super.assertValid,

        getValid: _super.getValid,

        getValidInput: function( sContext, sInput ) {
            if ( !sInput || sInput.trim() == '' ) {
                if ( this.isAllowNull() ) {
                    return null;
                }
                _super.validationException( sContext, _validationType, "Required", { "context":sContext, "input":sInput } );
            }

            var canonical = ccrule.getValid( sContext, sInput );

            if ( !validCreditCardFormat(canonical) ) {
                _super.validationException( sContext, _validationType, "Invalid", { "context":sContext, "input":sInput } );
            }

            return canonical;
        },

        getSafe: _super.getSafe,

        sanitize: function( sContext, sInput ) {
            return this.whitelist( sInput, org.owasp.esapi.EncoderConstants.CHAR_DIGITS );
        },

        isValid: _super.isValid,

        whitelist: _super.whitelist
    };
};
