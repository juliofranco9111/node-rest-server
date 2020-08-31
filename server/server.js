//---------CONFIG---------//
require('./config/config');

//---------requires---------//
const express = require('express');
const mongoose = require('mongoose');


//---------executes---------//

const app = express();
const port = process.env.PORT;


//---------Body parser-----------//
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



//---------Import rutas de usuario---------//
app.use(require('./routes/usuario'));




//--------Express services----------//



/* --------Conexion a la BD---------- */

mongoose.connect(process.env.URLDB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {

  if (err) throw err;

  console.log('++++Database connected++++')

},);





app.listen(port, () => {
  console.log(`-----Listening on port: ${port}----`)
})