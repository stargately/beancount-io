# Wash sales

A wash sale occurs when you close an options position at a **loss** and re-open a "substantially identical" position within 30 days (before or after the loss). The IRS disallows the loss for the year and rolls it into the cost basis of the replacement position.

## Within a single broker

Brokers compute and report wash-sale adjustments on the 1099-B (box 1g). **Trust the broker**. Don't try to compute it from scratch in beancount.

When a wash sale is reported:
1. Tag the loss-side close transaction with `#wash-sale` and metadata showing the disallowed amount.
2. The replacement position's basis should reflect the rolled-in disallowed loss when you record it (or as an adjustment metadata on the existing record).

```
2026-06-15 * "BTC AAPL 150P 6/20 (wash sale)" ^aapl-150p-20260620 #wash-sale
  wash_sale_disallowed: 50.00 USD
  Assets:Brokerage:Robinhood:Cash                                       -200.65 USD
  Assets:Brokerage:Robinhood:Options    1 AAPL_PUT_20260620_00150000 {1.50 USD} @ 2.00 USD
  Income:Trading:OptionPremium                                          150.00 USD
  Income:Trading:WashSaleDisallowed                                    -50.00 USD
```

The `WashSaleDisallowed` line offsets part of what would otherwise be the loss. The corresponding amount is added to the replacement position's basis when it's recorded.

This is approximate — beancount can't enforce the substantially-identical determination. The broker's 1099-B is authoritative.

## Across brokers

If the user closes a position at Broker A and opens substantially identical at Broker B within 30 days, **neither 1099-B will catch it**. The user is responsible for tracking and reporting cross-broker wash sales themselves.

This skill flags the possibility but doesn't auto-detect cross-broker wash sales in v1. If the user has multiple broker accounts and frequent options trading, recommend they manually review at year-end.

## What "substantially identical" means for options

- Same underlying + same type (call/put) + same strike + same expiry → definitely substantially identical
- Different strike or different expiry → usually not, but IRS guidance is murky for very close substitutes
- Different underlying → not

The skill doesn't make this determination. It just records what the broker reports.

## Common confusions

- **Only losses trigger wash-sale rules.** Closing at a gain is not a wash sale even if you re-open immediately.
- **Both directions of the 30-day window count**: 30 days before or after the loss.
- **Disallowed loss is rolled into replacement basis**, not lost forever. It comes back when the replacement is closed (assuming no further wash sale).
