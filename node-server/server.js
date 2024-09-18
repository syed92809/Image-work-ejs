const express = require('express');
const app = express();
const multer = require('multer'); 
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
const secret = process.env.SECRET_KEY || '2ZnEWk#s76jJuKii';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imageRoute = require("./routes/imageRoutes");
const authRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminRoutes");
const authController = require("./controllers/authController");

app.get('/',authController.login);

const upload = multer({
    dest: 'uploads/', 
    limits: {
        fileSize: 1024 * 1024 * 5000, 
    },
});

// Set up session middleware
app.use(session({
    secret: secret, 
    resave: false,              
    saveUninitialized: false,   
    cookie: { secure: false }   
}));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", imageRoute);
app.use("/", authRoute);
app.use("/", adminRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = upload;
