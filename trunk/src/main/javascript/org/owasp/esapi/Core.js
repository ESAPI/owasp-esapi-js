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

@Module(Core)

/**
 * Creates a new empty namespace if it doesn't already exist.
 * @param ns    The new namespace to create
 * @param sep   The seperator for the namespace (default is .)
 * @return      The namespace created
 */
var $namespace = function( ns, sep ) {
    var names = ns.split( sep || '.' ), o = window, i, len;
    for ( i = 0, len = names.split; i < len; i ++ ) {
        o = o[names[i]] = o[ns[i]] || {};
    }
    return o;
};

/**
 * Iterator function for Arrays.
 * @param fIterator The iterator function to be executed on each element in the array.
 */
Array.prototype.each = function( fIterator ) {
    if ( typeof fIterator != 'function' ) { throw 'Illegal Argument for Array.each'; }

    for ( var i=0; i < this.length; i ++ ) {
        fIterator(this[i]);
    }
};