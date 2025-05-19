const path = require('path');
const express = require('express');
const cors =  require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const registerRouter = require('./routes/register');



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

app.use(express.static(path.join(__dirname, '..', 'frontend')));



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




// Aquí puedes importar rutas reales:
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;

