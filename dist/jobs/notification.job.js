"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./../config/logger"));
const notification_model_1 = __importDefault(require("./../models/notification.model"));
const notification_service_impl_1 = __importDefault(require("./../service/impl/notification.service.impl"));
class NotificationJob {
    constructor() {
        this.runNotificationJob = () => __awaiter(this, void 0, void 0, function* () {
            if (this.jobRunning) {
                logger_1.default.info("Notification job is already running.......");
                return;
            }
            this.jobRunning = true;
            logger_1.default.info("Now running job");
            const pendingNotifications = yield notification_model_1.default.findAll({
                where: {
                    notificationSent: false
                }
            });
            logger_1.default.info(`Fetched ${pendingNotifications.length} pending notifications`);
            for (const pendingNotification of pendingNotifications) {
                try {
                    if (pendingNotification.isEmail) {
                        yield notification_service_impl_1.default.sendEmailViaSendGrid(pendingNotification);
                        logger_1.default.info("Customer notified successfully by Email");
                    }
                    else {
                        logger_1.default.info("Customer notified successfully by SMS");
                        yield notification_service_impl_1.default.sendSmsViaInfobip(pendingNotification);
                    }
                }
                catch (err) {
                    logger_1.default.error("Error occurred while sending pending notification due to ", err);
                }
            }
            this.jobRunning = false;
        });
    }
}
exports.default = new NotificationJob();
//# sourceMappingURL=notification.job.js.map