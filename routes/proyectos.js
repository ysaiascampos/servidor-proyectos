const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//crea un proyectos
// api/proyectos
router.post('/',
    auth
    ,[
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ]
    ,proyectoController.crearProyecto);

//Listar proyectos
// api/proyectos
router.get('/',
    auth
    ,proyectoController.obtenerProyectos);

//Actulizar un proyectos via ID
// api/proyectos
router.put('/:id',
    auth
    ,[
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ]
    ,proyectoController.actualizarProyecto);

//Eliminar un proyectos via ID
// api/proyectos
router.delete('/:id',
    auth
    ,proyectoController.eliminarProyecto);
module.exports = router;