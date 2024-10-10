var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _sentryReleaseInjectionFile = {};

var hasRequired_sentryReleaseInjectionFile;

function require_sentryReleaseInjectionFile () {
	if (hasRequired_sentryReleaseInjectionFile) return _sentryReleaseInjectionFile;
	hasRequired_sentryReleaseInjectionFile = 1;
	!function() {
	  try {
	    var e = "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {}, n = new Error().stack;
	    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "9222ad9f-8875-48ca-a8db-519489372aa5", e._sentryDebugIdIdentifier = "sentry-dbid-9222ad9f-8875-48ca-a8db-519489372aa5");
	  } catch (e2) {
	  }
	}();
	var _global = typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : {};
	_global.SENTRY_RELEASE = { id: "558db9a9badb40a79fc13ed1a00b6ea1" };
	
	return _sentryReleaseInjectionFile;
}

require_sentryReleaseInjectionFile();
//# sourceMappingURL=_sentry-release-injection-file-DHom2vTX.js.map
