import { PUBLIC_API_URL } from '$env/static/public';
import type { CandlestickData } from 'lightweight-charts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, data }) => {
  const topic = params.topic;
  const accessToken = data.accessToken || '';

  const res = await fetch(`${PUBLIC_API_URL}/api/kline/${topic}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const result: {
    list: CandlestickData[];
    latest: CandlestickData;
  } = await res.json();

  return {
    topic,
    result
  };
};
