const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Hubot-Sans.woff2","Mona-Sans.woff2","favicon.png","tonconnect-manifest.json"]),
	mimeTypes: {".woff2":"font/woff2",".png":"image/png",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.Bnm00sm8.js","app":"_app/immutable/entry/app.BKUyAhM1.js","imports":["_app/immutable/entry/start.Bnm00sm8.js","_app/immutable/chunks/entry.BnjkBCEM.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/entry/app.BKUyAhM1.js","_app/immutable/chunks/disclose-version.B_3xlfoo.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/stores.BCG-awgS.js","_app/immutable/chunks/entry.BnjkBCEM.js","_app/immutable/chunks/exports.C2hOwL6d.js","_app/immutable/chunks/index.DxEOhgvT.js","_app/immutable/chunks/this.5ZPbIZBj.js","_app/immutable/chunks/7.Bb1C-sr3.js","_app/immutable/chunks/props.DeK5Z2bj.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-DF8lfAiM.js')),
			__memo(() => import('./chunks/1-CocT9T8d.js')),
			__memo(() => import('./chunks/2-BYEkUSMT.js')),
			__memo(() => import('./chunks/3-BuO1h-Kf.js')),
			__memo(() => import('./chunks/4-vFk5wruo.js')),
			__memo(() => import('./chunks/5-zocEvVcE.js')),
			__memo(() => import('./chunks/6-CSY-xiYx.js')),
			__memo(() => import('./chunks/7-CQoNqv-v.js')),
			__memo(() => import('./chunks/8-BFElnYvI.js')),
			__memo(() => import('./chunks/9-C-s-xUbd.js')),
			__memo(() => import('./chunks/10-BS3aqUlr.js')),
			__memo(() => import('./chunks/11-C70WAcAD.js')),
			__memo(() => import('./chunks/12-B9tfvsVx.js')),
			__memo(() => import('./chunks/13-D9xyynUZ.js')),
			__memo(() => import('./chunks/14-BCSzZwKo.js')),
			__memo(() => import('./chunks/15-DesgK_bz.js')),
			__memo(() => import('./chunks/16-Dq9LFbTb.js')),
			__memo(() => import('./chunks/17-B-UwrnVE.js')),
			__memo(() => import('./chunks/18-CCYpRQCD.js')),
			__memo(() => import('./chunks/19-BOIG5yy_.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(app)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/dashboard/[topic]",
				pattern: /^\/dashboard\/([^/]+?)\/?$/,
				params: [{"name":"topic","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/playground",
				pattern: /^\/playground\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/playground/options-api",
				pattern: /^\/playground\/options-api\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/playground/options-api/(pages)/brokerage-account",
				pattern: /^\/playground\/options-api\/brokerage-account\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/playground/options-api/(pages)/brokerage",
				pattern: /^\/playground\/options-api\/brokerage\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/playground/options-api/(pages)/broker",
				pattern: /^\/playground\/options-api\/broker\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/playground/options-api/(pages)/cash-or-nothing-option",
				pattern: /^\/playground\/options-api\/cash-or-nothing-option\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/playground/options-api/deploy",
				pattern: /^\/playground\/options-api\/deploy\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/playground/streams-api",
				pattern: /^\/playground\/streams-api\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/playground/streams-api/(pages)/data-stream",
				pattern: /^\/playground\/streams-api\/data-stream\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/playground/streams-api/deploy",
				pattern: /^\/playground\/streams-api\/deploy\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/playground/streams-api/(pages)/session",
				pattern: /^\/playground\/streams-api\/session\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/playground/streams-api/(pages)/simple-subscriber",
				pattern: /^\/playground\/streams-api\/simple-subscriber\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/playground/streams-api/(pages)/subscription-batch",
				pattern: /^\/playground\/streams-api\/subscription-batch\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 18 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
