const { response } = require("express")

const validarArchivoSubir = ( req, res = response, next ) =>{

    // Si no viene nada en la req
    if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        res.status(400).json({
            msg: 'No hya archivos que subir - validarArchivoSubir'
        });
        return;
    }

    next();

}

module.exports = {
    validarArchivoSubir,
}