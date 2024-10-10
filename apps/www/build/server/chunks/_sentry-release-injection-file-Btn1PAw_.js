var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _sentryReleaseInjectionFile = {};

var hasRequired_sentryReleaseInjectionFile;

function require_sentryReleaseInjectionFile () {
	if (hasRequired_sentryReleaseInjectionFile) return _sentryReleaseInjectionFile;
	hasRequired_sentryReleaseInjectionFile = 1;
	!function() {
	  try {
	    var e = "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {}, n = new Error().stack;
	    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "fc23bf70-254a-4127-97e2-2fcb8638f2d4", e._sentryDebugIdIdentifier = "sentry-dbid-fc23bf70-254a-4127-97e2-2fcb8638f2d4");
	  } catch (e2) {
	  }
	}();
	var _global = typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : {};
	_global.SENTRY_RELEASE = { id: "05f221a983b241a8906df93efcc221b8" };
	
	return _sentryReleaseInjectionFile;
}

require_sentryReleaseInjectionFile();
//# sourceMappingURL=_sentry-release-injection-file-Btn1PAw_.js.map
