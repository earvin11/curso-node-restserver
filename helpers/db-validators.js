
const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async( rol = '' ) => {
        //Manejamos el rol enviado, en caso de que no sea enviado sera igual a un string vacio ''
        //Buscar dentro de Role uno igual al rol enviado por el cliente mediante findOne()
        const existeRol = await Role.findOne({rol});
        //Si no existe rol (!existeRol) envia un error
        if(!existeRol){
                throw new Error(`El rol ${rol} no es valido`);
        }
}

const emailExiste = async( correo = '' ) =>{

//Busca mediante el findOne una objeto Usuario que tenga un correo como el que haya sido enviado
    const existeEmail = await Usuario.findOne({ correo });

    if( existeEmail ){
        throw new Error(`El correo: ${correo} ya existe`);
    }
}

const existeUsuarioPorId = async( id ) =>{
    //Buscamos el id con el metodo findById
    const existeUsuario = await Usuario.findById( id );
    //Si no retorna un usuario dispara el error
    if( !existeUsuario ) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existeCategoriaPorId = async( id ) =>{

    const existeCategoria = await Categoria.findById( id );

    if(!existeCategoria) {
        throw new Error (`El id no existe ${id}`);
    }

}

const existeProductoPorId = async( id ) =>{

    const existeProducto = await Producto.findById( id );

    if(!existeProducto){
        throw new Error (`El id no existe ${id}`);
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) =>{

    //Verifica que la coleccion recibida este incluida en el arr de colecciones recibido
    const incluida = colecciones.includes( coleccion );
    if(!incluida){
        throw new Error(`La coleccion ${ coleccion } no esta permitida - ${ colecciones }`);
    }

    return true;

}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}