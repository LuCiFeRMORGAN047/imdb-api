const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors')
const movieroute = require('./routes/Movieroute')
const searchoute = require('./routes/Searchroute')
const tvroute = require('./routes/Tvroute')
dotenv.config();
app.use(express.json())
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};
app.use(cors(corsOptions))
app.use(movieroute)
app.use(searchoute)
app.use(tvroute)
const PORT =5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});