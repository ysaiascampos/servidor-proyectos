const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//iniciar sesión
// api/auth
router.post('/',
    authController.autenticarUsuario);

//Obtener usuario autenticado
router.get('/',
    auth, 
    authController.usuarioAutenticado);
module.exports = router;