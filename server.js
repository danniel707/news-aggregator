const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Connect to the SQLite database
const db = new sqlite3.Database('db_blog.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Define route handler for creating a new post
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;

  // Validate request body
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Insert new post into database
  const sql = 'INSERT INTO posts (title, content) VALUES (?, ?)';
  db.run(sql, [title, content], function (err) {
    if (err) {
      console.error('Error inserting post:', err);
      return res.status(500).json({ error: 'An error occurred while creating the post' });
    }
    
    // Return the newly created post
    const postId = this.lastID;
    res.status(201).json({ id: postId, title, content });
  });
});

// Export the database connection for use in other modules
module.exports = db;