const {Schema, model} = require('mongoose');


const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: { //Pare recibir el usuario que esta creando la categoria
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

//Cuando se llame el objeto JSON ejecuta esta funcion que debe ser una funcion tradicional
CategoriaSchema.methods.toJSON = function() {
    //Separa las propiedades y devuelve las propiedades restantes con el operador (...)
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema);