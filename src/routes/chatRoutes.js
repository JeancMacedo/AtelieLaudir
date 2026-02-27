const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const controller = require('../Controller/chatController');
const auth = require('../middleware/auth');

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

router.use(chatLimiter);
router.get('/', auth, controller.listChats);
router.get('/:id', auth, controller.getChat);
router.post('/', auth, controller.createChat);

module.exports = router;
