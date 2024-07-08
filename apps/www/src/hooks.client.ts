import { init, handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

init({
  dsn: 'https://55a4e626777e0b3cc8a1a49313c233e0@o4504770823061504.ingest.us.io/4507562211868672',
  enabled: import.meta.env.PROD,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.5,

  // Optional: Initialize Session Replay:
  integrations: [replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

const myErrorHandler: HandleClientError = ({ error, event }) => {
  console.error('An error occurred on the client side:', error, event);
};

export const handleError = handleErrorWithSentry(myErrorHandler);

// or alternatively, if you don't have a custom error handler:
// export const handleError = handleErrorWithSentry();
