# TACT Compilation Report
Contract: CashOrNothingOption
BOC Size: 3275 bytes

# Types
Total Types: 62

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## DSTDeploy
TLB: `dst_deploy#123f3826 queryId:uint64 = DSTDeploy`
Signature: `DSTDeploy{queryId:uint64}`

## DSTDeploySuccess
TLB: `dst_deploy_success#ebe9211f queryId:uint64 = DSTDeploySuccess`
Signature: `DSTDeploySuccess{queryId:uint64}`

## DSTDeployBatch
TLB: `dst_deploy_batch#b38ec08a queryId:uint64 = DSTDeployBatch`
Signature: `DSTDeployBatch{queryId:uint64}`

## DSTDeployBatchSuccess
TLB: `dst_deploy_batch_success#4b2b72ce queryId:uint64 batch:address = DSTDeployBatchSuccess`
Signature: `DSTDeployBatchSuccess{queryId:uint64,batch:address}`

## DSTDeploySession
TLB: `dst_deploy_session#62d58591 queryId:uint64 = DSTDeploySession`
Signature: `DSTDeploySession{queryId:uint64}`

## DSTDeploySessionSuccess
TLB: `dst_deploy_session_success#cdc93f86 queryId:uint64 session:address = DSTDeploySessionSuccess`
Signature: `DSTDeploySessionSuccess{queryId:uint64,session:address}`

## DSTSubscribe
TLB: `dst_subscribe#bfb56652 queryId:uint64 subscriber:address notificationsCount:int257 = DSTSubscribe`
Signature: `DSTSubscribe{queryId:uint64,subscriber:address,notificationsCount:int257}`

## DSTSubscribeSuccess
TLB: `dst_subscribe_success#e0b74758 queryId:uint64 batch:address remainingNotificationsCount:int257 = DSTSubscribeSuccess`
Signature: `DSTSubscribeSuccess{queryId:uint64,batch:address,remainingNotificationsCount:int257}`

## Candlestick
TLB: `_ start:int257 end:int257 open:int257 close:int257 high:int257 low:int257 = Candlestick`
Signature: `Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257}`

## DSTPublishCandlestick
TLB: `dst_publish_candlestick#3b0b3d3d queryId:uint64 candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257} = DSTPublishCandlestick`
Signature: `DSTPublishCandlestick{queryId:uint64,candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257}}`

## DSTPublishCandlestickSuccess
TLB: `dst_publish_candlestick_success#0cd28645 queryId:uint64 = DSTPublishCandlestickSuccess`
Signature: `DSTPublishCandlestickSuccess{queryId:uint64}`

## DSTUnsubscribedNotification
TLB: `dst_unsubscribed_notification#4cb7a0c4 queryId:uint64 remainingNotificationsCount:int257 = DSTUnsubscribedNotification`
Signature: `DSTUnsubscribedNotification{queryId:uint64,remainingNotificationsCount:int257}`

## SBDeploy
TLB: `sb_deploy#fe5e9e45 queryId:uint64 = SBDeploy`
Signature: `SBDeploy{queryId:uint64}`

## SBDeploySuccess
TLB: `sb_deploy_success#3d788f0e queryId:uint64 batchId:int257 = SBDeploySuccess`
Signature: `SBDeploySuccess{queryId:uint64,batchId:int257}`

## SBSubscribe
TLB: `sb_subscribe#774d40a2 queryId:uint64 session:address notificationsCount:int257 = SBSubscribe`
Signature: `SBSubscribe{queryId:uint64,session:address,notificationsCount:int257}`

## SBSubscribeSuccess
TLB: `sb_subscribe_success#f3563547 queryId:uint64 session:address remainingNotificationsCount:int257 = SBSubscribeSuccess`
Signature: `SBSubscribeSuccess{queryId:uint64,session:address,remainingNotificationsCount:int257}`

## SBPublishCandlestick
TLB: `sb_publish_candlestick#f1762622 queryId:uint64 candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257} publisher:address = SBPublishCandlestick`
Signature: `SBPublishCandlestick{queryId:uint64,candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257},publisher:address}`

## SBCandlestickPublishedNotification
TLB: `sb_candlestick_published_notification#f8e0060d queryId:uint64 candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257} remainingNotificationsCount:int257 = SBCandlestickPublishedNotification`
Signature: `SBCandlestickPublishedNotification{queryId:uint64,candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257},remainingNotificationsCount:int257}`

## SBUnsubscribedNotification
TLB: `sb_unsubscribed_notification#3bcab824 queryId:uint64 session:address remainingNotificationsCount:int257 = SBUnsubscribedNotification`
Signature: `SBUnsubscribedNotification{queryId:uint64,session:address,remainingNotificationsCount:int257}`

## SBPublishCandlestickSuccess
TLB: `sb_publish_candlestick_success#3d406a4a queryId:uint64 = SBPublishCandlestickSuccess`
Signature: `SBPublishCandlestickSuccess{queryId:uint64}`

## SESDeploy
TLB: `ses_deploy#51d18c4c queryId:uint64 = SESDeploy`
Signature: `SESDeploy{queryId:uint64}`

## SESDeploySuccess
TLB: `ses_deploy_success#1016fdca queryId:uint64 subscriber:address = SESDeploySuccess`
Signature: `SESDeploySuccess{queryId:uint64,subscriber:address}`

## SESSubscribe
TLB: `ses_subscribe#5b6c4b57 queryId:uint64 notificationsCount:int257 = SESSubscribe`
Signature: `SESSubscribe{queryId:uint64,notificationsCount:int257}`

## DSTTopUpSubscription
TLB: `dst_top_up_subscription#1d8fed1e queryId:uint64 subscriber:address batch:address notificationsCount:int257 = DSTTopUpSubscription`
Signature: `DSTTopUpSubscription{queryId:uint64,subscriber:address,batch:address,notificationsCount:int257}`

## SBTopUpSubscription
TLB: `sb_top_up_subscription#0ff79718 queryId:uint64 session:address notificationsCount:int257 = SBTopUpSubscription`
Signature: `SBTopUpSubscription{queryId:uint64,session:address,notificationsCount:int257}`

## SESSubscribeSuccess
TLB: `ses_subscribe_success#5372e3d3 queryId:uint64 remainingNotificationsCount:int257 = SESSubscribeSuccess`
Signature: `SESSubscribeSuccess{queryId:uint64,remainingNotificationsCount:int257}`

## SESCandlestickPublishedNotification
TLB: `ses_candlestick_published_notification#beca4454 queryId:uint64 candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257} remainingNotificationsCount:int257 = SESCandlestickPublishedNotification`
Signature: `SESCandlestickPublishedNotification{queryId:uint64,candlestick:Candlestick{start:int257,end:int257,open:int257,close:int257,high:int257,low:int257},remainingNotificationsCount:int257}`

## SESUnsubscribedNotification
TLB: `ses_unsubscribed_notification#f3ef9c7a queryId:uint64 remainingNotificationsCount:int257 = SESUnsubscribedNotification`
Signature: `SESUnsubscribedNotification{queryId:uint64,remainingNotificationsCount:int257}`

## SESUnsubscribe
TLB: `ses_unsubscribe#9f0ffd85 queryId:uint64 = SESUnsubscribe`
Signature: `SESUnsubscribe{queryId:uint64}`

## SBUnsubscribe
TLB: `sb_unsubscribe#41515954 queryId:uint64 = SBUnsubscribe`
Signature: `SBUnsubscribe{queryId:uint64}`

## SESDestroy
TLB: `ses_destroy#84b9f889 queryId:uint64 = SESDestroy`
Signature: `SESDestroy{queryId:uint64}`

## SESDestroySuccess
TLB: `ses_destroy_success#014e6b93 queryId:uint64 = SESDestroySuccess`
Signature: `SESDestroySuccess{queryId:uint64}`

## BRGDeploy
TLB: `brg_deploy#fa108535 queryId:uint64 = BRGDeploy`
Signature: `BRGDeploy{queryId:uint64}`

## BRGDeploySuccess
TLB: `brg_deploy_success#bb564d93 queryId:uint64 = BRGDeploySuccess`
Signature: `BRGDeploySuccess{queryId:uint64}`

## BRGDeployBroker
TLB: `brg_deploy_broker#11d1effe queryId:uint64 stream:address = BRGDeployBroker`
Signature: `BRGDeployBroker{queryId:uint64,stream:address}`

## BRKDeploy
TLB: `brk_deploy#51708f5d queryId:uint64 = BRKDeploy`
Signature: `BRKDeploy{queryId:uint64}`

## BRKDeploySuccess
TLB: `brk_deploy_success#972ea4c2 queryId:uint64 stream:address = BRKDeploySuccess`
Signature: `BRKDeploySuccess{queryId:uint64,stream:address}`

## BRGDeployBrokerSuccess
TLB: `brg_deploy_broker_success#f0ee3e25 queryId:uint64 broker:address = BRGDeployBrokerSuccess`
Signature: `BRGDeployBrokerSuccess{queryId:uint64,broker:address}`

## BRGDeployAccount
TLB: `brg_deploy_account#c0c2416a queryId:uint64 = BRGDeployAccount`
Signature: `BRGDeployAccount{queryId:uint64}`

## BRADeploy
TLB: `bra_deploy#466d2081 queryId:uint64 = BRADeploy`
Signature: `BRADeploy{queryId:uint64}`

## BRADeploySuccess
TLB: `bra_deploy_success#d1adde56 queryId:uint64 trader:address = BRADeploySuccess`
Signature: `BRADeploySuccess{queryId:uint64,trader:address}`

## BRGDeployAccountSuccess
TLB: `brg_deploy_account_success#75007086 queryId:uint64 account:address = BRGDeployAccountSuccess`
Signature: `BRGDeployAccountSuccess{queryId:uint64,account:address}`

## BRKDeposit
TLB: `brk_deposit#7fa9b2b4 queryId:uint64 = BRKDeposit`
Signature: `BRKDeposit{queryId:uint64}`

## BRKDepositSuccess
TLB: `brk_deposit_success#7b0c9548 queryId:uint64 = BRKDepositSuccess`
Signature: `BRKDepositSuccess{queryId:uint64}`

## BRKWithdraw
TLB: `brk_withdraw#20d2e1b7 queryId:uint64 = BRKWithdraw`
Signature: `BRKWithdraw{queryId:uint64}`

## BRKWithdrawSuccess
TLB: `brk_withdraw_success#9e3d0a1a queryId:uint64 = BRKWithdrawSuccess`
Signature: `BRKWithdrawSuccess{queryId:uint64}`

## Fraction
TLB: `_ nominator:int257 denominator:int257 = Fraction`
Signature: `Fraction{nominator:int257,denominator:int257}`

## CashOrNothingOptionDraftAgreement
TLB: `_ holder:address initiation:int257 expiration:int257 optionType:bool investment:int257 = CashOrNothingOptionDraftAgreement`
Signature: `CashOrNothingOptionDraftAgreement{holder:address,initiation:int257,expiration:int257,optionType:bool,investment:int257}`

## BrokerDeployOption
TLB: `broker_deploy_option#4605e3d9 queryId:uint64 draft:CashOrNothingOptionDraftAgreement{holder:address,initiation:int257,expiration:int257,optionType:bool,investment:int257} = BrokerDeployOption`
Signature: `BrokerDeployOption{queryId:uint64,draft:CashOrNothingOptionDraftAgreement{holder:address,initiation:int257,expiration:int257,optionType:bool,investment:int257}}`

## BrokerDeployOptionSuccess
TLB: `broker_deploy_option_success#9156a41b queryId:uint64 stream:address option:address = BrokerDeployOptionSuccess`
Signature: `BrokerDeployOptionSuccess{queryId:uint64,stream:address,option:address}`

## CashOrNothingOptionDeploy
TLB: `cash_or_nothing_option_deploy#c74f6284 queryId:uint64 stream:address agreement:CashOrNothingOptionAgreement{holder:address,writer:address,initiation:uint32,expiration:uint32,optionType:bool,investment:coins,payout:coins} = CashOrNothingOptionDeploy`
Signature: `CashOrNothingOptionDeploy{queryId:uint64,stream:address,agreement:CashOrNothingOptionAgreement{holder:address,writer:address,initiation:uint32,expiration:uint32,optionType:bool,investment:coins,payout:coins}}`

## CashOrNothingOptionDeploySuccess
TLB: `cash_or_nothing_option_deploy_success#9f1c052d queryId:uint64 optionId:int257 holder:address = CashOrNothingOptionDeploySuccess`
Signature: `CashOrNothingOptionDeploySuccess{queryId:uint64,optionId:int257,holder:address}`

## CashOrNothingOptionSettledInMoneyNotification
TLB: `cash_or_nothing_option_settled_in_money_notification#ff379604 queryId:uint64 = CashOrNothingOptionSettledInMoneyNotification`
Signature: `CashOrNothingOptionSettledInMoneyNotification{queryId:uint64}`

## CashOrNothingOptionSettledOutMoneyNotification
TLB: `cash_or_nothing_option_settled_out_money_notification#1800dc14 queryId:uint64 = CashOrNothingOptionSettledOutMoneyNotification`
Signature: `CashOrNothingOptionSettledOutMoneyNotification{queryId:uint64}`

## CashOrNothingOptionSettledAtMoneyNotification
TLB: `cash_or_nothing_option_settled_at_money_notification#50240b79 queryId:uint64 = CashOrNothingOptionSettledAtMoneyNotification`
Signature: `CashOrNothingOptionSettledAtMoneyNotification{queryId:uint64}`

## CashOrNothingOptionAgreement
TLB: `_ holder:address writer:address initiation:uint32 expiration:uint32 optionType:bool investment:coins payout:coins = CashOrNothingOptionAgreement`
Signature: `CashOrNothingOptionAgreement{holder:address,writer:address,initiation:uint32,expiration:uint32,optionType:bool,investment:coins,payout:coins}`

## SubscriberDestroyedNotification
TLB: `subscriber_destroyed_notification#86560ea9 queryId:uint64 = SubscriberDestroyedNotification`
Signature: `SubscriberDestroyedNotification{queryId:uint64}`

## SubscriberCheckTimeout
TLB: `subscriber_check_timeout#53539d13 queryId:uint64 = SubscriberCheckTimeout`
Signature: `SubscriberCheckTimeout{queryId:uint64}`

## SubscriberTimeoutExceeded
TLB: `subscriber_timeout_exceeded#aa5525e4 queryId:uint64 = SubscriberTimeoutExceeded`
Signature: `SubscriberTimeoutExceeded{queryId:uint64}`

# Get Methods
Total Get Methods: 10

## optionId

## agreement

## strikePrice

## latestCandlestick

## balance

## deployerAddress

## streamAddress

## notificationsCount

## expiration

## sessionAddress

# Error Codes
2: Stack underflow
3: Stack overflow
4: Integer overflow
5: Integer out of expected range
6: Invalid opcode
7: Type check error
8: Cell overflow
9: Cell underflow
10: Dictionary error
13: Out of gas error
32: Method ID not found
34: Action is invalid or not supported
37: Not enough TON
38: Not enough extra-currencies
128: Null reference exception
129: Invalid serialization prefix
130: Invalid incoming message
131: Constraints error
132: Access denied
133: Contract stopped
134: Invalid argument
135: Code of a contract was not found
136: Invalid address
137: Masterchain support is not enabled for this contract