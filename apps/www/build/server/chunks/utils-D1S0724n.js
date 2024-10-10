import { clsx } from 'clsx';
import { r as readable } from './index2-d8GdKNTl.js';
import { twMerge } from 'tailwind-merge';
import { a as TON_VALID_UNTIL } from './constants-D2ZMuuf5.js';
import { h as hapticFeedback } from './tma-DE_E59BU.js';
import './_sentry-release-injection-file-D10jjuQQ.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "c268f303-db5e-4b23-a63a-5eae92c797ef", e._sentryDebugIdIdentifier = "sentry-dbid-c268f303-db5e-4b23-a63a-5eae92c797ef");
  } catch (e2) {
  }
}();
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function pad(number) {
  return number < 10 ? "0" + number : number;
}
function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function timeToLocal(originalTime) {
  const d = new Date(originalTime * 1e3);
  return Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds()
  ) / 1e3;
}
function formatOutputDate(date) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0").slice(0, 2);
  return `${month} ${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
function mediaQuery(query) {
  return readable(false, (set) => {
    function cleanup() {
      return;
    }
    return cleanup;
  });
}
function randomize() {
  const uns = hapticFeedback.subscribe((f) => {
    if (f) f.impactOccurred("light");
  });
  setTimeout(() => {
    uns();
  }, 1e3);
  return Math.floor(Math.random() * 1e4);
}
function getValidUntil() {
  return Math.floor(Date.now() / 1e3) + TON_VALID_UNTIL;
}

export { formatOutputDate as a, cn as c, formatTime as f, getValidUntil as g, mediaQuery as m, randomize as r, timeToLocal as t };
//# sourceMappingURL=utils-D1S0724n.js.map
