import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI,{
//     userNewUrlParser: true,
//     userUnifiedTopology: true,
// })
// .then(() => console.log("Connected to MongoDB"))
// .catch((error)=> console.log("Could not connect to MongoDB: ", error ))

app.listen(PORT, ()=>{
    console.log(`Server Express esta corriendo running on port: ${PORT}`);
})

