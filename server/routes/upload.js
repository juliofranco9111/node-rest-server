const express = require('express');
const fileUpload = require('express-fileupload');
const { json } = require('body-parser');



const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

//Uso del middleware fileupload
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

   let tipo = req.params.tipo;
   let id = req.params.id

   //los archivos se almacenan en req.files 

   if (!req.files) {

      return res.status(400).json({
         ok: false,
         err: {
            message: 'No se ha seleccionado ningún archivo'
         }
      })
   };

   //Validar tipo
   let tiposValidos = ['productos', 'usuarios'];

   if (tiposValidos.indexOf(tipo) < 0) {
      return res.status(400).json({
         ok: false,
         err: {
            message: 'Los tipos permitidos son ' + tiposValidos.join(' y ')
         }
      })
   }


   let archivo = req.files.archivo;
   //console.log(archivo);

   let nombreCortado = archivo.name.split('.');
   //console.log(nombreCortado);

   let extension = nombreCortado[nombreCortado.length - 1];
   //console.log(extension);
   //restringir el tipo de archivo
   //extensiones permitidas
   let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

   //para buscar la extension en el arreglo uso indexof
   //si en extensionesvalidas no hay una extension ( <  0 ) 
   if (extensionesValidas.indexOf(extension) < 0) {

      return res.status(400).json({
         ok: false,
         err: {
            message: 'Las extensiones permitidas son ' + extensionesValidas.join(' , '),
            //el join se usa para juntar el array y le agrego el separador
            ext: extension
         }
      })

   }

   //Cambiar el nombre al archivo
   //el nombre compuesto por id(dfgdgdfg2342re-milisegundos(999).jpg
   let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;



   archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
      if (err)
         return res.status(500).json({
            ok: false,
            err
         });


      //Aqui, imagen cargada
      if (tipo === 'usuarios') {
         imagenUsuario(id, res, nombreArchivo);
      } else {
         imagenProducto(id, res, nombreArchivo);
      }




   });


   function imagenUsuario(id, res, nombreArchivo) {

      Usuario.findById(id, (err, usuarioDB) => {
         if (err) {

            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
               ok: false,
               err
            })
         };

         if (!usuarioDB) {

            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
               ok: false,
               err: {
                  message: 'Usuario no existe'
               }
            })
         }


         borrarArchivo(usuarioDB.img, 'usuarios');


         usuarioDB.img = nombreArchivo

         usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
               return res.status(500).json({
                  ok: false,
                  err
               })
            };

            res.json({
               ok: true,
               usuario: usuarioGuardado,
               img: nombreArchivo

            })
         });


      });


   };

   function borrarArchivo(nombre, tipo) {
      //validar si existe la img
      let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombre}`);
      //fs.existSync(path) devuelve true si existe o false si no
      if (fs.existsSync(pathImagen)) {
         ///unlink borra el path
         fs.unlinkSync(pathImagen)
      };

   };



   function imagenProducto(id, res, nombreArchivo) {

      Producto.findById(id, (err, productoDB) => {
         if (err) {

            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
               ok: false,
               err
            })
         };

         if (!productoDB) {

            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
               ok: false,
               err: {
                  message: 'El producto no existe'
               }
            })
         }


         borrarArchivo(productoDB.img, 'productos');


         productoDB.img = nombreArchivo

         productoDB.save((err, productoGuardado) => {
            if (err) {
               return res.status(500).json({
                  ok: false,
                  err
               })
            };

            res.json({
               ok: true,
               producto: productoGuardado,
               img: nombreArchivo

            })
         });
         ;

      });

   };

});


module.exports = app;