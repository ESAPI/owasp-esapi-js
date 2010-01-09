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

// @Module(Core)

/**
 * Creates a new empty namespace if it doesn't already exist.
 * @param name      The new namespace to create
 * @param separator The seperator for the namespace (default is .)
 * @param container The base container for the namespace (default is window)
 * @return          The namespace created
 */
var $namespace = function(name, separator, container){
  var ns = name.split(separator || '.'),
    o = container || window,
    i,
    len;
  for(i = 0, len = ns.length; i < len; i++){
    o = o[ns[i]] = o[ns[i]] || {};
  }
  return o;
};

if (!$) {
    /**
     * Shortcut to <pre>document.getElementById</pre>
     * @param sElementID
     *              The ID of the element to retrieve
     * @return HTMLObject
     */
    var $ = function( sElementID ) {
        return document.getElementById( sElementID );
    };
}

if (!Array.prototype.each) {
    /**
     * Iterator function for Arrays.
     * @param fIterator The iterator function to be executed on each element in the array.
     */
    Array.prototype.each = function(fIterator) {
        if (typeof fIterator != 'function') {
            throw 'Illegal Argument for Array.each';
        }

        for (var i = 0; i < this.length; i ++) {
            fIterator(this[i]);
        }
    };
}

if (!Array.prototype.contains) {
    /**
     * Determines whether the passed in object exists in the array.
     * @param srch The object to search for
     * @return True if the passed in object is found, false otherwise
     */
    Array.prototype.contains = function(srch) {
        this.each(function(e) {
            if (e === srch) {
                return true;
            }
        });
        return false;
    };
}

// Declare some Core Exceptions
if ( !RuntimeException ) {
    var RuntimeException = function( sMsg ) {
        var msg = sMsg;
        return {
            toString: function() { return 'RuntimeException: ' + msg; }
        };
    };
}

if ( !IllegalArgumentException ) {
    var IllegalArgumentException = function( sMsg ) {
        var msg = sMsg;
        return {
            toString: function() { return 'IllegalArgumentException: ' + msg; }
        };
    };
}

$namespace("org.owasp.esapi");

org.owasp.esapi.IntrusionException = function( sUserMessage, sLogMessage, oCause ) {
    var _userMessage = sUserMessage;
    var _logMessage  = sLogMessage;
    var _oCause      = (!oCause?null:oCause);

    return {
        getUserMessage: function() { return _userMessage; },
        getLogMessage: function() { return _logMessage; },
        getCause: function() { return _oCause; },
        toString: function() {
            return '[IntrusionException] - ' + this.getLogMessage();
        }
    };
};

$namespace('org.owasp.esapi.codecs');

org.owasp.esapi.codecs.PushbackString = function( sInput ) {
    var _input = sInput,
        _pushback = '',
        _temp = '',
        _index = 0,
        _mark = 0;

    return {
        pushback: function( c ) {
            _pushback = c;
        },

        index: function() {
            return _index;
        },

        hasNext: function() {
            if ( _pushback == null ) return true;
            return !(_input == null || _input.length == 0 || _index >= _input.length);

        },

        next: function() {
            if ( _pushback != null ) {
                var save = _pushback;
                _pushback = null;
                return save;
            }
            if ( _input == null || _input.length == 0 || _index >= _input.length ) {
                return null;
            }
            return _input.charAt(index++);
        },

        nextHex: function() {
            var c = this.next();
            if ( this.isHexDigit(c) ) return c;
            return null;
        },

        nextOctal: function() {
            var c = this.next();
            if ( this.isOctalDigit(c) ) return c;
            return null;
        },

        isHexDigit: function(c) {
            return c != null && ( ( c >= '0' && c <= '9' ) || ( c >= 'a' && c <= 'f' ) || ( c >= 'A' && c <= 'F' ) );
        },

        isOctalDigit: function(c) {
            return c != null && ( c >= '0' && c <= '7' );
        },

        peek: function(c) {
            if ( !c ) {
                if ( _pushback != null ) return _pushback;
                if ( _input == null || _input.length == 0 || _index >= _input.length ) return null;
                return _input.charAt(_index);
            } else {
                if ( _pushback != null && _pushback == c ) return true;
                if ( _input == null || _input.length == 0 || _index >= _input.length ) return false;
                return _input.charAt(_index) == c;
            }
        },

        mark: function() {
            _temp = _pushback;
            _mark = _index;
        },

        reset: function() {
            _pushback = _temp;
            _index = _mark;
        },

        remainder: function() {
            var out = _input.substr(_index);
            if ( _pushback != null ) {
                out = _pushback + out;
            }
            return out;
        }
    };
};

org.owasp.esapi.codecs.Codec = function() {
    return {
        /**
         * Encode a String so that it can be safely used in a specific context.
         *
         * @param aImmune
         *              array of immune characters
         * @param sInput
         *              the String to encode
         * @return the encoded String
         */
        encode: function( aImmune, sInput ) {
            var out = '';
            for ( var i = 0; i < sInput.length; i ++ ) {
                var c = sInput.charAt(i);
                out += this.encodeCharacter(aImmune,c);
            }
            return out;
        },

        /**
         * Default implementation that should be overridden in specific codecs.
         *
         * @param aImmune
         *              array of immune characters
         * @param c
         *              the Character to encode
         * @return
         *              the encoded Character
         */
        encodeCharacter: function( aImmune, c ) {
            return c;
        },

        /**
         * Decode a String that was encoded using the encode method in this Class
         *
         * @param sInput
         *              the String to decode
         * @return
         *              the decoded String
         */
        decode: function(sInput) {
            var out = '';
            var pbs = new org.owasp.esapi.codecs.PushbackString(sInput);
            while(pbs.hasNext()) {
                var c = decodeCharacter(pbs);
                if ( c != null ) {
                    out += c;
                } else {
                    out += pbs.next();
                }
            }
            return out;
        },

        /**
         * Returns the decoded version of the next character from the input string and advances the
         * current character in the PushbackString.  If the current character is not encoded, this
         * method MUST reset the PushbackString.
         *
         * @param oPushbackString the Character to decode
         * @return the decoded Character
         */
        decodeCharacter: function(oPushbackString) {
            return oPushbackString.next();
        }
    };
};

/**
 * DOMUtilities is a collection of helper methods for accessing the DOM. This is primarily for use between ESAPI
 * objects, however is accessible to code outside of the ESAPI. While fairly limited, it provides simple shortcut
 * methods to common DOM functions.
 *
 * @author  Chris Schmidt (chrisisbeef@gmail.com)
 * @since   ESAPI 1.0
 */
org.owasp.esapi.DOMUtilities = function() {

};

org.owasp.esapi.Base64 = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function(sInput) {
        if (!sInput) {
            return null;
        }

        var out = '';
        var ch1,ch2,ch3,enc1,enc2,enc3,enc4;
        var i = 0;

        var input = this._utf8_encode(sInput);

        while (i < input.length) {
            ch1 = input.charCodeAt(i++);
            ch2 = input.charCodeAt(i++);
            ch3 = input.charCodeAt(i++);

            enc1 = ch1 >> 2;
            enc2 = ((ch1 & 3) << 4) | (ch2 >> 4);
            enc3 = ((ch2 & 15) << 2) | (ch3 >> 6);
            enc4 = ch3 & 63;

            if (isNaN(ch2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(ch3)) {
                enc4 = 64;
            }

            out += this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }

        return out;
    },

    decode: function(sInput) {
        if (!sInput) {
            return null;
        }

        var out = '';
        var ch1, ch2, ch3, enc1, enc2, enc3, enc4;
        var i = 0;

        var input = sInput.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while ( i < input.length ) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            ch1 = (enc1 << 2) | (enc2 >> 4);
            ch2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            ch3 = ((enc3 & 3) << 6) | enc4;

            out += String.fromCharCode(ch1);
            if ( enc3 != 64 ) {
                out += String.fromCharCode(ch2);
            }
            if ( enc4 != 64 ) {
                out += String.fromCharCode(ch3);
            }
        }

        out = this._utf8_decode(out);
        return out;
    },

    _utf8_encode: function(sInput) {
        var input = sInput.replace(/\r\n/g, "\n");
        var utftext = '';

        for (var n = 0; n < input.length; n ++) {
            var c = input.charCodeAt(n);

            if ( c < 128 ) {
                utftext += String.fromCharCode(c);
            }
            else if (( c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) |128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    },

    _utf8_decode: function(sInput) {
        var out = '';
        var i = c = c1 = c2 = 0;

        while ( i < sInput.length ) {
            c = sInput.charCodeAt(i);

            if (c < 128) {
                out += String.fromCharCode(c);
                i ++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = sInput.charCodeAt(i+1);
                out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
            }
        }

        return out;
    }
};

org.owasp.esapi.Encoder = function( aCodecs ) {
    var _codecs = [],
        _htmlCodec = new org.owasp.esapi.codecs.Codec(),
        _percentCodec = new org.owasp.esapi.codecs.Codec(),
        _javascriptCodec = new org.owasp.esapi.codecs.Codec(),
        _cssCodec = new org.owasp.esapi.codecs.Codec();

    if ( !aCodecs ) {
        _codecs.push( _htmlCodec );
        _codecs.push( _percentCodec );
        _codecs.push( _javascriptCodec );
    } else {
        _codecs = aCodecs;
    }

    return {
        cananicalize: function( sInput, bStrict ) {
            if ( !sInput ) {
                return null;
            }

            var working = sInput, codecFound = null, mixedCount = 1, foundCount = 0, clean = false;
            while (!clean) {
                clean = true;

                _codecs.each(function(codec) {
                    var old = working;
                    working = codec.decode(working);
                    if (!old == working ) {
                        if ( codecFound != null && codecFound != codec ) {
                            mixedCount ++;
                        }
                        codecFound = codec;
                        if ( clean ) {
                            foundCount ++;
                        }
                        clean = false;
                    }
                });
            }

            if ( foundCount >= 2 && mixedCount > 1 ) {
                if ( bStrict ) {
                    throw new org.owasp.esapi.IntrusionException( "Input validation failure", "Multiple (" + foundCount + "x) and mixed encoding (" + mixedCount + "x) detected in " + sInput );
                }
            }
            else if ( foundCount >= 2 ) {
                if ( bStrict ) {
                    throw new org.owasp.esapi.IntrusionException( "Input validation failure", "Multiple (" + foundCount + "x) encoding detected in " + sInput );
                }
            }
            else if ( mixedCount > 1 ) {
                if ( bStrict ) {
                    throw new org.owasp.esapi.IntrusionException( "Input validation failure", "Mixed (" + mixedCount + "x) encoding detected in " + sInput );
                }
            }
            return working;
        },

        normalize: function( sInput ) {
            return sInput.replace( /[^\\p{ASCII}]/g, '' );
        },

        encodeForHTML: function( sInput ) {
            return !sInput ? null : _htmlCodec.encode( org.owasp.esapi.Encoder.IMMUNE_HTML, sInput );
        },

        decodeForHTML: function( sInput ) {
            return !sInput ? null : _htmlCodec.decode( sInput );
        },

        encodeForHTMLAttribute: function( sInput ) {
            return !sInput ? null : _htmlCodec.encode( org.owasp.esapi.Encoder.IMMUNE_HTMLATTR, sInput );
        },

        encodeForCSS: function( sInput ) {
            return !sInput ? null : _cssCodec.encode( org.owasp.esapi.Encoder.IMMUNE_CSS, sInput );
        },

        encodeForJavascript: function( sInput ) {
            return !sInput ? null : _javascriptCodec.encode( org.owasp.esapi.Encoder.IMMUNE_JAVASCRIPT, sInput );
        },

        encodeForURL: function( sInput ) {
            return !sInput ? null : escape(sInput);
        },

        decodeFromURL: function( sInput ) {
            return !sInput ? null : unescape(this.cananicalize(sInput));
        },

        encodeForBase64: function( sInput ) {
            return !sInput ? null : org.owasp.esapi.Base64.encode(sInput);
        },

        decodeFromBase64: function( sInput ) {
            return !sInput ? null : org.owasp.esapi.Base64.decode(sInput);
        }
    };
};

org.owasp.esapi.ESAPI = function() {
    var _encoder = new org.owasp.esapi.Encoder();

    return {
        encoder: function() {
            return _encoder;
        }
    };
};

org.owasp.esapi.ESAPI.$instance = new org.owasp.esapi.ESAPI();

var $ESAPI = org.owasp.esapi.ESAPI.$instance;

org.owasp.esapi.PreparedString = function( sTemplate, oCodec, sParameterCharacter ) {
    // Private Scope
    var parts = [];
    var parameters = [];

    function split( s ) {
        var idx = 0, pcount = 0;
        for ( var i = 0; i < s.length; i ++ ) {
            if ( s.charAt(i) == sParameterCharacter ) {
                pcount ++;
                parts.push( s.substr( index, i ) );
                index = i + 1;
            }
        }
        parts.push( s.substr(index));
        parameters = new Array(pcount);
    };

    if ( !sParameterCharacter ) {
        sParameterCharacter = '?';
    }

    split( sTemplate );

    return {
        set: function( iIndex, sValue, codec ) {
            if ( iIndex < 1 || index > parameters.length ) {
                throw new IllegalArgumentException( "Attempt to set parameter: " + iIndex + " on a PreparedString with only " + parameters.length + " placeholders" );
            }
            if ( !codec ) {
                codec = oCodec;
            }
            parameters[iIndex-1] = codec.encode( [], sValue );;
        },

        toString: function() {
            for ( var ix = 0; ix < parameters.length; ix ++ ) {
                if ( parameters[ix] == null ) {
                    throw new RuntimeException( "Attempt to render PreparedString without setting parameter " + (ix+1) );
                }
            }
            var out = '', i = 0;
            for ( var p = 0; p < parts.length; p ++ ) {
                out += parts[p];
                if ( i < parameters.length ) {
                    out += parameters[i++];
                }
            }
            return out;
        }
    };
};

org.owasp.esapi.StringUtilities = function() {

};
