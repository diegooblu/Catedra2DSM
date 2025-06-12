const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add/book', authMiddleware, bookController.createBook);
router.get('/books', bookController.getBooks);
router.get('/book/:id', bookController.getBookById);
router.put('/book/:id', authMiddleware, bookController.updateBook);
router.delete('/book/:id', authMiddleware, bookController.deleteBook);
router.put('/restore/book/:id', authMiddleware, bookController.restoreBook);





module.exports = router;
