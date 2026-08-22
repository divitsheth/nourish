# Food Ledger

A private, lightweight nutrition tracker for repeatedly ordered restaurant food.

## What it does

- Stores a reusable restaurant food library with calories, protein, sodium, evidence quality, and source notes.
- Separates known values from estimates and flags unavailable sodium.
- Lets you mark foods as **confirmed eaten today**; daily totals are saved locally in the browser.
- Seeds the tracker with previously researched Joe & The Juice and Kolapasi orders.

## Nutrition data standard

Every food record should include a source and one of:

- `official` — restaurant/manufacturer nutrition panel
- `estimate` — transparent comparable-food or ingredient/portion estimate

Do not present estimated restaurant values as exact. Update `data/foods.json` as new research is completed.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Tests

```bash
npm test
```

## Next build steps

1. Add a structured entry form and export/import.
2. Add Uber Eats order review flow that keeps ordered vs. confirmed eaten distinct.
3. Add per-item citations and research dates.
4. Choose a hosting target only when ready to deploy.
