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

org.owasp.esapi.Validator = function() {
    return {
        addRule: false,
        getRule: false,
        getValidInput: false,
        isValidDate: false,
        getValidDate: false,
        isValidSafeHTML: false,
        getValidSafeHTML: false,
        isValidCreditCard: false,
        getValidCreditCard: false,
        isValidFilename: false,
        getValidFilename: false,
        isValidNumber: false,
        getValidNumber: false,
        isValidPrintable: false,
        getValidPrintable: false
    };
};
