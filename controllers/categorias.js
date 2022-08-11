const { response, request } = require('express');
const { Categoria } = require('../models');

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async( req = request, res = response ) =>{

    const { limite = 5, desde = 0 } = req.body;

    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        //Total de registros en la BD con countDocuments()
        Categoria.countDocuments(query),
        //Crea una constante con todos los registros de categorias existentes en la BD
        Categoria.find(query)
                .populate('usuario', 'nombre')
                .skip(Number(desde)) //desde cual va a mostrar
                .limit(Number(limite)) //cuantos va a mostras
    ]);

    res.json({
        total,
        categorias
    });


}

//obtenerCategoria - populate
const obtenerCategoria = async ( req = request, res = response ) =>{

    //Extraer el id de los params enviados en la req
    const { id } = req.params;
    
    //Busca la categoria por id
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    
    res.json({
        categoria
    });
        
}

const crearCategoria = async(req, res = response) =>{

    //Crea una constante nombre con lo que venga como "nombre" en el body de la request
    // y transformalo a mayusculas
    const nombre = req.body.nombre.toUpperCase();

    //Busca en el modelo Categoria si ya existe una categria con el nombre
    const categoriaDB = await Categoria.findOne({ nombre });

    //Si existe una categoria con ese nombre retorna un error
    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        })
    }

    //Generar la data
    const data = {
        nombre,
        usuario: req.usuario._id //Usuario que esta creando la categoria
    }

    //Crea una nueva categoria mandando la data
    const categoria =  new Categoria( data );

    //Guardar la categoria en DB
    await categoria.save();

    //Envia un status 201 de creado y envia un json con la categoria creada
    res.status(201).json(categoria);
}

//actualizarCategoria
const actualizarCategoria = async( req = request, res = response ) =>{

    const { id } = req.params;

    //Separa el estado y el usuario de la data
    const { estado, usuario, ...data } = req.body;

    //Transofrma el nombre que venga en la data
    data.nombre  = data.nombre.toUpperCase();
    //Guarda el usuario que realiza la modificacion
    data.usuario = req.usuario._id; 

    //Busca una categoria con ese id y actualiza la informacion con lo que este en el segundo argumento
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    
    res.json(categoria);

}

//borrarCategoria 
const borrarCategoria = async( req = request, res = response ) =>{

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json(categoriaBorrada);

}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}