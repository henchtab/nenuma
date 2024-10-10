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
		client: {"start":"_app/immutable/entry/start.Csq7LAQM.js","app":"_app/immutable/entry/app.BaEvNdy0.js","imports":["_app/immutable/entry/start.Csq7LAQM.js","_app/immutable/chunks/entry.SZhX6hnE.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/entry/app.BaEvNdy0.js","_app/immutable/chunks/disclose-version.fOPLq0BV.js","_app/immutable/chunks/index.mbo8UwIt.js","_app/immutable/chunks/stores.DLKqf0w-.js","_app/immutable/chunks/entry.SZhX6hnE.js","_app/immutable/chunks/exports.C2hOwL6d.js","_app/immutable/chunks/index.DxEOhgvT.js","_app/immutable/chunks/this.BHzcAiyK.js","_app/immutable/chunks/7.Cd8d_C7g.js","_app/immutable/chunks/props.DeK5Z2bj.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-0PvlY430.js')),
			__memo(() => import('./chunks/1-Dmxt3NQJ.js')),
			__memo(() => import('./chunks/2-8rPN_VR8.js')),
			__memo(() => import('./chunks/3-B0MXtPcT.js')),
			__memo(() => import('./chunks/4-D6a6PNgR.js')),
			__memo(() => import('./chunks/5-BZj0GB5r.js')),
			__memo(() => import('./chunks/6-Br-BGMOO.js')),
			__memo(() => import('./chunks/7-BF32hUHE.js')),
			__memo(() => import('./chunks/8-BHIuwERH.js')),
			__memo(() => import('./chunks/9-BzSwK1q7.js')),
			__memo(() => import('./chunks/10-CP9Wal7W.js')),
			__memo(() => import('./chunks/11-BkOvZNTu.js')),
			__memo(() => import('./chunks/12-C3LmUKF2.js')),
			__memo(() => import('./chunks/13-g34_irKy.js')),
			__memo(() => import('./chunks/14-Cv8XwiBt.js')),
			__memo(() => import('./chunks/15-B2pWDc5S.js')),
			__memo(() => import('./chunks/16-BOWupsuE.js')),
			__memo(() => import('./chunks/17-Dz42zC2p.js')),
			__memo(() => import('./chunks/18-FZoxHJ2U.js')),
			__memo(() => import('./chunks/19-BoG9HtbY.js'))
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
