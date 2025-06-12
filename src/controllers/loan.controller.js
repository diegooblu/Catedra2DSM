const { Prestamo, Libro, Usuario } = require('../models');

exports.createLoan = async (req, res) => {
  try {
    const { usuarioId, libroId } = req.body;

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const libro = await Libro.findOne({ where: { id: libroId, eliminado: false, disponible: true } });
    if (!libro) return res.status(404).json({ mensaje: 'Libro no disponible o no existe' });

    const fechaPrestamo = new Date();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaPrestamo.getDate() + 7);

    const prestamo = await Prestamo.create({
      usuarioId,
      libroId,
      fechaPrestamo,
      fechaDevolucion,
      estado: 'prestado'
    });

    await libro.update({ disponible: false });

    res.status(201).json({
      mensaje: 'Préstamo registrado correctamente',
      prestamo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear préstamo', detalle: error.message });
  }
};

exports.returnLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const prestamo = await Prestamo.findByPk(id);
    if (!prestamo) {
      return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    }

    if (prestamo.estado !== 'prestado') {
      return res.status(400).json({ mensaje: 'El préstamo ya fue devuelto' });
    }

    const hoy = new Date();
    const fechaDevolucion = new Date(prestamo.fechaDevolucion);
    const estado = hoy > fechaDevolucion ? 'con retraso' : 'devuelto';

    await prestamo.update({ estado });

    const libro = await Libro.findByPk(prestamo.libroId);
    if (libro) {
      await libro.update({ disponible: true });
    }

    res.status(200).json({
      mensaje: `Libro marcado como ${estado}`,
      prestamo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al devolver libro', detalle: error.message });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'correo']
        },
        {
          model: Libro,
          attributes: ['id', 'titulo', 'autor']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener préstamos', detalle: error.message });
  }
};

exports.getLoansByUser = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const prestamos = await Prestamo.findAll({
      where: { usuarioId: usuario_id },
      include: [
        {
          model: Libro,
          attributes: ['id', 'titulo', 'autor']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!prestamos.length) {
      return res.status(404).json({ mensaje: 'Este usuario no tiene préstamos registrados' });
    }

    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener préstamos del usuario', detalle: error.message });
  }
};
