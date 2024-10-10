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
		client: {"start":"_app/immutable/entry/start.CMZR9_ja.js","app":"_app/immutable/entry/app.Dj5x6yxe.js","imports":["_app/immutable/entry/start.CMZR9_ja.js","_app/immutable/chunks/entry.BXM2iJQb.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/entry/app.Dj5x6yxe.js","_app/immutable/chunks/disclose-version.D6EsJnYG.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/stores.qu8QbZmA.js","_app/immutable/chunks/entry.BXM2iJQb.js","_app/immutable/chunks/exports.C2hOwL6d.js","_app/immutable/chunks/index.DxEOhgvT.js","_app/immutable/chunks/this.BQt3S_WI.js","_app/immutable/chunks/7.t5dMFPjj.js","_app/immutable/chunks/props.DeK5Z2bj.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-WL7DKhuT.js')),
			__memo(() => import('./chunks/1-B02ovB73.js')),
			__memo(() => import('./chunks/2-CT6_q8uz.js')),
			__memo(() => import('./chunks/3-uLsj_b2l.js')),
			__memo(() => import('./chunks/4-CR98MOO1.js')),
			__memo(() => import('./chunks/5-OvGrqJAC.js')),
			__memo(() => import('./chunks/6-D9XDZtN_.js')),
			__memo(() => import('./chunks/7-CkS99_1X.js')),
			__memo(() => import('./chunks/8-CCsd7n8C.js')),
			__memo(() => import('./chunks/9-0HzqTBOE.js')),
			__memo(() => import('./chunks/10-DNmNk3MI.js')),
			__memo(() => import('./chunks/11-BzpRn6uy.js')),
			__memo(() => import('./chunks/12-Ca9PCrd7.js')),
			__memo(() => import('./chunks/13-HRN1k0Xi.js')),
			__memo(() => import('./chunks/14-HhVLGQdM.js')),
			__memo(() => import('./chunks/15-D0OkUQMg.js')),
			__memo(() => import('./chunks/16-e5JQorvb.js')),
			__memo(() => import('./chunks/17-U35nNme-.js')),
			__memo(() => import('./chunks/18-DUU_gbd7.js')),
			__memo(() => import('./chunks/19-LCURVwGg.js'))
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
