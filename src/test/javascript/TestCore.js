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

function testStringEndswith() {
    assertTrue( "Test".endsWith("t"));
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

function testEncoderCananocolizeWithMultipleEncodings() {
    var testString = "%3CThis &amp; This are a test";
    try {
        $ESAPI.encoder().cananicalize( testString );
        fail( "Encoder.cananocolize() did not enforce strict mode" );
    } catch (e) {
        // Success
    }
}

function testEncoderNormalize() {
    var testString = '�Test String';
    assertEquals( "Test String", $ESAPI.encoder().normalize( testString ) );
}

function testEncoderEncodeForHTML() {
    var instance = $ESAPI.encoder();
    assertEquals(null, instance.encodeForHTML(null));
    assertEquals("&lt;script&gt;", instance.encodeForHTML("<script>"));
    assertEquals(",.-_ ", instance.encodeForHTML(",.-_ "));
    assertEquals("dir&amp;", instance.encodeForHTML("dir&"));
    assertEquals("one&amp;two", instance.encodeForHTML("one&two"));
}

function testEncoderEncoderFormHTMLAttribute() {
    var instance = $ESAPI.encoder();
    assertEquals(null, instance.encodeForHTMLAttribute(null));
    assertEquals("&lt;script&gt;", instance.encodeForHTMLAttribute("<script>"));
    assertEquals(",.-_", instance.encodeForHTMLAttribute(",.-_"));
    assertEquals(" &#x21;&#x40;&#x24;&#x25;&#x28;&#x29;&#x3d;&#x2b;&#x7b;&#x7d;&#x5b;&#x5d;", instance.encodeForHTMLAttribute(" !@$%()=+{}[]"));
}

function testEncoderEncodeForCSS() {
    var instance = $ESAPI.encoder();
    assertEquals(null, instance.encodeForCSS(null));
    assertEquals("\\3c script\\3e ", instance.encodeForCSS("<script>"));
    assertEquals("\\21 \\40 \\24 \\25 \\28 \\29 \\3d \\2b \\7b \\7d \\5b \\5d ", instance.encodeForCSS("!@$%()=+{}[]"));
}

function testEncoderEncodeForJavascript() {
    var instance = $ESAPI.encoder();
    assertEquals(null, instance.encodeForJavaScript(null));
    assertEquals("\\x3Cscript\\x3E", instance.encodeForJavaScript("<script>"));
    assertEquals(",.\\x2D_\\x20", instance.encodeForJavaScript(",.-_ "));
    assertEquals("\\x21\\x40\\x24\\x25\\x28\\x29\\x3D\\x2B\\x7B\\x7D\\x5B\\x5D", instance.encodeForJavaScript("!@$%()=+{}[]"));
}

function testEncoderEncodeForURL() {
    var instance = $ESAPI.encoder();
    assertEquals(null, instance.encodeForURL(null));
    assertEquals("%3Cscript%3E", instance.encodeForURL("<script>"));
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

function testJavascriptCodecEncode() {
    var codec = new org.owasp.esapi.codecs.JavascriptCodec();
    assertEquals( "\\x3C", codec.encode( new Array(), "<" ) );
}

function testJavascriptCodecDecode() {
    var codec = new org.owasp.esapi.codecs.JavascriptCodec();
    assertEquals( "<", codec.decode( "\\x3C" ) );
}

function testCSSCodecEncode() {
    var codec = new org.owasp.esapi.codecs.CSSCodec();
    assertEquals( "\\3c ", codec.encode( new Array(), "<" ) );
}

function testCSSCodecDecode() {
    var codec = new org.owasp.esapi.codecs.CSSCodec();
    assertEquals( "<", codec.decode( "\\3c" ) );    
}

function testPercentCodecEncode() {
    var codec = new org.owasp.esapi.codecs.PercentCodec();
    assertEquals( "%3C", codec.encode( new Array(), "<" ) );
}

function testPercentCodecDecode() {
    var codec = new org.owasp.esapi.codecs.PercentCodec();
    assertEquals( "<", codec.decode( "%3C" ) );
}

function testStringCharCodeAt() {
    assertEquals( parseInt("3c",16), "<test>".charCodeAt(0) );
}
