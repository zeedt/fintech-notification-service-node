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
const logger_1 = __importDefault(require("./../../config/logger"));
const notification_model_1 = __importDefault(require("./../../models/notification.model"));
const axios_1 = __importDefault(require("axios"));
const SENDGRID_BASE_URL = 'https://api.sendgrid.com/v3/mail/send';
const INFOBIP_BASE_URL = 'https://zjr41x.api.infobip.com/sms/2/text/advanced';
const SENDGRID_BEARER_TOKEN = process.env.SENDGRID_TOKEN;
const INFOBIP_USERNAME = process.env.INFOBIP_USERNAME;
const INFOBIP_PASSWORD = process.env.INFOBIP_PASSWORD;
const INFOBIP_DEFAULT_FROM = 'FINTECH';
const buff = new Buffer(`${INFOBIP_USERNAME}:${INFOBIP_PASSWORD}`);
const INFOBIP_BASIC_CODED_STRING = buff.toString('base64');
class NotificationServiceImpl {
    constructor() {
        this.sendEmail = (notification) => {
            notification.isEmail = true;
            notification_model_1.default.create(notification)
                .then(data => {
                this.sendEmailViaSendGrid(data);
            }).catch(err => {
                throw new Error(err);
            });
        };
        this.sendEmailViaSendGrid = (notification) => __awaiter(this, void 0, void 0, function* () {
            const request = this.createEmailObjectFromNotification(notification);
            try {
                const notificationResponse = yield axios_1.default({
                    method: 'post',
                    url: SENDGRID_BASE_URL,
                    data: request,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SENDGRID_BEARER_TOKEN}`
                    }
                });
                logger_1.default.info("Call successful");
                notification_model_1.default.update({ notificationSent: true }, { where: { id: notification.id } });
            }
            catch (err) {
                logger_1.default.error("Error occurred while sending mail via sendgrid due to ", err);
                throw new Error(err);
            }
        });
        this.createEmailObjectFromNotification = (notification) => {
            const toEmail = {
                email: notification.recipient,
                name: null
            };
            return {
                from: {
                    email: process.env.DEFAULT_SENDER_EMAIL || 'yusufsaheedtaiwo@gmail.com',
                    name: null
                },
                to: toEmail,
                subject: notification.subject,
                content: [{
                        type: 'text/html',
                        value: notification.content
                    }],
                personalizations: [
                    { to: [toEmail]
                    }
                ]
            };
        };
        this.sendSms = (notification) => {
            notification.isEmail = false;
            notification_model_1.default.create(notification)
                .then(data => {
                this.sendSmsViaInfobip(data);
            }).catch(err => {
                throw new Error(err);
            });
        };
        this.sendSmsViaInfobip = (notification) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                messages: [
                    {
                        from: INFOBIP_DEFAULT_FROM,
                        destinations: [
                            { to: notification.recipient }
                        ],
                        text: notification.content
                    }
                ]
            };
            try {
                const response = yield axios_1.default({
                    method: 'post',
                    url: INFOBIP_BASE_URL,
                    data: request,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${INFOBIP_BASIC_CODED_STRING}`
                    }
                });
                logger_1.default.info("SMS Call successful ");
                notification.notificationSent = true;
                notification_model_1.default.update({ notificationSent: true }, { where: { id: notification.id } });
            }
            catch (err) {
                logger_1.default.error("Error occurred while sending SMS via infobip due to ", err);
                throw new Error(err);
            }
        });
        logger_1.default.info("Notification Service instantiated");
    }
}
exports.default = new NotificationServiceImpl();
//# sourceMappingURL=notification.service.impl.js.map