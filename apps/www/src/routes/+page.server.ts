import { redirect } from '@sveltejs/kit';
import { PageServerLoad } from './$types';
import { ACCESS_TOKEN_COOKIE, REDIRECT_TO_COOKIE } from '$lib/constants';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);

  if (accessToken) {
    redirect(307, '/dashboard');
  }

  const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
  cookies.set(REDIRECT_TO_COOKIE, redirectTo, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false
  });
};
