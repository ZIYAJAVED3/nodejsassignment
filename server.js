const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

let users = [];

// Signup API
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword
  };

  users.push(newUser);

  res.status(201).json({ message: 'User created successfully' });
});

// Login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
console.log(users)
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, 'ziya', { expiresIn: '1h' });

  res.json({ message: 'Logged in successfully', token });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});