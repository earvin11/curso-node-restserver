
const { response, request } = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');



const usuariosGet = async (req = request, res = response) => {

    //Desectrura lo que venga en los argumentos del URL
    const { limite = 5, desde = 0 } = req.query;

    const query = {estado : true} //Solo los registros cuyo estado sea "true"

    //Esto crea una constante con todos los usuarios existentes en la BD
    // const usuarios = await Usuario.find(query)
    //         .skip(Number(desde))    //desde cual va a mostrar
    //         .limit(Number(limite)); //limite de cuantos va a mostrar

    //Total de registros en la base de datos con el metodo countDocuments()
    // const total = await Usuario.countDocuments(query);

    //Promise.all para disparar las dos promesas al mismo tiempo

    //Desestructuracion de arreglos, se le coloca como nombre total al indice 0 y usuarios al indice 1

    const [ total, usuarios ] = await Promise.all([
        //Total de registros en la base de datos con el metodo countDocuments()
        Usuario.countDocuments(query),
        //Esto crea una constante con todos los usuarios existentes en la BD
        Usuario.find(query)
            .skip(Number(desde))   //desde cual va a mostrar
            .limit(Number(limite)) //limite de cuantos va a mostrar

    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    //Extrae el nombre, correo, password y rol del body de la request
    const { nombre, correo, password, rol } = req.body;
    //Crea una nueva instancia de Usuario enviando lo extraido en la linea anterior
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar contraseña
    //Generar el salt (numero de vueltas para encriptar) y almacenarlo en una variable
    const salt = bcrypt.genSaltSync();

    //En la propiedad password del objeto usuario se encripta la contraseña con el metodo 
    // hashSync enviandole como primer argumento el password a encriptar y seguidamente el salt
    usuario.password = bcrypt.hashSync( password, salt );

    //Gaurdar en DB
    await usuario.save();

    res.status(201).json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async(req = request, res = response) => {

    const { id } = req.params;

    //Extrae password, correo y google e ignoralos
    const { _id, password, google, correo, ...resto } = req.body

    //TODO validar contra la base de datos

    //Si viene el password, quiere actualizar la contraseña
    if( password ){
        //Encriptar la nueva contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, salt );
    }

    //Busca un usuario con el id recibido en el primer argumento y acualiza lo que venga en el segundo argumento
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    //Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    //Cambiar estado de activo a inactivo
    //esto envia el id como primer argumento y luego la propiedad del objeto con el nuevo valor
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });


    res.json(usuario);
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}