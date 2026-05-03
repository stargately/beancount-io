# Condors and butterflies (3-4 leg structures)

Multi-leg structures combining puts and calls into defined-risk positions. From beancount's perspective, they're N legs in one transaction sharing a `^link`.

Cost basis convention: each leg has its own gross premium × 100 as basis. Quantity matters (butterfly middle = 2 contracts; iron condor = 1 of each).

## Iron condor (4 legs)

Sell a put spread + sell a call spread. Same expiry across all legs.

Example: SPY iron condor 6/20 — long 470P, short 475P, short 500C, long 505C. Per-leg premiums (illustrative): 0.40 / 0.90 / 1.00 / 0.30. Net credit: $1.20 per spread. Fees $2.60.

```
2026-05-01 * "STO iron condor SPY 470/475/500/505 6/20" ^spy-ic-20260620
  Assets:Brokerage:Robinhood:Cash                              117.40 USD
  Assets:Brokerage:Robinhood:Options     1 SPY_PUT_20260620_00470000  {40.00 USD}
  Assets:Brokerage:Robinhood:Options    -1 SPY_PUT_20260620_00475000  {90.00 USD}
  Assets:Brokerage:Robinhood:Options    -1 SPY_CALL_20260620_00500000 {100.00 USD}
  Assets:Brokerage:Robinhood:Options     1 SPY_CALL_20260620_00505000 {30.00 USD}
  Expenses:Trading:Fees                                          2.60 USD
```

Math: 117.40 + 40 + (-90) + (-100) + 30 + 2.60 = 0 ✓

Close, expire, roll: same pattern as verticals — one transaction with all legs, single `^link`. Partial events: split into per-leg transactions for the legs that close at expiry.

## Iron butterfly (4 legs)

Same structure as iron condor but the inner short legs share the same strike (call and put at the money). Same transaction shape; different strikes. No special handling.

## Butterfly (3 legs, same type)

A call butterfly: long 1 lower strike, short 2 middle strike, long 1 upper strike. All calls or all puts. Same expiry.

Example: AAPL call butterfly 145/150/155 6/20. Premiums: 6.00 / 3.00 / 1.00. Fees $1.30.

```
2026-05-01 * "BTO call butterfly AAPL 145/150/155 6/20" ^aapl-cb-20260620
  Assets:Brokerage:Robinhood:Cash                              -101.30 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00145000 {600.00 USD}
  Assets:Brokerage:Robinhood:Options    -2 AAPL_CALL_20260620_00150000 {300.00 USD}
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00155000 {100.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: -101.30 + 600 + (-2 × 300) + 100 + 1.30 = -101.30 + 600 - 600 + 100 + 1.30 = 0 ✓

Note `-2` quantity on the middle short.

## Broken-wing variants

A broken-wing condor or butterfly has unequal wing distances (e.g., 470/475/500/510 instead of 470/475/500/505). Same transaction structure; just different strikes. May produce a net credit when the standard version would be net debit, but doesn't change beancount mechanics.

## Common confusions

- **All legs in one transaction.** Don't split a 4-leg spread into 4 separate transactions unless the broker fills them on different tickets.
- **Quantity matters.** Butterfly middle has 2 contracts; iron condor has 1 of each. Get it right.
- **Mixing calls and puts.** Iron condor has both call and put legs; butterfly is single-type.
- **Per-leg cost basis.** Each leg's basis = its OWN gross premium × 100, NOT a share of the net.
- **Partial events.** If only some legs assign/expire, split into per-leg transactions.
