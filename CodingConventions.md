# Project Layout #
```
 + <root>
   - documentation ( Project Documentation )
   + src
     + main
       + javascript ( ESAPI4JS Source Files )
       + resources ( Resources for the Java Build Process )
     + test
       + javascript ( ESAPI4JS JSUnit Tests )
       + resources ( Resources for the Java Build Process Unit Tests )
```

# Build Information #
The ESAPI4JS Build Process is powered by PHP and PHP >= 5.1.3 is required to build the project.

# Code Style #
**1. Every file must start with the copyright notice.**
```
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
```

**2. Every class must be it's own file**

**3. Every class must be namespaced correctly**
```
$namespace('org.owasp.esapi');
```

**4. Class definitions should be wrapped in Closures to preserve private and public scoping**

**5. Documentation is required for packages, classes, and public methods.**