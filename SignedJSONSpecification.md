# Signed JSON #

## Summary ##

SecureJSON is intended as a means to mitigate the following scenarios as they apply to JSON:
  * DNS Cache Poisoning
  * MiTM Object Tampering

This functionality is dependent upon either the native integration of the JSON Object, or the inclusion of the
json2.js script available from http://json.org

## Example of a signed JSON String ##
```
{
    content: {
        //... Object contents
    },

    signature: {
        author: {
            name: "Application Name",
            url: "http://host.com"
        },
        timestamp: <timestamp of when the object was signed>,
        publicKey: "public key",
        signedHash: "signed hash"
    }
}
```

## Dependencies ##
  * json2.js or native implementation of the JSON object with
> > JSON.prototype.parse
> > JSON.prototype.stringify

## API ##

**Namespace**: org.owasp.esapi.json

**Accessor**: $ESAPI.json()

**Class**: org.owasp.esapi.json.SecureJSON

**Configuration**:
Base.esapi.properties.json
  * Strict    Whether unsigned json strings passed to SecureJSON.parse should throw an exception or just delegate to JSON.parse

  * TTL       Time specified in seconds that a signed json string is considered to be valid. Generally, this should be set to a relative low value such as 5 seconds. However, if you are storing json strings in a local storage repository (ie Google Gears) you can set this to a higher value so stored objects will remain valid for a specified length of time. Setting this value to -1 signifies indefinate validity.

  * NOTE  The timestamp on the signature of the json string is not to be considered trusted data as it's value can be changed, however, perhaps this could be caught by validating a hash of the signature itself in addition to validating the hash of the content?

**Properties**:

**Methods**:

```
public Object parse( String json ) throws InvalidSignatureException, ExpiredObjectException, ParseException
```


> This method will first verify the authenticity of the json string passed in, then parse the content of the signed json string and delegate the content of the signed json string to the JSON.parse method. If the passed in json object is not signed, and $ESAPI.properties.json.Strict is true, an InvalidSignatureException will be thrown. If false, a log message will be generated for the "json" logger and the string will be delegated to json.parse.

```
public void verify( String json ) throws InvalidSignatureException, ExpiredObjectException
```

> This method verifies the authenticity of the json string passed in by evaluating the signature and validating the public key and hash are correct for the content of the signed json object and verifying that the signed json has not expired. If the json is not authentic, indicating that it did not come from the intended source, or it has been tampered with prior to arriving at the browser, an InvalidSignatureException will be thrown. If the signed json has expired, an ExpiredObjectException will be thrown.

```
public String stringify( Object obj )
```

> Generates a signed json string using the key provided in $ESAPI.properties.json.Key

## Proposed Implementation Code ##
**[Revision 1](https://code.google.com/p/owasp-esapi-js/source/detail?r=1).0**
```
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

$namespace('org.owasp.esapi.json');

org.owasp.esapi.json.SecureJSON = {
    /**
     * This method verifies the authenticity of the json string passed in by evaluating the signature and validating
     * the public key and hash are correct for the content of the signed json object and verifying that the signed json
     * has not expired. If the json is not authentic, indicating that it did not come from the intended source, or it
     * has been tampered with prior to arriving at the browser, an InvalidSignatureException? will be thrown. If the
     * signed json has expired, an ExpiredObjectException? will be thrown.
     *
     * @param json
     *
     * @throws org.owasp.esapi.json.ExpiredObjectException
     * @throws org.owasp.esapi.json.InvalidSignatureException
     */
    verify: function( json ) {
        // To be implemented
    },

    /**
     * This method will first verify the authenticity of the json string passed in, then parse the content of the 
     * signed json string and delegate the content of the signed json string to the JSON.parse method. If the passed in
     * json object is not signed, and $ESAPI.properties.json.Strict is true, an InvalidSignatureException? will be
     * thrown. If false, a log message will be generated for the "json" logger and the string will be delegated to
     * JSON.parse.
     *
     * @param json The json string to parse
     *
     * @throws org.owasp.esapi.json.ExpiredObjectException
     * @throws org.owasp.esapi.json.InvalidSignatureException
     * @throws org.owasp.esapi.json.ParseException
     */
    parse: function( json ) {
        var signed = JSON.parse(json);

        if ( !signed['signature'] ) {
            if ( $ESAPI.properties.json.Strict ) throw new org.owasp.esapi.json.InvalidSignatureException('JSON Object is not signed.');
            else return signed;
        }

        // If the json is not authentic or has expired, an exception will be thrown and bubble through this method.
        org.owasp.esapi.json.SecureJSON.verify(signed);

        // No exception was thrown, the json is authentic - log the successful verification of the json and return the content
        $ESAPI.logger('json').info( org.owasp.esapi.Logger.EventType.SECURITY_SUCCESS, $ESAPI.resourceBundle().getString( "SecureJSON.SuccessfulParse", signed['signature'] ) );
        return signed['content'];
    },

    /**
     * Generates a signed json string using the applications PrivateKey
     *
     * @param obj
     */
    stringify: function( obj ) {
        // TODO: How to implement a private key in JS. This is problematic as we don't want this information available
        // to anyone who can view the source of imported JavaScript. I will look at how private keys work with jscrypt
        // and some of the other Javascript cryptography libraries to see if they can offer a solution.
        var signed = {
            content: obj,
            signature: {
                author: {
                    name: $ESAPI.properties.application.Name,
                    url: window.location.href
                },
                timestamp: new Date().getTime(),
                publicKey: $ESAPI.properties.json.PublicKey,
                signedHash: org.owasp.esapi.json.SecureJSON._getSignedHash( obj, $ESAPI.properties.json.PublicKey )
            }
        };

        return JSON.stringify(signed);
    },

    /**
     * @private
     */
    _getSignedHash: function( obj, key ) {
        // Temporary - Just Base64 encode the key and the stringified version of the object
        return org.owasp.esapi.codecs.Base64.encode( key + JSON.stringify( obj ) );
    }
};
```