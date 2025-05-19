// backend/routes/login.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por su email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const user = rows[0];

    // Verificar la contraseña
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Autenticación exitosa
    res.status(200).json({ message: 'Inicio de sesión exitoso', user: { id: user.id, username: user.username } });
    
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
});

module.exports = router;