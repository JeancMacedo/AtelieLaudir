const express = require('express');
const router = express.Router();
const controller = require('../Controller/serviceController');

// For now expose GET /services to list services (to test)
router.get('/', controller.getAllServices);

// Full CRUD (commented - ready to use)
router.post('/', controller.createService);
router.get('/:id', controller.getService);
router.put('/:id', controller.updateService);
router.delete('/:id', controller.deleteService);

module.exports = router;
