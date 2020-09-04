const express = require('express');

let { verificaToken } = require('../middlewares/autentication');

const app = express();

let Producto = require('../models/producto');



//===============================
//Buscar un producto
//===============================
app.get('/productos/buscar/:termino',verificaToken, (req,res)=>{

   let termino = req.params.termino;

   //para obtener busquedas no sintacticamente exactas se crean
   //las expresiones regulares
   // RegExp(basada en el término, y le pongo 'i' para que sea indistinto de mayusculas o minusculas)

      let regExp = new RegExp(termino,'i');
      let regExp2 = new RegExp(termino,'i') 


   Producto.find({ 
      nombre: regExp,
      disponible: true,
   })
   .populate('categoria', 'nombre')
   .exec((err, productos)=>{
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      }
      res.json({
         ok: true,
         productos

      });

   })
});



//===============================
//Obtener productos
//===============================
app.get('/productos', verificaToken, (req, res) => {
   //trae los productos
   //populate: usuario - categoria
   //paginado
   let desde = req.query.desde || 0;
   desde = Number(desde);


   Producto.find({ disponible: true })
      .sort('precioUni')
      .populate('usuario', 'nombre email')
      .populate('categoria', 'nombre email')
      .skip(desde)
      .limit(5)
      .exec((err, productos) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err
            });
         }

         res.json({
            ok: true,
            productos

         });


      });





});

//===============================
//Obtener producto por id
//===============================
app.get('/productos/:id', verificaToken, (req, res) => {
   //populate: usuario - categoria
   let id = req.params.id;

   Producto.findById(id)
      .populate('usuario', 'nombre email')
      .populate('categoria', 'nombre email')
      .exec( (err, producto) => {

         if (err) {
            return res.status(400).json({
               ok: false,
               err: {
                  message: 'Se ha producido un error'
               }
            });
         };

         if (!producto) {
            return res.status(400).json({
               ok: false,
               err: {
                  message: 'No existen categorías con ese ID'
               }
            });
         } else {
            return res.json({
               ok: true,
               producto

            });
         }


      });




});

//===============================
//Crear un producto
//===============================
app.post('/productos/', verificaToken, (req, res) => {
   //Grabar el usuario
   //grabar una categoria del listado
   let body = req.body;

   let producto = new Producto({
      nombre: body.nombre,
      precioUni: body.precioUni,
      descripcion: body.descripcion,
      disponible: body.disponible,
      categoria: body.categoria,
      usuario: req.usuario._id
   })

   producto.save((err, productoDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      }
      if (!productoDB) {
         return res.status(400).json({
            ok: false,
            err
         });
      }

      res.json({
         ok: true,
         producto: productoDB

      });
   })


});

//===============================
//Actualizar un producto
//===============================
app.put('/productos/:id', verificaToken, (req, res) => {
   //Grabar el usuario
   //grabar una categoria del listado

   let id = req.params.id;
   let body = req.body;

   Producto.findByIdAndUpdate(id, body, { new: true, runValidator: true }, (err, productoAct) => {

      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      };

      if (!productoAct) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'No existe el producto a actualizar'
            }
         });
      };

      res.json({
         ok: true,
         producto: productoAct
      });

   });




});

//===============================
//Borrar un producto
//===============================
app.delete('/productos/:id', verificaToken, (req, res) => {
   //disponible convertirse a false
   //El producto se ha borrado--mensaje de salida
   let id = req.params.id;
   let cambiaDisponible = { disponible: false };

   Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true, runValidator: true }, (err, productoAct) => {

      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      };

      if (!productoAct) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'No existe el producto a actualizar'
            }
         });
      };

      res.json({
         ok: true,
         producto: productoAct
      });

   });

});


module.exports = app;