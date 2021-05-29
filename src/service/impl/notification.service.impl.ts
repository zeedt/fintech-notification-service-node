import notificationModel from "./../../models/notification.model";
import NotificationService from "../notification.service";
import { SendGridNotificationRequest, EmailDetails } from "./../../dto/sendgrid.notification.request";
import logger from "./../../config/logger";
import Notification from './../../models/notification.model';
import axios from "axios";
import { InfobipSMSRequest, MessageItem, DestinationItem } from "./../../dto/infobip.notification.request";

const SENDGRID_BASE_URL = 'https://api.sendgrid.com/v3/mail/send';
const INFOBIP_BASE_URL = 'https://zjr41x.api.infobip.com/sms/2/text/advanced';
const SENDGRID_BEARER_TOKEN = process.env.SENDGRID_TOKEN;
const INFOBIP_USERNAME = process.env.INFOBIP_USERNAME;
const INFOBIP_PASSWORD = process.env.INFOBIP_PASSWORD;
const INFOBIP_DEFAULT_FROM = 'FINTECH';

const buff = new Buffer(`${INFOBIP_USERNAME}:${INFOBIP_PASSWORD}`);
const INFOBIP_BASIC_CODED_STRING = buff.toString('base64');
 class NotificationServiceImpl implements NotificationService {

    constructor() {
        logger.info("Notification Service instantiated");
    }
    sendEmail = (notification: notificationModel) : void => {
        notification.isEmail = true;
        Notification.create(notification)
    .then(data => {
        this.sendEmailViaSendGrid(data);
    }).catch(err => {
        throw new Error(err);
    })
    }

    sendEmailViaSendGrid = (notification: notificationModel) : void => {
        const request : SendGridNotificationRequest = this.createEmailObjectFromNotification(notification);
        axios({
            method: 'post',
            url: SENDGRID_BASE_URL,
            data: request,
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${SENDGRID_BEARER_TOKEN}`
            }
        }).then((response)=> {
            logger.info("Call successful");
            logger.info("Notification: ",notification);
            notification.notificationSent = true;
            Notification.update({notificationSent:true},{ where: { id: notification.id } });
            // logger.info("Response is ", response);
        }).catch((err)=>{
            logger.error("Error occurred while sending mail via sendgrid due to ", err);
        })
    }

    createEmailObjectFromNotification = (notification : notificationModel) : SendGridNotificationRequest => {
        const toEmail : EmailDetails = {
            email : notification.recipient,
            name : null
        };

        return  {
        from :  {
            email : process.env.DEFAULT_SENDER_EMAIL || 'yusufsaheedtaiwo@gmail.com' ,
            name : null
        },
        to : toEmail,
        subject : notification.subject,
        content : [{
            type : 'text/html',
            value : notification.content
        }],
        personalizations : [
            { to : [toEmail]
        }
        ]
    };
    }


    sendSms = (notification: notificationModel) : void => {
        notification.isEmail = false;
        Notification.create(notification)
        .then(data => {
        this.sendSmsViaInfobip(data);
    }).catch(err => {
        throw new Error(err);
    })
    }

    sendSmsViaInfobip = (notification: notificationModel) : void => {
        const request : InfobipSMSRequest = {
            messages : [
                {
                    from : INFOBIP_DEFAULT_FROM,
                    destinations : [
                        {to : notification.recipient}
                    ],
                    text : notification.content
                }
            ]
        }

        axios({
            method: 'post',
            url: INFOBIP_BASE_URL,
            data: request,
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : `Basic ${INFOBIP_BASIC_CODED_STRING}`
            }
        }).then((response)=> {
            logger.info("SMS Call successful ");
            logger.info("Notification: ",notification);
            notification.notificationSent = true;
            Notification.update({notificationSent:true},{ where: { id: notification.id } });
            // logger.info("Response is ", response);
        }).catch((err)=>{
            logger.error("Error occurred while sending SMS via infobip due to ", err);
        })

    };

}

export default new NotificationServiceImpl();