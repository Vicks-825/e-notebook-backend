const connetToMongo = require('./db');
const express = require('express');
const cors = require('cors');
connetToMongo();

const app = express()
const port = 8000

app.use(cors())

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Vicky you are really great!')
})

//Available routes
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(process.env.PORT || port, () => {
  console.log(`E-Notebook app connected`);
})