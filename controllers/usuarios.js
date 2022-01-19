
const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'no name', apikey } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
}

const usuariosPut = (req = request, res = response) => {

    const { id } = req.params;

    res.status(400).json({
        msg: 'put API - controlador',
        id,
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}