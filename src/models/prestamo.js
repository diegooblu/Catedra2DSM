'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prestamo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Prestamo.init({
    usuarioId: DataTypes.INTEGER,
    libroId: DataTypes.INTEGER,
    fechaPrestamo: DataTypes.DATE,
    fechaDevolucion: DataTypes.DATE,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Prestamo',
  });
  return Prestamo;
};