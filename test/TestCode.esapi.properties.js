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

// Override the default settings to enable info level logging
Base.esapi.properties.logging = {
    Implementation: org.owasp.esapi.reference.logging.Log4JSLogFactory,
    Level: org.owasp.esapi.Logger.INFO,
    Appenders: [ new Log4js.ConsoleAppender() ],
    LogApplicationName: true,
    EncodingRequired: true
};

Base.esapi.properties.logging["TestLogger"] = {
    Level: org.owasp.esapi.Logger.ALL,
    Appenders: [ new Log4js.ConsoleAppender() ],
    LogUrl: true,
    LogApplicationName: true,
    EncodingRequired: true
};

Base.esapi.properties.application.Name = 'OWASP ESAPI4JS Test Application';