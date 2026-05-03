# Single-leg options

Covers: long call, long put, short call (naked), short put (naked or cash-secured).

For covered calls and protective puts (single-leg option layered on existing stock), see `stock-plus-option.md`.

## Cost basis convention

Each option contract is **1 unit** in beancount. Cost basis on that unit equals the **gross dollar premium** (premium × 100), e.g. `{150.00 USD}` for a $1.50 contract — NOT `{1.50 USD}`.

Fees are an explicit `Expenses:Trading:Fees` posting; cash leg holds the net (gross ± fees).

## Open

### Sell to open (short put or short call)

You receive premium. Short position = -1 unit at cost basis = gross premium × 100.

```
2026-05-01 * "STO AAPL 150P 6/20" ^aapl-150p-20260620
  Assets:Brokerage:Robinhood:Cash                              149.35 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_PUT_20260620_00150000 {150.00 USD}
  Expenses:Trading:Fees                                          0.65 USD
```

Math check: 149.35 (net cash) − 150.00 (basis on -1 unit) + 0.65 (fees) = 0 ✓

For a naked call, identical structure with `_CALL_` in the symbol.

### Buy to open (long call or long put)

You pay premium. Long position = +1 unit at cost basis = gross premium × 100.

```
2026-05-01 * "BTO AAPL 160C 6/20" ^aapl-160c-20260620-long
  Assets:Brokerage:Robinhood:Cash                              -200.65 USD
  Assets:Brokerage:Robinhood:Options     1 AAPL_CALL_20260620_00160000 {200.00 USD}
  Expenses:Trading:Fees                                          0.65 USD
```

Math check: -200.65 + 200.00 + 0.65 = 0 ✓

## Close

### Buy to close (closing a short)

You pay to flatten a short. Use `{original_basis} @ close_premium × 100` syntax. `Income:Trading:OptionPremium` auto-balances to absorb realized P&L.

```
2026-06-15 * "BTC AAPL 150P 6/20" ^aapl-150p-20260620
  Assets:Brokerage:Robinhood:Cash                                       -40.65 USD
  Assets:Brokerage:Robinhood:Options    1 AAPL_PUT_20260620_00150000 {150.00 USD} @ 40.00 USD
  Expenses:Trading:Fees                                                  0.65 USD
  Income:Trading:OptionPremium
```

Math: -40.65 + 150.00 + 0.65 + Income = 0 → Income = -110.00 USD (credit). Realized gain = +$110 (received $150 basis on STO, paid $40 BTC, plus net fees).

The same `^link` as the STO ties the pair together for reconciliation.

### Sell to close (closing a long)

```
2026-06-15 * "STC AAPL 160C 6/20" ^aapl-160c-20260620-long
  Assets:Brokerage:Robinhood:Cash                                       249.35 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00160000 {200.00 USD} @ 250.00 USD
  Expenses:Trading:Fees                                                  0.65 USD
  Income:Trading:OptionPremium
```

Math: 249.35 + (-1 × 200) + 0.65 + Income = 0 → Income = -50.00 USD (credit). Realized gain = +$50 (paid $200 basis at BTO, received $250 STC, minus fees).

## Expire worthless

Identical to a close at $0 premium and no cash leg.

For a short that expires worthless (full premium kept):
```
2026-06-20 * "EXP AAPL 150P 6/20 worthless" ^aapl-150p-20260620
  Assets:Brokerage:Robinhood:Options    1 AAPL_PUT_20260620_00150000 {150.00 USD} @ 0.00 USD
  Income:Trading:OptionPremium
```

Auto-balance: 150 + Income = 0 → Income = -150.00 (credit, full basis becomes income).

For a long that expires worthless (full loss):
```
2026-06-20 * "EXP AAPL 160C 6/20 worthless" ^aapl-160c-20260620-long
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00160000 {200.00 USD} @ 0.00 USD
  Income:Trading:OptionPremium
```

Auto-balance: -200 + Income = 0 → Income = 200.00 (debit/loss).

## Assignment

If a short option is assigned, do NOT generate an income line for the option. The premium adjusts the cost basis of the resulting stock. See `assignment.md`.

## Exercise

If you exercise a long option, the premium adjusts the cost basis (or proceeds) of the resulting stock. See `exercise.md`.

## Common confusions

- **Cash-secured put vs naked put**: identical beancount entries. The "secured" status is a broker buying-power concept; cash is still in the same `Cash` account. Don't split into `Cash:Available` / `Cash:Secured` unless the user explicitly asks.
- **Per-contract, not per-share**: cost basis on a $1.50 contract is `{150.00 USD}`, not `{1.50 USD}`. Per-share basis won't balance against per-contract cash.
- **Don't fold fees into basis or cash**: keep fees as a separate `Expenses:Trading:Fees` posting. Net cash leg = gross premium × 100 ± fees, basis = gross premium × 100.
- **Auto-balance Income line**: write `Income:Trading:OptionPremium` with no amount on close transactions; beancount fills in the realized gain/loss.
