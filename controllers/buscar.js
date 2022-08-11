const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, 
        Categoria, 
        Producto } = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

const buscarCategorias = async( termino = '', res = response ) =>{

    //Verifica si el termino que viene es un monogId
    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [ categoria ] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })

}

const buscarProductos = async( termino = '', res = response ) =>{

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ) {
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({ nombre: regex, estado: true })
                                        .populate('categoria', 'nombre');

    res.json({
        results: productos
    })

}

const buscarUsuarios = async(termino = '', res = response) =>{

    const esMongoId = ObjectId.isValid( termino ); // si termino es un objectid valido de monogo es TRUE, sino FAlSE

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] //Si el usuario exciste, return arr con el usuario, sino un arr vacio
        });    
    }

    // Crea una const regex 
    //RegExp enviando como primer argumento el termino y el segundo termino la 'i' de insensible a mayusculas y minusculas
    const regex = new RegExp( termino, 'i' );

    // Busca en el modelo Usuario todos los usuarios que tengan una propiedad nombre que coincidan con la const regex
    const usuarios = await Usuario.find({
        //O ($or de mongoose) nombre coincide con regex, o correo es igual a regex
        $or: [{ nombre: regex }, {correo: regex}],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}



const buscar = async( req, res = response ) =>{

    //Extrae de la req params (URL) coleccion y termino
    const { coleccion, termino } = req.params;

    //Si el arr coleccionesPermitidas no incluye la coleccion que viene en la rq retorna err
    if( !coleccionesPermitidas.includes(coleccion) ){
        return res.status(400).json({
          msg: `Las colecciones permitidas son ${ coleccionesPermitidas }`  
        });
    }

    switch ( coleccion ) {
        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos( termino, res );
        break;

        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });
    }

}


module.exports = {
    buscar,
}