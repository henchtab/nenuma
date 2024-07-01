import { redirect } from '@sveltejs/kit';
import { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  redirect(307, '/streams-api');
};
