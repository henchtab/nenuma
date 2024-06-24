import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { BackButton, HapticFeedback, MainButton, initBackButton, initHapticFeedback, initMainButton } from '@tma.js/sdk';

export const hapticFeedback = readable<HapticFeedback>(undefined, (set) => {
  if (!browser) {
    return () => {};
  }

  const hf = initHapticFeedback();
  set(hf);
});

export const mainButton = readable<MainButton>(undefined, (set) => {
  if (!browser) {
    return () => {};
  }

  const mb = initMainButton();
  set(mb[0]);

  return () => mb[1]();
});

export const backButton = readable<BackButton>(undefined, (set) => {
  if (!browser) {
    return () => {};
  }

  const bb = initBackButton();
  set(bb[0]);

  return () => bb[1]();
});
