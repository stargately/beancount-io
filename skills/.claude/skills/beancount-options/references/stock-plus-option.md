# Stock + option strategies

Strategies that combine stock with an option overlay: covered call, protective put, collar, married put.

The option transactions follow single-leg rules (`single-leg.md`). The complications come from interactions with the underlying stock — holding period, qualified-CC dividend treatment, basis adjustments on assignment.

## Covered call

You own ≥100 shares and sell a call against them.

### Open the call

Same as a naked short call (see `single-leg.md`). The stock is unchanged; only a new short option appears.

```
2026-05-01 * "STO AAPL 160C 6/20 (covered)" ^aapl-160c-20260620
  Assets:Brokerage:Robinhood:Cash                              199.35 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00160000 {200.00 USD}
  Expenses:Trading:Fees                                          0.65 USD
```

Math: 199.35 − 200 + 0.65 = 0 ✓

The "covered" status is metadata, not a different transaction. Some users add a `#covered` tag for visibility.

### Close, expire, roll

Same as any single-leg short call. See `single-leg.md` and `rolling.md`.

### Assigned

Forced to sell 100 shares at strike. Premium folds into effective sale price. See `assignment.md` § "Covered call assignment". Critically: do NOT post `Income:Trading:OptionPremium` separately.

### Qualified covered call (tax wrinkle)

A covered call is "qualified" for tax purposes if:
- Not deep in the money (strike vs price thresholds)
- More than 30 days to expiry at sale
- Other conditions around exercise

If qualified, the underlying stock's holding period continues during the call's life. If unqualified, the holding period is suspended — long-term stock can be reset to short-term if assigned.

This skill doesn't compute qualification. If the underlying is near a long-term holding milestone (>1 year), flag for the user to verify with their broker or CPA.

## Protective put

You own ≥100 shares and buy a put against them as insurance.

```
2026-05-01 * "BTO AAPL 140P 6/20 (protective)" ^aapl-140p-20260620-long
  Assets:Brokerage:Robinhood:Cash                              -150.65 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_PUT_20260620_00140000 {150.00 USD}
  Expenses:Trading:Fees                                          0.65 USD
```

Math: -150.65 + 150 + 0.65 = 0 ✓

### Married put (special case)

A "married put" is a protective put bought the same day as the stock and held with it. Tax treatment can differ — premium may add to stock basis instead of being a separate position. This is a niche election; most brokers don't apply it automatically.

Default to standard protective-put treatment unless the user explicitly says "married put with elected basis adjustment". Then ask for confirmation before generating.

### If exercised

If the protective put is in the money at expiry and you exercise, you sell 100 shares at strike. The premium **decreases** the effective sale price (= strike − premium per share).

```
2026-06-20 * "EXER AAPL 140P 6/20 → sold 100 AAPL @ 140" ^aapl-140p-20260620-long
  Assets:Brokerage:Robinhood:Cash                                  14000.00 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_PUT_20260620_00140000 {150.00 USD} @ 0.00 USD
  Assets:Brokerage:Robinhood:Stock     -100 AAPL {} @ 138.50 USD
  Income:Trading:CapitalGains
```

`{}` matches any held lot. `@ 138.50 USD` = strike − premium per share. CapitalGains auto-balances.

### If expires worthless

Loss = full premium paid. Same as a long single-leg expiry (see `single-leg.md`).

## Collar

A collar = long stock + long put + short call, typically same expiry. Three positions; the stock is pre-existing. The two option legs:

```
2026-05-01 * "Open AAPL collar 140P/160C 6/20" ^aapl-collar-20260620
  Assets:Brokerage:Robinhood:Cash                              48.70 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_PUT_20260620_00140000 {150.00 USD}
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00160000 {200.00 USD}
  Expenses:Trading:Fees                                          1.30 USD
```

Math: 48.70 + 150 + (-200) + 1.30 = 0 ✓

If the user is opening the collar simultaneously with buying stock, that's three legs in one transaction. Ask if ambiguous.

## Dividends during a covered call

Dividends post separately to `Income:Dividends`, regardless of the covered call. The call doesn't affect how the dividend is recorded.

But: qualified-vs-unqualified-CC status can affect whether the dividend qualifies for the 0/15/20% rate. Unqualified CCs during the dividend's holding period can disqualify it. This skill doesn't classify dividends; flag for user awareness if a covered call was open during ex-dividend.

## Common confusions

- **The stock side of "covered call"** doesn't have a separate transaction at open. The stock was already there.
- **At assignment of a covered call**, premium adjusts stock disposal price — do NOT book separate option income.
- **Protective put exercise** decreases stock sale proceeds; covered call assignment increases them. Mirror cases.
- **Collar net debit/credit** depends on the relative strikes and prices. Either is fine; cash leg sign reflects it.
