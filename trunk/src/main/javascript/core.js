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

// Utility and Core API Methods
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

var $require = function( sPackage ) {
    if ( !eval(sPackage) ) {
        throw new RuntimeException( sPackage + " required, but does not exist in the document." );
    }
};

if (!$) {
    var $ = function( sElementID ) {
        return document.getElementById( sElementID );
    };
}

if (!Array.prototype.each) {
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
    Array.prototype.contains = function(srch) {
        var found = false;
        this.each(function(e) {
            if ( ( srch.equals && srch.equals(e) ) || e == srch) {
                found = true;
                return;
            }
        });
        return found;
    };
}

if (!Array.prototype.containsKey) {
    Array.prototype.containsKey = function(srch) {
        for ( var key in this ) {
            if ( key.toLowerCase() == srch.toLowerCase() ) {
                return true;
            }
        }
        return false;
    };
}

if (!Array.prototype.getCaseInsensitive) {
    Array.prototype.getCaseInsensitive = function(key) {
        for (var k in this) {
            if (k.toLowerCase() == key.toLowerCase()) {
                return this[k];
            }
        }
        return null;
    };
}

if (!String.prototype.charCodeAt) {
    String.prototype.charCodeAt = function( idx ) {
        var c = this.charAt(idx);
        for ( var i=0;i<65536;i++) {
            var s = String.fromCharCode(i);
            if ( s == c ) { return i; }
        }
        return 0;
    };
}
             
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function( test ) {
        return this.substr( ( this.length - test.length ), test.length ) == test;
    };
}

// Declare Core Exceptions
if ( !Exception ) {
    var Exception = function( sMsg, oException ) {
        this.cause = oException;
        this.errorMessage = sMsg;
    };

    Exception.prototype = Error.prototype;

    Exception.prototype.getCause = function() { return this.cause; };

    Exception.prototype.getMessage = function() { return this.message; };

    /**
     * This method creates the stacktrace for the Exception only when it is called the first time and
     * caches it for access after that. Since building a stacktrace is a fairly expensive process, we
     * only want to do it if it is called.
     */
    Exception.prototype.getStackTrace = function() {
        if ( this.callstack ) {
            return this.callstack;
        }

        if ( this.stack ) { // Mozilla
            var lines = stack.split("\n");
            for ( var i=0, len=lines.length; i<len; i ++ ) {
                if ( lines[i].match( /^\s*[A-Za-z0-9\=+\$]+\(/ ) ) {
                    this.callstack.push(lines[i]);
                }
            }
            this.callstack.shift();
            return this.callstack;
        }
        else if ( window.opera && this.message ) { // Opera
            var lines = this.message.split('\n');
            for ( var i=0, len=lines.length; i<len; i++ ) {
                if ( lines[i].match( /^\s*[A-Za-z0-9\=+\$]+\(/ ) ) {
                    var entry = lines[i];
                    if ( lines[i+1] ) {
                        entry += " at " + lines[i+1];
                        i++;
                    }
                    this.callstack.push(entry);
                }
            }
            this.callstack.shift();
            return this.callstack;
        }
        else { // IE and Safari
            var currentFunction = arguments.callee.caller;
            while ( currentFunction ) {
                var fn = currentFunction.toString();
                var fname = fn.substring(fn.indexOf("function")+8,fn.indexOf("(")) || "anonymous";
                this.callstack.push(fname);
                currentFunction = currentFunction.caller;
            }
            return this.callstack;
        }
    };

    Exception.prototype.printStackTrace = function( writer ) {
        var out = this.getMessage() + "|||" + this.getStackTrace().join( "|||" );

        if ( this.cause ) {
            if ( this.cause.printStackTrace ) {
                out += "||||||Caused by " + this.cause.printStackTrace().replace( "\n", "|||" );
            }
        }

        if ( !writer ) {
            return writer.replace( "|||", "\n" );
        } else if ( writer.value ) {
            writer.value = out.replace( "|||", "\n" );
        } else if ( writer.writeln ) {
            writer.writeln( out.replace( "|||", "\n" ) );
        } else if ( writer.innerHTML ) {
            writer.innerHTML = out.replace( "|||", "<br/>" );
        } else if ( writer.innerText ) {
            writer.innerText = out.replace( "|||", "<br/>" );
        } else if ( writer.append ) {
            writer.append( out.replace( "|||", "\n" ) );
        } else if ( writer instanceof Function ) {
            writer(out.replace( "|||", "\n" ) );
        }
    };
}

if ( !RuntimeException ) {
    var RuntimeException = {};
    RuntimeException.prototype = Exception.prototype;
}

if ( !IllegalArgumentException ) {
    var IllegalArgumentException = {};
    IllegalArgumentException.prototype = Exception.prototype;
}

if ( !DateFormat ) {
    // Based on http://jacwright.com/projects/javascript/date_format
    var DateFormat = function( sFmt ) {

        var fmt = sFmt;

        var replaceChars = {
            longMonths: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            longDays: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
            shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],

            // Day
            d: function(date) { return (date.getDate() < 10 ? '0' : '') + date.getDate(); },
            D: function(date) { return replaceChars.shortDays[date.getDay()]; },
            j: function(date) { return date.getDate(); },
            l: function(date) { return replaceChars.longDays[date.getDay()]; },
            N: function(date) { return date.getDay() + 1; },
            S: function(date) { return (date.getDate() % 10 == 1 && date.getDate() != 11 ? 'st' : (date.getDate() % 10 == 2 && date.getDate() != 12 ? 'nd' : (date.getDate() % 10 == 3 && date.getDate() != 13 ? 'rd' : 'th'))); },
            w: function(date) { return date.getDay(); },
            z: function(date) { return "Not Yet Supported"; },
            // Week
            W: function(date) { return "Not Yet Supported"; },
            // Month
            F: function(date) { return replaceChars.longMonths[date.getMonth()]; },
            m: function(date) { return (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1); },
            M: function(date) { return replaceChars.shortMonths[date.getMonth()]; },
            n: function(date) { return date.getMonth() + 1; },
            t: function(date) { return "Not Yet Supported"; },
            // Year
            L: function(date) { return (((date.getFullYear()%4==0)&&(date.getFullYear()%100 != 0)) || (date.getFullYear()%400==0)) ? '1' : '0'; },
            o: function(date) { return "Not Supported"; },
            Y: function(date) { return date.getFullYear(); },
            y: function(date) { return ('' + date.getFullYear()).substr(2); },
            // Time
            a: function(date) { return date.getHours() < 12 ? 'am' : 'pm'; },
            A: function(date) { return date.getHours() < 12 ? 'AM' : 'PM'; },
            B: function(date) { return "Not Yet Supported"; },
            g: function(date) { return date.getHours() % 12 || 12; },
            G: function(date) { return date.getHours(); },
            h: function(date) { return ((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12); },
            H: function(date) { return (date.getHours() < 10 ? '0' : '') + date.getHours(); },
            i: function(date) { return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(); },
            s: function(date) { return (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(); },
            // Timezone
            e: function(date) { return "Not Yet Supported"; },
            I: function(date) { return "Not Supported"; },
            O: function(date) { return (-date.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(date.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(date.getTimezoneOffset() / 60)) + '00'; },
            P: function(date) { return (-date.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(date.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(date.getTimezoneOffset() / 60)) + ':' + (Math.abs(date.getTimezoneOffset() % 60) < 10 ? '0' : '') + (Math.abs(date.getTimezoneOffset() % 60)); },
            T: function(date) { var m = date.getMonth(); date.setMonth(0); var result = date.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); date.setMonth(m); return result;},
            Z: function(date) { return -date.getTimezoneOffset() * 60; },
            // Full Date/Time
            c: function(date) { return date.format("Y-m-d") + "T" + date.format("H:i:sP"); },
            r: function(date) { return date.toString(); },
            U: function(date) { return date.getTime() / 1000; }
        };


        return {
            format: function(oDate) {
                var out = '';
                for(var i=0;i<fmt.length;i++) {
                    var c = fmt.charAt(i);
                    if ( replaceChars[c] ) {
                        out += replaceChars[c].call(oDate);
                    } else {
                        out += c;
                    }
                }
                return out;
            }
        };
    };

    DateFormat.getDateInstance = function() {
        return new DateFormat("M/d/y h:i a");
    };
}

if ( !StringFormatter ) {
    var StringFormatter = {
        init : function () {

            if (typeof arguments == "undefined") { return null; }
            if (arguments.length < 1) { return null; }
            if (typeof arguments[0] != "string") { return null; }
            if (typeof RegExp == "undefined") { return null; }

            var string = arguments[0];
            var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
            var matches = new Array();
            var strings = new Array();
            var convCount = 0;
            var stringPosStart = 0;
            var stringPosEnd = 0;
            var matchPosEnd = 0;
            var newString = '';
            var match = null;

            while (match = exp.exec(string)) {
                if (match[9]) { convCount += 1; }

                stringPosStart = matchPosEnd;
                stringPosEnd = exp.lastIndex - match[0].length;
                strings[strings.length] = string.substring(stringPosStart, stringPosEnd);

                matchPosEnd = exp.lastIndex;
                matches[matches.length] = {
                    match: match[0],
                    left: match[3] ? true : false,
                    sign: match[4] || '',
                    pad: match[5] || ' ',
                    min: match[6] || 0,
                    precision: match[8],
                    code: match[9] || '%',
                    negative: parseInt(arguments[convCount]) < 0 ? true : false,
                    argument: String(arguments[convCount])
                };
            }
            strings[strings.length] = string.substring(matchPosEnd);

            if (matches.length == 0) { return string; }
            if ((arguments.length - 1) < convCount) { return null; }

            var code = null;
            var match = null;
            var i = null;

            for (i=0; i<matches.length; i++) {

                if (matches[i].code == '%') { substitution = '%' }
                else if (matches[i].code == 'b') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                    substitution = StringFormatter.convert(matches[i], true);
                }
                else if (matches[i].code == 'c') {
                    matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
                    substitution = StringFormatter.convert(matches[i], true);
                }
                else if (matches[i].code == 'd') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                    substitution = StringFormatter.convert(matches[i]);
                }
                else if (matches[i].code == 'f') {
                    matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
                    substitution = StringFormatter.convert(matches[i]);
                }
                else if (matches[i].code == 'o') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                    substitution = StringFormatter.convert(matches[i]);
                }
                else if (matches[i].code == 's') {
                    matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
                    substitution = StringFormatter.convert(matches[i], true);
                }
                else if (matches[i].code == 'x') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                    substitution = StringFormatter.convert(matches[i]);
                }
                else if (matches[i].code == 'X') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                    substitution = StringFormatter.convert(matches[i]).toUpperCase();
                }
                else {
                    substitution = matches[i].match;
                }

                newString += strings[i];
                newString += substitution;

            }
            newString += strings[i];

            return newString;

        },

        convert : function(match, nosign){
            if (nosign) {
                match.sign = '';
            } else {
                match.sign = match.negative ? '-' : match.sign;
            }
            var l = match.min - match.argument.length + 1 - match.sign.length;
            var pad = new Array(l < 0 ? 0 : l).join(match.pad);
            if (!match.left) {
                if (match.pad == "0" || nosign) {
                    return match.sign + pad + match.argument;
                } else {
                    return pad + match.sign + match.argument;
                }
            } else {
                if (match.pad == "0" || nosign) {
                    return match.sign + match.argument + pad.replace(/0/g, ' ');
                } else {
                    return match.sign + match.argument + pad;
                }
            }
        }
    };

    String.format = StringFormatter.init;
}
