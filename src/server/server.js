import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Soporte para dos nombres comunes de la variable de entorno:
// - MONGODB_URI (usado por muchos ejemplos)
// - MONGO_URI (tu .env actual usa este nombre)
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (mongoUri && mongoUri.trim() !== '') {
    console.log('Usando conexión MongoDB desde variable de entorno.');
    mongoose
        .connect(mongoUri, {
        })
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.log('Could not connect to MongoDB: ', error));
} else {
    console.log('No se encontró MONGODB_URI ni MONGO_URI. Se omite la conexión a MongoDB. Si quieres usar MongoDB, añade MONGO_URI o MONGODB_URI en un archivo .env o en las variables de entorno.');
}


app.listen(PORT, ()=>{
    console.log(`Server Express esta corriendo running on port: ${PORT}`);
})

