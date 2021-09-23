'use strict';
var assert = require('assert');
var trimOffNewlines = require('./');

it('should trim off \\r', function () {
	assert.strictEqual(trimOffNewlines('\runicorns'), 'unicorns');
	assert.strictEqual(trimOffNewlines('unicorns\r\r'), 'unicorns');
	assert.strictEqual(trimOffNewlines('unicorns\r'), 'unicorns');
});

it('should trim off \\n', function () {
	assert.strictEqual(trimOffNewlines('\nunicorns'), 'unicorns');
	assert.strictEqual(trimOffNewlines('\n\n\n\nunicorns\n\n'), 'unicorns');
	assert.strictEqual(trimOffNewlines('unicorns\n'), 'unicorns');
});

it('should trim off \\r\\n', function () {
	assert.strictEqual(trimOffNewlines('\r\n\r\n\r\nunicorns'), 'unicorns');
	assert.strictEqual(trimOffNewlines('\r\nunicorns\r\n'), 'unicorns');
	assert.strictEqual(trimOffNewlines('unicorns\r\n\r\n\r\n\r\n\r\n\r\n'), 'unicorns');
});

it('should not be susceptible to exponential backtracking', function () {
	var redosString = 'a';
	var count = 1000;
	while (count) {
		redosString += '\r\n';
		count--;
	}
	redosString += 'a';

	var longerRedosString = redosString;
	count = 1000;
	while (count) {
		longerRedosString += redosString;
		count--;
	}

	var start = Date.now();
	trimOffNewlines(redosString);
	trimOffNewlines(longerRedosString);
	var end = Date.now();
	assert.ok(end - start < 1000, 'took too long, susceptible to ReDoS?');
});

it('should be performant on very long strings', function () {
	var longOrdinaryString = 'aa';
	var count = 27;
	while (count) {
		longOrdinaryString += longOrdinaryString;
		count--;
	}
	assert.strictEqual(longOrdinaryString.length, 268435456);

	var start = Date.now();
	trimOffNewlines(longOrdinaryString);
	var end = Date.now();
	assert.ok(end - start < 1000, 'took too long, performance issue?');
});

it('should be performant in worst-case', function () {
	// In the current algorithm, this is likely a worst-case:
	// non-newline character followed by many newline characters.

	this.timeout(10000);

	var worstCaseString = '\r\n';
	var count = 27;
	while (count) {
		worstCaseString += worstCaseString;
		count--;
	}
	worstCaseString = 'a' + worstCaseString;
	assert.strictEqual(worstCaseString.length, 268435457);
	var start = Date.now();
	trimOffNewlines(worstCaseString);
	var end = Date.now();
	assert.ok(end - start < 5000, 'worst case took too long, performance issue?');
});

it('should leave newlines in the middle of a string alone', function () {
	assert.strictEqual(trimOffNewlines('Come on,\nFhqwhgads.'), 'Come on,\nFhqwhgads.');
});

it('should leave spaces at start and end alone', function () {
	assert.strictEqual(trimOffNewlines(' fhqwhgads '), ' fhqwhgads ');
});

it('should return an empty string if there are only \\r and \\n', function () {
	assert.strictEqual(trimOffNewlines('\r\n\r\r\n\n'), '');
});
