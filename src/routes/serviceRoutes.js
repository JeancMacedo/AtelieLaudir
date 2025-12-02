const express = require('express');
const router = express.Router();
const controller = require('../Controller/serviceController');
const auth = require('../middleware/auth');

// For now expose GET /services to list services (to test)
router.get('/', controller.getAllServices);

// Full CRUD (protected write operations)
router.post('/', auth, controller.createService);
router.get('/:id', auth, controller.getService);
router.put('/:id', auth, controller.updateService);
router.delete('/:id', auth, controller.deleteService);

module.exports = router;
