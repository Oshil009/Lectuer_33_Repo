const express = require('express');
const roleRouter = express.Router();
const { createRole, getAllRole, updateRole, deleteRole } = require('../controllers/RoleController');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

roleRouter.use(auth, authorizeRole('admin'));
roleRouter.post('/', createRole);
roleRouter.get('/', getAllRole);
roleRouter.put('/:id', updateRole);
roleRouter.delete('/:id', deleteRole);

module.exports = roleRouter;
