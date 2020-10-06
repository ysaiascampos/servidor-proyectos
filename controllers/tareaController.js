const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
exports.crearTarea =  async (req, res) => {

    //revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errores: errors.array()});
    }
    
    try {
        const { proyecto } =req.body;
        // revisar el id
        let existeProyecto = await Proyecto.findById(proyecto);

        //si el proyecto existe o no
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }

        //revisar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario no autorizado'});
        }

        //crear un nuevo tarea
        const tarea = new Tarea(req.body);
        //Guardar el creador via JWT
        tarea.save();
        res.json(tarea);

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}
//obtener tareas por proyectos
exports.obtenerTareas =  async (req, res) => {
    try {
        const { proyecto } =req.body;
        // revisar el id
        let existeProyecto = await Proyecto.findById(proyecto);

        //si el proyecto existe o no
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }

        //revisar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario no autorizado'});
        }

        //obtener proyectos
        const tarea = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}
//actualizar tarea por ID
exports.actualizarTarea =  async (req, res) => {

    //revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errores: errors.array()});
    }
    try {

        const { proyecto, nombre, estado } =req.body;
        // revisar el id
        let tarea = await Tarea.findById(req.params.id);

        //si el tarea existe o no
        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrado'});
        }

        // revisar el id
        let existeProyecto = await Proyecto.findById(proyecto);

        //revisar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario no autorizado'});
        }
        const nuevoTarea = {};
        if(nombre){
            nuevoTarea.nombre = nombre;
        }
        if(estado){
            nuevoTarea.estado = estado;
        }

        //actualizar
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, { $set : nuevoTarea}, { new: true });
        res.json(tarea);

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}


//actualizar tarea por ID
exports.eliminarTarea =  async (req, res) => {
    try {

        const { proyecto } =req.body;
        // revisar el id
        let existeProyecto = await Proyecto.findById(proyecto);

        //si el proyecto existe o no
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }

        //revisar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario no autorizado'});
        }

        //eliminar
        await Tarea.findOneAndRemove({_id : req.params.id });
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}