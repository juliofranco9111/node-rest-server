//---------CONFIG---------//
require('./config/config');

const port = process.env.PORT;


//---------express---------//
const express = require('express');
const app = express();


//---------Body parser-----------//
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


//--------Express services----------//
app.get('/', function (req, res) {
  res.json('Hello World')
});

app.post('/usuario', (req, res) => {
  let body = req.body;

  if( body.name === undefined){
    //probando los codigos de status http
    res.status(400).json({
      ok:false,
      message: 'El nombre es necesario'
    })
  }else{
    res.json({user: body});
  }

});

app.put('/usuario/:id', (req, res) => {

  let id = req.params.id;

  res.json({
    nombre: "usuario",
    id
  })
});

app.delete('/usuario', (req, res) => {
  res.json('DELETE usuario')
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})