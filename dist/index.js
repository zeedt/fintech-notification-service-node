"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./config/logger"));
const notification_1 = __importDefault(require("./routes/notification"));
const db_config_1 = __importDefault(require("./config/db-config"));
const notification_model_1 = __importDefault(require("./models/notification.model"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cron_1 = __importDefault(require("./config/cron"));
const notification_job_1 = __importDefault(require("./jobs/notification.job"));
const app = express_1.default();
const port = 3000; // default port to listen
const task = cron_1.default.schedule('0 * * * *', () => {
    logger_1.default.info('Starting task');
    notification_job_1.default.runNotificationJob();
}, {
    scheduled: true
});
task.start();
// sequelize.addModels(['./models']);
db_config_1.default.addModels([notification_model_1.default]);
db_config_1.default.authenticate();
db_config_1.default.sync();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.use('/notification', notification_1.default);
// start the Express server
app.listen(port, () => {
    // console.log( `server started at http://localhost:${ port }` );
});
//# sourceMappingURL=index.js.map