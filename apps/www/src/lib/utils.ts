import { clsx, type ClassValue } from 'clsx';
import { cubicOut } from 'svelte/easing';
import { readable } from 'svelte/store';
import type { TransitionConfig } from 'svelte/transition';
import { browser } from '$app/environment';
import { twMerge } from 'tailwind-merge';
import { hapticFeedback } from './stores/tma';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pad(number: number) {
  return number < 10 ? '0' + number : number;
}

export function formatTime(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Format date to the playground output console format
 *  @param date - Date object
 */
export function formatOutputDate(date: Date) {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];

  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0').slice(0, 2);

  return `${month} ${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, '');
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
};

export function mediaQuery(query: string) {
  return readable(false, (set) => {
    const _window = browser ? window : undefined;
    const isSupported =
      _window && 'matchMedia' in _window && typeof _window.matchMedia === 'function';

    let mediaQuery: MediaQueryList | undefined;

    function cleanup() {
      if (!mediaQuery) return;
      if ('removeEventListener' in mediaQuery) mediaQuery.removeEventListener('change', update);
      // @ts-expect-error deprecated API
      else mediaQuery.removeListener(update);
    }

    function update() {
      if (!isSupported) return;

      cleanup();

      mediaQuery = _window!.matchMedia(query);
      set(mediaQuery.matches);

      if ('addEventListener' in mediaQuery) mediaQuery.addEventListener('change', update);
      // @ts-expect-error deprecated API
      else mediaQuery.addListener(update);
    }

    update();

    return cleanup;
  });
}

export function randomize() {
  const uns = hapticFeedback.subscribe((f) => {
    if (f) f.impactOccurred('light');
  });

  setTimeout(() => {
    uns();
  }, 1000);

  return Math.floor(Math.random() * 10000);
}
