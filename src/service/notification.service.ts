import Notification from "./../models/notification.model";

export default interface NotificationService {
    sendEmailViaSendGrid : (notification :Notification) => void;
    sendEmail : (notification :Notification) => void;
    sendSms : (notification:Notification) => void;
    sendSmsViaInfobip : (notification:Notification) => void;
}