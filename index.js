'use strict';

module.exports = function (str) {
	var firstIndex = 0;
	while (str[firstIndex] === '\r' || str[firstIndex] === '\n') {
		firstIndex++;
	}

	var lastIndex = str.length - 1;
	if (firstIndex - 1 === lastIndex) {
		return '';
	}

	while (str[lastIndex] === '\r' || str[lastIndex] === '\n') {
		lastIndex--;
	}
	return str.substring(firstIndex, lastIndex + 1);
};
