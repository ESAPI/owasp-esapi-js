//jshint quotmark:false
/*global module:false, test:false */
/*global ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false */

	'use strict';
	/*
	 ======== A Handy Little QUnit Reference ========
	 http://docs.jquery.com/QUnit

	 Test methods:
	 expect(numAssertions)
	 stop(increment)
	 start(decrement)
	 Test assertions:
	 ok(value, [message])
	 equal(actual, expected, [message])
	 notEqual(actual, expected, [message])
	 deepEqual(actual, expected, [message])
	 notDeepEqual(actual, expected, [message])
	 strictEqual(actual, expected, [message])
	 notStrictEqual(actual, expected, [message])
	 raises(block, [expected], [message])
	 */

	module('OWASP::ESAPI', {
		setup: function () {

		}
	});

	test('the base function exists', function() {
		ok(org.owasp.esapi, 'org.owasp.esapi exists');
		ok(org.owasp.esapi.codecs.UTF8, 'org.owasp.esapi.codecs.UTF8 exists');
	});



