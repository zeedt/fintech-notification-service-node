import express from 'express';
import Notification from './../models/notification.model';
import logger from './../config/logger';
const router = express.Router();


export default router.post('/send-email', (req, res) => {
    logger.info(`Request body is `, req.body);
    Notification.create(req.body)
    .then(data => {
        const msg = {
            to: req.body.recipients, // Change to your recipient
            from: 'yusufsaheedtaiwo@gmail.com', // Change to your verified sender
            subject: req.body.subject,
            text: 'and easy to do anywhere, even with Node.js',
            html: req.body.content,
          }
        res.send(data);
    })
    .catch(err => {
        res.status(500)
        .send({message : err.message});
    });
});
