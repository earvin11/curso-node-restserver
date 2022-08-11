
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) =>{

    //Crea una constante con lo que envie el usuario en el header en x-token
    const token = req.header('x-token');
    
    //Si la const token viene vacia
    if( !token ) {
        //Retorna un json con un msj de error
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });

    }

    try {

        //Con la funcion verify enviando el token como primer argumento
        // y la firma como segundo argumento extrae de todo eso el uid del usuario dueño del token
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        //Crea una nueva propiedad en la request que sea igual al id extraido del token
        req.uid = uid;

        
        //Leer usuario que corresponde al uid
        //Crea una nueva prppiedad del usuario autenticado con el uid extraido del token
        const usuario = await Usuario.findById(uid);

        //Verificar si existe usuario
        if( !usuario ){
            return res.status(401).json({
                msg : 'Token invalido - Usuario no existe en BD'
            });
        }
        
        //Verificar estado true o false del usuario a autenticar
        if( !usuario.estado ){

            return res.status(401).json({
                msg : 'Token invalido - Usuario inactivo'
            });

        }

        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        })
        
    }


}

module.exports = {
    validarJWT
}