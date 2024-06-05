import { Mwn } from 'mwn';

import * as botpass from '../bot.config.mjs';
import { Logger } from './Logger.js';

/**
 * Bot base.
 */
export class NuxCleanupBase {
	constructor(site) {
		this.site = site;
		this.apiUrl = `https://${this.site}/w/api.php`;
	}

	/**
	 * Init bot.
	 * @param {Logger} logger 
	 */
	async init(logger) {
		this.logger = logger;
		this.mwn = await Mwn.init({
			apiUrl: this.apiUrl,
			username: botpass.username,
			password: botpass.password,
			// UA required for WMF wikis: https://meta.wikimedia.org/wiki/User-Agent_policy
			userAgent: `NuxSkCleanupBot 0.1 ([[:pl:User:Nux/SkCleanupBot|NuxSkCleanupBot]])`,
		});
	}

	/** Log API call. */
	logQuery(query) {
		const baseUrl = `https://${this.site}/wiki/Special:ApiSandbox`;
		const url = new URL(baseUrl);
	
		Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
	
		this.logger.log(url.toString().replace('?', '#'));
	}

	/** Search for pages and run action on each portion. */
	async search(query, action) {
		this.logQuery(query);
		try {
			let batchNo = 0;
			for await (let response of this.mwn.continuedQueryGen(query)) {
				batchNo++;
				await action(response, batchNo);
				// let portion = response.query.exturlusage;
				// pages = pages.concat(portion);
			}
		} catch (error) {
			this.logger.error('Error searching articles:', error);
		}
	}
	/** Read page contents. */
	async readText(title) {
		let re = await this.mwn.read(title);
		return re.revisions[0].content;
	}
	/** Save page contents. */
	async save(title, newtext, summary) {
		if (typeof newtext !== 'string') {
			throw "New text must be a string!";
		}
		await this.mwn.save(title, newtext, summary);
	}
}
