const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

let dbAdapter = null;

const initDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'sqlite';

  if (dbType === 'mysql') {
    try {
      const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'quiz_platform',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      console.log('✅ Connected to MySQL Database.');
      dbAdapter = {
        query: async (sql, params = []) => {
          const [rows, fields] = await pool.query(sql, params);
          return [rows, fields];
        }
      };
      return;
    } catch (err) {
      console.warn('⚠️ MySQL connection failed, falling back to SQLite:', err.message);
    }
  }

  // SQLite Fallback setup
  const dbPath = path.join(__dirname, '../database/quiz_platform.db');
  const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('SQLite connection error:', err);
    else console.log(`✅ Connected to SQLite Database (${dbPath}).`);
  });

  const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ insertId: this.lastID, changes: this.changes });
      });
    });
  };

  const allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  // Run SQLite Schema Migrations
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      time_limit INTEGER DEFAULT 300,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      option1 TEXT NOT NULL,
      option2 TEXT NOT NULL,
      option3 TEXT NOT NULL,
      option4 TEXT NOT NULL,
      correct_option INTEGER NOT NULL,
      marks INTEGER DEFAULT 1,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      correct INTEGER NOT NULL,
      wrong INTEGER NOT NULL,
      skipped INTEGER DEFAULT 0,
      time_taken INTEGER DEFAULT 0,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      total_score INTEGER DEFAULT 0,
      total_quizzes INTEGER DEFAULT 0,
      average_score REAL DEFAULT 0.0,
      rank_position INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Auto-seed initial Data if empty
  const userCheck = await allAsync('SELECT COUNT(*) as count FROM users');
  if (userCheck[0].count === 0) {
    console.log('🌱 Seeding users, quizzes, questions, and leaderboard attempts...');
    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);

    const admin = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin User', 'admin@quiz.com', adminPass, 'admin']);
    const u1 = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Alex Johnson', 'alex@quiz.com', userPass, 'user']);
    const u2 = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Sophia Chen', 'sophia@quiz.com', userPass, 'user']);
    const u3 = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['David Miller', 'david@quiz.com', userPass, 'user']);
    const u4 = await runAsync('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Emma Watson', 'emma@quiz.com', userPass, 'user']);

    // Quizzes (8 total)
    const q1 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'React.js Fundamentals', 'Test component lifecycle, state, props, and hooks.', 'React', 'Easy', 300
    ]);
    const q2 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'JavaScript ES6+ Mastery', 'Closures, promises, async/await, and arrow functions.', 'JavaScript', 'Medium', 300
    ]);
    const q3 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'Node.js & Express REST APIs', 'Express routing, middleware, JWT, and HTTP methods.', 'Node.js', 'Medium', 300
    ]);
    const q4 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'SQL Database Essentials', 'SELECT queries, JOINs, foreign keys, and indexes.', 'SQL', 'Easy', 240
    ]);
    const q5 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'General Tech Aptitude', 'Logical reasoning, algorithms, and math basics.', 'Aptitude', 'Hard', 300
    ]);
    const q6 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'HTML & CSS Web Basics', 'Web semantics, flexbox, grid, and CSS selectors.', 'HTML/CSS', 'Easy', 240
    ]);
    const q7 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'Git & GitHub Version Control', 'Commits, branches, merging, rebasing, and remote repos.', 'Git', 'Easy', 240
    ]);
    const q8 = await runAsync('INSERT INTO quizzes (title, description, category, difficulty, time_limit) VALUES (?, ?, ?, ?, ?)', [
      'Python Programming Fundamentals', 'Data types, loops, functions, and OOP in Python.', 'Python', 'Medium', 300
    ]);

    // Questions for React (q1)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q1.insertId, 'Which hook handles side effects in React?', 'useState', 'useEffect', 'useContext', 'useReducer', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q1.insertId, 'What keyword creates a component in React?', 'function', 'class', 'Both function and class', 'None', 3
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q1.insertId, 'Props in React components are:', 'Mutable', 'Read-Only (Immutable)', 'Dynamic Functions', 'Global variables', 2
    ]);

    // Questions for JS (q2)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q2.insertId, 'Which method converts JSON string to object?', 'JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'Object.parse()', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q2.insertId, 'What type of scoping does let/const use?', 'Global', 'Function Scope', 'Block Scope', 'Module Scope', 3
    ]);

    // Questions for Node.js (q3)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q3.insertId, 'Which core module creates an HTTP server in Node.js?', 'fs', 'http', 'path', 'url', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q3.insertId, 'Which Express middleware parses JSON body requests?', 'express.json()', 'express.static()', 'express.router()', 'express.urlencoded()', 1
    ]);

    // Questions for SQL (q4)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q4.insertId, 'What does SQL stand for?', 'Structured Query Language', 'Sequential Query Logic', 'Standard Quantum Language', 'System Query List', 1
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q4.insertId, 'Which clause is used to filter records in a SELECT query?', 'GROUP BY', 'WHERE', 'ORDER BY', 'HAVING', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q4.insertId, 'Which constraint uniquely identifies each row in a database table?', 'FOREIGN KEY', 'UNIQUE', 'PRIMARY KEY', 'CHECK', 3
    ]);

    // Questions for Aptitude (q5)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q5.insertId, 'What is the binary equivalent of decimal number 10?', '1001', '1010', '1100', '1110', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q5.insertId, 'Which data structure operates on a LIFO (Last In First Out) basis?', 'Queue', 'Stack', 'Array', 'LinkedList', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q5.insertId, 'What is the time complexity of searching an element in a balanced Binary Search Tree?', 'O(1)', 'O(n)', 'O(log n)', 'O(n^2)', 3
    ]);

    // Questions for HTML/CSS (q6)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q6.insertId, 'Which HTML tag is used for the largest main title of a web page?', '<h6>', '<title>', '<h1>', '<head>', 3
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q6.insertId, 'Which CSS property makes text bold?', 'text-decoration', 'font-weight', 'font-style', 'text-transform', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q6.insertId, 'Which layout model distributes space along a single axis (row or column)?', 'Flexbox', 'CSS Grid', 'Float', 'Absolute Positioning', 1
    ]);

    // Questions for Git (q7)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q7.insertId, 'Which command initializes a new Git repository in a folder?', 'git start', 'git init', 'git create', 'git clone', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q7.insertId, 'Which command creates and immediately switches to a new branch?', 'git branch <name>', 'git checkout -b <name>', 'git merge <name>', 'git commit -m <name>', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q7.insertId, 'Which command stages all modified files for commit?', 'git stage all', 'git commit -a', 'git add .', 'git push', 3
    ]);

    // Questions for Python (q8)
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q8.insertId, 'Which keyword is used to define a function in Python?', 'function', 'def', 'create', 'func', 2
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q8.insertId, 'Which Python data structure is ordered and immutable?', 'List', 'Dictionary', 'Tuple', 'Set', 3
    ]);
    await runAsync('INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      q8.insertId, 'Which method appends an element to the end of a list in Python?', 'push()', 'add()', 'insert()', 'append()', 4
    ]);

    // Seed Quiz Attempt History for Users
    await runAsync('INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct, wrong, skipped, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      u1.insertId, q1.insertId, 3, 3, 3, 0, 0, 120
    ]);
    await runAsync('INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct, wrong, skipped, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      u1.insertId, q2.insertId, 2, 2, 2, 0, 0, 140
    ]);

    await runAsync('INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct, wrong, skipped, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      u2.insertId, q1.insertId, 2, 3, 2, 1, 0, 150
    ]);
    await runAsync('INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct, wrong, skipped, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      u2.insertId, q4.insertId, 3, 3, 3, 0, 0, 110
    ]);

    await runAsync('INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct, wrong, skipped, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      u3.insertId, q6.insertId, 2, 3, 2, 1, 0, 130
    ]);

    // Seed Leaderboard entries
    await runAsync('INSERT INTO leaderboard (user_id, total_score, total_quizzes, average_score, rank_position) VALUES (?, 5, 2, 2.5, 1)', [u1.insertId]);
    await runAsync('INSERT INTO leaderboard (user_id, total_score, total_quizzes, average_score, rank_position) VALUES (?, 5, 2, 2.5, 2)', [u2.insertId]);
    await runAsync('INSERT INTO leaderboard (user_id, total_score, total_quizzes, average_score, rank_position) VALUES (?, 2, 1, 2.0, 3)', [u3.insertId]);
    await runAsync('INSERT INTO leaderboard (user_id, total_score, total_quizzes, average_score, rank_position) VALUES (?, 0, 0, 0.0, 4)', [u4.insertId]);

    console.log('✅ Seed completed successfully!');
  }

  // SQLite Adapter wrapper to match MySQL interface
  dbAdapter = {
    query: async (sql, params = []) => {
      const sqlTrim = sql.trim().toUpperCase();

      if (sqlTrim.startsWith('SELECT')) {
        const rows = await allAsync(sql, params);
        return [rows, []];
      } else {
        const res = await runAsync(sql, params);
        return [res, []];
      }
    }
  };
};

initDatabase();

module.exports = {
  query: (sql, params) => {
    if (!dbAdapter) {
      throw new Error('Database adapter not initialized yet.');
    }
    return dbAdapter.query(sql, params);
  }
};
