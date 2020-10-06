const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario =  async (req, res) => {

    //revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errores: errors.array()});
    }

    try {
        //extraer email y password
        const { email, password } = req.body;

        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({ msg: 'El usuario no existe'});
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password,usuario.password);
        if(!passCorrecto){
            return res.status(400).json({ msg: 'El password es incorrecto'});
        }

        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA,{
           expiresIn: 3600 //segundos
        }, (error, token) => {
            if(error) throw error;
            res.json({ token });
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}

//obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }

}
