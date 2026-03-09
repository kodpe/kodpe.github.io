module.exports = {
	config: {
		enableReplace: true,
		userId: 1, // perikless 08/03
		dbPath: process.env.DB_PATH || "dev\\planning.db",

		/* replaceMode usage */
		//
		// "replace-children-only" :
		//   - upsert les day_logs ciblés
		//   - remplace seulement les children (practices/items) des jours présents dans logs
		//
		// "replace-full-range" :
		//   - calcule min/max des dates présentes dans logs
		//   - supprime entièrement tous les day_logs de l'utilisateur sur cette plage
		//   - recrée tout à partir du seed
		/*
		replace-children-only
	
		Met à jour/crée les user_day_logs des dates fournies,
		puis remplace seulement leurs practices et items.
	
		replace-full-range
	
		Prend la date min et max présentes dans logs,
		supprime tous les user_day_logs de cet utilisateur dans cette plage,
		puis recrée tout depuis le seed.
		Comme les tables enfants sont en ON DELETE CASCADE,
		leurs children partent aussi
		*/
		// replaceMode: "replace-children-only",
		replaceMode: "replace-full-range",

		// Practices ajoutées à chaque jour si useDefaultPractices !== false
		defaultPractices: ["ANCRAGE", "QCM"],
	},

	logs: [
		{ date: "2025-10-28", hours: 5.5, items: [9, 22, 29, 50, 289, 255] },
		{ date: "2025-10-29", hours: 3.0, items: [56] },
		{ date: "2025-10-30", hours: 1.0 },
		{ date: "2025-10-31", hours: 1.0 },

		{ date: "2025-11-03", hours: 3.0, items: [30, 306, 312] },
		{ date: "2025-11-04", hours: 3.8, items: [25, 35, 42, 43] },
		{ date: "2025-11-05", hours: 4.0, items: [337, 100] },
		{ date: "2025-11-06", hours: 4.7, items: [41, 151, 44] },
		{ date: "2025-11-07", hours: 4.5, items: [26, 36, 176, 286, 177] },
		{ date: "2025-11-08", hours: 1.5, items: [142, 146], extraPractices: ["LCA"] },

		{ date: "2025-11-24", hours: 6.1, items: [48, 147, 159, 89, 278] },
		{ date: "2025-11-25", hours: 8.0, items: [219, 249, 253, 259, 260, 329, 212, 213, 55] },
		{ date: "2025-11-26", hours: 7.0, items: [23, 34, 186, 332, 188, 57, 13] },
		{ date: "2025-11-27", hours: 4.8, items: [300, 114, 203, 364, 365, 334] },
		{ date: "2025-11-28", hours: 1.5, items: [163, 52] },
		{ date: "2025-11-29", hours: 5.0, items: [105, 110, 124, 224, 346], extraPractices: ["LCA"] },
		{ date: "2025-11-30", hours: 1.0 },
		{ date: "2025-12-01", hours: 4.0, items: [46, 45, 254, 271] },
		{ date: "2025-12-02", hours: 6.5, items: [269, 274, 283, 285, 356, 357, 354] },
		{ date: "2025-12-03", hours: 5.8, items: [27, 331, 238, 343] },
		{ date: "2025-12-04", hours: 6.5, items: [37, 345, 336, 359, 247, 248, 250, 256, 189] },
		{ date: "2025-12-05", hours: 1.5, items: [24] },
		{ date: "2025-12-06", hours: 6.0, items: [161, 28, 51, 148], extraPractices: ["LCA"] },
		{ date: "2025-12-07", hours: 3.6, items: [38, 39, 53, 243] },
		{ date: "2025-12-08", hours: 7.0, items: [31, 32, 33, 54, 156] },
		{ date: "2025-12-09", hours: 7.0, items: [154, 155, 158, 207, 258, 264, 348] },
		{ date: "2025-12-10", hours: 10.0, items: [245, 220, 215, 214, 49, 150, 149, 40, 204] },
		{ date: "2025-12-11", hours: 6.0, items: [353, 344, 240] },
		{ date: "2025-12-12", hours: 6.5, items: [297, 187, 164, 137] },
		{ date: "2025-12-13", hours: 1.2, items: [47], extraPractices: ["LCA"] },
		{ date: "2025-12-14", hours: 1.0 },
		{ date: "2025-12-15", hours: 5.0 },
		{ date: "2025-12-16", hours: 7.8 },
		{ date: "2025-12-17", hours: 6.0, extraPractices: ["MASTERCLASS", "MASTERCLASS"] }, // gyneco, pediatrie
		{ date: "2025-12-18", hours: 6.0, extraPractices: ["PARTIEL"] },

		{ date: "2026-01-12", hours: 5.0, items: [121], extraPractices: ["MASTERCLASS", "BU", "ANALE"] }, // ortho

		{ date: "2026-01-16", hours: 1.0 },
		{ date: "2026-01-17", hours: 5.0, items: [76, 64, 77] },
		{ date: "2026-01-18", hours: 1.0 },
		{ date: "2026-01-19", hours: 5.0, items: [75, 1, 66, 62] },
		{ date: "2026-01-20", hours: 2.0, items: [79] },
		{ date: "2026-01-21", hours: 2.0, items: [74] },
		{ date: "2026-01-22", hours: 1.0, items: [351] },
		{ date: "2026-01-23", hours: 4.0, items: [71, 65] },
		{ date: "2026-01-24", hours: 2.0, items: [63], extraPractices: ["LCA"] },
		{ date: "2026-01-25", hours: 1.0 },
		{ date: "2026-01-26", hours: 2.0, extraPractices: ["MASTERCLASS"] }, // psy

		{ date: "2026-02-10", hours: 1.3 },
		{ date: "2026-02-11", hours: 1.0 },
		{ date: "2026-02-12", hours: 1.0 },
		{ date: "2026-02-13", hours: 1.0 },
		{ date: "2026-02-14", hours: 3.0, items: [58], extraPractices: ["LCA"] },
		{ date: "2026-02-15", hours: 2.0, items: [59] },
		{ date: "2026-02-16", hours: 7.5, items: [104, 60, 242] },
		{ date: "2026-02-17", hours: 6.8, items: [83, 61, 201] },
		{ date: "2026-02-18", hours: 7.8, items: [102, 67, 82, 15] },
		{ date: "2026-02-19", hours: 4.6, items: [84, 80, 73] },
		{ date: "2026-02-20", hours: 8.0, items: [92, 85, 69] },
		{ date: "2026-02-21", hours: 6.3, items: [86, 70, 81], extraPractices: ["LCA"] },
		{ date: "2026-02-22", hours: 9.0, items: [241, 91] },
		{ date: "2026-02-23", hours: 11.0, items: [95, 96, 97] },
		{ date: "2026-02-24", hours: 9.9, items: [78, 88, 98] },
		{ date: "2026-02-25", hours: 9.1, items: [90, 144, 118], extraPractices: ["CONFERENCE"] },
		{ date: "2026-02-26", hours: 7.8, items: [68, 120, 87] },
		{ date: "2026-02-27", hours: 7.0, items: [352, 122] },
		{ date: "2026-02-28", hours: 5.5, extraPractices: ["LCA", "MASTERCLASS"] }, // psy
		{ date: "2026-03-01", hours: 1.0 },
		{ date: "2026-03-02", hours: 1.0 },
		{ date: "2026-03-03", hours: 2.4, items: [106] },
		{ date: "2026-03-04", hours: 6.3, items: [107, 168, 230] },
		{ date: "2026-03-05", hours: 4.0, items: [101, 103] },
		{ date: "2026-03-06", hours: 5.8 },
		{ date: "2026-03-07", hours: 0.3, extraPractices: ["LCA"] },
		{ date: "2026-03-08", hours: 12.0, items: [129, 119, 335], extraPractices: ["CONFERENCE", "CONFERENCE"] }
	]
};

/*

{ date: "2026-03-08", hours: 6.0, items: [7, 18, 39], extraPractices: ["ANNALE", "QUIZ"] }
{ date: "2025-10-31", hours: 1.0, useDefaultPractices: false, extraPractices: ["MASTERCLASS"] }

*/