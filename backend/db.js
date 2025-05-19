const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    console.log('✅ Conexión a la base de datos MySQL exitosa');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1); // Detener la app si falla la conexión
  }
}

verificarConexion();

