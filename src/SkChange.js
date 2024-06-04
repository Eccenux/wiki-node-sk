/**
 * Helper class to hold summary of changes.
 */
export class SkChange {
	/**
	 * @param {String} text initial text.
	 */
	constructor(text) {
		this.initialText = text;
		this.text = text;
		this.summaries = [];
	}

	/** @returns true if changed */
	ismodfied() {
		return this.initialText != this.text;
	}
	/** @returns summaries */
	summary(unique = true) {
		if (unique) {
			let s = new Set(this.summaries);
			return Array.from(s).join(', ');
		}
		return this.summaries.join(', ');
	}

	/**
	 * Run action and append summary if modified.
	 * @param {Function} action change action.
	 */
	run(summary, action) {
		let newtext = action();
		if (newtext != this.text) {
			this.text = newtext;
			this.summaries.push(summary);
		}
	}
	
}

// quick check
function abcChange(text) {
	return text.replace('abc', 'def');
}
function nopChange(text) {
	return text;
}
function test() {
	let change = new SkChange(`abc xyz`);
	change.run('nop changed', ()=>nopChange(change.text));
	console.log(change.text, change.summaries);
	change.run('abc changed', ()=>abcChange(change.text));
	console.log(change.text, change.summaries);
	change.run('nop changed', ()=>nopChange(change.text));
	console.log(change.text, change.summaries);
	change.run('abc changed', ()=>abcChange(change.text));
	console.log(change.text, change.summaries);

	change.run('anonmized', ()=>change.text.replace(/[a-f]/g, 'a'));
	console.log(change.text, change.summaries);
	change.run('nop changed', ()=>nopChange(change.text));
	console.log(change.text, change.summaries);
	change.run('anonmized', ()=>change.text.replace(/[a-z]/g, 'a'));
	console.log(change.text, change.summaries);
	console.log(change.summary());
	console.log(change.summary(false));
}
// test();