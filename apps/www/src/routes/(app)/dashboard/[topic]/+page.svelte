<script lang="ts">
  import * as Tabs from '$lib/components/ui/tabs';
  import { hapticFeedback } from '$lib/stores/tma';
  import type { PageData } from './$types';
  import { ChartTab, TradeTab } from './components';

  // type BaseOption = {
  //   optionId: number;
  // };

  // type PendingOption = BaseOption & {
  //   status: 'pending';
  //   draft: CashOrNothingOptionDraftAgreement;
  // };

  // type DeployedOption = BaseOption & {
  //   status: 'deployed';
  //   address: Address;
  //   agreement: CashOrNothingOptionAgreement;
  // };

  // type InitiatedOption = Omit<DeployedOption, 'status'> & {
  //   status: 'initiated';
  //   strikePrice: number;
  // };

  // type SettledOption = Omit<InitiatedOption, 'status'> & {
  //   status: 'settled';
  // };

  // type ExpiredOption = Omit<DeployedOption, 'status'> & {
  //   status: 'expired';
  // };

  // type Option = PendingOption | DeployedOption | InitiatedOption | SettledOption | ExpiredOption;

  let { data }: { data: PageData } = $props();

  // const options = getContext<Writable<Option[]>>('options');
</script>

<Tabs.Root class="pt-4" value="chart" onValueChange={() => $hapticFeedback.selectionChanged()}>
  <div class="container">
    <Tabs.List class="w-full">
      <Tabs.Trigger class="flex-1" value="chart">Chart</Tabs.Trigger>
      <Tabs.Trigger class="flex-1" value="trade">Trade</Tabs.Trigger>
    </Tabs.List>
  </div>
  <Tabs.Content class="pt-8 mt-0" value="chart">
    <ChartTab />
  </Tabs.Content>
  <Tabs.Content class="pt-8 mt-0" value="trade">
    <TradeTab />
  </Tabs.Content>
</Tabs.Root>
