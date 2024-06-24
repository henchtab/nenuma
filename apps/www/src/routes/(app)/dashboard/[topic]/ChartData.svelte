<script lang="ts">
  import { page } from '$app/stores';
  import { ws } from '$lib/stores/ws.svelte';
  import { createChart, type CandlestickData, type IChartApi } from 'lightweight-charts';
  import { onMount } from 'svelte';

  let { initialData }: { initialData: CandlestickData[] } = $props();

  let chartContainer = $state() as HTMLDivElement;
  let candlestickSeries: ReturnType<IChartApi['addCandlestickSeries']> | undefined = $state();

  $effect(() => {
    if (
      $ws.currentMessage &&
      $ws.currentMessage.topic === $page.params.topic &&
      candlestickSeries
    ) {
      candlestickSeries.update($ws.currentMessage.data);
    }
  });

  onMount(() => {
    const chart = createChart(chartContainer, {
      timeScale: {
        timeVisible: true,
        fixRightEdge: true,
        rightBarStaysOnScroll: true,
      },
      layout: {
        textColor: '#fff',
        background: { color: '#000' }
      }
    });
    candlestickSeries = chart.addCandlestickSeries({
      upColor: '#28A948',
      downColor: '#D8001B',
      borderVisible: false,
      wickUpColor: '#28A948',
      wickDownColor: '#D8001B',
      priceLineColor: '#000000'
    });

    if (initialData) {
      candlestickSeries.setData(initialData);
    }

    candlestickSeries.priceScale().applyOptions({
      borderVisible: false,
      ticksVisible: true
    });
  });
</script>

<div bind:this={chartContainer} class="w-full h-96"></div>
