const { request, response } = require("express")


const esAdminRole = ( req = request, res = response, next ) =>{

    //Verificar si viene un usuario valido
    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    //Del usuario que viene en la req extrae rol y nombre
    const { rol, nombre } = req.usuario

    //Si el rol no es administrador
    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ nombre } no es administrador`
        });
    }


    next();
}

const tieneRole = ( ...roles ) =>{

    return (req, res = response, next) =>{
        
        //Verificar si viene un usuario valido
        if( !req.usuario ){
            return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        //Si el rol del usuario no esta incluido dentro del arreglo de roles (...roles) error
        if( !roles.includes( req.usuario.rol ) ){
            return res.status(401).json({
                msg: 'El usuario no tiene permisos para esta accion'
            })
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}