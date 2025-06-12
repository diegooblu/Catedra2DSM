const { Libro } = require('../models');

exports.createBook = async (req, res) => {
  try {
    const { titulo, autor, genero, fechaPublicacion } = req.body;

    const nuevoLibro = await Libro.create({
      titulo,
      autor,
      genero,
      fechaPublicacion,
      disponible: true,
      eliminado: false,
    });

    res.status(201).json({
      mensaje: 'Libro creado correctamente',
      libro: nuevoLibro,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear libro', detalle: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const libros = await Libro.findAll({
      where: { eliminado: false },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libros', detalle: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const libro = await Libro.findOne({
      where: { id, eliminado: false }
    });

    if (!libro) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }

    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el libro', detalle: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, genero, fechaPublicacion } = req.body;

    const libro = await Libro.findOne({ where: { id, eliminado: false } });

    if (!libro) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }

    await libro.update({ titulo, autor, genero, fechaPublicacion });

    res.status(200).json({
      mensaje: 'Libro actualizado correctamente',
      libro
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar libro', detalle: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const libro = await Libro.findOne({ where: { id, eliminado: false } });

    if (!libro) {
      return res.status(404).json({ mensaje: 'Libro no encontrado o ya eliminado' });
    }

    await libro.update({ eliminado: true });

    res.status(200).json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar libro', detalle: error.message });
  }
};

exports.restoreBook = async (req, res) => {
  try {
    const { id } = req.params;

    const libro = await Libro.findOne({ where: { id, eliminado: true } });

    if (!libro) {
      return res.status(404).json({ mensaje: 'Libro no encontrado o no está eliminado' });
    }

    await libro.update({ eliminado: false });

    res.status(200).json({ mensaje: 'Libro restaurado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al restaurar libro', detalle: error.message });
  }
};
