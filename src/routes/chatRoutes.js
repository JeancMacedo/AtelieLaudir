const express = require('express');
const router = express.Router();
const controller = require('../Controller/chatController');
const auth = require('../middleware/auth');

router.get('/', auth, controller.listChats);
router.get('/:id', auth, controller.getChat);
router.post('/', auth, controller.createChat);

module.exports = router;
