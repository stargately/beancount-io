# Exercise (long option holder exercises)

When you exercise a long option, you voluntarily trigger the contract. Long calls become stock buys at strike; long puts become stock sells at strike. Premium adjusts the resulting stock's effective price — no separate income line for the option.

Structurally similar to assignment (`assignment.md`) but the user initiates it; basis-adjustment direction depends on call vs put.

Cost basis convention: option basis is per-contract (gross premium × 100), same as everywhere else.

## Long call exercised (you buy 100 shares at strike)

You paid premium P (per share), exercise, pay strike K to buy 100 shares. Effective per-share cost = K + P.

Example: paid $2.00 for AAPL 150C ($200 basis), exercise. Pay $15,000 for 100 AAPL.
- Effective basis = 150 + 2.00 = $152.00/share
- Total stock cost = $15,200

```
2026-06-20 * "EXER AAPL 150C 6/20 → bought 100 AAPL @ 150" ^aapl-150c-20260620-long
  Assets:Brokerage:Robinhood:Cash                                  -15000.00 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_CALL_20260620_00150000 {200.00 USD} @ 0.00 USD
  Assets:Brokerage:Robinhood:Stock      100 AAPL {152.00 USD}
```

Math: -15000 + (-200) + 15200 = 0 ✓

The option closes at $0 disposal; its basis is rolled into the stock's basis (strike + premium per share).

## Long put exercised (you sell 100 shares at strike)

You paid premium P, exercise, get strike K for selling 100 shares. Effective per-share proceeds = K − P.

If you held the underlying:

```
2026-06-20 * "EXER AAPL 140P 6/20 → sold 100 AAPL @ 140" ^aapl-140p-20260620-long
  Assets:Brokerage:Robinhood:Cash                                  14000.00 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_PUT_20260620_00140000 {150.00 USD} @ 0.00 USD
  Assets:Brokerage:Robinhood:Stock     -100 AAPL {} @ 138.50 USD
  Income:Trading:CapitalGains
```

If you didn't (now short stock):

```
2026-06-20 * "EXER AAPL 140P 6/20 → short 100 AAPL @ 140" ^aapl-140p-20260620-long
  Assets:Brokerage:Robinhood:Cash                                  14000.00 USD
  Assets:Brokerage:Robinhood:Options    -1 AAPL_PUT_20260620_00140000 {150.00 USD} @ 0.00 USD
  Assets:Brokerage:Robinhood:Stock     -100 AAPL {138.50 USD}
```

Math: 14000 + (-150) + (-13850) = 0 ✓

## When does exercise actually happen?

Most retail options settle via offsetting close, not exercise. Exercise happens when:
- You hold a long option to expiry and it's ITM (auto-exercise on most brokers if >$0.01 ITM)
- You manually exercise early (rare; usually for deep ITM with no time value, or to capture a dividend)

If the user says "I exercised", verify they actually mean exercise vs close. Sometimes "exercised" is colloquially used for "closed".

## Tax form impact

- The option does NOT appear on Form 8949.
- The stock disposition (puts) or eventual sale of bought shares (calls) appears on Form 8949 with basis or proceeds already adjusted for option premium.

## Common confusions

- **Exercise direction**: call → buy stock; put → sell stock. Don't flip these.
- **Premium direction**: long call exercise increases stock basis; long put exercise decreases stock proceeds. Both make the stock side worse for you (correct — the premium you paid is a real cost).
- **No `Income:Trading:OptionPremium` posting on exercise.** Same rationale as assignment.
