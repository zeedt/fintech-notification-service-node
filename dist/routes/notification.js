"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_model_1 = __importDefault(require("./../models/notification.model"));
const logger_1 = __importDefault(require("./../config/logger"));
const router = express_1.default.Router();
exports.default = router.post('/send-email', (req, res) => {
    logger_1.default.info(`Request body is `, req.body);
    notification_model_1.default.create(req.body)
        .then(data => {
        const msg = {
            to: req.body.recipients,
            from: 'yusufsaheedtaiwo@gmail.com',
            subject: req.body.subject,
            text: 'and easy to do anywhere, even with Node.js',
            html: req.body.content,
        };
        res.send(data);
    })
        .catch(err => {
        res.status(500)
            .send({ message: err.message });
    });
});
//# sourceMappingURL=notification.js.map