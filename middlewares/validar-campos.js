
const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next ) =>{

    //validationResult para buscar erroes enviados a la request mediante los middlewares
    const errors = validationResult(req);
    
    //Si errors no esta vacia (!isEmpty) retorna estatus 400 mostrando lo que este dentro de errors
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next();
}



module.exports = {
    validarCampos,

}