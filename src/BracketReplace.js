/**
 * Replace wikicode between brackets.
 * 
 * Walks to the next closing bracktes
 * taking care of any inner wikilinks.
 * 
 * Runs replace action on each bracket expression.
 */
export class BracketReplace {
	constructor(str, from, replaceAction) {
		this.str = str;
		this.from = from.length < 1 ? "[" : from;
		this.replaceAction = replaceAction;
		this.reset();
	}

	/** Reset search. */
	reset(start = 0) {
		this.index = start;
		this.lastEnd = 0;
		this.changes = 0;
		this.result = '';
	}

	/** Find next start. */
	findNext() {
		this.index = this.str.indexOf(this.from, this.index);
		return this.index >= 0;
	}

	/** Find end from current index. */
	findEnd() {
		let open = 0;
		let close = 0;
		let started = false;
		for(let i=this.index; i<this.str.length; i++) {
			switch (this.str[i]) {
				case '[': open++; started=true; break;
				case ']': close++; break;
			}
			if (started && open == close) {
				return i + 1;
			}
		}
		return -1;
	}

	/** @private Replace step. */
	replace(start, end) {
		let inner = this.str.substring(start, end);
		let res = this.replaceAction(inner);
		if (inner != res) {
			this.changes++;
			if (start > 0 && this.lastEnd < start) {
				this.result += this.str.substring(this.lastEnd, start);
			}
			this.result += res;
			this.lastEnd = end;
		}
		this.index = end;
	}

	/** Run replacement actions. */
	exec() {
		while (this.findNext()) {
			let start = this.index;
			let end = this.findEnd();
			if (end > 0) {
				this.replace(start, end);
			}
		}
		if (this.changes === 0) {
			return this.str;
		}
		let final = this.str.substring(this.lastEnd);
		return this.result + final;
	}
}

/**
 * Usage example.
 */
function test() {
	var str = `
[[Plik:Abc.jpg]][[Plik:Def.jpg]]
Abc, [[def]].

[[Plik:Xyz.png|mały|Test [[kopytko]].]]
Xyz.
	`;
	var from = `[[Plik:`;
	// var replaceAction = (inner)=>inner.replace('.jpg', '.png')+';';
	var replaceAction = (inner)=>inner.replace('.png', '.svg');
	var helper = new BracketReplace(str, from, replaceAction);
	var result = helper.exec();
	console.log(result);
}
// test();
