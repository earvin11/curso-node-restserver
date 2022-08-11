const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo', 'Escriba una direccion de correo valida').isEmail(),
    check('password', 'La contraseña es obligatorioa').not().isEmpty(),
    validarCampos
   
],login );

router.post('/google',[
    check('id_token', 'id_token de google es necesario').not().isEmpty(),
    validarCampos
   
], googleSignin );



module.exports = router;