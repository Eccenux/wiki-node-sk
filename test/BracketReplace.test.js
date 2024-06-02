import { assert } from 'chai';
import { BracketReplace } from '../src/BracketReplace.js';

describe('BracketReplace', () => {
	// Plik:
	function test(input, expected, replaceAction) {
		let from = "[[Plik:";
		let helper = new BracketReplace(input, from, replaceAction);
		let result = helper.exec();
		if (result !== expected) {
			console.error({input, expected, result});
			assert.fail(`for "${input}" expected: ${expected}`);
		}
	}
	
	it('should ignore unmatched from', () => {
		const input = '[[example]]';
		const expected = input;
		test(input, expected, ()=>'');
	});

	it('should replace all', () => {
		const input = 'a[[Plik:example.jpg]]b[[Plik:example2.jpg]]';
		const expected = 'ab';
		test(input, expected, ()=>'');
	});

	it('should replace side by side', () => {
		const input = 'a[[Plik:example.jpg]][[Plik:example2.jpg]]b';
		const expected = 'ab';
		test(input, expected, ()=>'');
	});

	it('should replace from start', () => {
		const input = '[[Plik:example.jpg]]abc[[Plik:example2.jpg]]';
		const expected = 'abc';
		test(input, expected, ()=>'');
	});
});

