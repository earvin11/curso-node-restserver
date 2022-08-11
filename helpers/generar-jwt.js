
const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) =>{

    return new Promise( (resolve, reject) => {

        //Almacena el uid recibido en una const payload para generar el JWT
        const payload = { uid };

        // Firma el JWT, el payload luego la firma y las opciones
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' //tiempo de expiracion
        }, ( err, token ) => { //callback

            //Si hay error envia el reject y muestra el error en consola
            if(err) {
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                //Si todo sale bien envia el token en el resolve
                resolve( token );
            }

        })
    })
}

module.exports = {
    generarJWT,
}