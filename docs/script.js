// TODOアプリのフロントエンド処理 (GitHub Pages用: localStorageにデータ保存)
const STORAGE_KEY = 'todo-app-todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('.filter-btn');

let todos = loadTodos();
let currentFilter = 'all';

// localStorageからTODO一覧を読み込む
function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// TODO一覧をlocalStorageに保存する
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 現在のフィルタに応じてリストを描画する
function render() {
  list.innerHTML = '';

  const filtered = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return !!todo.completed;
    return true;
  });

  emptyMessage.hidden = filtered.length !== 0;

  filtered.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener('change', () => toggleCompleted(todo.id, checkbox.checked));

    const title = document.createElement('span');
    title.className = 'todo-title';
    title.textContent = todo.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn delete';
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, title, deleteBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter((t) => !t.completed).length;
  counter.textContent = `未完了: ${remaining}件 / 全体: ${todos.length}件`;
}

// 新規TODOを追加する
function addTodo(title) {
  todos.unshift({
    id: Date.now(),
    title,
    completed: false,
    created_at: new Date().toISOString(),
  });
  saveTodos();
  render();
}

// 完了状態を切り替える
function toggleCompleted(id, completed) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.completed = completed;
  saveTodos();
  render();
}

// TODOを削除する
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  addTodo(title);
  input.value = '';
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
