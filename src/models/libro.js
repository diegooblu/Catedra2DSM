module.exports = (sequelize, DataTypes) => {
  const Libro = sequelize.define('Libro', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fechaPublicacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Libro;
};
