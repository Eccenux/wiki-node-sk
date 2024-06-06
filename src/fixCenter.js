import { BracketReplace } from "./BracketReplace.js";
import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { SkChange } from "./SkChange.js";
import { checkBracket } from "./check.js";
import { cleanerLinks } from "./sk/cleanerLinks.js";

const SUMMARY = 'zastosowanie [[Szablon:center|center]]';

/**
 * Zmiana <center> na {{center}}. Prośba by Swampl.
 * 
 * Lista starych tagów:
 * https://pl.wikiquote.org/wiki/Specjalna:B%C5%82%C4%99dy_sk%C5%82adniowe/obsolete-tag
 * 
 * @param {NuxCleanupBase} bot 
 */
export async function fixCenter(bot) {
	let logger = bot.logger;

	let warns = [];
	let saved = 0;

	// https://www.mediawiki.org/wiki/API:Search
	// https://pl.wikiquote.org/wiki/Specjalna:%C5%9Arodowisko_testowe_API#action=query&format=json&list=search&formatversion=2&srsearch=insource%3A%2F%5C%3Ccenter%2F&srprop=&srsort=create_timestamp_desc
	let query = {
		action: "query",
		list: "search",
		srsearch: "insource:/\\<center/",
		srnamespace: 0,
		srsort: 'create_timestamp_desc',
		srlimit: 50, // per batch
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
				const sizeDiff = change.sizeDiff();
				if (Math.abs(sizeDiff) > 15) {
					logger.warn(`[!] ${title} [${sizeDiff}]: ${summary}`);
					warns.push(`[!] ${title} [${sizeDiff}]: ${summary}`);
				} else {
					logger.info(`${title} [${sizeDiff}]: ${summary}`);
				}
				try {
					await bot.save(title, change.text, summary);
					saved++;
				} catch (error) {
					logger.error(`Error saving: ${title} (maybe try later or as admin?)`, {code:error?.code, info:error?.info, message:error?.message});
					warns.push(`Error saving: ${title} [${sizeDiff}]`);
				}
			} else {
				// logger.warn({title, s:'no change'});
			}
		}

		// throw "break";
	}
	await bot.search(query, action);

	if (warns.length > 0) {
		logger.warn(`Warnings: [${warns.length}], e.g.: ${warns[0]}`);
	}
	logger.log(`Done (saved: ${saved}).`);
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
	let helper = new BracketReplace(change.text, from, replaceAction);
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

