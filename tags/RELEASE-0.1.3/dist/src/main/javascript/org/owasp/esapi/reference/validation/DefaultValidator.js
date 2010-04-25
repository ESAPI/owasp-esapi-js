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

org.owasp.esapi.reference.validation.DefaultValidator = function( oEncoder, oLocale ) {
    var rules = Array();
    var encoder = oEncoder?oEncoder:$ESAPI.encoder();
    var locale = oLocale?oLocale:org.owasp.esapi.i18n.Locale.getDefault();

    var p = org.owasp.esapi.reference.validation;

    return {
        addRule: function( oValidationRule ) {
            rules[oValidationRule.getName()] = oValidationRule;
        },

        getRule: function( sName ) {
            return rules[sName];
        },

        isValidInput: function( sContext, sInput, sType, nMaxLength, bAllowNull ) {
            try {
                this.getValidInput( sContext, sInput, sType, nMaxLength, bAllowNull );
                return true;
            } catch (e) {
                return false;
            }
        },

        getValidInput: function( sContext, sInput, sType, nMaxLength, bAllowNull, oValidationErrorList ) {
            var rvr = new org.owasp.esapi.reference.validation.StringValidationRule( sType, encoder, locale );
            var p = new RegExp($ESAPI.properties.validation[sType]);
            if ( p && p instanceof RegExp ) {
                rvr.addWhitelistPattern( p );
            } else {
                throw new IllegalArgumentException("Invalid Type: " + sType + " not found.");
            }
            rvr.setMaxLength( nMaxLength );
            rvr.setAllowNull( bAllowNull );

            try {
                return rvr.getValid(sContext,sInput);
            } catch (e) {
                if ( e instanceof p.ValidationErrorList && oValidationErrorList ) {
                    oValidationErrorList.addError( sContext, e );
                }
                throw e;
            }
        },

        isValidDate: function( sContext, sInput, oDateFormat, bAllowNull ) {
            try {
                this.getValidDate( sContext, sInput, oDateFormat, bAllowNull );
                return true;
            } catch (e) {
                return false;
            }
        },

        getValidDate: function( sContext, sInput, oDateFormat, bAllowNull, oValidationErrorList ) {
            var dvr = new p.DateValidationRule( sContext, encoder, locale );
            dvr.setAllowNull( bAllowNull );
            dvr.setDateFormat(oDateFormat);
            try {
                return dvr.getValid( sContext, sInput );
            } catch (e) {
                if ( e instanceof p.ValidationErrorList && oValidationErrorList ) {
                    oValidationErrorList.addError( sContext, e );
                }
                throw e;
            }
        },

        getValidCreditCard: function( sContext, sInput, bAllowNull, oValidationErrorList ) {
            var ccr = new p.CreditCardValidationRule( sContext, encoder, locale );
            ccr.setAllowNull(bAllowNull);

            try {
                return ccr.getValid(sContext,sInput);
            } catch (e) {
                if ( e instanceof p.ValidationErrorList && oValidationErrorList ) {
                    oValidationErrorList.addError( sContext, e );
                }
                throw e;
            }
        },

        isValidCreditCard: function( sContext, sInput, bAllowNull ) {
            try {
                this.getValidCreditCard( sContext,sInput,bAllowNull );
                return true;
            } catch (e) {
                return false;
            }
        },

        getValidNumber: function( sContext, sInput, bAllowNull, nMinValue, nMaxValue, oValidationErrorList ) {
            var nvr = new p.NumberValidationRule( sContext, encoder, locale, nMinValue, nMaxValue );
            nvr.setAllowNull(bAllowNull);

            try {
                return nvr.getValid(sContext, sInput);
            } catch(e) {
                if ( e instanceof p.ValidationErrorList && oValidationErrorList ) {
                    oValidationErrorList.addError( sContext, e );
                }
                throw e;
            }
        },

        isValidNumber: function( sContext, sInput, bAllowNull, nMinValue, nMaxValue ) {
            try {
                this.getValidNumber(sContext,sInput,bAllowNull,nMinValue,nMaxValue);
                return true;
            } catch (e) {
                return false;
            }
        },

        getValidInteger: function( sContext, sInput, bAllowNull, nMinValue, nMaxValue, oValidationErrorList ) {
            var nvr = new p.IntegerValidationRule( sContext, encoder, locale, nMinValue, nMaxValue );
            nvr.setAllowNull(bAllowNull);

            try {
                return nvr.getValid(sContext, sInput);
            } catch(e) {
                if ( e instanceof p.ValidationErrorList && oValidationErrorList ) {
                    oValidationErrorList.addError( sContext, e );
                }
                throw e;
            }
        },

        isValidInteger: function( sContext, sInput, bAllowNull, nMinValue, nMaxValue ) {
            try {
                this.getValidInteger(sContext,sInput,bAllowNull,nMinValue,nMaxValue);
                return true;
            } catch (e) {
                return false;
            }
        }
    };
};
