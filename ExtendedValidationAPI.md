# Introduction #

ESAPI4JS - Proposed Extended Validation API and dependencies Specification


# Details #

## Configuration ##

Configuration will be specified by implementation of the Validator component. Each implementation will by design
have it's own specific configuration properties.

Special note should be given to the integration of HTML5 form field validation attributes. The following options
should be provided by any implementation of the Validator component:

```
"Validator" : {
     // If the client browser supports HTML5 Field Validation - use the browser implementations
     allow.html5.validation: true,
    
     // If the client browser does not support HTML 5 field validation - use this implementation
     html5.compatibility.implementation: $ESAPI.component('HTML5CompatibilityValidator'),
}
```

If HTML5 Validation is allowed, the validation engine will first try to use browser implementations of the
validators and fall back to the specified javascript implementation in the event the client browser does not
support a validation mechanism specified in the HTML5 spec.

Also of consideration is to specify the implementation that will handle selectors:

```
"DOM": {
	// Implementation of $ESAPI() will delegate to the specified method
	// This can either be something from a framework (jQuery,Prototype) or can be a custom implementation
	select: $
}
```

The reference implementation shall use the Sizzle Selector Library (the same thing used by jQuery)

http://sizzlejs.com/

## API ##

### $ESAPI( selector, root ) ###

**Description:**
> Selects all elements with the given class, id, type, or attribute name/value pair

**Parameters:**
> selector (String)
> > - the selectors to select from the DOM

> root (HTMLElement)
> > - The root element to search under

**Returns:**

> HTMLElement

**Examples:**
```
        // select all elements with id="my-element" 
	$ESAPI('#my-element')
		
        // select all elements with class="my-class"
	$ESAPI('.my-class')

        // select all elements of type <input>
	$ESAPI('input')

        // select all elements of type <input> with attribyte name="some-checkbox" and type="text"
	$ESAPI('input:text [name=some-checkbox]')

        // select all elements of type <input> within the Element which contains id="my-form"
	$ESAPI('input', $ESAPI('#my-form') )
	
```

### $ESAPI.component( search, root ) ###

**Description:**
> Searches for an object under the org.owasp.esapi namespace and returns a reference to it

**Parameters:**
> search (String)
> > - the name of the object to find

> root (Object)
> > - the root namespace to search under

**Returns:**

> Object

**Examples:**
```
        // returns a reference to org.owasp.esapi.reference.validation.StringValidationRule
	$ESAPI.component('StringValidationRule')

        // returns a reference to org.owasp.esapi.reference.validation.DateValidationRule - performs faster since it only needs to enumerate the namespace from a deeper point of entry.
	$ESAPI.component('DateValidationRule', org.owasp.esapi.reference.validation )
	
```

### .bindValidation( validationConfig ) ###

**Description:**
> Binds the specified validation configuration to a form element any optional custom validation configurations to fields that	are children of the form being bound to.

**This method will only work if called from an HTMLFormElement**

**Parameters:**
> onSuccess (function)
> > - default validation success callback function

> onFailure (function)
> > - default validation failure callback function is called with a org.owasp.esapi.ValidationRespose as a parameter

**Custom Field Validators:**

> Parm-Name (selector)
> Parm-Value (org.owasp.esapi.Validator or object)

> If the value of the parameter is an object, it will be evaluated as a complex validation rule. The following configuration options are available for complex validation rules:

> onSuccess (function)
> > - same as above

> onFailure (function)
> > - same as above

> required (boolean)
> > - if true, validation will fail-fast if the field is not answered

**Returns:**

> void

**Throws:**
> org.owasp.esapi.ValidationException
> > - NOTE: This class will need to be moved out of the reference implementation
> > - If an unrecoverable Runtime error occurs

Examples:
```
	$ESAPI('#user-profile-form').bindValidation({
		// The birthdate field validates 10 to 50 year olds and is required
		'#birthdate': {
			validator: $ESAPI.component('DateRangeValidator').newInstance({
				rangeMin: DateRangeValidator.ONE_YEAR * 50,
				rangeMax: DateRangeValidator.ONE_YEAR * 10
			}),
			required: true
		},

		// About me is a freetext field that allows any Safe String values
		'#aboutme': $ESAPI.component('StringValidator').newInstance({
			stringType: 'SafeString'
		}),

		// The E-Mail address field is required, and must be a valid email address
		'#email-address' : {
			validator: $ESAPI.component('StringValidator').newInstance({ stringType: 'EmailAddress' }),
			onFailure: function( validationResponse ) { alert('Please input a valid email address'); },
			required: true
		},

		// The widget validator is more complex, with some special error case handling
		'#widget-code' : {
			validator: $ESAPI.component('WidgetValidator').newInstance({ 
				trustedDomains: [ '*.google.com', 'api.facebook.com', 'api.twitter.com' ],
				maxWidgets: 5
			}),
			onFailure: function( validationResponse ) {
				with ( $ESAPI.component('WidgetValidator') ) {
					if ( validationResponse.responseCode == this.TOO_MANY_WIDGETS ) {
						alert('Too many widgets on page');
					} else if ( validationResponse.responseCode == this.UNTRUSTED_SOURCE ) {
						alert('This is not a trusted domain');
					}				
				}
			}
		},

		// This is pretty complex client-side validation to ensure that the value of a slider is indeed
		// a percent value and is not less than a dynamic value that is specified by other client-side 
		// business logic and stored as a hidden form element in the DOM. It also has custom error handling
		// for both the inner and outer validators.
		'#percent-slider' : {
			validator: $ESAPI.component('ChainedValidator').newInstance([
				$ESAPI.component('PercentValidator').newInstance(),
				$ESAPI.component('"NotLessThanValidator').newInstance({
					compareValue: $ESAPI('#base-percentage').value
					onFailure: function( validationResponse ) {
						alert( 'Percentage must be more than ' + this.compareValue );
					}
				})
			]),
			onFailure: function( validationResponse ) {
				alert( validationResponse.getUserMessage() );
			}
		}
	
		// Any validation for an element in this form will use this as the default success callback
		onSuccess: function() {
			return true;
		},

		// Any validation for an element in this form will use this as the default failure callback
		onFailure: function( validationResponse ) {
			$ESAPI('#form-errors').innerHTML = 'An error has occured: ' + validationResponse.getUserMessage() );
		}
	});
```