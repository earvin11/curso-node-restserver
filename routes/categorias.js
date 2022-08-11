const { Router } = require('express');
const { check } = require('express-validator');


const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        borrarCategoria, 
        actualizarCategoria } = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, 
        validarCampos, 
        tieneRole, 
        esAdminRole} = require('../middlewares');


const router = Router();

// {{url}}/api/categorias

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoria );

//Crar categoria -privado- cualquier persona con token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos 
    ], crearCategoria );

//Actualizar -privado- cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nuevo nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria );

//Borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria );




module.exports = router;