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

org.owasp.esapi.reference.validation.StringValidationRule = function( sTypeName, oEncoder, oLocale, sWhiteListPattern ) {
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
};
