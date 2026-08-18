// TODOアプリのバックエンドサーバー (Express + SQLite)
const express = require('express');
const path = require('node:path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 一覧取得
app.get('/api/todos', (req, res) => {
  const rows = db.prepare('SELECT * FROM todos ORDER BY id DESC').all();
  res.json(rows);
});

// 新規追加
app.post('/api/todos', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) {
    return res.status(400).json({ error: 'titleは必須です' });
  }
  const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title);
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

// 更新(タイトル・完了状態)
app.put('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: '指定されたTODOが見つかりません' });
  }

  const title = req.body.title !== undefined ? String(req.body.title).trim() : existing.title;
  const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed;

  if (!title) {
    return res.status(400).json({ error: 'titleは必須です' });
  }

  db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?').run(title, completed, id);
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json(row);
});

// 削除
app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: '指定されたTODOが見つかりません' });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`TODOアプリが起動しました: http://localhost:${PORT}`);
});
