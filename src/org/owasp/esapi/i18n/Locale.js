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

org.owasp.esapi.i18n.Locale = function( sLanguage, sCountry, sVariant ) {
    var language = sLanguage, country = sCountry, variant = sVariant;

    return {
        getLanguage: function() { return language; },
        getCountry: function() { return country; },
        getVariant: function() { return variant; },
        toString: function() { return language + ( country ? "-" + country + ( variant ? "-" + variant : "" ) : "" ); }
    };
};

org.owasp.esapi.i18n.Locale.US = new org.owasp.esapi.i18n.Locale("en","US");
org.owasp.esapi.i18n.Locale.GB = new org.owasp.esapi.i18n.Locale("en","GB");

org.owasp.esapi.i18n.Locale.getLocale = function(sLocale) {
    var l = sLocale.split("-");
    return new org.owasp.esapi.i18n.Locale( l[0], (l.length>1?l[1]:""), (l.length>2?l.length[2]:""));
};

org.owasp.esapi.i18n.Locale.getDefault = function() {
    var l = (navigator['language']?navigator['language']:(navigator['userLanguage']?navigator['userLanguage']:'en-US')).split("-");
    return new org.owasp.esapi.i18n.Locale( l[0], (l.length>1?l[1]:""), (l.length>2?l.length[2]:""));
};
