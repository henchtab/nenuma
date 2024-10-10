var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _sentryReleaseInjectionFile = {};

var hasRequired_sentryReleaseInjectionFile;

function require_sentryReleaseInjectionFile () {
	if (hasRequired_sentryReleaseInjectionFile) return _sentryReleaseInjectionFile;
	hasRequired_sentryReleaseInjectionFile = 1;
	!function() {
	  try {
	    var e = "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {}, n = new Error().stack;
	    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "991d4b81-5bd1-4665-9b97-2fb0f365e4e9", e._sentryDebugIdIdentifier = "sentry-dbid-991d4b81-5bd1-4665-9b97-2fb0f365e4e9");
	  } catch (e2) {
	  }
	}();
	var _global = typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : {};
	_global.SENTRY_RELEASE = { id: "26fbe93ef68a4e598a874cac5d358072" };
	
	return _sentryReleaseInjectionFile;
}

require_sentryReleaseInjectionFile();
//# sourceMappingURL=_sentry-release-injection-file-DnBzmPpn.js.map
