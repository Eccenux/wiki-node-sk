import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { cleanerLinks } from "./sk/cleanerLinks.js";

const SUMMARY = 'Zmiana <center> na {{center}}. Prośba by Swampl';

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
	let query = {
		action: "query",
		list: "search",
		srsearch: "insource:/\\<center/",
		srprop: '',	// less info
		format: "json",		
	};
	let action = async (response, batchNo) => {
		let pages = Object.values(response.query.search).map(v=>v.title);
		console.log(`batch [${batchNo}]:`, pages);
		for (let title of pages) {
			let text = await bot.readText(title);
			text = fixes(text);
			await bot.save(title, text, SUMMARY);
			break;
		}

		throw "break";
	}
	await bot.search(query, action);
}

export function fixes(text) {
	text = cleanerLinks(text);

	// [[Plik:Colcoca01.jpg|mały|<center>Krzew koki]]
	text = text.replace(/(\[\[[^\]]+?)<center>([^\]]+)/g, function(a, pre, inner){
		inner = inner.replace(/<\/?center\/?>/, '');
		return pre + `{{center|${inner}}}`;
	});
	// <center>Janusz Steinhoff</center>
	text = text.replace(/<center>([\s\S]+?)<\/center>/g, function(a, inner){
		// spr. zamykające i otwierające linki
		
		return `{{center|${inner}}}`;
	});

	return text;
}

