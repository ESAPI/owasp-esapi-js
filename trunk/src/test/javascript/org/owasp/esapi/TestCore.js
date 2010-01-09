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
    assertNotNull($namespace);
    assertEvaluatesToTrue($namespace('org.owasp.esapi.testnamespace'));
}

function testESAPIInstance() {
    assertNotNull($ESAPI);
}

function testEncoderEncodeForBase64() {
    var testString = 'This is a test string';
    assertEquals($ESAPI.encoder().decodeFromBase64($ESAPI.encoder().encodeForBase64(testString)), testString);
}

function testHtmlEntityEncode() {
    assertNotNull( org.owasp.esapi.codecs.HTMLEntityCodec );
    var codec = new org.owasp.esapi.codecs.HTMLEntityCodec();
    assertEquals( "This is a &quot;test&quot;", codec.encode( [], "This is a \"test\""));
}

function testHtmlEntityDecode() {
    var codec = new org.owasp.esapi.codecs.HTMLEntityCodec();
    assertEquals( "This is a \"test\"", codec.decode( "This is a &quot;test&quot;" ));
}

function testEncoderCananocolize() {
    var testString = "This &amp; This are a test";
    assertEquals("This & This are a test", $ESAPI.encoder().cananicalize( testString ) );
}

function testEncoderEncodeForHTML() {
    var instance = $ESAPI.encoder();
    assertEquals(null, instance.encodeForHTML(null));
    assertEquals("&lt;script&gt;", instance.encodeForHTML("<script>"));
    assertEquals(",.-_ ", instance.encodeForHTML(",.-_ "));
    assertEquals("dir&amp;", instance.encodeForHTML("dir&"));
    assertEquals("one&amp;two", instance.encodeForHTML("one&two"));
}

function testGetElementById() {
    assertNotNull( $('test') );
    assertEquals( $('test').id, 'test' );
}

function testArrayEach() {
    var testArray = Array( 1, 2, 3, 4, 5, 6, 7, 8, 9 );
    assertNotNull( testArray.each );
    var answer = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9;
    var working = 0;
    testArray.each( function(num) {
        working += num;
    });
    assertEquals( answer, working );
}

function testArrayContains() {
    var testArray = Array( 1, 2, 3, 4, 5, 6, 7, 8, 9 );
    assertNotNull( testArray.contains );
    assertTrue( testArray.contains( 5 ) );
    assertFalse( testArray.contains( 12 ) );
}

function testPushbackString() {
    assertNotNull( org.owasp.esapi.codecs.PushbackString );
    var pushbackString = new org.owasp.esapi.codecs.PushbackString('Test');
    
}

function testPreparedString() {
    assertNotNull( org.owasp.esapi.PreparedString );
    var codec = new org.owasp.esapi.codecs.HTMLEntityCodec();
    var ps1 = new org.owasp.esapi.PreparedString( "Test ? is ?", codec );
    ps1.set( 1, "[]<>;\"\'PreparedString" );
    ps1.set( 2, "cool" );

    try {
        var ps2 = new org.owasp.esapi.PreparedString( "Test ? is ?", codec );
        ps2.set( 2, "cool" );
    } catch (exception) {
        fail(exception);
    }

    try {
        var ps3 = new org.owasp.esapi.PreparedString( "Test ? is ?", codec );
        ps3.set( 1, "[]<>;\"\'PreparedString" );
        ps3.set( 2, "cool" );
        ps3.set( 3, "cool" );
        fail("Was able to set parameters past the end of the parameter stack");
    } catch (exception) {
        // Success
    }

    try {
        var ps4 = new org.owasp.esapi.PreparedString( "???", codec );
        ps4.set( 1, "1" );
        ps4.set( 2, "2" );
        ps4.set( 3, "3" );
    } catch (exception) {
        fail(exception);
    }

    try {
        var ps5 = new org.owasp.esapi.PreparedString( "??x", codec );
        ps5.set( 1, "1" );
        ps5.set( 2, "2" );
    } catch (exception) {
        fail(exception);
    }
}