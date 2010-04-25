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

org.owasp.esapi.PreparedString = function(sTemplate, oCodec, sParameterCharacter) {
    // Private Scope
    var parts = [];
    var parameters = [];

    function split(s) {
        var idx = 0, pcount = 0;
        for (var i = 0; i < s.length; i ++) {
            if (s.charAt(i) == sParameterCharacter) {
                pcount ++;
                parts.push(s.substr(idx, i));
                idx = i + 1;
            }
        }
        parts.push(s.substr(idx));
        parameters = new Array(pcount);
    }

    ;

    if (!sParameterCharacter) {
        sParameterCharacter = '?';
    }

    split(sTemplate);

    return {
        set: function(iIndex, sValue, codec) {
            if (iIndex < 1 || iIndex > parameters.length) {
                throw new IllegalArgumentException("Attempt to set parameter: " + iIndex + " on a PreparedString with only " + parameters.length + " placeholders");
            }
            if (!codec) {
                codec = oCodec;
            }
            parameters[iIndex - 1] = codec.encode([], sValue);
        },

        toString: function() {
            for (var ix = 0; ix < parameters.length; ix ++) {
                if (parameters[ix] == null) {
                    throw new RuntimeException("Attempt to render PreparedString without setting parameter " + (ix + 1));
                }
            }
            var out = '', i = 0;
            for (var p = 0; p < parts.length; p ++) {
                out += parts[p];
                if (i < parameters.length) {
                    out += parameters[i++];
                }
            }
            return out;
        }
    };
};
