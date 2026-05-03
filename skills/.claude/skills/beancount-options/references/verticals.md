# Verticals (two-leg spreads, same expiry)

A vertical spread is two legs of the same type (both calls or both puts), same expiry, different strikes, opposite directions. Four flavors:

| Name | Long leg | Short leg | Net premium |
|---|---|---|---|
| Bull call spread (debit) | lower strike | higher strike | pay net debit |
| Bear call spread (credit) | higher strike | lower strike | receive net credit |
| Bull put spread (credit) | lower strike | higher strike | receive net credit |
| Bear put spread (debit) | higher strike | lower strike | pay net debit |

## Cost basis convention reminder

Each leg = 1 unit. Cost basis per leg = that leg's own gross premium × 100. Don't combine premiums across legs.

## Open

One transaction, both legs as separate postings, single shared `^link`. If the broker reports a single net premium, ask for the per-leg breakdown (or estimate from market mid prices) — each leg needs its own basis.

### Bull put spread (credit) example

Sold 1 SPY 480P 6/20 @ $2.10 ($210 basis), bought 1 SPY 475P 6/20 @ $1.00 ($100 basis). Fees $1.30 total. Net credit $1.10 ($110), net cash after fees $108.70.

```
2026-05-01 * "STO bull put spread SPY 480/475 6/20" ^spy-bps-480-475-20260620
  Assets:Brokerage:Robinhood:Cash                              108.70 USD
  Assets:Brokerage:Robinhood:Options    -1 SPY_PUT_20260620_00480000 {210.00 USD}
  Assets:Brokerage:Robinhood:Options     1 SPY_PUT_20260620_00475000 {100.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: 108.70 + (-210) + 100 + 1.30 = 0 ✓

### Bull call spread (debit) example

Bought 1 AAPL 150C 6/20 @ $4.50 ($450 basis), sold 1 AAPL 155C 6/20 @ $2.20 ($220 basis). Fees $1.30. Net debit $2.30 ($230), net cash -$231.30.

```
2026-05-01 * "BTO bull call spread AAPL 150/155 6/20" ^aapl-bcs-150-155-20260620
  Assets:Brokerage:Robinhood:Cash                              -231.30 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00150000 {450.00 USD}
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00155000 {220.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: -231.30 + 450 + (-220) + 1.30 = 0 ✓

## Close

Mirror of open. Both legs flatten in one transaction, single link, `Income:Trading:OptionPremium` auto-balances net P&L.

```
2026-06-15 * "BTC bull put spread SPY 480/475 6/20" ^spy-bps-480-475-20260620
  Assets:Brokerage:Robinhood:Cash                                       -41.30 USD
  Assets:Brokerage:Robinhood:Options    1 SPY_PUT_20260620_00480000 {210.00 USD} @ 50.00 USD
  Assets:Brokerage:Robinhood:Options   -1 SPY_PUT_20260620_00475000 {100.00 USD} @ 10.00 USD
  Expenses:Trading:Fees                                                  1.30 USD
  Income:Trading:OptionPremium
```

Auto-balance: -41.30 + 210 + (-100) + 1.30 + Income = 0 → Income = -70.00 (credit, $70 net realized gain on the spread).

## Expire worthless

A credit spread that finishes OTM expires worthless on both legs:

```
2026-06-20 * "EXP bull put spread SPY 480/475 6/20 worthless" ^spy-bps-480-475-20260620
  Assets:Brokerage:Robinhood:Options    1 SPY_PUT_20260620_00480000 {210.00 USD} @ 0.00 USD
  Assets:Brokerage:Robinhood:Options   -1 SPY_PUT_20260620_00475000 {100.00 USD} @ 0.00 USD
  Income:Trading:OptionPremium
```

Auto-balance: 210 − 100 + Income = 0 → Income = -110.00 (the full net credit kept).

## Partial assignment / partial expiry

Possible if the underlying lands between the two strikes. Example: SPY closes at $478 with a 480/475 bull put spread.
- Short 480P → in the money → assigned
- Long 475P → out of the money → expires worthless

Two separate transactions:

```
2026-06-20 * "ASSN SPY 480P 6/20" ^spy-bps-480-475-20260620
  Assets:Brokerage:Robinhood:Cash                                  -48000.00 USD
  Assets:Brokerage:Robinhood:Options    1 SPY_PUT_20260620_00480000 {210.00 USD} @ 0.00 USD
  Assets:Brokerage:Robinhood:Stock      100 SPY {477.90 USD}

2026-06-20 * "EXP SPY 475P 6/20 worthless" ^spy-bps-480-475-20260620
  Assets:Brokerage:Robinhood:Options   -1 SPY_PUT_20260620_00475000 {100.00 USD} @ 0.00 USD
  Income:Trading:OptionPremium
```

Long leg's premium realized as a loss on its own row (Income = +$100 debit, i.e. $100 loss). Short leg's premium adjusts stock basis (see `assignment.md`).

## Common confusions

- **Don't allocate the entire net credit to one leg.** Each leg has its OWN basis from its OWN fill price. If broker only gives a net, ask for per-leg or estimate from market prices at fill.
- **Both legs share one `^link`** at open and close — that's the reconciliation hook for the spread.
- **At close, both legs must close.** Don't leave one open unless you intend to (then it's a different position).

## Rolling a vertical

See `rolling.md`. Roll = BTC the entire spread (one transaction, both legs) + STO a new spread (one transaction, two new legs). Two transactions total, each with its own link.
