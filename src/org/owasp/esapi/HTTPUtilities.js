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

org.owasp.esapi.HTTPUtilities = function() {
    var log = $ESAPI.logger("HTTPUtilities");
    var resourceBundle = $ESAPI.resourceBundle();
    var EventType = org.owasp.esapi.Logger.EventType;

    return {
        addCookie: function( oCookie ) {
            $type(oCookie,org.owasp.esapi.net.Cookie);

            if ( window.top.location.protocol != 'http:' || window.top.location.protocol != 'https:' )
                throw new RuntimeException(resourceBundle.getString( "HTTPUtilities.Cookie.Protocol", {"protocol":window.top.location.protocol}));

            var name = oCookie.getName(),
                value = oCookie.getValue(),
                maxAge = oCookie.getMaxAge(),
                domain = oCookie.getDomain(),
                path = oCookie.getPath(),
                secure = oCookie.getSecure();

            var validationErrors = new org.owasp.esapi.ValidationErrorList();
            var cookieName = $ESAPI.validator().getValidInput("cookie name", name, "HttpCookieName", 50, false, validationErrors );
            var cookieValue = $ESAPI.validator().getValidInput("cookie value", value, "HttpCookieValue", 5000, false, validationErrors );

            if (validationErrors.size() == 0) {
                var header = name+'='+escape(value);
                header += maxAge?";expires=" + ( new Date( ( new Date() ).getTime() + ( 1000 * maxAge ) ).toGMTString() ) : "";
                header += path?";path="+path:"";
                header += domain?";domain="+domain:"";
                header += secure||$ESAPI.properties.httputilities.cookies.ForceSecure?";secure":"";
                document.cookie=header;
            }
            else
            {
                log.warning(EventType.SECURITY_FAILURE, resourceBundle.getString("HTTPUtilities.Cookie.UnsafeData", { 'name':name, 'value':value } ) );
            }
        },

        /**
         * Returns a {@link org.owasp.esapi.net.Cookie} containing the name and value of the requested cookie.
         *
         * IMPORTANT: The value of the cookie is not sanitized at this level. It is the responsibility of the calling
         * code to sanitize the value for proper output encoding prior to using it.
         *
         * @param sName {String} The name of the cookie to retrieve
         * @return {org.owasp.esapi.net.Cookie}
         */
        getCookie: function(sName) {
            var cookieJar = document.cookie.split("; ");
            for(var i=0,len=cookieJar.length;i<len;i++) {
                var cookie = cookieJar[i].split("=");
                if (cookie[0] == escape(sName)) {
                    return new org.owasp.esapi.net.Cookie( sName, cookie[1]?unescape(cookie[1]):'' );
                }
            }
            return null;
        },

        /**
         * Will attempt to kill any cookies associated with the current request (domain,path,secure). If a cookie cannot
         * be deleted, a RuntimeException will be thrown.
         *
         * @throws RuntimeException if one of the cookies cannot be deleted.
         */
        killAllCookies: function() {
            var cookieJar = document.cookie.split("; ");
            for(var i=0,len=cookieJar.length;i<len;i++) {
                var cookie = cookieJar[i].split("=");
                var name = unescape(cookie[0]);
                // RuntimeException will bubble through if the cookie cannot be deleted
                if (!this.killCookie(name)) {
                    // Something is wrong - cookieJar contains a cookie that is inaccesible using getCookie
                    throw new RuntimeException(resourceBundle.getString("HTTPUtilities.Cookie.CantKill", {"name":name}));
                }
            }
        },

        /**
         * Will kill a single cookie. If that cookie cannot be deleted a RuntimeException will be thrown
         * @param sName {String} The name of the cookie
         */
        killCookie: function(sName) {
            var c = this.getCookie(sName);
            if ( c ) {
                c.setMaxAge( -10 );
                this.addCookie(c);
                if (this.getCookie(sName)) {
                    throw new RuntimeException(resourceBundle.getString("HTTPUtilities.Cookie.CantKill", {"name":sName}));
                }
                return true;
            }
            return false;
        },

        /**
         * This only works for GET parameters and is meerly a convenience method for accessing that information if need be
         * @param sName {String} The name of the parameter to retrieve
         */
        getRequestParameter: function( sName ) {
            var url = window.top.location.search.substring(1);
            var pIndex = url.indexOf(sName);
            if (pIndex<0) return null;
            pIndex=pIndex+sName.length;
            var lastIndex=url.indexOf("&",pIndex);
            if (lastIndex<0) lastIndex=url.length;
            return unescape(url.substring(pIndex,lastIndex));
        }
    };
};