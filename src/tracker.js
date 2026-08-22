export function calculateLog(rows) {
  return rows.filter((row) => row.eaten).reduce((total, row) => ({
    calories: total.calories + row.calories,
    protein: total.protein + row.protein,
    sodiumKnown: total.sodiumKnown + (Number.isFinite(row.sodium) ? row.sodium : 0),
    sodiumUnknownItems: total.sodiumUnknownItems + (Number.isFinite(row.sodium) ? 0 : 1)
  }), { calories: 0, protein: 0, sodiumKnown: 0, sodiumUnknownItems: 0 });
}

export function filterFoods(foods, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return foods;
  return foods.filter((food) => `${food.restaurant} ${food.name}`.toLowerCase().includes(needle));
}

export function qualityLabel(quality) {
  return quality === 'official' ? 'Official nutrition' : 'Estimated nutrition';
}
