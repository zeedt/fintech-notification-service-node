import express from "express";
import * as createError from "http-errors";
import logger from 'morgan';
import path from 'path';
import router from './routes/notification';
import sequelize from './config/db-config';
import Notification from './models/notification.model';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000; // default port to listen

// sequelize.addModels(['./models']);
sequelize.addModels([Notification])
sequelize.authenticate();
sequelize.sync();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.use('/notification', router)
// start the Express server
app.listen( port, () => {
    // console.log( `server started at http://localhost:${ port }` );
} );