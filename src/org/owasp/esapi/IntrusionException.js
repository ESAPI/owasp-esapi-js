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

$namespace('org.owasp.esapi');

org.owasp.esapi.IntrusionException = function(sUserMessage, sLogMessage, oCause) {
    var _super = new org.owasp.esapi.EnterpriseSecurityException(sUserMessage, sLogMessage, oCause);

    return {
        getMessage: _super.getMessage,
        getUserMessage: _super.getMessage,
        getLogMessage: _super.getLogMessage,
        getStackTrace: _super.getStackTrace,
        printStackTrace: _super.printStackTrace
    };
};