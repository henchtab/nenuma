<script lang="ts">
  import { page } from "$app/stores";
  import { ws } from "$lib/stores/ws.svelte";
  import { createChart, CrosshairMode, LineStyle, type IChartApi } from "lightweight-charts";
  import { onMount } from "svelte";

  let initialChartData = $page.data?.result?.list.length
    ? [...$page.data.result.list, $page.data.result.latest]
    : [$page.data?.result?.latest];

  let chartContainer = $state() as HTMLDivElement;
  let candlestickSeries: ReturnType<IChartApi["addCandlestickSeries"]> | undefined = $state();

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
        secondsVisible: false,
        allowShiftVisibleRangeOnWhitespaceReplacement: true,
        shiftVisibleRangeOnNewBar: true,
        rightOffset: 12,
        borderVisible: false,
        ticksVisible: true,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        horzLine: {
          style: LineStyle.Dashed,
          color: "#FFAF00",
        },
        vertLine: {
          style: LineStyle.Dashed,
          color: "#FFAF00",
        },
      },
      layout: {
        textColor: "#A1A1A1",
        background: { color: "#000" },
        fontSize: 12,
        fontFamily: "Mona Sans",
      },
      grid: {
        horzLines: { color: "#FFFFFF17" },
        vertLines: { color: "#FFFFFF17" },
      },
      kineticScroll: {
        mouse: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
      },
    });
    candlestickSeries = chart.addCandlestickSeries({
      upColor: "#00AC3A",
      downColor: "#E2162A",
      borderVisible: false,
      wickUpColor: "#00AC3A",
      wickDownColor: "#E2162A",
    });

    candlestickSeries.priceScale().applyOptions({
      borderColor: "#2E2E2E",
      ticksVisible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      alignLabels: true,
    });

    candlestickSeries.setData(initialChartData);

    // chart.subscribeCrosshairMove(() => $hapticFeedback.selectionChanged());
  });
</script>

<div bind:this={chartContainer} class="w-full h-80"></div>
