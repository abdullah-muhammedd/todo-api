import app from './app';
import mongoose from 'mongoose';
import 'dotenv/config';

mongoose
    .connect(process.env.DB_CONNECTION_STRING as string)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Server is up and listening on 3000');
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
