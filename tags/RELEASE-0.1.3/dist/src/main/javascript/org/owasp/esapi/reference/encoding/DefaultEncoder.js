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

$namespace('org.owasp.esapi.reference.encoding');

org.owasp.esapi.reference.encoding.DefaultEncoder = function(aCodecs) {
    var _codecs = [],
            _htmlCodec = new org.owasp.esapi.codecs.HTMLEntityCodec(),
            _javascriptCodec = new org.owasp.esapi.codecs.JavascriptCodec(),
            _cssCodec = new org.owasp.esapi.codecs.CSSCodec(),
            _percentCodec = new org.owasp.esapi.codecs.PercentCodec();

    if (!aCodecs) {
        _codecs.push(_htmlCodec);
        _codecs.push(_javascriptCodec);
        _codecs.push(_cssCodec);
        _codecs.push(_percentCodec);
    } else {
        _codecs = aCodecs;
    }

    var IMMUNE_HTML = new Array(',', '.', '-', '_', ' ');
    var IMMUNE_HTMLATTR = new Array(',', '.', '-', '_');
    var IMMUNE_CSS = new Array();
    var IMMUNE_JAVASCRIPT = new Array(',', '.', '_');

    return {
        cananicalize: function(sInput, bStrict) {
            if (!sInput) {
                return null;
            }
            var working = sInput, codecFound = null, mixedCount = 1, foundCount = 0, clean = false;
            while (!clean) {
                clean = true;

                _codecs.each(function(codec) {
                    var old = working;
                    working = codec.decode(working);

                    if (old != working) {
                        if (codecFound != null && codecFound != codec) {
                            mixedCount ++;
                        }
                        codecFound = codec;
                        if (clean) {
                            foundCount ++;
                        }
                        clean = false;
                    }
                });
            }

            if (foundCount >= 2 && mixedCount > 1) {
                if (bStrict) {
                    throw new org.owasp.esapi.IntrusionException("Input validation failure", "Multiple (" + foundCount + "x) and mixed encoding (" + mixedCount + "x) detected in " + sInput);
                }
            }
            else if (foundCount >= 2) {
                if (bStrict) {
                    throw new org.owasp.esapi.IntrusionException("Input validation failure", "Multiple (" + foundCount + "x) encoding detected in " + sInput);
                }
            }
            else if (mixedCount > 1) {
                    if (bStrict) {
                        throw new org.owasp.esapi.IntrusionException("Input validation failure", "Mixed (" + mixedCount + "x) encoding detected in " + sInput);
                    }
                }
            return working;
        },

        normalize: function(sInput) {
            return sInput.replace(/[^\x00-\x7F]/g, '');
        },

        encodeForHTML: function(sInput) {
            return !sInput ? null : _htmlCodec.encode(IMMUNE_HTML, sInput);
        },

        decodeForHTML: function(sInput) {
            return !sInput ? null : _htmlCodec.decode(sInput);
        },

        encodeForHTMLAttribute: function(sInput) {
            return !sInput ? null : _htmlCodec.encode(IMMUNE_HTMLATTR, sInput);
        },

        encodeForCSS: function(sInput) {
            return !sInput ? null : _cssCodec.encode(IMMUNE_CSS, sInput);
        },

        encodeForJavaScript: function(sInput) {
            return !sInput ? null : _javascriptCodec.encode(IMMUNE_JAVASCRIPT, sInput);
        },

        encodeForJavascript: this.encodeForJavaScript,

        encodeForURL: function(sInput) {
            return !sInput ? null : escape(sInput);
        },

        decodeFromURL: function(sInput) {
            return !sInput ? null : unescape(sInput);
        },

        encodeForBase64: function(sInput) {
            return !sInput ? null : org.owasp.esapi.codecs.Base64.encode(sInput);
        },

        decodeFromBase64: function(sInput) {
            return !sInput ? null : org.owasp.esapi.codecs.Base64.decode(sInput);
        }
    };
};
