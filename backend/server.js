const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./app/config/config');
const app = express();

const cors = require('cors');

var corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const sequelize = new Sequelize(config.development);

sequelize
  .authenticate()
  .then(() => {
    console.log('Koneksi ke database berhasil.');
})
.catch((error) => {
    console.error('Gagal terhubung ke database:', error.message);
});

// routes
require('./app/routes/auth.routes')(app);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});