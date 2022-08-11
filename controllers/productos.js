const { response } = require('express');
const { Producto, Categoria } = require('../models');

const obtenerProductos = async(req, res) =>{

    const { limite = 5, desde = 0 } = req.body;

    const query = { estado: true };

    const [ total, productos ] = await Promise.all([

        Producto.countDocuments(query),

        Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });

}

const obtenerProducto = async( req, res = response ) =>{

    const { id } = req.params;

    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json({
        producto
    });

}

const crearProducto = async( req, res = response ) =>{

    //Separa el estado y usuario, lo demas almacenalo en ...body
    const { estado, usuario, ...body } = req.body
    
    //Busca si hay un producto con ese nombre en la DB
    const nombre = req.body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre });
    //Si existe el producto con ese nombre retorna err
    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ nombre } ya existe en la base de datos`
        });
    }

    //Generar la data
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id

    }

    const producto = new Producto( data );

    //Guardar el producto en DB
    await producto.save();

    res.status(201).json(producto);


}

const actualizarProducto = async( req, res = response ) =>{

    const { id } = req.params;

    const{ estado, usuario, ...data } = req.body;

    if(data.nombre){

        data.nombre  = data.nombre.toUpperCase();

    }


    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, {new: true} );

    res.json(producto);
}

const borrarProducto = async( req, res ) =>{

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id,{ estado: false }, {new: true});

    res.json(productoBorrado);
}




module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}