
const { Router } = require('express');
const { check } = require('express-validator');

const {
        validarCampos,
        validarJWT,
        esAdminRole,
        tieneRole
} = require('../middlewares');

const { esRoleValido,
        emailExiste, 
        existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.post('/', [
        //Chequea que el nombre no venga vacio (not().isEmpty()), caso contrario envia el msj del segundo parametro
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        //Chequea que la contraseña tenga un minimo de 6 caracteres con isLenght
        check('password', 'La contraseña debe de tener mas de 5 caracteres').isLength({ min: 6 }),
        //Chequea el correo sea un correo valido (isEmail)
        check('correo', 'El correo no es valido').isEmail(),
        //Verificar si el correo existe
        check('correo').custom( emailExiste ),
        //Chequea que el rol exista dentro de el arreglo enviado en el metodo isIn([])
        // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        //Verifica que sea un rol valido enviandolo a la funcion esRoleValido()
        check('rol').custom( esRoleValido ),
        
        validarCampos
], usuariosPost );

router.put('/:id', [
        //Verifica que el id recibido sea un id valido de Mongo con isMongoId()
        check('id', 'No es un ID válido').isMongoId(),
        //Verifica que el id exista dentro de la BD
        check('id').custom( existeUsuarioPorId ),
        //Verifica que venga un rol valido dentro de la BD
        check('rol').custom( esRoleValido ),
        validarCampos
] ,usuariosPut );

router.patch('/', usuariosPatch );

router.delete('/:id',[
        validarJWT,
        // esAdminRole,
        //Verifica que el usuario autenticado tenga uno de estos roles
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        //Verifica que el id recibido sea un id valido de Mongo con isMongoId()
        check('id', 'No es un ID válido').isMongoId(),
        //Verifica que el id exista dentro de la BD
        check('id').custom( existeUsuarioPorId ),
        validarCampos
],usuariosDelete );




module.exports = router;