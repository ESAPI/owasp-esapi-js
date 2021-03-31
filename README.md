# DEPRECATED - OWASP Enterprise Security API for JavaScript (ESAPI-JS)

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

This file is part of the Open Web Application Security Project (OWASP)
Enterprise Security API (ESAPI) project. For details, please see
[https://owasp.org/www-project-enterprise-security-api/](https://owasp.org/www-project-enterprise-security-api/).

Copyright (c) 2008 - The OWASP Foundation

The ESAPI is published by OWASP under the BSD license. You should read and accept the
LICENSE before you use, modify, and/or redistribute this software.


## WARNING: This project is deprecated and unmaintainted. Use at your own risk.
This project is no longer supported. It is known to be potentially affected by a
vulnerability in 'bower' (specifically, CVE-2019-5484). This vulnerability could
be addressed by upgrading ESAPI-JS to use bower 1.8.8 or later, however this has
been tried and resulted in deployment problems when using NPM. See the ensuing
discussion for [PR#29](https://github.com/ESAPI/owasp-esapi-js/pull/29) for
details.

### Potential Alternatives to ESAPI-JS (aka, ESAPI4JS)
* [node-esapi](https://github.com/ESAPI/node-esapi/) - a minimal port of ESAPI-JS' output encoder
  that does not depend on bower and as of this writing (2021-03-30), has no
  known vulnerabilities. It does not include the validator or other portions of ESAPI-JS.
* [DOMPurify](https://github.com/cure53/DOMPurify/) - a DOM-only, XSS sanitizer for HTML, MathML, and SVG.
* Lots of additional alternatives if your project is not pure JavaScript.

### Looking for Maintainers
If you would like to support project, please contact one or both of the ESAPI project
leaders listed on the [OWASP ESAPI wiki page](https://owasp.org/www-project-enterprise-security-api/).
They can unarchive it for you.

## Installation Instructions

```
$ npm install --save-dev ESAPI-JS
```

### Installation:
1. Download the distribution zip from http://owasp-esapi-js.googlecode.com
2. Unzip the distribution zip
3. Create a directory on your server, under the web root called esapi4js
4. Copy either esapi.js or esapi-compressed.js from dist/ to your esapi4js directory
5. Create a lib directory under the esapi4js called lib and copy the contents of dist/lib to that directory
6. Create a resources directory under the esapi4js called resources and copy the contents of dist/resources to that directory

## Quick Start:

	<!-- esapi4js dependencies --><script type="text/javascript" language="JavaScript" src="{your_installation_path}/esapi4js/lib/log4js.js"></script>
	<!-- esapi4js i18n resources -->
	<script type="text/javascript" language="JavaScript" src="{your_installation_path}/esapi4js/resources/i18n/ESAPI_Standard_en_US.properties.js"></script>
	<!-- esapi4js configuration -->
	<script type="text/javascript" language="JavaScript" src="{your_installation_path}/esapi4js/resources/Base.esapi.properties.js"></script>
	<!-- esapi4js core -->
	<script type="text/javascript" language="JavaScript" src="{your_installation_path}/esapi4js/esapi.js"></script>

	<script type="text/javascript" language="JavaScript">
	    // Set any custom configuration options here or in an external js file that gets sourced in above.
	    Base.esapi.properties.logging['ApplicationLogger'] = {
	        Level: org.owasp.esapi.Logger.ALL,
    	    Appenders: [ new Log4js.ConsoleAppender() ],
	        LogUrl: true,
	        LogApplicationName: true,
	        EncodingRequired: true
	    };

    Base.esapi.properties.application.Name = "My Application v1.0";

    // Initialize the api
    org.owasp.esapi.ESAPI.initialize();

    // Using the logger
    $ESAPI.logger().getLogger('ApplicationLogger').info(org.owasp.esapi.Logger.EventType.EVENT_SUCCESS, 'This is a test message');

    // Using the encoder
    document.writeln( $ESAPI.encoder().encodeForHTML( "<a href=\"http://owasp-esapi-js.googlecode.com\">Check out esapi4js</a>" ) );

    // Using the validator
    var validateCreditCard = function() {
        return $ESAPI.validator().isValidCreditCard( $('CreditCard').value );
    }
	</script>`


## License

BSD
