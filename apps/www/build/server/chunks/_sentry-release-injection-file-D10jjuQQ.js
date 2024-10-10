var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _sentryReleaseInjectionFile = {};

var hasRequired_sentryReleaseInjectionFile;

function require_sentryReleaseInjectionFile () {
	if (hasRequired_sentryReleaseInjectionFile) return _sentryReleaseInjectionFile;
	hasRequired_sentryReleaseInjectionFile = 1;
	!function() {
	  try {
	    var e = "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {}, n = new Error().stack;
	    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "77bdca31-df79-4da1-96b8-3b131c03e1ee", e._sentryDebugIdIdentifier = "sentry-dbid-77bdca31-df79-4da1-96b8-3b131c03e1ee");
	  } catch (e2) {
	  }
	}();
	var _global = typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : {};
	_global.SENTRY_RELEASE = { id: "b1205db4d1014718a08cb849046eb670" };
	
	return _sentryReleaseInjectionFile;
}

require_sentryReleaseInjectionFile();
//# sourceMappingURL=_sentry-release-injection-file-D10jjuQQ.js.map
