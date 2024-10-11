import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({}) => {
  return redirect(307, "/dashboard/BTCUSDT");
};
