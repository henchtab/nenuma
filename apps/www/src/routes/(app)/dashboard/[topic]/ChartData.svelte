<script lang="ts">
  import { page } from '$app/stores';
  import { ws } from '$lib/stores/ws.svelte';
  import {
    createChart,
    CrosshairMode,
    LineStyle,
    type CandlestickData,
    type IChartApi
  } from 'lightweight-charts';
  import { onMount } from 'svelte';
  import { hapticFeedback } from '$lib/stores/tma';

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
        fixLeftEdge: true,
        borderVisible: false,
        secondsVisible: false,
        allowShiftVisibleRangeOnWhitespaceReplacement: true,
        shiftVisibleRangeOnNewBar: true,
        rightOffset: 12
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        horzLine: {
          style: LineStyle.Dashed,
          color: '#FFAF00'
        },
        vertLine: {
          style: LineStyle.Dashed,
          color: '#FFAF00'
        }
      },
      layout: {
        textColor: '#A1A1A1',
        background: { color: '#000' },
        fontSize: 12
      },
      grid: {
        horzLines: { color: '#FFFFFF17' },
        vertLines: { color: '#FFFFFF17' }
      },
      kineticScroll: {
        mouse: true
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: false,
      }
    });
    candlestickSeries = chart.addCandlestickSeries({
      upColor: '#28A948',
      downColor: '#D8001B',
      borderVisible: false,
      wickUpColor: '#28A948',
      wickDownColor: '#D8001B'
    });

    if (initialData) {
      candlestickSeries.setData(initialData);
    }

    candlestickSeries.priceScale().applyOptions({
      borderVisible: false,
      ticksVisible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1
      },
      alignLabels: true
    });

    // chart.subscribeCrosshairMove(() => $hapticFeedback.selectionChanged());
  });
</script>

<div bind:this={chartContainer} class="w-full h-96"></div>
