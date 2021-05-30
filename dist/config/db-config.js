"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const HOST = process.env.DB_HOST || 'localhost';
const PORT = parseInt(process.env.DB_PORT, 10) || 5432;
const PASSWORD = process.env.DB_PASSWORD || 'root';
const DB = process.env.DB_NAME || 'fintech_notification';
const DIALECT = "postgres";
const USER = process.env.DB_USER || 'postgres';
exports.default = new sequelize_typescript_1.Sequelize(DB, USER, PASSWORD, { modelPaths: ['./../models'],
    dialect: DIALECT,
    host: HOST,
    port: PORT,
    sync: {
        schema: 'public',
        searchPath: 'public'
    }
});
//# sourceMappingURL=db-config.js.map