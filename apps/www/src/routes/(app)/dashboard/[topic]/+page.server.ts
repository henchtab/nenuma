import { ACCESS_TOKEN_COOKIE } from "$lib/constants";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);

  return {
    accessToken,
  };
};
