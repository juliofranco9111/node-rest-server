const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autentication');

let app = express();

let Categoria = require('../models/categoria');





//Crear una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
   //Regresa la nueva categoria
   //req.usuario._id ---id de la persona que ejecuta la funcion
   let body = req.body;

   let categoria = new Categoria({
      descripcion: body.descripcion,
      usuario: req.usuario._id
   });

   categoria.save((err, categoriaDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      }
      if (!categoriaDB) {
         return res.status(400).json({
            ok: false,
            err
         });
      }

      res.json({
         ok: true,
         categoria: categoriaDB,
         
      });
   });
});


//Actualizar una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {

   let id = req.params.id;
   let body = req.body;
   let descCategoria = {
      descripcion: body.descripcion
   };


   Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidator: true }, (err, categoriaDB) => {

      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      };

      if (!categoriaDB) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'No existe la categoría a actualizar'
            }
         });
      };

      res.json({
         ok: true,
         categoria: categoriaDB
      });

   });

});


//Borrar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
   //Solo un admin puede borrar categorias
   //eliminar fisicamente

   let catId = req.params.id;

   Categoria.findByIdAndRemove(catId, (err, categoriaDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      };

      if (!categoriaDB) {
         return res.status(404).json({
            ok: false,
            err: {
               message: 'No existe la categoría a eliminar'
            }
         });
      };

      return res.json({
         ok: true,
         message: 'Categoria borrada'
      })

   })
});


//mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

   Categoria.find({})
   .sort('descripcion')
      .populate('usuario', 'nombre email')
      .exec((err, categorias) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err
            });
         }

         res.json({
            ok: true,
            categorias

         });
      

   });


});

//mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {

   let catId = req.params.id;

   Categoria.findById(catId, (err, categoria) => {

      if (err) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'Se ha producido un error'
            }
         });
      };

      if (!categoria) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'No existen categorías con ese ID'
            }
         });
      } else {
         return res.json({
            ok: true,
            categoria

         });
      }


   });



});









module.exports = app;





