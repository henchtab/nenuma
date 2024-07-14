import { ACCESS_TOKEN_COOKIE } from '$lib/constants';
import { handleErrorWithSentry, init, sentryHandle } from '@sentry/sveltekit';
import { error, HandleServerError, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

init({
  dsn: 'https://55a4e626777e0b3cc8a1a49313c233e0@o4504770823061504.ingest.us.sentry.io/4507562211868672',
  enabled: import.meta.env.PROD,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
});

const AUTH_ROUTE = '/';
const PROTECTED_ROUTES_PREFIX = '/(app)';
const DASHBOARD_ROUTE = '/dashboard';

const myHandle: Handle = async ({ event, resolve }) => {
  const routeId = event.route.id;

  if (routeId === null) {
    throw error(404, 'The route does not exist');
  }

  // let canAccess = false;

  // if (routeId.startsWith(PROTECTED_ROUTES_PREFIX)) {
  //   const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE);

  //   // TODO: Validate access token

  //   canAccess = !!accessToken;
  // } else {
  //   canAccess = true;
  // }

  // if (!canAccess) {
  //   redirect(307, AUTH_ROUTE);
  // }

  return resolve(event);
};

export const handle = sequence(sentryHandle(), myHandle);

const myErrorHandler: HandleServerError = ({ error, event }) => {
  console.error('An error occurred on the server side:', error, event);
};

export const handleError = handleErrorWithSentry(myErrorHandler);
