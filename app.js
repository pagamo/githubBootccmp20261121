// 待辦事項儲存在瀏覽器的 localStorage。
const STORAGE_KEY = 'todo-list';
const THEME_KEY = 'todo-list-theme';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedButton = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.btn-filter');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

let todos = loadTodos();
let currentFilter = 'all';

// 讀取並檢查已儲存的待辦資料。
function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) return [];

  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    console.warn('讀取待辦清單失敗，已忽略無效資料。', error);
    return [];
  }

  const isValid = Array.isArray(parsed) && parsed.every((todo) =>
    todo &&
    typeof todo.id === 'string' &&
    typeof todo.text === 'string' &&
    typeof todo.completed === 'boolean'
  );

  if (!isValid) {
    console.warn('讀取待辦清單失敗，資料格式不正確。');
    return [];
  }

  return parsed;
}

// 儲存目前的待辦清單。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 更新主題按鈕的文字與無障礙狀態。
function updateThemeButton(theme) {
  const isDark = theme === 'dark';
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

// 套用主題，但不變更使用者的手動偏好設定。
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  updateThemeButton(theme);
}

// 套用使用者選擇的主題並儲存偏好。
function setTheme(theme) {
  applyTheme(theme);
  localStorage.setItem(THEME_KEY, theme);
}

// 讀取手動設定；尚未設定時讓樣式依系統偏好切換。
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme;
    updateThemeButton(savedTheme);
    return;
  }

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(systemTheme.matches ? 'dark' : 'light');
  systemTheme.addEventListener('change', (event) => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme !== 'light' && savedTheme !== 'dark') {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
}

// 根據目前篩選條件取得要顯示的待辦事項。
function getVisibleTodos() {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }
  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

// 依清單內容與篩選條件決定空狀態提示。
function getEmptyMessage() {
  if (todos.length === 0) {
    return '還沒有任何待辦事項,新增一個吧!';
  }
  if (currentFilter === 'active') {
    return '太棒了，沒有未完成的事項！';
  }
  return '還沒有已完成的事項。';
}

// 依目前篩選條件更新清單、空狀態提示與整體未完成數量。
function render() {
  list.replaceChildren();

  const visibleTodos = getVisibleTodos();
  const completedCount = todos.filter((todo) => todo.completed).length;
  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  emptyState.textContent = getEmptyMessage();
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
  clearCompletedButton.hidden = completedCount === 0;
}

// 切換篩選條件並更新按鈕狀態。
function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  render();
}

// 新增待辦時使用時間戳與隨機字串產生識別碼。
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: createId(), text, completed: false });
  saveTodos();
  render();
  form.reset();
  input.focus();
});

list.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const item = event.target.closest('.todo-item');
  if (!item) return;

  const { id } = item.dataset;
  if (event.target.matches('input[type="checkbox"]')) {
    const todo = todos.find((entry) => entry.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
  } else if (event.target.matches('.btn-delete')) {
    todos = todos.filter((todo) => todo.id !== id);
  } else {
    return;
  }

  saveTodos();
  render();
});

clearCompletedButton.addEventListener('click', () => {
  const completedCount = todos.filter((todo) => todo.completed).length;
  if (completedCount === 0) return;

  const confirmed = window.confirm(`確定要清除 ${completedCount} 項已完成的待辦事項嗎？`);
  if (!confirmed) return;

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.dataset.theme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

initTheme();
render();
