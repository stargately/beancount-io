# Exotic strategies

Less common strategies, but they all follow the same primitives: legs in transactions, shared links, cost basis = gross premium × 100 per contract per leg.

## Synthetic positions

A synthetic long stock = long call + short put, same strike, same expiry. P&L mimics holding 100 shares without owning them.

```
2026-05-01 * "Synthetic long AAPL 150 6/20" ^aapl-synth-150-20260620
  Assets:Brokerage:Robinhood:Cash                              -1.30 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00150000 {300.00 USD}
  Assets:Brokerage:Robinhood:Options    -1 AAPL_PUT_20260620_00150000  {300.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: -1.30 + 300 + (-300) + 1.30 = 0 ✓

Synthetic short stock = short call + long put. Mirror.

Conversion / reversal = long stock + synthetic short / short stock + synthetic long. Three legs across two transactions if the option pair fills together.

## Ratio spreads

Unequal numbers of long and short legs. Example: 1×2 ratio call spread = long 1 call at lower strike, short 2 calls at higher strike.

```
2026-05-01 * "BTO 1x2 ratio call spread AAPL 150/155 6/20" ^aapl-ratio-20260620
  Assets:Brokerage:Robinhood:Cash                              -101.30 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00150000 {400.00 USD}
  Assets:Brokerage:Robinhood:Options    -2 AAPL_CALL_20260620_00155000 {150.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: -101.30 + 400 + (-2 × 150) + 1.30 = -101.30 + 400 - 300 + 1.30 = 0 ✓

Quantity matters — `-2` not `-1`.

## Jade lizard

Short put + short call spread (3 legs). Combination of CSP + bear call spread.

Example: AAPL jade lizard — short 145P @ $1.20, short 160C @ $1.80, long 165C @ $0.30. Fees $1.95.

```
2026-05-01 * "STO jade lizard AAPL 145P 160/165C 6/20" ^aapl-jade-20260620
  Assets:Brokerage:Robinhood:Cash                              268.05 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_PUT_20260620_00145000  {120.00 USD}
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00160000 {180.00 USD}
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00165000 {30.00 USD}
  Expenses:Trading:Fees                                          1.95 USD
```

Math: 268.05 + (-120) + (-180) + 30 + 1.95 = 0 ✓

## Common pattern

For any exotic, the recipe is:
1. Identify the legs (direction, type, strike, expiry, qty per leg).
2. One transaction at open with all legs as separate postings, shared `^link`.
3. Close mirrors open.
4. Partial outcomes (some legs assigned/expired) split into per-leg transactions when they happen.

If the user describes a strategy by name not listed here, ask them to enumerate the legs explicitly.
