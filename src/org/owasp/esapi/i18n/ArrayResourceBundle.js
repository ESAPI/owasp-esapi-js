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

org.owasp.esapi.i18n.ArrayResourceBundle = function( sName, oLocale, aMessages, oParent ) {
    with(org.owasp.esapi.i18n) var _super = new ResourceBundle( sName, oLocale, oParent );

    var messages = aMessages;

    return {
        getParent: _super.getParent,
        getLocale: _super.getLocale,
        getName: _super.getName,
        getString: _super.getString,
        getMessage: function(sKey) {
            return messages[sKey];
        }
    };
};
