import cron from './../config/cron';
import logger from './../config/logger';
import Notification from './../models/notification.model';
import NotificationServiceImpl from './../service/impl/notification.service.impl';
class NotificationJob {

    private jobRunning : boolean;

    runNotificationJob = async () : Promise<void> => {
        if (this.jobRunning) {
            logger.info("Notification job is already running.......");
            return;
        }
        this.jobRunning = true;
        logger.info("Now running job");
        const pendingNotifications: Notification[] = await Notification.findAll({
            where: {
                notificationSent : false
            }
        });
        logger.info(`Fetched ${pendingNotifications.length} pending notifications`);
        for (const pendingNotification of pendingNotifications) {
            try {
                if (pendingNotification.isEmail) {
                    await NotificationServiceImpl.sendEmailViaSendGrid(pendingNotification);
                    logger.info("Customer notified successfully by Email");
                } else {
                    logger.info("Customer notified successfully by SMS");
                    await NotificationServiceImpl.sendSmsViaInfobip(pendingNotification);
                }
            } catch (err) {
                logger.error("Error occurred while sending pending notification due to ", err);
            }
        }
        this.jobRunning = false;
    }

}

export default new NotificationJob();