require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
