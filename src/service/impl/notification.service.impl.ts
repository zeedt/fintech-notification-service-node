import notificationModel from "./../../models/notification.model";
import NotificationService from "../notification.service";
import { SendGridNotificationRequest, EmailDetails } from "./../../dto/sendgrid.notification.request";
import logger from "./../../config/logger";
import Notification from './../../models/notification.model';
import axios from "axios";

const SENDGRID_BASE_URL = 'https://api.sendgrid.com/v3/mail/send';
const SENDGRID_BEARER_TOKEN = process.env.SENDGRID_TOKEN

 class NotificationServiceImpl implements NotificationService {

    constructor() {
        logger.info("Notification Service instantiated");
    }
    sendEmail = (notification: notificationModel) : void => {
        Notification.create(notification)
    .then(data => {
        this.sendEmailViaSendGrid(notification);
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

}

export default new NotificationServiceImpl();