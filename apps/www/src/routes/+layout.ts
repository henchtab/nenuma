import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_TOKEN } from '$env/static/public';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

export const load = async () => {
  if (browser) {
    posthog.init(PUBLIC_POSTHOG_TOKEN, {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false
    });

    try {
      const { initData } = retrieveLaunchParams();

      if (initData && initData.user) {
        posthog.identify(initData.user.id.toString(), {
          ...initData.user
        });
      }
    } catch (error) {}
  }
  return;
};
