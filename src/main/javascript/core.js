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

if (!Object.prototype.implements) {
    Object.prototype.implements = function( oClazz ) {
        for ( p in oClazz.prototype ) {
            eval("if ( !this."+p+" ) { throw new SyntaxError(oClazz.constructor.toString() + ' must implement ' + property.toString() ); }");
        }
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
        var out = this.constructor.toString() + ": " + this.getMessage() + "|||" + this.getStackTrace().join( "|||" );

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