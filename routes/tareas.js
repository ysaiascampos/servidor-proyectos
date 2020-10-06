const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//crea un tareas
// api/tareas
router.post('/',
    auth,[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ]
    ,tareaController.crearTarea);

//Listar tareas por proyecto
// api/tareas
router.get('/',
    auth
    ,tareaController.obtenerTareas);

//Actulizar un tareas via ID
// api/tareas
router.put('/:id',
    auth,[
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ]
    ,tareaController.actualizarTarea);

//Eliminar un tareas via ID
// api/tareas
router.delete('/:id',
    auth
    ,tareaController.eliminarTarea);
module.exports = router;