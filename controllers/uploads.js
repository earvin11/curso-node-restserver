const path = require('path');
const fs   = require('fs');

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { Usuario, Producto } = require('../models'); 


const cargarArchivo = async( req, res = response ) =>{

  try {

    const nombre = await subirArchivo( req.files, undefined, 'imgs' );

    res.json({
      nombre
    });
    
  } catch (msg) {
    res.status(400).json({ msg });
  }


}

const actualizarImagen = async( req, res = response ) =>{

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {

    case 'usuarios':
      
      modelo = await Usuario.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: 'No existe un usuario con ese id'
        });
      }

    break;

    case 'productos':
      
      modelo = await Producto.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: 'No existe un Producto con ese id'
        });
      }

    break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });


  }


  //Limpiar imagenes previas
  //Si el modelo que estamos evaluando tiene la propiedad img
  if( modelo.img ) {
    //Hay que borrar la imagen del servidor
    //Crea una const con el path de la img
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

    console.log(pathImagen);
    //Si existe un archivo en este path
    if( fs.existsSync( pathImagen ) ) {
      //Elimina el archivo que este en el path
      fs.unlinkSync( pathImagen );
    }
  }


  const nombre = await subirArchivo( req.files, undefined, coleccion );
  modelo.img = nombre;

  await modelo.save();

  res.json( modelo );


}

const mostrarImagen = async( req, res = response ) =>{

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {

    case 'usuarios':
      
      modelo = await Usuario.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: 'No existe un usuario con ese id'
        });
      }

    break;

    case 'productos':
      
      modelo = await Producto.findById(id);
      if( !modelo ) {
        return res.status(400).json({
          msg: 'No existe un Producto con ese id'
        });
      }

    break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });


  }


  //Si el modelo que estamos evaluando tiene la propiedad img
  if( modelo.img ) {
    //Crea una const con el path de la img
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    //Si existe un archivo en este path
    if( fs.existsSync( pathImagen ) ) {
      //Muestra el archivo
      return res.sendFile( pathImagen );
    }
  }

  //En caso de no existir la imagen crea una const con el path de la img de no-image
  const noImgPath = path.join( __dirname, '../assets/no-image.jpg' );
  //Responde la imagen de no-image
  res.sendFile(noImgPath);

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}