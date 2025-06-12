const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loan.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/loan', authMiddleware, loanController.createLoan);
router.put('/loan/return/:id', authMiddleware, loanController.returnLoan);
router.get('/loans', authMiddleware, loanController.getAllLoans);
router.get('/loans/users/:usuario_id', authMiddleware, loanController.getLoansByUser);


module.exports = router;
