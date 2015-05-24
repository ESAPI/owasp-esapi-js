# What is DOM Based XSS? #

Who better to answer that question, than the experts at OWASP?

> "DOM Based XSS (or as it is called in some texts, “type-0 XSS”) is an XSS attack wherein the attack payload is executed as a result of modifying the DOM “environment” in the victim’s browser used by the original client side script, so that the client side code runs in an “unexpected” manner. That is, the page itself (the HTTP response that is) does not change, but the client side code contained in the page executes differently due to the malicious modifications that have occurred in the DOM environment." - <a href='http://www.owasp.org/index.php/DOM_Based_XSS'>OWASP</a>

The most common type of vulnerable code that this affects is code which uses the information that is in the window.location global object.

Let's work through an example of the vulnerable code, and how it could be mitigated using ESAPI4JS.

```
<html>
<head>
   <title>My Vulnerable Webpage</title>
   <script type="text/javascript">
      var getParameter = function( name ) {
         var startIdx = window.location.href.indexOf( name ) + name.length + 1;
         var endIdx = window.location.href.indexOf( '&', startIdx );
         if ( endIdx = -1 ) endIdx = window.location.href.length;
         return window.location.href.substring( startIdx, endIdx );
      }

      var firstName = getParameter('firstName');
   </script>
</head>
<body onload="function(){document.getElementById('nameplace').innerHTML = firstName; }">
  <h1>Hello <div id="nameplace"></div>, Welcome to my Vulnerable Page!</h1>
</body>
</html>
```

If you were to hit this page with the following URL:
<pre>
http://host.com/vulnerable.html?firstName=Chris<br>
</pre>

The resulting page would render as such:

<pre>
Hello Chris, Welcome to my Vulnerable Page!<br>
</pre>

However, what if you were to hit this page with a URL that looked like:
<pre>
http://host.com/vulnerable.html?<sript>alert('xss');<br>
<br>
Unknown end tag for </script><br>
<br>
<br>
</pre>

The resulting page would popup a pretty little alert box, letting you know that yes, you are indeed vulnerable to DOM Based XSS.

**But won't Server-Side security controls, WAFs, or IDS catch this attack and mitigate it appropriately?**

Absolutely, however, consider the following url:

<pre>
http://host.com/vulnerable.html#<sript>alert('xss');<br>
<br>
Unknown end tag for </script><br>
<br>
<br>
</pre>

Notice, the _?_ in the url has been replaced with a _#_

**What does this mean?**

Well, as you may be aware, browsers do not send anything that comes after a hash mark (#) in the url to the server as part of the request, thus, server-side security controls will have no idea that a payload has been attached to the URL and will be unable to mitigate the attack, leaving the client wide open to the XSS payload.

# Mitigating the Attack #

This is where the ESAPI4JS Tools at your disposal will be invaluable. To my knowledge there is no other tools available for the client to mitigate these attacks, short of using plug-ins such as NoScript for Firefox or IE8's XSS Protection. This is where you as the vendor can ensure that all of your clients are protected from this type of attack when they visit your site.

## Introducing $ESAPI.encoder() ##

Two things should be called out here, first is that there is a built-in method in HTTPUtilities for retrieving parameter values from GET requests on the URL.

```
var firstName = $ESAPI.httpUtilities.getParameter('firstName');
```

The second is that mitigating this attack is as simple as encoding the value of the parameter for HTML use!

```
$('nameplace').innerHTML = $ESAPI.encoder().encodeForHTML( firstName );
```

**Voila!!!!**

You are done, and you have successfully mitigated DOM Based XSS Attacks against your once vulnerable code, ensuring that your customers are safe from this type of attack regardless of the browser they are visiting your site with!