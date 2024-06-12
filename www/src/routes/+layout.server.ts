import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  // const isAuthenticated = locals.isAuthenticated;

  // console.log('isAuthenticated', isAuthenticated);

  // if (isAuthenticated) {
  //   redirect(307, '/dashboard');
  // }
};
