const express=require("express")
const roleRouter=express.Router()
const { createRole, getAllRole, updateRole, deleteRole }=require('../controllers/RoleController');
roleRouter.post('/', createRole);
roleRouter.get('/', getAllRole);
roleRouter.put('/:id', updateRole);
roleRouter.delete('/:id', deleteRole);
module.exports = roleRouter;