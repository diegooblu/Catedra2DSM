const app = require('./src/app');
const { sequelize } = require('./src/models');


const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('✅ Conexión a la base de datos exitosa');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Error al conectar a la base de datos:', err.message);
});
