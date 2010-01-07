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

$namespace('org.owasp.esapi');

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

org.owasp.esapi.ESAPI = function() {

};

org.owasp.esapi.PreparedString = function() {
    /* private */

    /**
     * This is the placeholder that will be used to mark a parameter
     */
    var ch_parameterCharacter = '?';

    /**
     * The {@link org.owasp.esapi.Codec} that will be used to encode values for parameters passed in
     */
    var o_codec = null;

    /**
     * A working list of parameters
     */
    var a_s_parameters = [];

    var a_parts = [];

    
};

org.owasp.esapi.StringUtilities = function() {

};
