/**
 * Check if brackets match in wikicode fragment.
 * @param {String} str 
 * @returns {Object} ok=true if brackets match.
 */
export function checkBracket(str) {
	let open = 0;
	let close = 0;
	let ok = true;
    for(let i=0; i<str.length; i++) {
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
