import { redirect } from '@sveltejs/kit';
import { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  console.log('page.server.ts');

  redirect(307, '/streams-api');
};
