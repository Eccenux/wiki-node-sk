import { assert } from 'chai';
import { checkBracket } from '../src/check.js';

describe('checkBracket', () => {
	function test(input, expected) {
		let result = checkBracket(input);
		if (result.ok !== expected) {
			console.error(result);
			assert.fail(`for "${input}" expected: ` + (expected ? 'ok' : 'fail'));
		}
	}
	it('should return ok=true for matching brackets', () => {
		const input = '[[example]]';
		const expected = true;
		test(input, expected);
	});

	it('should return ok=false for more opening brackets', () => {
		const input = '[[example]';
		const expected = false;
		test(input, expected);
	});

	it('should return ok=false for more closing brackets', () => {
		const input = '[example]]';
		const expected = false;
		test(input, expected);
	});

	it('should return ok=true for empty string', () => {
		const input = '';
		const expected = true;
		test(input, expected);
	});
});
