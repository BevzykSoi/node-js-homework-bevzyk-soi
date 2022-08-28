const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connection successful!'))
  .catch((error) => console.log(error));