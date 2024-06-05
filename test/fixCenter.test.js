import { assert } from 'chai';
import { fixes } from '../src/fixCenter.js';

describe('fixCenter fixes', () => {
	it('should replace closed <center> in simple file', () => {
		var input, expected;
		input = '[[Plik:Janusz Steinhoff.jpg|mały|<center>Janusz Steinhoff</center>]]';
		expected = '[[Plik:Janusz Steinhoff.jpg|mały|{{center|Janusz Steinhoff}}]]';
		assert.equal(fixes(input).text, expected);
	});
	it('should replace closed <center> in a file with wikilink', () => {
		var input, expected;
		input = '[[Plik:Harry.jpg|mały|<center>Jakiś [[Harry]] II</center>]]';
		expected = '[[Plik:Harry.jpg|mały|{{center|Jakiś [[Harry]] II}}]]';
		assert.equal(fixes(input).text, expected);

		input = '[[Plik:Harry Belafonte singing 1954.jpg|mały|<center>Śpiewający [[Harry Belafonte]] (1954)</center>]]';
		expected = '[[Plik:Harry Belafonte singing 1954.jpg|mały|{{center|Śpiewający [[Harry Belafonte]] (1954)}}]]';
		assert.equal(fixes(input).text, expected);
	});

	it('should fix unclosed <center> tags in a file', () => {
		var input, expected;
		input = '[[Plik:Colcoca01.jpg|mały|<center>Krzew koki]]';
		expected = '[[Plik:Colcoca01.jpg|mały|{{center|Krzew koki}}]]';
		assert.equal(fixes(input).text, expected);

		input = '[[Plik:Janusz Steinhoff.jpg|mały|<center>Janusz Steinhoff<center/>]]';
		expected = '[[Plik:Janusz Steinhoff.jpg|mały|{{center|Janusz Steinhoff}}]]';
		assert.equal(fixes(input).text, expected);
	});

	it('should append between changed-unchanged', () => {
		let text = `
			[[Plik:Famous mouse (3463764209).jpg|mały|<center>Myszka Miki</center>]]
			'''[[w:Myszka Miki|Myszka Miki]]''' – fikcyjna postać z filmów animowanych i komiksów, stworzona w studiu Walta Disneya, po odebraniu wytwórni Disneya praw do Królika Oswalda; antropomorficzna mysz.
			[[Plik:Mickey Mouse title.png|mały|Logo Myszki Miki]]
		`.replace(/\n\t+/g, '\n');
		let expected = text.replace(`<center>Myszka Miki</center>`, `{{center|Myszka Miki}}`);

		let change = fixes(text);
		if (change.ismodfied()) {
			// const summary = change.summary();
			assert.equal(change.initialText, text);
			assert.equal(change.text, expected);
			const sizeDiff = change.sizeDiff();
			assert.isTrue(sizeDiff < 0, `change: ${sizeDiff}`);
		} else {
			assert.fail('no change');
		}
	});
});
