const Proyecto = require('../models/Proyecto');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
exports.crearProyecto =  async (req, res) => {

    //revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errores: errors.array()});
    }
    try {

        //crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}
//obtine todos los proyectos del usuario actual
exports.obtenerProyectos =  async (req, res) => {
    try {

        //obtener proyectos
        const proyecto = await Proyecto.find({'creador': req.usuario.id }).sort({creado: -1});
        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}
//actualizar proyecto por ID
exports.actualizarProyecto =  async (req, res) => {

    //revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errores: errors.array()});
    }
    try {
        // extraer la información del proyecto
        const { nombre } = req.body;
        const nuevoProyecto = {};
        if(nombre){
            nuevoProyecto.nombre = nombre;
        }
        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }

        //revisar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario no autorizado'});
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set : nuevoProyecto}, { new: true });
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}


//actualizar proyecto por ID
exports.eliminarProyecto =  async (req, res) => {
    try {
            
        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }

        //revisar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario no autorizado'});
        }

        //actualizar
        await Proyecto.findOneAndRemove({_id : req.params.id });
        res.json({msg: 'Proyecto eliminado'});

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}