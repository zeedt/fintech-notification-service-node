import express from 'express';
import Notification from './../models/notification.model';
import logger from './../config/logger';
const router = express.Router();
import NotificationServiceImpl from './../service/impl/notification.service.impl';

export default router.post('/send-email', (req, res) => {
    logger.info(`Request body is `, req.body);
    try {
        NotificationServiceImpl.sendEmail(req.body as Notification);
        res.send();
    } catch (error) {
        res.status(500)
        .send({message : error.message});
    }
});
