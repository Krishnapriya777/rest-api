const express = require('express');
const router = express.Router();
const multer=require("multer");
const authController = require('../controllers/authController');
const storage=multer.diskStorage(
    {
        destination:(req,file,cb)=>
        {
          cb(null,'uploads/') ;
        },
        filename:(req,file,cb)=>
        {
            const ext=paths.extname(file.orginalname);
            cb(null,Date.now()+ext);
        }
    }
);
const upload=multer({storage});
router.post('/register',upload.single('profilepic'),authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);
module.exports = router;
