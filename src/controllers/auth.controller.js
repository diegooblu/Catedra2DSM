const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// REGISTRO DE USUARIO
exports.register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ mensaje: 'Correo ya registrado' });

    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      contrasena: hash,
    });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno al registrar', detalle: error.message });
  }
};

// LOGIN DE USUARIO
exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Correo no registrado' });
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error interno al hacer login', detalle: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { id } = req.user;

    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'apellido', 'correo'] // excluye contraseña
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del usuario', detalle: error.message });
  }
};

