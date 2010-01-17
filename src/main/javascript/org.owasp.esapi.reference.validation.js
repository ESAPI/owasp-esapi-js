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

org.owasp.esapi.reference.validation = {

    /**
     * A ValidationRule performs syntax and possibly semantic validation of a single
     * piece of data from an untrusted source.
     *
     * @author Chris Schmidt (chrisisbeef@gmail.com)
     * @since Jan 16, 2010
     * @see org.owasp.esapi.Validator
     */
    BaseValidationRule: function( sTypeName, oEncoder, oLocale ) {
        var log = $ESAPI.logger( "Validation" );

        var typename = sTypeName;
        var encoder = oEncoder?oEncoder:$ESAPI.encoder();
        var allowNull = false;

        var ResourceBundle = org.owasp.esapi.i18n.ResourceBundle;

        var locale = oLocale?oLocale:org.owasp.esapi.i18n.Locale.getDefault();
        var resourceBundle;
        try {
            resourceBundle = ResourceBundle.getResourceBundle( "Validation", locale );
        } catch (e) {
            log.info( "No Validation ResourceBundle - Defaulting to ESAPI Standard en-US" );
        }

        if ( !resourceBundle ) {
            resourceBundle = ResourceBundle.getResourceBundle( ResourceBundle.ESAPI_Standard, org.owasp.esapi.i18n.Locale.US );
        }

        log.info( "Validation Rule Initialized with ResourceBundle: " + resourceBundle.getName() );

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
    },

    CreditCardValidationRule: function( sTypeName, oEncoder, oLocale ) {
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
    },

    DateValidationRule: function( sTypeName, oEncoder, oLocale ) {
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
    },

    IntegerValidationRule: function( sTypeName, oEncoder, oLocale, nMinValue, nMaxValue ) {
        var _super = new org.owasp.esapi.reference.validation.BaseValidationRule( sTypeName, oEncoder, oLocale );
        var _validationTarget = "Integer";

        var minValue = nMinValue?nMinValue:Number.MIN_VALUE;
        var maxValue = nMaxValue?nMaxValue:Number.MAX_VALUE;

        if ( minValue >= maxValue ) {
            throw new IllegalArgumentException( "minValue must be less than maxValue" );
        }

        var safelyParse = function(sContext,sInput) {
            if ( !sInput || sInput.trim() == '' ) {
                if ( _super.allowNull() ) {
                    return null;
                }
                _super.validationException( sContext, _validationTarget, "Required", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
            }

            var canonical = _super.getEncoder().cananicalize(sInput);

            var n = parseInt(canonical);
            var e = new Exception('test'); var st = ''; e.printStackTrace(st); alert(st);
            if ( n == 'NaN' ) {
                _super.validationException( sContext, _validationTarget, "NaN", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
            }
            if ( n < minValue ) {
                _super.validationException( sContext, _validationTarget, "MinValue", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
            }
            if ( n > maxValue ) {
                _super.validationException( sContext, _validationTarget, "MaxValue", { "context":sContext, "input":sInput, "minValue":minValue, "maxValue":maxValue } );
            }
            return n;
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
    },

    NumberValidationRule: function( sTypeName, oEncoder, oLocale, fMinValue, fMaxValue ) {
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
    },

    StringValidationRule: function( sTypeName, oEncoder, oLocale, sWhiteListPattern ) {
        var _super = new org.owasp.esapi.reference.validation.BaseValidationRule( sTypeName, oEncoder, oLocale );
        var _validationTarget = 'String';

        var whitelistPatterns = Array();
        var blacklistPatterns = Array();
        var minLength = 0;
        var maxLength = Number.MAX_VALUE;
        var validateInputAndCanonical = true;

        if ( sWhiteListPattern ) {
            if ( sWhiteListPattern instanceof String ) {
                whitelistPatterns.push( new RegExp(sWhiteListPattern) );
            } else if ( sWhiteListPattern instanceof RegExp ) {
                whitelistPatterns.push( sWhiteListPattern );
            } else {
                throw new IllegalArgumentException("sWhiteListPattern must be a string containing RegExp or a RegExp Object");
            }
        }

        var checkWhitelist = function( sContext, sInput, sOrig ) {
            whitelistPatterns.each(function(p){
                if ( sInput.match(p) ) {
                    _super.validationException( sContext, _validationTarget, "Whitelist", { "context":sContext, "input":sInput, "orig":sOrig, "pattern":p.toString(), "minLength":minLength, "maxLength":maxLength, "validateInputAndCanonical":validateInputAndCanonical } );
                }
            });
        };

        var checkBlacklist = function( sContext, sInput, sOrig ) {
            blacklistPatterns.each(function(p){
                if ( sInput.match(p) ) {
                    _super.validationException( sContext, _validationTarget, "Blacklist", { "context":sContext, "input":sInput, "orig":sOrig, "pattern":p.toString(), "minLength":minLength, "maxLength":maxLength, "validateInputAndCanonical":validateInputAndCanonical } );
                }
            });
        };

        var checkLength = function( sContext, sInput, sOrig ) {
            if ( sInput.length < minLength ) {
                _super.validationException( sContext, _validationTarget, "MinLength", { "context":sContext, "input":sInput, "orig":sOrig, "minLength":minLength, "maxLength":maxLength, "validateInputAndCanonical":validateInputAndCanonical } );
            }
            if ( sInput.length > maxLength ) {
                _super.validationException( sContext, _validationTarget, "MaxLength", { "context":sContext, "input":sInput, "orig":sOrig, "minLength":minLength, "maxLength":maxLength, "validateInputAndCanonical":validateInputAndCanonical } );
            }
            return sInput;
        };

        var checkEmpty = function( sContext, sInput, sOrig ) {
            if ( !sInput || sInput.trim() == '' ) {
                if ( _super.isAllowNull() ) {
                    return null;
                }
                _super.validationException( sContext, _validationTarget, "Required", { "context":sContext, "input":sInput, "orig":sOrig, "minLength":minLength, "maxLength":maxLength, "validateInputAndCanonical":validateInputAndCanonical } );
            }
        };

        return {
            addWhitelistPattern: function(p) {
                if ( p instanceof String ) {
                    whitelistPatterns.push( new RegExp(p) );
                } else if ( p instanceof RegExp ) {
                    whitelistPatterns.push(p);
                } else {
                    throw new IllegalArgumentException("p must be a string containing RegExp or a RegExp Object");
                }
            },

            addBlacklistPattern: function(p) {
                if ( p instanceof String ) {
                    blacklistPatterns.push( new RegExp(p) );
                } else if ( p instanceof RegExp ) {
                    blacklistPatterns.push(p);
                } else {
                    throw new IllegalArgumentException("p must be a string containing RegExp or a RegExp Object");
                }
            },

            setMinLength: function(n) { minLength = n; },

            getMinLength: function() { return minLength; },

            setMaxLength: function(n) { maxLength = n; },

            getMaxLength: function() { return maxLength; },

            setValidateInputAndCanonical: function(b) { validateInputAndCanonical = b; },

            isValidateInputAndCanonical: function() { return validateInputAndCanonical; },

            setAllowNull: _super.setAllowNull,

            isAllowNull: _super.isAllowNull,

            getTypeName: _super.getTypeName,

            setTypeName: _super.setTypeName,

            setEncoder: _super.setEncoder,

            getEncoder: _super.getEncoder,

            assertValid: _super.assertValid,

            getValid: _super.getValid,

            getValidInput: function( sContext, sInput ) {
                var canonical = null;

                if ( checkEmpty( sContext, sInput ) == null ) {
                    return null;
                }

                if ( validateInputAndCanonical ) {
                    checkLength(sContext, sInput);
                    checkWhitelist(sContext,sInput);
                    checkBlacklist(sContext,sInput);
                }

                canonical = this.getEncoder().cananicalize(sInput);

                if ( checkEmpty( sContext, canonical, sInput ) == null ) {
                    return null;
                }

                checkLength( sContext, canonical, sInput );
                checkWhitelist( sContext, canonical, sInput );
                checkBlacklist( sContext, canonical, sInput );

                return canonical;
            },

            getSafe: _super.getSafe,

            sanitize: function( sContext, sInput ) {
                return this.whitelist( sInput, org.owasp.esapi.EncoderConstants.CHAR_ALNUM );
            },

            isValid: _super.isValid,

            whitelist: _super.whitelist
        };
    },

    ValidationException: function( sUserMessage, sLogMessage ) {
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
    },

    DefaultValidator: function( oEncoder, oLocale ) {
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
                var rvr = new p.StringValidationRule( sType, encoder, locale );
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
    }
};
