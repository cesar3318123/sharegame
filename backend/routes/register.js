// backend/routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const upload = multer();


function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
}



router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password_hash]);
    res.status(201).json({ message: 'Usuario registrado correctamente' });



    



  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message });
  }

  
});


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







        // Generar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Guardar el hash del refresh token en la base de datos
    // Puedes usar bcrypt para hashear el refresh token antes de guardar
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await db.query('UPDATE users SET refresh_token_hash = ? WHERE id = ?', [refreshTokenHash, user.id]);

    // Enviar el refresh token en cookie segura
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción https
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en ms
    });

    // Enviar access token al cliente para autenticar peticiones
    res.status(200).json({ 
      message: 'Inicio de sesión exitoso', 
      accessToken, 
      user: { id: user.id, username: user.username, role: user.role } 
    });


    
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
});


// Ruta para buscar usuarios por nombre exacto o por inicial de nombre
router.get('/api/users', async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
  }

  try {
    // Extraemos la primera letra para búsqueda por inicial
    const firstLetter = search.charAt(0);

    // Consulta que busca usuarios cuyo username sea igual al término de búsqueda
    // o que empiecen con la misma inicial (case insensitive)
    const [users] = await db.query(
      `SELECT id, username FROM users 
       WHERE LOWER(username) = LOWER(?) 
          OR LOWER(username) LIKE LOWER(CONCAT(?, '%'))`,
      [search, firstLetter]
    );

    res.json(users);
  } catch (error) {
    console.error('❌ Error en búsqueda de usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
});




router.get('/api/user/profile-image/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT profile_image FROM user_profiles WHERE user_id = ?', [id]);

    if (rows.length === 0 || !rows[0].profile_image) {
      return res.status(404).send("Sin imagen");
    }

    res.setHeader("Content-Type", "image/jpeg");
    res.send(rows[0].profile_image);
  } catch (err) {
    console.error("Error al obtener imagen:", err);
    res.status(500).send("Error de servidor");
  }
});



router.post('/api/user/profile-image/:id', upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const image = req.file?.buffer;

  if (!image) return res.status(400).send("Imagen requerida");

  try {
    // Verificamos si ya existe
    const [existing] = await db.query('SELECT user_id FROM user_profiles WHERE user_id = ?', [id]);

    if (existing.length > 0) {
      await db.query('UPDATE user_profiles SET profile_image = ? WHERE user_id = ?', [image, id]);
    } else {
      await db.query('INSERT INTO user_profiles (user_id, profile_image) VALUES (?, ?)', [id, image]);
    }

    res.status(200).send(image); // Devuelve imagen para previsualizar si quieres
  } catch (err) {
    console.error("Error al guardar imagen:", err);
    res.status(500).send("Error al guardar imagen");
  }
});




const storage = multer.memoryStorage();
  const upload1 = multer({ storage });

router.post("/api/posts", upload1.single("image"), async (req, res) => {
  const { title, description, user_id } = req.body;
  const imageBuffer = req.file?.buffer || null;

  if (!title || !description || !user_id) {
    return res.status(400).send("Missing required fields.");
  }

  try {
    await db.query(
      `INSERT INTO posts (user_id, title, description, image) VALUES (?, ?, ?, ?)`,
      [user_id, title, description, imageBuffer]
    );

    res.status(200).send("Post saved successfully.");
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).send("Server error.");
  }
});



router.get('/api/posts/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [posts] = await db.query(
      'SELECT id, title, description, image, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    // Convierte la imagen en base64 para poder mostrarla en el frontend
    const formattedPosts = posts.map(post => ({
      ...post,
      image: post.image ? `data:image/jpeg;base64,${post.image.toString('base64')}` : null
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).send("Server error");
  }
});


router.get('/api/users/:id/friends', async (req, res) => {
  const userId = req.params.id;

  const [rows] = await db.execute(`
    SELECT u.id, u.username, u.email
    FROM friendships f
    JOIN users u ON u.id = f.friend_id
    WHERE f.user_id = ?
  `, [userId]);

  res.json(rows);
});



router.get('/users/:id/profile-image1', async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.execute(
      'SELECT profile_image FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0 || !rows[0].profile_image) {
      return res.status(404).send('Imagen no encontrada');
    }

    const imgBuffer = rows[0].profile_image;
    res.writeHead(200, {
      'Content-Type': 'image/jpeg', // Ajusta según el tipo real (puede ser image/png, etc.)
      'Content-Length': imgBuffer.length,
    });
    res.end(imgBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al recuperar la imagen');
  }
});



module.exports = router;
