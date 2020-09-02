const express = require('express');

/* bcrypt */
const bcrypt = require('bcrypt');

/* underscore */
const _ = require('underscore');

const Usuario = require('../models/usuario');
//middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autentication')

const app = express();


app.get('/', function (req, res) {
   
});



app.get('/usuarios', verificaToken, (req, res) => {

   let from = req.query.from || 0;
   from = Number(from);

   let limit = req.query.limit || 5;
   limit = Number(limit);

   Usuario.find({ estado: true })
      .skip(from)
      .limit(limit)
      .exec((err, usuarios) => {

         if (err) {
            return res.status(400).json({
               ok: false,
               err
            });
         }

         Usuario.countDocuments({ estado: true }, (err, conteo) => {

            res.json({
               ok: true,
               usuarios,
               cuantos: conteo
            })

         })



      })


});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
   let body = req.body;

   let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      //usar bcrypt ---primer arg el dato a guardar el segundo la cantidad de vueltas
      password: bcrypt.hashSync(body.password, 10),
      role: body.role
   });

   usuario.save((err, usuarioDB) => {

      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      }

      res.json({
         ok: true,
         usuario: usuarioDB
      })

   });




});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

   let id = req.params.id;
   let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

   Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      };

      res.json({
         ok: true,
         usuario: usuarioDB
      });


   });




});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {


   let id = req.params.id;
   /* Usuario.findByIdAndRemove(id, (err, userDeleted) =>{
      
      
      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      };

      if(!userDeleted){
         return res.status(404).json({
            ok: false,
            err:{
               message:'Usuario no encontrado en la BD'
            }
         }); 
      }

      res.json({
         ok: true,
         usuario: userDeleted
      });


   }); */

   let cambiaEstado = { estado: false }

   Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, userDeleted) => {
      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      };

      if (!userDeleted) {
         return res.status(404).json({
            ok: false,
            err: {
               message: 'Usuario no encontrado en la BD'
            }
         });
      }

      res.json({
         ok: true,
         usuario: userDeleted
      });
   });


});



module.exports = app;