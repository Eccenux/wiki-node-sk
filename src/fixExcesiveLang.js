import { BracketReplace } from "./BracketReplace.js";
import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { SkChange } from "./SkChange.js";
import { checkBracket } from "./check.js";
import { cleanerLinks } from "./sk/cleanerLinks.js";

const SUMMARY = 'Usunięcie nadmiarowych J i K';

/*
	Rzeczy tego typu do usunięcia J/K:
	`W tym samym roku SA{{J|en|PR}} przyznaje po raz pierwszy nagrodę` // sklejka pl/non-pl
	`== Struktura branży {{J|en|public relations}} w Polsce ==`	// nagłówki, zwłaszcza fragmenty nagłówków
	
	All search:
	`\{\{[JK]\|[a-z]+\|([^}]+)\}\}`
*/

/**
 * Usuwanie nadużyć J i K.
 * 
 * @param {NuxCleanupBase} bot 
 */
export async function fixTitleLang(bot) {
	let logger = bot.logger;

	// https://www.mediawiki.org/wiki/API:Search
	let query = {
		action: "query",
		list: "search",
		// srsearch: `insource:"DISPLAYTITLE" insource:` + /\{\{J\|[a-z]+\|\{\{PAGENAME\}\}/.toString(),
		srnamespace: 0,
		srsort: 'create_timestamp_desc',
		srlimit: 20, // per page
		srprop: '',	// less info
		format: "json",		
	};
	let action = async (response, batchNo) => {
		let pages = Object.values(response.query.search).map(v=>v.title);
		logger.log(`batch [${batchNo}]:`, pages);
		for (let title of pages) {
			let text = await bot.readText(title);
			let change = fixes(text);
			if (change.ismodfied()) {
				const summary = change.summary();
				logger.info(`${title}: ${summary}`);
				await bot.save(title, change.text, summary);
			} else {
				logger.warn({title, s:'no change'});
			}
		}

		throw "break";
	}
	await bot.search(query, action);
}

export function fixes(text) {
	let change = new SkChange(text);
	change.run('SK:cleanerLinks', ()=>cleanerLinks(change.text));
	
	// en
	change.run(SUMMARY, ()=>change.text.replace('{{DISPLAYTITLE:{{J|en|{{PAGENAME}}}}}}', '{{Język tytułu}}'));
	// other
	change.run(SUMMARY, ()=>change.text.replace(/\{\{DISPLAYTITLE:\{\{[JK]\|([\w\-]+)\|\{\{PAGENAME\}\}\}\}\}\}/, '{{Język tytułu|$1}}'));

	return change;
}

/**
 * Usage example.
 */
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
	test(`{{DISPLAYTITLE:{{J|en-US|{{PAGENAME}}}}}} {{Ujednoznacznienie}}`);
	test(`{{DISPLAYTITLE:{{K|en-US|{{PAGENAME}}}}}} {{Ujednoznacznienie}}`);
	test(`{{DISPLAYTITLE:minix}} {{dopracować|przypisy=2021-02}}`);
}
// tests();