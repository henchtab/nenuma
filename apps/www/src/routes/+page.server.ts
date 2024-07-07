import { redirect } from '@sveltejs/kit';
import { PageServerLoad } from './$types';
import { ACCESS_TOKEN_COOKIE, REDIRECT_URL_COOKIE } from '$lib/constants';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const redirectUrl = url.searchParams.get('redirectUrl') || '/dashboard';
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);

  if (accessToken) {
    redirect(307, redirectUrl);
  }

  cookies.set(REDIRECT_URL_COOKIE, redirectUrl, {
    path: '/',
    secure: false,
    httpOnly: false
  });
};
