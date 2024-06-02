//
// Dekodowanie linków
//
function rLinkdecode(a,name,anchor,end)
{
	try
	{
		name=decodeURIComponent(name);
		anchor=decodeURIComponent(anchor.replace(/\.([2-9A-F]{2})/g,'%$1'));
		a='[['+name+anchor+end;
	}
	catch(err){}

	a = a.replace(/\{\{/g, '.7B.7B');
	a = a.replace(/\}\}/g, '.7D.7D');
	a = a.replace(/802\x11/g, '802.11');
	return a.replace(/_/g,' ');
};

/**
 * Sprzątanie wikilinków.
 * 
 * Partial copy from: [[MediaWiki:Gadget-sk.js]]
 * 
 * @param {String} str Input.
 * @returns {String} Modified.
 */
export function cleanerLinks (str)
{
	// [[http://]]→[http://...]
	str = str.replace(/\[\[([a-z]+:\/\/[^\|\]]+)\]\]/g, '[$1]');
	// [[Kto%C5%9B_jaki%C5%9B#co.C5.9B|...]]→[[Ktoś jakiś#coś|...]]
	str = str.replace(/\[\[([^|#\]]*)([^|\]]*)(\||\]\])/g, rLinkdecode);
	// wyjątek dla [[Spark-Renault SRT_01E]]
	str = str.replace(/\[\[Spark-Renault SRT 01E\]\]/g, '[[Spark-Renault SRT_01E]]');

	// poprawa nazw przestrzeni i drobne okoliczne
	str = str.replace(/\[\[(:?) *(image|grafika|file) *: *([^ ])/gi, function (a,dw,co,l1) {return '[['+dw+'Plik:'+l1.toUpperCase();} );
	str = str.replace(/\[\[(:?) *(category|kategoria) *: *([^ ])/gi, function (a,dw,co,l1) {return '[['+dw+'Kategoria:'+l1.toUpperCase();} );
	str = str.replace(/\[\[ *(:?) *(template|szablon) *: *([^ ])/gi, function (a,dw,co,l1) {return '[[Szablon:'+l1.toUpperCase();} );
	str = str.replace(/\[\[ *(:?) *(special|specjalna) *: *([^ ])/gi, function (a,dw,co,l1) {return '[[Specjalna:'+l1.toUpperCase();} );

	str = str.replace(/\[\[ *:? *[Dd]yskusja( [a-z]*) *: */g, '[[Dyskusja$1:');

	// // usunięcie klucza sortowania kat. jeśli w całości jest prefiksem nazwy artykułu lub nazwą artykułu
	// if (str.search(/\{\{[ ]*(DEFAULTSORT|DOMYŚLNIESORTUJ|SORTUJ)[ ]*:/)==-1)
	// {
	// 	str = str.replace(/\[\[(Kategoria:[^\|\[\]\n]+)\|([^\|\[\]\n]+)\]\]/gi,
	// 		function (a,kat,klucz)
	// 		{
	// 			if (mw.config.get('wgTitle').indexOf(klucz)===0)
	// 				return '[['+kat+']]'
	// 				;
	// 			return a;
	// 		}
	// 	);
	// }

	// sprząranie parametrów w obrazkach
	str = str.replace(/\[\[Plik:[^\n\]]+\|/g, (a)=>{
		a = a
			.replace(/\|[ \t]+/g, '')
			.replace(/[ \t]+\|/g, '')
			.replace('|thumb|', '|mały|')
			.replace('|right|', '|prawo|')
			.replace('|left|', '|lewo|')
		;
		a = a
			.replace(/(\|mały\|)prawo\|/g, '$1')		// niepotrzebne
			.replace(/\|prawo(\|mały\|)/g, '$1')		// niepotrzebne
			.replace(/(\|)frame(\|[0-9x]+px)/, '$1mały$2');			// prawie na pewno błąd
		;
		return a;
	});
	// str = str.replace(/(\[\[Plik:[^\|\]]+\|[^\|\]]+)\.\]\]/, '$1]]');				// kropka
	// -mid spacje
	/* // zawiesza FF w niektórych warunkach, psuje niektóre opisy
	str = str.replace(/(\[\[Plik:[^\|\[\]]+)(\|[^\[\]\{\}]+ [^\[\]\{\}]*)(\|([^\|\[\]]+|[^\|\[\]]+\[\[[^\[\]]+\]\]){7,}\]\])/g, function(a,g1,gmid,gn)
	{
		return g1+ gmid.replace(/\s/g,'') +gn;
	});
	*/

	// usuwanie [[:pl:
	str = str.replace(/\[\[ *:? *pl *: */g, '[[');

	// // stare przestrzenie
	// str = str.replace(/\[\[Dyskusja Wikipedysty/g, '[[Dyskusja wikipedysty');

	// [[link|| -> [[link|
	str = str.replace(/\[\[ *([^\]\|:]+) *\| *\| */g, '[[$1|');

	//
	// (ro)zwijanie wikilinków
	// [[Link|link]] > [[link]] i [[Link|linka]] > [[link]]a
	//str = str.replace(/\[\[([^|\]])([^|\]]*)\|([^\]])\2([a-zA-ZżółćęśąźńŻÓŁĆĘŚĄŹŃ]*)\]\]/g, function (a, w1_1, w_rest, w2_1, poza)
	str = str.replace(/\[\[([^|\]])([^|\]]*)\|([^\]])\2([a-zżółćęśąźń]*)\]\]/g, function (a, w1_1, w_rest, w2_1, poza)
	{
		return (w1_1.toUpperCase()==w2_1.toUpperCase()) ? '[['+w2_1+w_rest+']]'+poza : a;
	});
	// [[Link|link]]er > [[Link|linker]]
	//str = str.replace(/\[\[([^|\]]+)\|([^|\]]+)\]\]([a-zA-ZżółćęśąźńŻÓŁĆĘŚĄŹŃ]+)/g, '[[$1|$2$3]]');
	str = str.replace(/\[\[([^|\]]+)\|([^|\[\]]+)\]\]([a-zżółćęśąźń]+)/g, '[[$1|$2$3]]');

	// usuwanie spacji w wikilinkach
	str = str.replace(/\[\[ *([^\]\|:]*[^\]\| ]) *\|/g, '[[$1|');
	str = str.replace(/([^ \t\n])\[\[ +/g, '$1 [[');
	str = str.replace(/\[\[ +/g, '[[');
	str = str.replace(/([^ \t\n])\[\[([^\]\|:]+)\| +/g, '$1 [[$2|');
	str = str.replace(/\[\[([^\]\|:]+)\| +/g, '[[$1|');
	str = str.replace(/([^ \|]) +\]\]([^ \t\na-zA-ZżółćęśąźńŻÓŁĆĘŚĄŹŃ])/g, '$1]] $2');
	str = str.replace(/([^ \|]) +\]\]([^a-zA-ZżółćęśąźńŻÓŁĆĘŚĄŹŃ])/g, '$1]]$2');

	// // sklejanie skrótów linkowych
	// str = str.replace(/m\.? ?\[\[n\.? ?p\.? ?m\.?\]\]/g, 'm [[n.p.m.]]');

	// // korekty dat - niepotrzebny przecinek
	// str = str.replace(/(\[\[[0-9]+ (stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia)\]\]), (\[\[[0-9]{4}\]\])/g, '$1 $3');

	// // linkowanie do wieków
	// str = str.replace(/\[\[([XVI]{1,5}) [wW]\.?\]\]/g, '[[$1 wiek|$1 w.]]');
	// str = str.replace(/\[\[([XVI]{1,5}) [wW]\.?\|/g, '[[$1 wiek|');
	// str = str.replace(/\[\[(III|II|IV|VIII|VII|VI|IX|XIII|XII|XI|XIV|XV|XVIII|XVII|XVI|XIX|XXI|XX)\]\]/g, '[[$1 wiek|$1]]');
	// str = str.replace(/\[\[(III|II|IV|VIII|VII|VI|IX|XIII|XII|XI|XIV|XV|XVIII|XVII|XVI|XIX|XXI|XX)\|/g, '[[$1 wiek|');

	// // rozwijanie typowych linków
	// str = str.replace(/\[\[ang\.\]\]/g, '[[język angielski|ang.]]');
	// str = str.replace(/\[\[cz\.\]\]/g, '[[język czeski|cz.]]');
	// str = str.replace(/\[\[fr\.\]\]/g, '[[język francuski|fr.]]');
	// str = str.replace(/\[\[łac\.\]\]/g, '[[łacina|łac.]]');
	// str = str.replace(/\[\[niem\.\]\]/g, '[[język niemiecki|niem.]]');
	// str = str.replace(/\[\[pol\.\]\]/g, '[[język polski|pol.]]');
	// str = str.replace(/\[\[pl\.\]\]/g, '[[język polski|pol.]]');
	// str = str.replace(/\[\[ros\.\]\]/g, '[[język rosyjski|ros.]]');
	// str = str.replace(/\[\[(((G|g)iga|(M|m)ega|(K|k)ilo)herc|[GMk]Hz)\|/g, '[[herc|');

	// // skracanie szablonów Dziennik Ustaw i Monitor Polski
	// str = str.replace(/\{{2}\s*(Dziennik|Monitor)\s+(Ustaw|Polski)\s*\|\s*rok\s*=\s*(\d+)\s*\|\s*numer\s*=\s*(\d+)\s*\|\s*pozycja\s*=\s*(\d+)\s*\}{2}/gi, '{{$1 $2|$3|$4|$5}}');
	// // ale numer=0 powinien wylecieć w wersji skróconej; spacji już nie ma, więc nie szukam
	// str = str.replace(/\{{2}(Dziennik Ustaw|Monitor Polski)\|(20[12]\d)\|0+\|(\d+)\}{2}/gi, '{{$1|$2|$3}}');

	return str;
}
