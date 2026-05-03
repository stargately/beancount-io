# Volatility strategies (straddles and strangles)

Two-leg structures betting on volatility (long versions) or lack of it (short versions).

| Strategy | Structure |
|---|---|
| Long straddle | Buy 1 call + buy 1 put, **same** strike, same expiry |
| Short straddle | Sell 1 call + sell 1 put, **same** strike, same expiry |
| Long strangle | Buy 1 OTM call + buy 1 OTM put, different strikes, same expiry |
| Short strangle | Sell 1 OTM call + sell 1 OTM put, different strikes, same expiry |

Cost basis: per leg = that leg's own gross premium × 100.

## Open

One transaction, two postings, single `^link`.

### Short strangle example

Sold AAPL 145P @ $1.20 ($120 basis) + AAPL 160C @ $1.50 ($150 basis), both 6/20. Fees $1.30. Net credit $2.70 ($270), net cash $268.70.

```
2026-05-01 * "STO short strangle AAPL 145P/160C 6/20" ^aapl-stsg-20260620
  Assets:Brokerage:Robinhood:Cash                              268.70 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_PUT_20260620_00145000  {120.00 USD}
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00160000 {150.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: 268.70 + (-120) + (-150) + 1.30 = 0 ✓

### Long straddle example

Bought AAPL 150P @ $2.00 ($200 basis) + AAPL 150C @ $3.00 ($300 basis), both 6/20. Fees $1.30. Net debit $5.00 ($500), net cash -$501.30.

```
2026-05-01 * "BTO long straddle AAPL 150 6/20" ^aapl-lsd-20260620
  Assets:Brokerage:Robinhood:Cash                              -501.30 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_PUT_20260620_00150000  {200.00 USD}
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00150000 {300.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: -501.30 + 200 + 300 + 1.30 = 0 ✓

## Close, expire, partial assignment

Same patterns as verticals. Both legs flatten in one transaction (close), share one `^link`, `Income:Trading:OptionPremium` auto-balances net P&L.

For a short strangle, partial assignment is common — usually only one side ends up in the money. Generate one assignment transaction (see `assignment.md`) for the assigned leg + one expiry transaction for the worthless leg.

## Common confusions

- **Straddle vs strangle**: same strike vs different strikes. Same beancount mechanics; just different commodity symbols.
- **Both legs in one transaction at open and close**, single link.
- **Short straddle/strangle is undefined risk** (no protective leg). Strictly a buying-power consideration; doesn't change beancount mechanics.
