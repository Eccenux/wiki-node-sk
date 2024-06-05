import { BracketReplace } from "./BracketReplace.js";
import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { SkChange } from "./SkChange.js";
import { checkBracket } from "./check.js";
import { cleanerLinks } from "./sk/cleanerLinks.js";

const SUMMARY = 'zastosowanie [[Szablon:center|]]';

/**
 * Zmiana <center> na {{center}}. Prośba by Swampl.
 * 
 * Lista starych tagów:
 * https://pl.wikiquote.org/wiki/Specjalna:B%C5%82%C4%99dy_sk%C5%82adniowe/obsolete-tag
 * 
 * @param {NuxCleanupBase} bot 
 */
export async function fixCenter(bot) {
	// https://www.mediawiki.org/wiki/API:Search
	// https://pl.wikiquote.org/wiki/Specjalna:%C5%9Arodowisko_testowe_API#action=query&format=json&list=search&formatversion=2&srsearch=insource%3A%2F%5C%3Ccenter%2F&srprop=&srsort=create_timestamp_desc
	let query = {
		action: "query",
		list: "search",
		srsearch: "insource:/\\<center/",
		srsort: 'create_timestamp_desc',
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

		throw "break";
	}
	await bot.search(query, action);
}

export function fixes(text) {
	let change = new SkChange(text);
	change.run('SK:cleanerLinks', ()=>cleanerLinks(change.text));

	// zepsute tagi w plikach, np.:
	// [[Plik:Colcoca01.jpg|mały|<center>Krzew koki]]
	// [[Plik:Janusz Steinhoff.jpg|mały|<center>Janusz Steinhoff<center/>]]
	let from = "[[Plik:";
	let replaceAction = (file) => {
		let start = file.indexOf('<center');
		if (start < 0) {
			return file;
		}
		let pre = file.substring(0, start);
		let inner = file.substring(start, file.length - 2);
		inner = inner.replace(/<\/?center\/?>/g, '');
		return `${pre}{{center|${inner}}}]]`;
	}
	let helper = new BracketReplace(text, from, replaceAction);
	change.run(SUMMARY, ()=>helper.exec());

	// <center>Jakiś wikikod</center>
	change.run(SUMMARY, ()=>change.text.replace(/<center>([\s\S]+?)<\/center>/g, function(a, inner){
		// spr. zamykające i otwierające linki
		if (!checkBracket(inner).ok) {
			return a;
		}
		return `{{center|${inner}}}`;
	}));

	return change;
}

