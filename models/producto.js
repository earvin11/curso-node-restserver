const {Schema, model} = require('mongoose');


const ProductoSchema = Schema({

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
        ref: 'Usuario', //del Schema usuario
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: /*Schema.Types.ObjectId*/ String,
        ref: 'Categoria',
        required: true
    },
    descripcion : { type: String },
    disponible : { type: Boolean, default: true },
    img: {type: String}

});

//Cuando se llame el objeto JSON ejecuta esta funcion que debe ser una funcion tradicional
ProductoSchema.methods.toJSON = function() {
    //Separa las propiedades y devuelve las propiedades restantes con el operador (...)
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Producto', ProductoSchema);