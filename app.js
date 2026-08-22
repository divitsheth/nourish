import { calculateLog, filterFoods, qualityLabel } from './src/tracker.js';

const foods = await fetch('./data/foods.json').then((r) => r.json());
const eaten = new Set(JSON.parse(localStorage.getItem('food-ledger-eaten') || '[]'));
const list = document.querySelector('#food-list');
const template = document.querySelector('#food-template');
const search = document.querySelector('#search');

function updateSummary() {
  const log = calculateLog(foods.map((food) => ({ ...food, eaten: eaten.has(food.id) })));
  document.querySelector('#calories').textContent = log.calories;
  document.querySelector('#protein').textContent = `${log.protein}g`;
  document.querySelector('#sodium').textContent = `${log.sodiumKnown}mg`;
  document.querySelector('#sodium-note').textContent = log.sodiumUnknownItems ? `Sodium unavailable for ${log.sodiumUnknownItems} confirmed item${log.sodiumUnknownItems > 1 ? 's' : ''}.` : '';
  localStorage.setItem('food-ledger-eaten', JSON.stringify([...eaten]));
}

function render() {
  list.replaceChildren();
  filterFoods(foods, search.value).forEach((food) => {
    const item = template.content.cloneNode(true);
    item.querySelector('.restaurant').textContent = food.restaurant;
    item.querySelector('.name').textContent = food.name;
    item.querySelector('.macros').innerHTML = `<span>${food.calorieRange || food.calories} kcal</span><span>${food.proteinRange || food.protein + 'g'} protein</span><span>${food.sodium === null ? 'sodium unavailable' : food.sodium + 'mg sodium'}</span><span>${qualityLabel(food.quality)}</span>`;
    item.querySelector('.source').textContent = `Source: ${food.source}`;
    item.querySelector('.notes').textContent = food.notes;
    const checkbox = item.querySelector('input'); checkbox.checked = eaten.has(food.id);
    checkbox.addEventListener('change', () => { checkbox.checked ? eaten.add(food.id) : eaten.delete(food.id); updateSummary(); });
    list.append(item);
  });
}
search.addEventListener('input', render);
document.querySelector('#clear').addEventListener('click', () => { eaten.clear(); updateSummary(); render(); });
render(); updateSummary();
