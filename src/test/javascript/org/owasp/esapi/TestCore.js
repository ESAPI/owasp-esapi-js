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
function testNamespace() {
    assertNotNull( $namespace );
    assertEvaluatesToTrue( $namespace( 'org.owasp.esapi.testnamespace' ) );
}

function testESAPIInstance() {
    assertNotNull( $ESAPI );
}

function testEncodeForBase64() {
    var testString = 'This is a test string';
    assertEquals( $ESAPI.encoder().decodeFromBase64( $ESAPI.encoder().encodeForBase64( testString ) ), testString );
}