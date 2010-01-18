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

$namespace('org.owasp.esapi.i18n');

org.owasp.esapi.i18n.ResourceBundle = function( sName, oLocale, oParentResourceBundle ) {
    var parent = oParentResourceBundle;
    var locale = oLocale;
    var name = sName;

    if ( !name ) throw new SyntaxError("Name required for implementations of org.owasp.esapi.i18n.ResourceBundle");
    if ( !locale ) throw new SyntaxError("Locale required for implementations of org.owasp.esapi.i18n.ResourceBundle");

    return {
        getParent: function() { return parent; },
        getLocale: function() { return locale; },
        getName: function() { return name; },
        getMessage: function(sKey) { return sKey; },
        getString: function( sKey, oContextMap ) {
            if ( arguments.length < 1 ) {
                throw new IllegalArgumentException("No key passed to getString");
            }

            var msg = this.getMessage(sKey);
            if ( !msg ) {
                if ( parent ) {
                    return parent.getString( sKey, oContextMap );
                } else {
                    return sKey;
                }
            }

            if ( !msg.match( /\{([A-Za-z]+)\}/ ) || !oContextMap ) {
                return msg;
            }

            var out = '', lastIndex = 0;
            while (true) {
                var nextVarIdx = msg.indexOf( "{", lastIndex );
                var endIndex = msg.indexOf( "}", nextVarIdx );

                if ( nextVarIdx < 0 ) {
                    out += msg.substr( lastIndex, msg.length-lastIndex );
                    break;
                }

                if ( nextVarIdx >= 0 && endIndex < -1 ) {
                    throw new SyntaxError("Invalid Message - Unclosed Context Reference: " + msg );
                }

                out += msg.substring( lastIndex, nextVarIdx );
                var contextKey = msg.substring( nextVarIdx+1, endIndex );
                if ( oContextMap[contextKey] ) {
                    out += oContextMap[contextKey];
                } else {
                    out += msg.substring( nextVarIdx, endIndex+1 );
                }

                lastIndex = endIndex + 1;
            }

            return out;
        }
    };
};

org.owasp.esapi.i18n.ResourceBundle.getResourceBundle = function(sResource, oLocale) {
    var classname = sResource + "_" + oLocale.toString().replace("-","_");

    with( org.owasp.esapi.i18n ) {
        if ( ResourceBundle[classname] instanceof Object ) {
            return ResourceBundle[classname];
        } else {
            return new ResourceBundle[classname]();
        }
    }
};

with(org.owasp.esapi.i18n) {
    messages = {
        "Test"                              : "This is test #{testnumber}",
        "CreditCard.Required.Usr"           : "{context}: Input credit card required",
        "CreditCard.Required.Log"           : "Input credit card required: context={context}, input={input}",
        "CreditCard.Invalid.Usr"            : "{context}: Invalid credit card input",
        "CreditCard.Invalid.Log"            : "Invalid credit card input: context={context}, input={input}",
        "Date.Required.Usr"                 : "{context}: Input date required in {format} format",
        "Date.Required.Log"                 : "Date required: context={context}, input={input}, format={format}",
        "Date.Invalid.Usr"                  : "{context}: Invalid date, please use {format} format",
        "Date.Invalid.Log"                  : "Invalid date: context={context}, input={input}, format={format}",
        "Integer.Required.Usr"              : "{context}: Input number required",
        "Integer.Required.Log"              : "Input number required: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "Integer.NaN.Usr"                   : "{context}: Invalid number",
        "Integer.NaN.Log"                   : "Invalid number: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "Integer.MinValue.Usr"              : "{context}: Invalid number - Must be greater than {minValue}",
        "Integer.MinValue.Log"              : "Invalid number: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "Integer.MaxValue.Usr"              : "{context}: Invalid number - Must be less than {maxValue}",
        "Integer.MaxValue.Log"              : "Invalid number: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "Number.Required.Usr"               : "{context}: Input number required",
        "Number.Required.Log"               : "Input number required: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "Number.NaN.Usr"                    : "{context}: Invalid number",
        "Number.NaN.Log"                    : "Invalid number: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "Number.MinValue.Usr"               : "{context}: Invalid number - Must be greater than {minValue}",
        "Number.MinValue.Log"               : "Invalid number: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "Number.MaxValue.Usr"               : "{context}: Invalid number - Must be less than {maxValue}",
        "Number.MaxValue.Log"               : "Invalid number: context={context}, input={input}, minValue={minValue}, maxValue={maxValue}",
        "String.Required.Usr"               : "{context}: Input required",
        "String.Required.Log"               : "Input required: context={context}, input={input}, original={orig}",
        "String.Whitelist.Usr"              : "{context}: Invalid input - Conform to regex {pattern}",
        "String.Whitelist.Log"              : "Invalid input - Whitelist validation failed: context={context}, input={input}, original={orig}, pattern={pattern}",
        "String.Blacklist.Usr"              : "{context}: Invalid input - Dangerous input matching {pattern} detected",
        "String.Blacklist.Log"              : "Invalid input - Blacklist validation failed: context={context}, input={input}, original={orig}, pattern={pattern}",
        "String.MinLength.Usr"              : "{context}: Invalid input - Minimum length is {minLength}",
        "String.MinLength.Log"              : "Invalid input - Too short: context={context}, input={input}, original={orig}, minLength={minLength}",
        "String.MaxLength.Usr"              : "{context}: Invalid input - Maximum length is {maxLength}",
        "String.MaxLength.Log"              : "Invalid input - Too long: context={context}, input={input}, original={orig}, maxLength={maxLength}"
    };

    ResourceBundle.ESAPI_Standard = "ESAPI_Standard";
    ResourceBundle.ESAPI_Standard_en_US = new ArrayResourceBundle( 'ESAPI Standard Messaging - US English', Locale.US, messages );
}