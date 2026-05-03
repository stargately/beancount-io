# Calendars and diagonals (different-expiry spreads)

Two-leg spreads where legs have **different expiries**. Same strike (calendar) or different strikes (diagonal).

| Strategy | Strikes | Expiries |
|---|---|---|
| Calendar spread | Same | Different (sell near, buy far) |
| Diagonal spread | Different | Different |
| Double calendar | Two strikes | Two expiries (4 legs) |

Cost basis: per leg = its own gross premium × 100.

## Open

One transaction, two postings (or four for double calendar), single `^link`.

### Calendar spread example

Sold AAPL 150C 6/20 (near) @ $2.00 ($200 basis), bought AAPL 150C 7/18 (far) @ $3.50 ($350 basis). Fees $1.30. Net debit $1.50 ($150), net cash -$151.30.

```
2026-05-01 * "BTO calendar AAPL 150C 6/20-7/18" ^aapl-cal-150c-20260620-20260718
  Assets:Brokerage:Robinhood:Cash                              -151.30 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00150000 {200.00 USD}
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260718_00150000 {350.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: -151.30 + (-200) + 350 + 1.30 = 0 ✓

### Diagonal spread example

Sold AAPL 155C 6/20 @ $1.50 ($150 basis), bought AAPL 150C 7/18 @ $3.50 ($350 basis). Fees $1.30. Net debit $2.00 ($200), net cash -$201.30.

```
2026-05-01 * "BTO diagonal AAPL 155/150C 6/20-7/18" ^aapl-diag-20260620-20260718
  Assets:Brokerage:Robinhood:Cash                              -201.30 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00155000 {150.00 USD}
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260718_00150000 {350.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: -201.30 + (-150) + 350 + 1.30 = 0 ✓

## Close

Same as verticals — one transaction, both legs flatten, single link, `Income:Trading:OptionPremium` auto-balances.

## The asymmetry: legs expire at different times

The defining wrinkle: the near leg expires before the far leg. When this happens:
- The near leg expires (or is assigned/closed) on its expiry date as its own transaction.
- The far leg remains open as a single-leg long from that point.

Effectively transitions from a two-leg spread to a single-leg long. After the near leg expires:
- Original `^link` covers both events for audit
- Remaining far leg stands alone; can be closed or rolled later

If the user closes the entire spread before near-leg expiry, single transaction. If the near leg expires first, two transactions (near's expiry, then later far's close or expiry).

## Common confusions

- **Don't mix expiries in one commodity symbol.** Each leg's commodity has its own expiry encoded; symbols differ even if strike is the same.
- **The near leg's expiry is its own event.** Don't try to keep a "calendar" position open after the near leg expires — it's now a single long.
- **Double calendar is 4 legs**, not 2 — calendar at one strike + calendar at another strike.
