const { response } = require("express");
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');



const login = async(req, res = response) =>{

    const { correo, password } = req.body

    try {

        //Verificar si email existe
        const usuario = await Usuario.findOne({ correo });
        //Si no viene un true del metodo findOne retorna el error
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Usuario'
            });
        }


        //Verificar si el usuario esta activo
        //Si usuario.estado es falso retorna un error
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Paswword no son correctos'
            })
        }

        //Verficiar password
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Paswword no son correctos - Password'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );


        res.json({
            msg: 'Login ok',
            usuario,
            token
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }


}

const googleSignin = async( req, res = response ) =>{

    const { id_token } = req.body;

    try {

        //Crea constantes con lo que regresa la promesa
        const { correo, nombre, img } = await googleVerify( id_token );

        //Crea una variable y busca si existe uno (findOne) que ya tenga el correo recibido
        let usuario = await Usuario.findOne({ correo });

        //Si no existe hay que crearlo
        if( !usuario ){
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            //Crea un usuario con todos las propiedades de la data
            usuario = new Usuario( data );
            //Guarda el usuario en DB
            await usuario.save();
        }

        //Si el usuario esta en DB pero su estado es false
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });


    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar!!!!!!'
        })
        
    }


}


module.exports = {
    login,
    googleSignin
}