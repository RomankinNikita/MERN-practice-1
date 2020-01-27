const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = config.get('port') || 5000;
const MONGO_URI = config.get('mongoUri');

// parse json body
app.use(express.json({extended: true}));
// /api/auth
app.use('/api/auth', require('./routes/auth.routes'));
// /api/link
app.use('/api/link', require('./routes/link.routes'));
// /t
app.use('/t', require('./routes/redirect.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
  } catch (error) {
    console.log('Server Error: ', error.message);
    process.exit(1);
  }
}

start();
