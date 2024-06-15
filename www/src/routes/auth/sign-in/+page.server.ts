import { REDIRECT_TO_COOKIE, ACCESS_TOKEN_COOKIE } from '$lib/constants';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  cookies.delete(ACCESS_TOKEN_COOKIE, { path: '/' });

  const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
  cookies.set(REDIRECT_TO_COOKIE, redirectTo, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false
  });
};
