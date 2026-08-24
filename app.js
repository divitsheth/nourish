import { calculateLog, filterFoods, qualityLabel } from './src/tracker.js';

const list = document.querySelector('#food-list');
const template = document.querySelector('#food-template');
const search = document.querySelector('#search');
const loading = document.querySelector('#loading');
const empty = document.querySelector('#empty');
let foods = [];
const eaten = new Set(JSON.parse(localStorage.getItem('food-ledger-eaten') || '[]'));

function persist() { localStorage.setItem('food-ledger-eaten', JSON.stringify([...eaten])); }

function updateSummary() {
  const log = calculateLog(foods.map((food) => ({ ...food, eaten: eaten.has(food.id) })));
  const logged = foods.filter((food) => eaten.has(food.id)).length;
  document.querySelector('#calories').textContent = log.calories.toLocaleString();
  document.querySelector('#protein').textContent = `${log.protein}g`;
  document.querySelector('#sodium').textContent = `${log.sodiumKnown.toLocaleString()}mg`;
  document.querySelector('#logged-count').textContent = `${logged} food${logged === 1 ? '' : 's'} logged`;
  document.querySelector('#sodium-note').textContent = logged ? (log.sodiumUnknownItems ? `Unavailable for ${log.sodiumUnknownItems} item${log.sodiumUnknownItems > 1 ? 's' : ''}` : 'All logged items known') : 'No items logged';
  persist();
  document.querySelector('#dashboard')?.dispatchEvent(new CustomEvent('summarychange'));
}

function addMacro(container, text, quality = false) {
  const pill = document.createElement('span');
  pill.textContent = text;
  if (quality) pill.className = 'quality-pill';
  container.append(pill);
}

function render() {
  list.replaceChildren();
  const matches = filterFoods(foods, search.value);
  document.querySelector('#result-count').textContent = `${matches.length} meal${matches.length === 1 ? '' : 's'}`;
  empty.hidden = Boolean(matches.length) || !foods.length;
  if (!matches.length && foods.length) { list.hidden = true; return; }
  list.hidden = false;
  matches.forEach((food) => {
    const item = template.content.cloneNode(true);
    item.querySelector('.restaurant').textContent = food.restaurant || 'Restaurant';
    item.querySelector('.name').textContent = food.name;
    const macros = item.querySelector('.macros');
    addMacro(macros, `${food.calorieRange || food.calories} kcal`);
    addMacro(macros, `${food.proteinRange || `${food.protein}g`} protein`);
    addMacro(macros, food.sodium === null ? 'Sodium unavailable' : `${food.sodium}mg sodium`);
    addMacro(macros, qualityLabel(food.quality), true);
    item.querySelector('.source').textContent = `Source: ${food.source || 'Not provided'}`;
    item.querySelector('.notes').textContent = food.notes || '';
    const checkbox = item.querySelector('.eat-input');
    checkbox.checked = eaten.has(food.id);
    checkbox.setAttribute('aria-label', `Mark ${food.name} as eaten today`);
    checkbox.addEventListener('change', () => { checkbox.checked ? eaten.add(food.id) : eaten.delete(food.id); updateSummary(); });
    list.append(item);
  });
}

async function load() {
  try {
    const response = await fetch('./data/foods.json');
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    foods = await response.json();
    loading.hidden = true;
    render(); updateSummary();
  } catch (error) {
    loading.textContent = 'We couldn’t load your food library. Refresh to try again.';
    loading.classList.add('error-state');
    console.error(error);
  }
}

search.addEventListener('input', render);
document.querySelector('#clear').addEventListener('click', () => {
  if (!eaten.size) return;
  eaten.clear(); updateSummary(); render();
});
load();
