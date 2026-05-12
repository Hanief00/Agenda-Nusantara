import * as SQLite from 'expo-sqlite';

// Membuka koneksi ke database lokal
const db = SQLite.openDatabaseSync('agendanusantara.db');

export const setupDatabase = () => {
  try {
    // Membuat tabel jika belum ada
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        dueDate TEXT,
        type TEXT, 
        status INTEGER DEFAULT 0
      );
    `);

    // Memasukkan akun default "user" dengan password "user" jika tabel masih kosong
    const user = db.getFirstSync('SELECT * FROM users WHERE username = ?', ['user']);
    if (!user) {
      db.runSync('INSERT INTO users (username, password) VALUES (?, ?)', ['user', 'user']);
    }
    
    console.log('Database berhasil diinisialisasi!');
  } catch (error) {
    console.error('Gagal menginisialisasi database:', error);
  }
};

export default db;