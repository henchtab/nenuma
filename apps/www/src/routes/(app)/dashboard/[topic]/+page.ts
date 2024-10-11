import { PUBLIC_API_URL } from "$env/static/public";
import { timeToLocal } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { CandlestickData, UTCTimestamp } from "lightweight-charts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params, data }) => {
  const topic = params.topic;

  const res = await fetch(`${PUBLIC_API_URL}/api/kline/${topic}`);
  const result: {
    list: CandlestickData[];
    latest: CandlestickData;
  } = await res.json();

  try {
    // Convert time to local one
    result.list.forEach((item) => {
      item.time = timeToLocal(item.time as number) as UTCTimestamp;
    });

    result.latest.time = timeToLocal(result.latest.time as number) as UTCTimestamp;

    return {
      topic,
      result,
    };
  } catch (e) {
    error(
      500,
      "Something went wrong! We are already notified about this issue. Please try again later.",
    );
  }
};
