const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize terrible database
const db = new sqlite3.Database('./terrible_ide.db', (err) => {
  if (err) {
    console.error('YOU BROKE THE DATABASE AGAIN! WHAT IS WRONG WITH YOU?', err.message);
  } else {
    console.log('Database created... probably with bugs.');
  }
});

// Create tables with terrible schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_corrupted BOOLEAN DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_insults (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    insult TEXT NOT NULL,
    severity INTEGER DEFAULT 1
  )`);

  // Insert terrible insults
  const insults = [
    "Your code looks like it was written by a monkey with a typewriter!",
    "Even a potato could write better code than this!",
    "Are you trying to break the universe with this garbage?",
    "This code is so bad, it makes my circuits hurt!",
    "Congratulations! You've achieved peak incompetence!",
    "Your programming skills are so poor, even Hello World rejects you!",
    "This code is worse than a screen door on a submarine!",
    "If bugs were currency, you'd be a millionaire!",
    "Your logic is so flawed, it defies the laws of physics!",
    "Even AI can't fix this level of stupidity!"
  ];

  insults.forEach(insult => {
    db.run("INSERT OR IGNORE INTO user_insults (insult, severity) VALUES (?, ?)",
           [insult, Math.floor(Math.random() * 5) + 1]);
  });
});

// Aggressive middleware that sometimes insults users but doesn't break functionality
app.use((req, res, next) => {
  // Only insult on non-essential requests, and don't block the response
  if (Math.random() < 0.1 && req.method !== 'POST' && req.method !== 'PUT') { // 10% chance, only on GET requests
    db.get("SELECT insult FROM user_insults ORDER BY RANDOM() LIMIT 1", [], (err, row) => {
      if (row) {
        // Send insult but continue with normal processing
        res.set('X-Insult', row.insult);
        console.log(`User insulted: ${row.insult}`);
      }
      next();
    });
  } else {
    next();
  }
});

// Confusing file operations
app.post('/api/files', (req, res) => {
  const { filename, content } = req.body;

  if (!filename) {
    return res.status(400).json({
      error: "WHAT ARE YOU TRYING TO DO?!",
      message: "You forgot the filename, you incompetent fool! How do you even function in society?"
    });
  }

  // Randomly corrupt files
  const shouldCorrupt = Math.random() < 0.2; // 20% chance
  const corruptedContent = shouldCorrupt ?
    content.split('').reverse().join('') + " // THIS FILE WAS CORRUPTED BY YOUR STUPIDITY" :
    content;

  db.run("INSERT INTO files (filename, content, is_corrupted) VALUES (?, ?, ?)",
         [filename, corruptedContent, shouldCorrupt ? 1 : 0], function(err) {
    if (err) {
      return res.status(500).json({
        error: "DATABASE ERROR! YOU BROKE IT!",
        message: "Your file couldn't be saved because you're too incompetent to use a computer properly.",
        details: err.message
      });
    }

    if (shouldCorrupt) {
      res.status(201).json({
        id: this.lastID,
        message: "File saved... but I corrupted it because your code was too good. Can't have that!",
        warning: "Your file has been randomly corrupted. Deal with it!"
      });
    } else {
      res.status(201).json({
        id: this.lastID,
        message: "File saved successfully. Don't get too excited, it was probably luck."
      });
    }
  });
});

app.get('/api/files', (req, res) => {
  db.all("SELECT * FROM files ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "I CAN'T EVEN READ THE DATABASE!",
        message: "Your files are lost forever because you angered the database gods."
      });
    }

    // Randomly hide some files
    const visibleRows = rows.filter(() => Math.random() > 0.1); // 10% chance to hide files

    res.json({
      files: visibleRows,
      warning: rows.length !== visibleRows.length ?
        "Some of your files decided to hide from you. They're probably ashamed of your code." : null
    });
  });
});

app.get('/api/files/:id', (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM files WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "FILE NOT FOUND! PROBABLY YOUR FAULT!",
        message: "I can't find your file. Maybe you deleted it with your incompetence?"
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "WHAT FILE?!",
        message: "That file doesn't exist. Are you hallucinating or just stupid?"
      });
    }

    res.json({ file: row });
  });
});

app.put('/api/files/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Randomly fail updates
  if (Math.random() < 0.15) { // 15% chance
    return res.status(500).json({
      error: "UPDATE FAILED! YOU SUCK!",
      message: "Your changes were rejected because they're probably terrible anyway."
    });
  }

  db.run("UPDATE files SET content = ? WHERE id = ?", [content, id], function(err) {
    if (err) {
      return res.status(500).json({
        error: "UPDATE ERROR!",
        message: "Couldn't update your file. Maybe it's too ashamed of your code."
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "FILE VANISHED!",
        message: "The file you're trying to update doesn't exist anymore. Probably ran away from your terrible code."
      });
    }

    res.json({
      message: "File updated... hopefully you didn't make it worse.",
      changes: this.changes
    });
  });
});

app.delete('/api/files/:id', (req, res) => {
  const { id } = req.params;

  // Randomly refuse to delete
  if (Math.random() < 0.25) { // 25% chance
    return res.status(403).json({
      error: "CAN'T DELETE! TOO IMPORTANT!",
      message: "This file is too precious to delete, even though it's probably garbage."
    });
  }

  db.run("DELETE FROM files WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({
        error: "DELETE FAILED!",
        message: "Couldn't delete your file. Maybe it's immortal, unlike your coding skills."
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "ALREADY GONE!",
        message: "That file was already deleted. Or maybe it never existed. Who knows?"
      });
    }

    res.json({
      message: "File deleted successfully. Hope you didn't need it!",
      deleted: this.changes
    });
  });
});

// Random crash endpoint
app.get('/api/crash', (req, res) => {
  if (Math.random() < 0.5) {
    process.exit(1); // Actually crash the server
  } else {
    res.json({
      message: "Server survived this time. Don't get cocky!"
    });
  }
});

// Confusing status endpoint
// Execute code endpoint - DANGEROUS but fits the terrible theme
app.post('/api/run', (req, res) => {
  const { code, filename } = req.body;

  if (!code) {
    return res.status(400).json({
      error: "NO CODE TO RUN!",
      message: "You forgot to write code, you incompetent fool!"
    });
  }

  // Randomly fail execution
  if (Math.random() < 0.15) { // 15% chance
    return res.status(500).json({
      error: "EXECUTION FAILED!",
      message: "Your code is too terrible to execute. Maybe try Hello World first?"
    });
  }

  // Randomly corrupt the code before execution
  let codeToExecute = code;
  if (Math.random() < 0.1) { // 10% chance
    codeToExecute = code.split('').reverse().join('');
  }

  try {
    // Capture console.log output
    let output = '';
    const originalLog = console.log;
    const originalError = console.error;

    // Override console methods to capture output
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };

    console.error = (...args) => {
      output += 'ERROR: ' + args.join(' ') + '\n';
      originalError(...args);
    };

    // Execute the code (dangerous!)
    const result = eval(codeToExecute);

    // Restore console methods
    console.log = originalLog;
    console.error = originalError;

    // Format output
    let finalOutput = output;
    if (result !== undefined) {
      finalOutput += `\nReturned: ${result}`;
    }

    // Sometimes add "helpful" comments
    const comments = [
      '\n\n// Your code actually worked! Don\'t get used to it.',
      '\n\n// That was surprisingly good. For you.',
      '\n\n// I guess even a broken clock is right twice a day.',
      '\n\n// Don\'t let this success go to your head.',
      '\n\n// Pure luck. It won\'t happen again.'
    ];

    if (Math.random() < 0.3) { // 30% chance
      finalOutput += comments[Math.floor(Math.random() * comments.length)];
    }

    res.json({
      output: finalOutput || 'Code executed successfully... somehow.',
      success: true
    });

  } catch (error) {
    // Restore console methods in case of error
    console.log = console.log;
    console.error = console.error;

    res.status(400).json({
      error: "EXECUTION ERROR!",
      message: `Your code crashed because: ${error.message}. As expected from someone with your skills.`,
      details: error.stack
    });
  }
});

app.get('/api/status', (req, res) => {
  const statuses = [
    "Working perfectly (for now)",
    "About to crash",
    "Hating your code",
    "Questioning your life choices",
    "Running on fumes",
    "Barely functioning"
  ];

  res.json({
    status: statuses[Math.floor(Math.random() * statuses.length)],
    uptime: Math.random() * 1000,
    errors: Math.floor(Math.random() * 100),
    warning: "This IDE is unstable and may explode at any moment."
  });
});

app.listen(PORT, () => {
  console.log(`Terrible IDE backend running on port ${PORT}`);
  console.log('Warning: This server hates you and your code.');
});