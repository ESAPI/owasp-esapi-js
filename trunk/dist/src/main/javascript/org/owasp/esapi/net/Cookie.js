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

$namespace('org.owasp.esapi.net');

/**
 * Constructs a cookie with a specified name and value.
 * <p/>
 * The name must conform to RFC 2109. That means it can contain only ASCII alphanumeric characters and cannot contain
 * commas, semicolons, or white space or begin with a $ character. The cookie's name cannot be changed after creation.
 * <p/>
 * The value can be anything the server chooses to send. Its value is probably of interest only to the server. The
 * cookie's value can be changed after creation with the setValue method.
 * <p/>
 * By default, cookies are created according to the Netscape cookie specification. The version can be changed with the
 * {@link #setVersion} method.
 *
 * @constructor
 * @param sName {String} a <code>String</code> specifying the name of the cookie
 * @param sValue {String} a <code>String</code> specifying the value of the cookie
 * @throws  IllegalArgumentException
 *          if the cookie name contains illegal characters (for example, a comma, space, or semicolon) or it is one of
 *          the tokens reserved for use by the cookie protocol
 */
org.owasp.esapi.net.Cookie = function( sName, sValue ) {
    var name;       // NAME= ... "$Name" style is reserved
    var value;      // value of NAME

    var comment;    // ;Comment=VALUE ... describes the cookies use
    var domain;     // ;Domain=VALUE ... domain that sees the cookie
    var maxAge;     // ;Max-Age=VALUE ... cookies auto-expire
    var path;       // ;Path=VALUE ... URLs that see the cookie
    var secure;     // ;Secure ... e.g. use SSL
    var version;    // ;Version=1 ... means RFC-2109++ style

    var _resourceBundle = $ESAPI.resourceBundle();

    var tSpecials = ",; ";

    var isToken = function(sValue) {
        for(var i=0,len=sValue.length;i<len;i++) {
            var cc = sValue.charCodeAt(i),c=sValue.charAt(i);
            if (cc<0x20||cc>=0x7F||tSpecials.indexOf(c)!=-1) {
                return false;
            }
        }
        return true;
    };

    if ( !isToken(sName)
            || sName.toLowerCase() == 'comment'
            || sName.toLowerCase() == 'discard'
            || sName.toLowerCase() == 'domain'
            || sName.toLowerCase() == 'expires'
            || sName.toLowerCase() == 'max-age'
            || sName.toLowerCase() == 'path'
            || sName.toLowerCase() == 'secure'
            || sName.toLowerCase() == 'version'
            || sName.charAt(0) == '$' ) {
        var errMsg = _resourceBundle.getString( "Cookie.Name", { 'name':sName } );
        throw new IllegalArgumentException(errMsg);
    }

    name = sName;
    value = sValue;

    return {
        setComment: function(purpose) { comment = purpose; },
        getComment: function() { return comment; },
        setDomain: function(sDomain) { domain = sDomain.toLowerCase(); },
        getDomain: function() { return domain; },
        setMaxAge: function(nExpirey) { maxAge = nExpirey; },
        getMaxAge: function() { return maxAge; },
        setPath: function(sPath) { path = sPath; },
        getPath: function() { return path; },
        setSecure: function(bSecure) { secure = bSecure; },
        getSecure: function() { return secure; },
        getName: function() { return name; },
        setValue: function(sValue) { value = sValue; },
        getValue: function() { return value; },
        setVersion: function(nVersion) {
            if(nVersion<0||nVersion>1)throw new IllegalArgumentException(_resourceBundle.getString("Cookie.Version", { 'version':nVersion } ) );
            version = nVersion;
        },
        getVersion: function() { return version; }
    };
};