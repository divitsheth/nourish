import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLog, filterFoods, qualityLabel } from '../src/tracker.js';

test('calculateLog totals only confirmed eaten food', () => {
  const rows = [
    { calories: 480, protein: 11, sodium: 490, eaten: true },
    { calories: 325, protein: 10, sodium: null, eaten: true },
    { calories: 500, protein: 20, sodium: 800, eaten: false }
  ];
  assert.deepEqual(calculateLog(rows), {
    calories: 805,
    protein: 21,
    sodiumKnown: 490,
    sodiumUnknownItems: 1
  });
});

test('filterFoods matches restaurant and item name', () => {
  const foods = [
    { restaurant: 'Joe & The Juice', name: 'Vegan Avocado Sandwich' },
    { restaurant: 'Kolapasi', name: 'Paneer Dosa' }
  ];
  assert.equal(filterFoods(foods, 'paneer').length, 1);
  assert.equal(filterFoods(foods, 'joe').length, 1);
});

test('quality labels keep official values distinct from estimates', () => {
  assert.equal(qualityLabel('official'), 'Official nutrition');
  assert.equal(qualityLabel('estimate'), 'Estimated nutrition');
});
