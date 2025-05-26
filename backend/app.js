const path = require('path');
const express = require('express');
const cors =  require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const registerRouter = require('./routes/register');
const axios = require('axios');
require('dotenv').config();






const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 peticiones por IP
    standardHeaders: true,
    legacyHeaders: false,
})


//Midlewares

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Ajusta según frontend
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(limiter);
app.use('/', registerRouter);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://www.google.com"],
        connectSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com"],
        imgSrc: ["'self'", "https://www.google.com", "data:"],
        imgSrc: ["'self'", "https://www.google.com", "data:", "blob:"]
      },
    },
  })
);


app.use(express.static(path.join(__dirname, '..', 'frontend')));


app.post('/api/login', async (req, res) => {
  const recaptchaToken = req.body['g-recaptcha-response'];
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const response = await axios.post(verifyURL);

    if (!response.data.success) {
      return res.status(403).json({ message: 'reCAPTCHA falló.' });
    }

    res.status(200).json({ message: 'Autenticación exitosa.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al validar reCAPTCHA.' });
  }
});



// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'log.html'));
    
  });

app.get('/post.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'post.html'));
});


app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'profile.html'));
});

app.get('/reg.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'reg.html'));
});

app.get('/friend.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'friend.html'));
});




// Aquí puedes importar rutas reales:
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;

