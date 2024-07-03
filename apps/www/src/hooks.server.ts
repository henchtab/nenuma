import { ACCESS_TOKEN_COOKIE } from '$lib/constants';
import { error, redirect, type Handle } from '@sveltejs/kit';

const AUTH_ROUTE = '/';
const PROTECTED_ROUTES_PREFIX = '/(app)';
const DASHBOARD_ROUTE = '/dashboard';

export const handle: Handle = async ({ event, resolve }) => {
  const routeId = event.route.id;

  if (routeId === null) {
    throw error(404, 'The route does not exist');
  }

  let canAccess = false;

  if (routeId.startsWith(PROTECTED_ROUTES_PREFIX)) {
    const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE);

    // TODO: Validate access token

    canAccess = !!accessToken;
  } else {
    canAccess = true;
  }

  if (!canAccess) {
    redirect(307, AUTH_ROUTE);
  }

  return resolve(event);
};
