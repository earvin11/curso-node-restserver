const path = require('path');
const { v4 : uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesPermitidas = ['jpg', 'png', 'jpeg', 'gif'], carpeta = '' ) =>{

    return new Promise( ( resolve, reject ) => {
        // Crea una const archivo con lo que venga en la req
        const { archivo } = files;

        //Separa el nombre del archivo por cada punto que tenga y crea un array
        const nombreCortado = archivo.name.split('.');
        //Con la ultima posicion del arr obtenemos la extension
        const extension = nombreCortado[ nombreCortado.length -1 ];

        //Validar extension

        //Si las extensiones permitinad no incluyen la extension que viene de la req
        if( !extensionesPermitidas.includes( extension ) ) {

        return reject(`El tipo de archivo ${ extension } no esta permitido, tipos de archivos permitidos: ${ extensionesPermitidas }`); 
        }


        
        // Crea una constante con la ruta
        const nombreTemp = uuidv4() + '.' + extension;
        //Une __dirname, con la ruta del directorio, y dale el nombre de la propiedad name que venga del archivo
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );
        
        // Mueve lo que venga en archivo para la ruta 'uploadPath' y en caso de que falle dispara el CB
        archivo.mv(uploadPath, (err) => {
        if (err) {
            return reject(err);
        }
    
        resolve( nombreTemp );

        });
    })

    

}



module.exports = {
    subirArchivo
}