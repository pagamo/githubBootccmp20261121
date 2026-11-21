// 待辦事項儲存在瀏覽器的 localStorage。
const STORAGE_KEY = 'todo-list';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

let todos = loadTodos();

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

// 依目前資料更新清單、空狀態提示與未完成數量。
function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
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

  emptyState.hidden = todos.length > 0;
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
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

render();
