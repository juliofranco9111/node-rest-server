const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({

   descripcion: {
      type: String,
      required: [true, 'La descripción de la categoría es necesario'],
      unique: true
   },
   usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

});

categoriaSchema.plugin(uniqueValidator, { message: 'El {PATH} de la categoria ya existe en la BD' })


module.exports = mongoose.model('Categoria', categoriaSchema);