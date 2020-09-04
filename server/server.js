//---------CONFIG---------//
require('./config/config');

//---------requires---------//
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//---------executes---------//

const app = express();
const port = process.env.PORT;


//---------Body parser-----------//
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'./public')));

//console.log(path.resolve(__dirname ,'../public'))

//---------Import global de rutas---------//

app.use(require('./routes/index'));

/* --------Conexion a la BD---------- */

mongoose.connect(process.env.URLDB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {

  if (err) {
    return console.log('error', err)
  };

  console.log('++++Database connected++++')

});

app.listen(port, () => {
  console.log(`-----Listening on port: ${port}----`)
})