"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./../config/logger"));
const router = express_1.default.Router();
const notification_service_impl_1 = __importDefault(require("./../service/impl/notification.service.impl"));
exports.default = router.post('/send-email', (req, res) => {
    logger_1.default.info(`Request body is `, req.body);
    try {
        notification_service_impl_1.default.sendEmail(req.body);
        res.send();
    }
    catch (error) {
        res.status(500)
            .send({ message: error.message });
    }
});
//# sourceMappingURL=notification.js.map