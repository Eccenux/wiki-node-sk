/**
 * Check if brackets match in wikicode fragment.
 * @param {String} str 
 * @returns {Object} ok=true if brackets match.
 */
export function checkBracket(str) {
	var open = 0;
	var close = 0;
	var ok = true;
    for(var i=0; i<str.length; i++) {
		switch (str[i]) {
			case '[': open++; break;
			case ']': close++; break;
		}
		if (open < close) {
			ok = false;
			break;
		}
	}
	if (ok && open != close) {
		ok = false;
	}
	return {ok, open, close};
}