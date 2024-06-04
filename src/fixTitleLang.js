import { BracketReplace } from "./BracketReplace.js";
import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { SkChange } from "./SkChange.js";
import { checkBracket } from "./check.js";
import { cleanerLinks } from "./sk/cleanerLinks.js";

const SUMMARY = 'Zastosowanie [[Szablon:Język tytułu]]';

/**
 * Zastosowanie [[Szablon:Język tytułu]].
 * 
 * @param {NuxCleanupBase} bot 
 */
export async function fixTitleLang(bot) {
	// https://www.mediawiki.org/wiki/API:Search
	let query = {
		action: "query",
		list: "search",
		srsearch: `insource:"DISPLAYTITLE" insource:/\\{\\{DISPLAYTITLE[^}]+PAGENAME\\}\\}/`,
		srprop: '',	// less info
		format: "json",		
	};
	let action = async (response, batchNo) => {
		let pages = Object.values(response.query.search).map(v=>v.title);
		console.log(`batch [${batchNo}]:`, pages);
		for (let title of pages) {
			let text = await bot.readText(title);
			let change = fixes(text);
			if (change.ismodfied()) {
				await bot.save(title, change.text, change.summary());
				// break;
			} else {
				console.warn({title, s:'no change'});
			}
		}

		// throw "break";
	}
	await bot.search(query, action);
}

export function fixes(text) {
	let change = new SkChange(text);
	change.run('cleanerLinks', ()=>cleanerLinks(change.text));

	// en
	change.run(SUMMARY, ()=>change.text.replace('{{DISPLAYTITLE:{{J|en|{{PAGENAME}}}}}}', '{{Język tytułu}}'));
	// other
	change.run(SUMMARY, ()=>change.text.replace(/\{\{DISPLAYTITLE:\{\{J\|(\w+)\|\{\{PAGENAME\}\}\}\}\}\}/, '{{Język tytułu|$1}}'));

	return change;
}

function test(text) {
	let change = fixes(text);
	if (change.ismodfied()) {
		console.log({t:change.text, s:change.summary()});
	} else {
		console.warn({t:change.text, s:'no change'});
	}
}
function tests() {
	test(`{{DISPLAYTITLE:{{J|en|{{PAGENAME}}}}}} {{dopracować|przypisy=2021-02}}`);
	test(`{{DISPLAYTITLE:{{J|fr|{{PAGENAME}}}}}} {{dopracować|przypisy=2021-02}}`);
	test(`{{DISPLAYTITLE:minix}} {{dopracować|przypisy=2021-02}}`);
}
// tests();