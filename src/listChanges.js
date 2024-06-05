import { NuxCleanupBase } from "./NuxCleanupBase.js";
import { Logger } from "./Logger.js";

/*
	List large user changes.
	
	Checks if size change is above `minBytesChange`.
*/

// Site
const site = 'pl.wikiquote.org';
const baseUrl = `https://pl.wikiquote.org/w/index.php?diff=cur&oldid=prev&title=`;
// const site = 'pl.wikipedia.org';
const bot = new NuxCleanupBase(site);

// Log file
const logger = new Logger('./io/list_changes.tsv', false);

async function getUserContributions(username, minBytesChange = 10) {
	await bot.init(logger);

	let hasHead = false;

	let query = {
		action: "query",
		list: "usercontribs",
		ucuser: username,
		ucprop: "title|timestamp|comment|sizediff",
		uclimit: "1000",
		format: "json"
	};
	let action = async (data, batchNo) => {
		console.log(`batch [${batchNo}]:`);

		if (!hasHead) {
			logger.log(`\n\nUrl\tSizeDiff\tTimestamp\tComment\tTitle`);
			hasHead = true;
		}

		const contributions = data.query.usercontribs;
		contributions
			.filter(contrib => Math.abs(contrib.sizediff) > minBytesChange)
			.forEach(contrib => {
				let url = baseUrl + encodeURIComponent(contrib.title);
				logger.log(`${url}\t${contrib.sizediff}\t${contrib.timestamp}\t${contrib.comment}\t${contrib.title}`);
			})
		;
		// throw "break";
	}
	await bot.search(query, action);
	console.log('\n\nDone');
}

// Użycie funkcji
const username = "NuxBot";
await getUserContributions(username);
