import { Mwn } from 'mwn';

import * as botpass from './bot.config.mjs';

/**
 * Bot base.
 */
export class NuxCleanupBase {
	constructor(apiUrl) {
		this.apiUrl = apiUrl;
	}

	/** Init bot. */
	async init() {
		this.mwn = await Mwn.init({
			apiUrl: this.apiUrl,
			username: botpass.username,
			password: botpass.password,
			// UA required for WMF wikis: https://meta.wikimedia.org/wiki/User-Agent_policy
			userAgent: `NuxSkCleanupBot 0.1 ([[:pl:User:Nux/SkCleanupBot|NuxSkCleanupBot]])`,
		});
	}

	/** Search for pages and run action on each portion. */
	async search(query, action) {
		try {
			let batchNo;
			for await (let response of this.mwn.continuedQueryGen(query)) {
				action(response, batchNo);
				// let portion = response.query.exturlusage;
				// pages = pages.concat(portion);
			}
		} catch (error) {
			console.error('Error searching articles:', error);
		}
	}
}
