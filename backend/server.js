require('dotenv').config();
const app = require('./app');
const htpps = require('https');
const fs = require('fs');


//Configuración del https
const PORT = process.env.PORT || 3000;



// Si usas HTTPS local en desarrollo con certificados autofirmados:
// const options = {
//   key: fs.readFileSync('./certs/key.pem'),
//   cert: fs.readFileSync('./certs/cert.pem')
// };



app.listen(PORT, () => {
    console.log(`Sharegame está corriendo en: http://localhost:${PORT}`)
})



// Para producción con HTTPS:
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`🚀 Sharegame seguro en https://localhost:${PORT}`);
// });