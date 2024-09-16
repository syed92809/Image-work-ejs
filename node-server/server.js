const express = require('express')
const app = express();
const PORT = process.env.PORT || 5000;
const {prismaClient} = require("@prisma/client").PrismaClient;
const imageRoute = require("./routes/imageRoutes")
const authRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminRoutes");
const axios = require("axios");
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs')


app.use("/", imageRoute);
app.use("/", authRoute);
app.use("/", adminRoute);

app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);  
})