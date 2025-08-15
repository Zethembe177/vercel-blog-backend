console.log("🟢 server.js is running...");

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Root route
app.get('/', (req, res) => {
  res.send('🟢 Backend is running!');
});


// Middleware
app.use(cors());          // allow React frontend to talk to server
app.use(express.json());   // parse JSON body

// File paths
const showsFile = path.join(__dirname, 'shows.json');
const postsFile = path.join(__dirname, 'posts.json');

// GET /api/shows
app.get('/api/shows', (req, res) => {
  console.log('GET /api/shows route hit');
  fs.readFile(showsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading shows:', err);
      return res.status(500).send('Error reading shows');
    }
    try {
      const shows = JSON.parse(data);
      res.json(shows);
    } catch (parseErr) {
      console.error('Error parsing shows.json:', parseErr);
      return res.status(500).send('Error parsing shows.json');
    }
  });
});

//get api/posts
app.get('/api/posts', (req, res) => {
  fs.readFile(postsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading posts:', err);
      return res.status(500).send('Error reading posts');
    }
    try {
      const posts = JSON.parse(data);
      res.json(posts);
    } catch (parseErr) {
      console.error('Error parsing posts.json:', parseErr);
      res.status(500).send('Error parsing posts.json');
    }
  });
});
// POST /api/posts
app.post('/api/posts', (req, res) => {
  const newPost = req.body;

  fs.readFile(postsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading posts:', err);
      return res.status(500).send('Error reading posts');
    }

    let posts;
    try {
      posts = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing posts.json:', parseErr);
      return res.status(500).send('Error parsing posts.json');
    }

    newPost.id = Date.now();  // unique ID
    newPost.comments = [];

    posts.push(newPost);

    fs.writeFile(postsFile, JSON.stringify(posts, null, 2), err => {
      if (err) {
        console.error('Error saving post:', err);
        return res.status(500).send('Error saving post');
      }
      res.status(201).json(newPost);
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
