// TODOアプリのフロントエンド処理
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('.filter-btn');

let todos = [];
let currentFilter = 'all';

// サーバーからTODO一覧を取得して描画する
async function fetchTodos() {
  const res = await fetch('/api/todos');
  todos = await res.json();
  render();
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
async function addTodo(title) {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const err = await res.json();
    alert(err.error || '追加に失敗しました');
    return;
  }
  await fetchTodos();
}

// 完了状態を切り替える
async function toggleCompleted(id, completed) {
  await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  await fetchTodos();
}

// TODOを削除する
async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  await fetchTodos();
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

fetchTodos();
