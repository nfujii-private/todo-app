// SQLiteデータベースの初期化処理
// Node.js組み込みの node:sqlite を使用(ネイティブモジュールのビルドが不要)
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'todo.db');
const db = new DatabaseSync(dbPath);

// todosテーブルが無ければ作成する
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`);

module.exports = db;
