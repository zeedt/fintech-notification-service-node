import { Sequelize } from 'sequelize-typescript';

const HOST = process.env.DB_HOST || 'localhost';
const PORT = parseInt(process.env.DB_PORT, 10) || 5432;
const PASSWORD = process.env.DB_PASSWORD || 'root';
const DB = process.env.DB_NAME || 'fintech_notification';
const DIALECT = "postgres"
const USER = process.env.DB_USER || 'postgres';

export default new Sequelize(DB,USER , PASSWORD,
        {modelPaths : ['./../models'],
         dialect : DIALECT,
         host : HOST,
         port : PORT,
         ssl : true,
         sync : {
          schema : 'public',
          searchPath : 'public'
         }
        });