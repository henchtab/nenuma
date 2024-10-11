<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import { hapticFeedback } from "$lib/stores/tma";
  import { openedPositionsCount } from "$lib/stores/positions";
  import { writable } from "svelte/store";
  import { ChartTab, PositionTab, TradeTab } from "./components";
  import { setContext } from "svelte";

  let activeTab = writable("chart");
  setContext("activeTab", activeTab);
</script>

<Tabs.Root
  class="pt-4"
  value={$activeTab}
  onValueChange={(tab) => {
    if (tab) {
      activeTab.set(tab);
    }

    $hapticFeedback.selectionChanged();
  }}
>
  <div class="container">
    <Tabs.List class="w-full">
      <Tabs.Trigger class="flex-1" value="chart">Chart</Tabs.Trigger>
      <Tabs.Trigger class="flex-1" value="trade">Trade</Tabs.Trigger>
      <Tabs.Trigger class="flex-1" value="positions"
        >Positions ({$openedPositionsCount})</Tabs.Trigger
      >
    </Tabs.List>
  </div>
  <Tabs.Content class="pt-8 mt-0" value="chart">
    <ChartTab />
  </Tabs.Content>
  <Tabs.Content class="pt-8 mt-0" value="trade">
    <TradeTab />
  </Tabs.Content>
  <Tabs.Content class="pt-8 mt-0" value="positions">
    <PositionTab />
  </Tabs.Content>
</Tabs.Root>
